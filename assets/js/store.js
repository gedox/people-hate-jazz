/* THE STORE — router, catalogue rendering, plate art, bidding.

   No backend. Bids and the watchlist live in localStorage, and the auction
   clock is anchored to the first visit so countdowns are stable across
   reloads instead of resetting. Everything here is the front end a real
   server would slot into: see wireUp() at the bottom for the seams.
*/
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  const money = (n) => "$" + n.toLocaleString("en-US");

  const ART = {};
  ARTISTS.forEach((a) => { ART[a.slug] = a; });

  /* ── theme (shared key with the magazine) ───────────────────────── */

  const root = document.documentElement;
  const tbtn = $("#theme-toggle"), tlbl = $("#theme-label");
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    tbtn.setAttribute("aria-pressed", String(t === "dark"));
    tlbl.textContent = t === "dark" ? "Light" : "Dark";
    try { localStorage.setItem("phj-theme", t); } catch (e) { /* private mode */ }
  }
  let storedTheme = null;
  try { storedTheme = localStorage.getItem("phj-theme"); } catch (e) { /* ignore */ }
  applyTheme(storedTheme ||
    (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  tbtn.addEventListener("click", () =>
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  /* ── persistence ────────────────────────────────────────────────── */

  const KEY = "phj-store-v1";
  let DB = { pinned: Date.now(), bids: {}, watch: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      DB = {
        pinned: typeof p.pinned === "number" ? p.pinned : Date.now(),
        bids:   p.bids && typeof p.bids === "object" ? p.bids : {},
        watch:  Array.isArray(p.watch) ? p.watch : []
      };
    }
  } catch (e) { /* corrupt or unavailable — carry on with defaults */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { /* quota / private */ }
  }
  save();

  /* ── deterministic randomness (stable art + bid histories) ──────── */

  function hash32(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function prng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ── plate art ──────────────────────────────────────────────────────
     No photography exists for any of this, so rather than fake a product
     shot each lot gets a printed plate: two riso inks, one drawing, chosen
     by category so the picture actually says something about the object. */

  function plateSVG(lot) {
    const r = prng(hash32(lot.id + lot.cat));
    const A = "var(--plate-a)", B = "var(--plate-b)";
    const rot = (r() * 8 - 4).toFixed(2);
    let body = "";

    if (lot.cat === "vinyl") {
      let rings = "";
      for (let i = 13; i > 0; i--) {
        rings += '<circle cx="100" cy="80" r="' + (i * 5.6 + 4).toFixed(1) +
                 '" fill="none" stroke="' + (i % 4 === 0 ? B : A) +
                 '" stroke-width="' + (i % 4 === 0 ? 1.6 : .8) + '" opacity="' + (i % 4 === 0 ? .9 : .5) + '"/>';
      }
      body = rings + '<circle cx="100" cy="80" r="7" fill="' + B + '"/>' +
             '<circle cx="100" cy="80" r="2" fill="var(--paper)"/>';

    } else if (lot.cat === "paper") {
      let lines = "";
      for (let i = 0; i < 22; i++) {
        const y = 14 + i * 6.4, w = 40 + r() * 130;
        lines += '<rect x="18" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) +
                 '" height="1.5" fill="' + A + '" opacity="' + (.25 + r() * .5).toFixed(2) + '"/>';
      }
      let staff = "";
      for (let i = 0; i < 5; i++) {
        staff += '<rect x="0" y="' + (44 + i * 5) + '" width="200" height="1" fill="' + B + '" opacity=".55"/>';
      }
      body = lines + staff;

    } else if (lot.cat === "gear") {
      let g = '<rect x="16" y="26" width="168" height="108" fill="none" stroke="' + A + '" stroke-width="2"/>';
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const x = 30 + col * 40, y = 40 + row * 32;
          if (r() > .45) {
            g += '<rect x="' + x + '" y="' + y + '" width="26" height="20" fill="' +
                 (r() > .6 ? B : A) + '" opacity="' + (.3 + r() * .55).toFixed(2) + '"/>';
          } else {
            g += '<circle cx="' + (x + 13) + '" cy="' + (y + 10) + '" r="9" fill="none" stroke="' +
                 B + '" stroke-width="2"/>' +
                 '<rect x="' + (x + 12.2) + '" y="' + (y + 1) + '" width="1.6" height="9" fill="' + B + '"/>';
          }
        }
      }
      body = g;

    } else if (lot.cat === "tape") {
      let bars = "";
      for (let i = 0; i < 46; i++) {
        const h = 6 + Math.pow(r(), 1.7) * 92;
        bars += '<rect x="' + (12 + i * 4).toFixed(1) + '" y="' + (80 - h / 2).toFixed(1) +
                '" width="2.4" height="' + h.toFixed(1) + '" fill="' + (i % 7 === 0 ? B : A) +
                '" opacity="' + (.45 + r() * .5).toFixed(2) + '"/>';
      }
      body = bars + '<rect x="0" y="79" width="200" height="1" fill="' + B + '" opacity=".8"/>';

    } else if (lot.cat === "photo") {
      let dots = "";
      for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 20; x++) {
          const d = 1 + (1 - Math.abs(x - 9) / 12) * r() * 4.6;
          dots += '<circle cx="' + (8 + x * 9.4) + '" cy="' + (12 + y * 10.6) + '" r="' + d.toFixed(2) +
                  '" fill="' + (x % 5 === 0 ? B : A) + '" opacity="' + (.3 + r() * .55).toFixed(2) + '"/>';
        }
      }
      body = dots;

    } else if (lot.cat === "wearable") {
      let st = "";
      for (let i = -8; i < 26; i++) {
        st += '<rect x="' + (i * 12) + '" y="-40" width="' + (3 + r() * 5).toFixed(1) +
              '" height="240" fill="' + (i % 4 === 0 ? B : A) +
              '" opacity="' + (.25 + r() * .5).toFixed(2) + '" transform="rotate(22 100 80)"/>';
      }
      body = st;

    } else { /* session — two heads talking */
      let rays = "";
      for (let i = 0; i < 34; i++) {
        const ang = (i / 34) * Math.PI * 2, len = 26 + r() * 44;
        rays += '<line x1="' + (100 + Math.cos(ang) * 20).toFixed(1) +
                '" y1="' + (80 + Math.sin(ang) * 20).toFixed(1) +
                '" x2="' + (100 + Math.cos(ang) * (20 + len)).toFixed(1) +
                '" y2="' + (80 + Math.sin(ang) * (20 + len)).toFixed(1) +
                '" stroke="' + (i % 5 === 0 ? B : A) + '" stroke-width="' + (.8 + r() * 1.6).toFixed(1) +
                '" opacity="' + (.3 + r() * .5).toFixed(2) + '"/>';
      }
      body = rays +
        '<circle cx="78" cy="80" r="26" fill="none" stroke="' + A + '" stroke-width="2.4"/>' +
        '<circle cx="122" cy="80" r="26" fill="none" stroke="' + B + '" stroke-width="2.4"/>';
    }

    return '<svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true" ' +
           'style="mix-blend-mode:multiply">' +
           '<g class="plate__art" transform="rotate(' + rot + ' 100 80)">' + body + '</g></svg>';
  }

  /* ── auction mechanics ──────────────────────────────────────────── */

  function step(v) {
    if (v < 200)  return 10;
    if (v < 500)  return 25;
    if (v < 1000) return 50;
    if (v < 2500) return 100;
    return 250;
  }
  const endsAt   = (lot) => DB.pinned + lot.hours * 3600000;
  const myBids   = (id) => DB.bids[id] || [];
  const topMine  = (id) => { const b = myBids(id); return b.length ? b[b.length - 1].amt : 0; };
  const current  = (lot) => Math.max(lot.bid, topMine(lot.id));
  const bidCount = (lot) => lot.bids + myBids(lot.id).length;
  const minNext  = (lot) => current(lot) + step(current(lot));
  const isMine   = (lot) => topMine(lot.id) >= lot.bid && topMine(lot.id) > 0;
  const isClosed = (lot) => Date.now() >= endsAt(lot);
  const isSoon   = (lot) => !isClosed(lot) && endsAt(lot) - Date.now() < 864e5;
  const watching = (id) => DB.watch.indexOf(id) > -1;

  function left(lot) {
    let ms = endsAt(lot) - Date.now();
    if (ms <= 0) return { state: "closed", text: "Closed" };
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5);  ms -= h * 36e5;
    const m = Math.floor(ms / 6e4);
    const s = Math.floor((ms - m * 6e4) / 1000);
    const soon = endsAt(lot) - Date.now() < 864e5;
    const text = d > 0 ? d + "d " + h + "h"
               : h > 0 ? h + "h " + String(m).padStart(2, "0") + "m"
               : m + "m " + String(s).padStart(2, "0") + "s";
    return { state: soon ? "soon" : "open", text: text + " left" };
  }

  function clockHTML(lot) {
    const l = left(lot);
    return '<span class="clock" data-clock="' + lot.id + '" data-state="' + l.state + '">' +
           esc(l.text) + "</span>";
  }

  /* Prior bidders. Invented, but stable per lot and consistent with the
     increment ladder, so the history never contradicts the current price. */
  function history(lot) {
    const rows = [];
    const r = prng(hash32(lot.id + "hist"));
    let v = lot.bid;
    const now = Date.now();
    for (let i = 0; i < lot.bids; i++) {
      rows.push({
        who: "bidder_" + hash32(lot.id + i).toString(36).slice(0, 4),
        amt: v,
        ts: now - (i * (3 + r() * 20) + 1) * 36e5,
        me: false
      });
      v -= step(v - step(v));
    }
    myBids(lot.id).forEach((b) => rows.push({ who: "You", amt: b.amt, ts: b.ts, me: true }));
    return rows.sort((a, b) => b.amt - a.amt);
  }

  function ago(ts) {
    const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
    if (s < 60) return s + "s ago";
    if (s < 3600) return Math.round(s / 60) + "m ago";
    if (s < 86400) return Math.round(s / 3600) + "h ago";
    return Math.round(s / 86400) + "d ago";
  }

  /* ── cards ──────────────────────────────────────────────────────── */

  function lotCard(lot) {
    const a = ART[lot.artist];
    const flag = isClosed(lot) ? '<span class="flag flag--closed">Closed</span>'
               : isMine(lot)   ? '<span class="flag flag--winning">Your bid</span>'
               : isSoon(lot)   ? '<span class="flag flag--soon">Closing</span>' : "";
    return '<a class="lotcard" href="#/lot/' + lot.id + '">' +
      '<div class="plate">' + plateSVG(lot) +
        '<span class="plate__no">' + lot.id + "</span>" +
        '<span class="plate__cat">' + esc(CATLABEL[lot.cat]) + "</span>" + flag +
      "</div>" +
      '<div class="lotcard__body">' +
        '<span class="lotcard__artist">' + esc(a ? a.name : lot.artist) + "</span>" +
        '<h3 class="lotcard__title">' + esc(lot.title) + "</h3>" +
        '<div class="lotcard__foot">' +
          '<dl class="lotcard__bid"><dt>' + (bidCount(lot) ? "Current bid" : "Opening bid") +
            "</dt><dd>" + money(current(lot)) + "</dd></dl>" +
          '<div class="lotcard__n">' + bidCount(lot) + (bidCount(lot) === 1 ? " bid" : " bids") +
            "<br>" + clockHTML(lot) + "</div>" +
        "</div>" +
      "</div></a>";
  }

  const sechead = (h2, note) =>
    '<div class="sechead"><h2>' + h2 + "</h2>" + (note ? "<p>" + note + "</p>" : "") + "</div>";

  /* ── views ──────────────────────────────────────────────────────── */

  function viewIndex() {
    const open = LOTS.filter((l) => !isClosed(l));
    const closing = open.filter(isSoon).sort((a, b) => endsAt(a) - endsAt(b));
    const marquee = LOTS.filter((l) => l.marquee && !isClosed(l));
    const value = LOTS.reduce((s, l) => s + current(l), 0);

    return (
      '<header class="storehero shell">' +
        '<div class="masthead__meta">' +
          "<span>The Store</span><span>60 private shops</span>" +
          "<span><i>" + LOTS.length + "</i> lots</span>" +
          "<span><i>" + closing.length + "</i> closing today</span>" +
          '<span style="margin-left:auto">One of everything</span>' +
        "</div>" +
        '<h1 class="storehero__mark">The<span class="s2">Store</span></h1>' +
        '<div class="storehero__deck">' +
          "<p>Sixty artists, sixty private shops, and one of everything. " +
          "Test pressings that were never meant to leave the plant, charts in pencil, " +
          "the cymbal that cracked, two hours of somebody's <em>undivided attention</em>. " +
          "Highest bid at close takes it.</p>" +
          '<dl class="stats">' +
            "<div><dt>Lots</dt><dd>" + LOTS.length + "</dd></div>" +
            "<div><dt>Shops</dt><dd>60</dd></div>" +
            "<div><dt>Closing today</dt><dd>" + closing.length + "</dd></div>" +
            "<div><dt>Book value</dt><dd>" + money(value) + "</dd></div>" +
          "</dl>" +
        "</div>" +
      "</header>" +

      (closing.length
        ? '<section class="shell" style="padding-top:var(--s-6)">' +
            sechead("Closing Today", "Under 24 hours &mdash; " + closing.length + " lots") +
            '<div class="rail">' + closing.slice(0, 12).map(lotCard).join("") + "</div>" +
          "</section>"
        : "") +

      '<section class="shell" style="padding-top:var(--s-6)">' +
        sechead("The Headline Lots", "Ten objects worth arguing about") +
        '<div class="lotgrid">' + marquee.map(lotCard).join("") + "</div>" +
      "</section>" +

      '<section class="shell" id="all" style="padding-top:var(--s-6);padding-bottom:var(--s-6)">' +
        sechead("Full Catalogue", "Every lot, every shop") +
        '<div class="toolbar">' +
          '<label class="search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">' +
              '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>' +
            '<input type="search" id="lq" placeholder="Search lots, artists, objects" aria-label="Search lots">' +
          "</label>" +
          '<div class="chips" role="group" aria-label="Filter by category">' +
            Object.keys(CATLABEL).map((c) =>
              '<button class="chip" data-cat="' + c + '" aria-pressed="false">' +
              esc(CATLABEL[c]) + "</button>").join("") +
          "</div>" +
          '<div class="chips" role="group" aria-label="Filter by status">' +
            '<button class="chip chip--flame" data-stat="soon" aria-pressed="false">Closing soon</button>' +
            '<button class="chip" data-stat="mine" aria-pressed="false">My bids</button>' +
            '<button class="chip" data-stat="watch" aria-pressed="false">Watching</button>' +
          "</div>" +
          '<label class="search" style="flex:0 0 auto;gap:.4rem">' +
            '<span class="mono" style="color:var(--ink-faint)">Sort</span>' +
            '<select id="lsort" aria-label="Sort lots" style="border:0;background:none;font-family:var(--mono);font-size:var(--t--1);text-transform:uppercase;letter-spacing:.06em;color:inherit;outline:none">' +
              '<option value="ending">Ending soonest</option>' +
              '<option value="bids">Most bids</option>' +
              '<option value="high">Price: high to low</option>' +
              '<option value="low">Price: low to high</option>' +
              '<option value="artist">Artist A&ndash;Z</option>' +
            "</select>" +
          "</label>" +
          '<p class="count" id="lcount" aria-live="polite"><b>' + LOTS.length + "</b> lots</p>" +
        "</div>" +
        '<div class="lotgrid" id="lotgrid"></div>' +
        '<div class="loadmore" id="lmore" hidden>' +
          '<button class="btn btn--ghost" id="lmoreb" type="button">Show more</button>' +
          '<span class="mono" id="lmoren"></span>' +
        "</div>" +
        '<div class="empty" id="lempty" hidden><h3>No lots match that</h3>' +
          "<p>Try an artist, a city, or a kind of object &mdash; acetate, cassette, chart, " +
          "cymbal, Polaroid. Or clear the filters and browse all " + LOTS.length + ".</p></div>" +
      "</section>"
    );
  }

  function viewShops() {
    const rows = ARTISTS.map((a) => {
      const mine = LOTS.filter((l) => l.artist === a.slug);
      const open = mine.filter((l) => !isClosed(l)).length;
      const low = Math.min.apply(null, mine.map(current));
      return '<a href="#/shop/' + a.slug + '">' +
        '<span class="sd-name">' + esc(a.name) + "</span>" +
        '<span class="sd-meta">' + mine.length + " lots &middot; from " + money(low) + "</span>" +
        '<span class="sd-meta">' + (open ? open + " open" : "all closed") + "</span></a>";
    }).join("");
    return '<section class="shell" style="padding-block:var(--s-5) var(--s-6)">' +
      sechead("The 60 Shops", "One per artist. A&ndash;Z by the survey&rsquo;s running order") +
      '<div class="shopdir">' + rows + "</div></section>";
  }

  function viewClosing() {
    const rows = LOTS.filter((l) => !isClosed(l) && isSoon(l)).sort((a, b) => endsAt(a) - endsAt(b));
    return '<section class="shell" style="padding-block:var(--s-5) var(--s-6)">' +
      sechead("Closing Today", "Everything with under 24 hours on it") +
      (rows.length
        ? '<div class="lotgrid">' + rows.map(lotCard).join("") + "</div>"
        : '<div class="empty"><h3>Nothing closing today</h3><p>Check the ' +
          '<a href="#/">full catalogue</a> &mdash; the next lots close within the week.</p></div>') +
      "</section>";
  }

  function viewShop(slug) {
    const a = ART[slug];
    if (!a) return notFound();
    const mine = LOTS.filter((l) => l.artist === slug);
    return (
      '<div class="shell">' +
        '<nav class="crumbs" style="margin-top:var(--s-4)" aria-label="Breadcrumb">' +
          '<a href="#/">The Store</a><span>/</span><a href="#/shops">Shops</a>' +
          "<span>/</span><span>" + esc(a.name) + "</span>" +
        "</nav>" +
      "</div>" +
      '<header class="shophead shell" style="padding-top:0">' +
        '<p class="mono" style="color:var(--ultra)">Private shop &mdash; ' + mine.length + " lots</p>" +
        '<h1 class="shophead__name">' + esc(a.name) + "</h1>" +
        '<div class="shophead__rail">' +
          '<span class="form">' + esc(a.form) + "</span>" +
          (a.origin && a.origin !== "—" ? '<span class="sep">/</span><em>' + esc(a.origin) + "</em>" : "") +
          '<span class="sep">/</span>' + a.filed.map(esc).join(' <span class="sep">&middot;</span> ') +
          '<span class="sep">/</span><a href="index.html#' + a.slug + '">Read the entry &#8599;</a>' +
        "</div>" +
        '<div class="shophead__note">' +
          "<p>" + esc(a.blurb) + "</p>" +
          '<p class="pull">&ldquo;' + esc(a.pull) + "&rdquo;</p>" +
        "</div>" +
      "</header>" +
      '<section class="shell" style="padding-block:var(--s-5) var(--s-6)">' +
        sechead("The Lots", "One of each. Nothing here gets restocked") +
        '<div class="lotgrid">' + mine.map(lotCard).join("") + "</div>" +
      "</section>"
    );
  }

  function viewLot(id) {
    const lot = LOTS.filter((l) => l.id === id)[0];
    if (!lot) return notFound();
    const a = ART[lot.artist];
    const closed = isClosed(lot), mineNow = isMine(lot);
    const rows = history(lot);

    const status = closed
      ? (mineNow ? "You won this lot" : "Bidding has closed")
      : (mineNow ? "You are the highest bidder" : "");

    return (
      '<section class="lotview shell">' +
        '<nav class="crumbs" aria-label="Breadcrumb">' +
          '<a href="#/">The Store</a><span>/</span>' +
          '<a href="#/shop/' + lot.artist + '">' + esc(a ? a.name : lot.artist) + "</a>" +
          "<span>/</span><span>Lot " + lot.id + "</span>" +
          '<span style="margin-left:auto">' + esc(CATLABEL[lot.cat]) + "</span>" +
        "</nav>" +

        '<div class="lotview__grid">' +
          "<div>" +
            '<div class="lotview__plate">' + plateSVG(lot) +
              '<span class="plate__no">Lot ' + lot.id + "</span>" +
              '<span class="plate__cat">' + esc(CATLABEL[lot.cat]) + "</span>" +
            "</div>" +
            '<p class="mono" style="color:var(--ultra);margin-top:var(--s-3)">' +
              esc(a ? a.name : lot.artist) + "</p>" +
            '<h1 class="lotview__title">' + esc(lot.title) + "</h1>" +
            '<p class="lotview__desc">' + esc(lot.desc) + "</p>" +
            '<dl class="spec">' +
              "<div><dt>Condition</dt><dd>" + esc(lot.cond) + "</dd></div>" +
              "<div><dt>Ships from</dt><dd>" + esc(lot.ships) + "</dd></div>" +
              "<div><dt>Edition</dt><dd>1 of 1 &mdash; no reissue</dd></div>" +
              "<div><dt>Opening bid</dt><dd>" + money(lot.opening) + "</dd></div>" +
            "</dl>" +
            '<p class="storefoot-note">Lot ' + lot.id + " &middot; " + lot.watchers +
              " watching &middot; Sold as seen. Shipping quoted at close and paid by the buyer.</p>" +

            '<div class="history">' +
              "<h3>Bid history &mdash; " + bidCount(lot) + (bidCount(lot) === 1 ? " bid" : " bids") + "</h3>" +
              (rows.length
                ? "<ol>" + rows.map((b) =>
                    '<li class="' + (b.me ? "is-me" : "") + '"><span class="who">' + esc(b.who) +
                    '</span><span class="amt">' + money(b.amt) + '</span>' +
                    '<span class="when">' + ago(b.ts) + "</span></li>").join("") + "</ol>"
                : '<p class="mybids__empty">No bids yet. Opening bid is ' + money(lot.opening) + ".</p>") +
            "</div>" +
          "</div>" +

          "<div>" +
            '<div class="bidbox">' +
              '<div class="bidbox__head"><span>' +
                (closed ? "Lot closed" : "Bidding open") + "</span>" + clockHTML(lot) + "</div>" +
              '<div class="bidbox__body">' +
                '<dl class="bidnow">' +
                  "<div><dt>" + (bidCount(lot) ? "Current bid" : "Opening bid") + "</dt>" +
                  '<dd id="cur">' + money(current(lot)) + "</dd></div>" +
                  '<p class="meta">' + bidCount(lot) + (bidCount(lot) === 1 ? " bid" : " bids") +
                    "<br>" + lot.watchers + " watching</p>" +
                "</dl>" +

                (status ? '<div class="bidmsg" data-tone="good">' + status + "</div>" : "") +

                (closed ? "" :
                  '<form class="bidform" id="bidform" novalidate>' +
                    '<div class="bidform__row">' +
                      '<label class="bidfield"><span>$</span>' +
                        '<input type="number" id="bidamt" inputmode="numeric" step="1" ' +
                          'min="' + minNext(lot) + '" value="' + minNext(lot) + '" ' +
                          'aria-label="Your bid in dollars"></label>' +
                      '<button class="btn" type="submit">Place bid</button>' +
                    "</div>" +
                    '<p class="bidhint">Next valid bid is <b>' + money(minNext(lot)) +
                      "</b> &mdash; increments of " + money(step(current(lot))) +
                      " at this price. No proxy bidding.</p>" +
                    '<div id="bidmsg" role="status"></div>' +
                  "</form>") +

                '<div class="bidbox__acts">' +
                  '<button class="btn btn--ghost" id="watch" type="button" aria-pressed="' +
                    watching(lot.id) + '">' + (watching(lot.id) ? "Watching" : "Watch lot") + "</button>" +
                  '<a class="btn btn--ghost" href="#/shop/' + lot.artist + '" style="text-align:center">' +
                    "Shop</a>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function viewMyBids() {
    const ids = Object.keys(DB.bids).filter((k) => DB.bids[k].length);
    const bidLots = ids.map((id) => LOTS.filter((l) => l.id === id)[0]).filter(Boolean);
    const watch = DB.watch.map((id) => LOTS.filter((l) => l.id === id)[0]).filter(Boolean);
    const winning = bidLots.filter(isMine).length;
    const spend = bidLots.filter((l) => isMine(l)).reduce((s, l) => s + current(l), 0);

    const list = (rows, empty) => rows.length
      ? "<ul>" + rows.map((l) => {
          const a = ART[l.artist];
          return '<li><a href="#/lot/' + l.id + '"><span class="mb-t">' + esc(l.title) + "</span>" +
            '<span class="mb-a">' + esc(a ? a.name : l.artist) + " &middot; " + l.id + " &middot; " +
            (isClosed(l) ? (isMine(l) ? "won" : "closed") : isMine(l) ? "highest bidder" : "outbid") +
            "</span></a>" +
            '<span class="mb-amt">' + money(current(l)) + "<br>" +
            '<span class="mb-a">' + esc(left(l).text) + "</span></span></li>";
        }).join("") + "</ul>"
      : '<p class="mybids__empty">' + empty + "</p>";

    return '<section class="shell" style="padding-block:var(--s-5) var(--s-6)">' +
      sechead("My Bids", "Stored in this browser, visible to nobody") +
      '<div class="storehero__deck" style="border-top:0;margin-top:var(--s-3)">' +
        "<p>Everything you have bid on, plus anything you are watching. " +
        "This lives in <em>localStorage</em> and goes no further &mdash; there is no account, " +
        "no server and no email. Clear your site data and it is gone.</p>" +
        '<dl class="stats">' +
          "<div><dt>Lots bid on</dt><dd>" + bidLots.length + "</dd></div>" +
          "<div><dt>Leading</dt><dd>" + winning + "</dd></div>" +
          "<div><dt>Watching</dt><dd>" + watch.length + "</dd></div>" +
          "<div><dt>If it all closed now</dt><dd>" + money(spend) + "</dd></div>" +
        "</dl>" +
      "</div>" +
      '<div class="mybids"><div class="mybids__head"><span>Your bids</span><span>' +
        bidLots.length + "</span></div>" +
        list(bidLots, "You have not bid on anything yet. Start with the <a href=\"#/closing\">lots closing today</a>.") +
      "</div>" +
      '<div class="mybids"><div class="mybids__head"><span>Watching</span><span>' +
        watch.length + "</span></div>" +
        list(watch, "Nothing on the watchlist. Hit &ldquo;Watch lot&rdquo; on anything you want to keep an eye on.") +
      "</div>" +
      (bidLots.length || watch.length
        ? '<p style="margin-top:var(--s-4)"><button class="btn btn--ghost" id="wipe" type="button">' +
          "Clear my bids and watchlist</button></p>" : "") +
      "</section>";
  }

  function viewHow() {
    return '<section class="shell" style="padding-block:var(--s-5) var(--s-6)">' +
      sechead("How It Works", "Four rules and one disclaimer") +
      '<div class="editorial__grid" style="margin-top:var(--s-4)">' +
        '<div class="editorial__label"><h2>The<br>Rules</h2>' +
          '<p>Store policy<br>Filed under: fine print</p></div>' +
        '<div class="prose">' +
          "<p>Every artist in the survey has a shop. Every shop sells things that exist " +
          "once: an object that cannot be reprinted, or a block of the artist's time that " +
          "cannot be resold to anybody else. There is no merch here. There are no sizes " +
          "to run out of.</p>" +
          '<div class="dropquote">One of everything. <b>When it goes, it is gone.</b></div>' +
          "<p><strong>Bidding.</strong> Beat the current bid by at least one increment. " +
          "Increments rise with price &mdash; $10 below $200, $25 below $500, $50 below $1,000, " +
          "$100 below $2,500, and $250 above that. There is no proxy bidding and no reserve " +
          "beyond the opening bid, because both of those exist mainly to help the house.</p>" +
          "<p><strong>Closing.</strong> Each lot has a hard end time. Highest bid at that " +
          "moment takes it. No anti-sniping extension, which means the last thirty seconds " +
          "are the whole auction, which is the fun part.</p>" +
          "<p><strong>Shipping.</strong> Quoted at close, paid by the buyer, sent from " +
          "wherever the artist actually is. Some of these people are one person with a " +
          "sampler, so allow time.</p>" +
          "<p><strong>The disclaimer.</strong> This is a working prototype of a storefront, " +
          "not a live marketplace. The lots are invented for the purpose of building and " +
          "showing the interface. The artists are real and have not listed anything. " +
          "No money changes hands, no card is taken, and your bids are written to your own " +
          "browser and nowhere else.</p>" +
        "</div>" +
      "</div></section>";
  }

  function notFound() {
    return '<section class="shell" style="padding-block:var(--s-6)">' +
      '<div class="empty"><h3>No such lot</h3>' +
      '<p>That lot number does not exist, or the link is bent. ' +
      '<a href="#/">Back to the catalogue</a>.</p></div></section>';
  }

  /* ── catalogue filtering (index view only) ──────────────────────── */

  const hay = {};
  LOTS.forEach((l) => {
    const a = ART[l.artist];
    hay[l.id] = (l.title + " " + l.desc + " " + l.cond + " " + l.ships + " " + CATLABEL[l.cat] + " " +
      (a ? a.name + " " + a.origin + " " + a.form + " " + a.filed.join(" ") : "")).toLowerCase();
  });

  /* 140 cards is a 64,000px page carrying 140 inline SVGs, which makes the
     whole document janky to scroll and slow to paint. Render a page at a
     time; filters reset the window back to the first page. */
  const PAGE = 24;
  const filt = { q: "", cat: null, stat: null, sort: "ending", shown: PAGE };

  function runFilter() {
    const grid = $("#lotgrid");
    if (!grid) return;
    let rows = LOTS.filter((l) => {
      if (filt.q && hay[l.id].indexOf(filt.q) < 0) return false;
      if (filt.cat && l.cat !== filt.cat) return false;
      if (filt.stat === "soon"  && !(isSoon(l) && !isClosed(l))) return false;
      if (filt.stat === "mine"  && !myBids(l.id).length) return false;
      if (filt.stat === "watch" && !watching(l.id)) return false;
      return true;
    });
    const s = filt.sort;
    rows.sort((x, y) =>
      s === "bids"   ? bidCount(y) - bidCount(x)
    : s === "high"   ? current(y) - current(x)
    : s === "low"    ? current(x) - current(y)
    : s === "artist" ? (ART[x.artist] ? ART[x.artist].name : "").localeCompare(
                        ART[y.artist] ? ART[y.artist].name : "")
    : endsAt(x) - endsAt(y));

    const page = rows.slice(0, filt.shown);
    grid.innerHTML = page.map(lotCard).join("");
    grid.hidden = rows.length === 0;
    $("#lempty").hidden = rows.length !== 0;
    $("#lcount").innerHTML = "<b>" + rows.length + "</b> " + (rows.length === 1 ? "lot" : "lots");

    const more = $("#lmore");
    const rest = rows.length - page.length;
    more.hidden = rest <= 0;
    if (rest > 0) {
      $("#lmoreb").textContent = "Show " + Math.min(PAGE, rest) + " more";
      $("#lmoren").textContent = page.length + " of " + rows.length + " shown";
    }
  }

  /* ── after-render wiring ────────────────────────────────────────── */

  function wireUp(route) {
    /* catalogue toolbar */
    if ($("#lotgrid")) {
      runFilter();
      let t;
      $("#lq").addEventListener("input", (e) => {
        clearTimeout(t);
        const v = e.target.value.trim().toLowerCase();
        t = setTimeout(() => { filt.q = v; filt.shown = PAGE; runFilter(); }, 120);
      });
      $("#lsort").addEventListener("change", (e) => {
        filt.sort = e.target.value; filt.shown = PAGE; runFilter();
      });
      $("#lmoreb").addEventListener("click", () => {
        const before = $("#lotgrid").children.length;
        filt.shown += PAGE;
        runFilter();
        const next = $("#lotgrid").children[before];   /* keep the reading position */
        if (next) next.querySelector(".lotcard__title").scrollIntoView({ block: "center" });
      });
      $$(".chip").forEach((c) => {
        c.addEventListener("click", () => {
          const key = c.dataset.cat ? "cat" : "stat";
          const val = c.dataset.cat || c.dataset.stat;
          const on = filt[key] === val;
          $$(".chip").forEach((o) => {
            if ((o.dataset.cat ? "cat" : "stat") === key) o.setAttribute("aria-pressed", "false");
          });
          filt[key] = on ? null : val;
          filt.shown = PAGE;
          c.setAttribute("aria-pressed", String(!on));
          runFilter();
        });
      });
    }

    /* bid form — this is the seam. Replace the DB write with a POST and
       re-render from the server's response and the rest still holds. */
    const form = $("#bidform");
    if (form) {
      const lot = LOTS.filter((l) => l.id === route.id)[0];
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const box = $("#bidmsg");
        const amt = Math.floor(Number($("#bidamt").value));
        const need = minNext(lot);

        if (isClosed(lot)) {
          box.innerHTML = '<div class="bidmsg" data-tone="bad">This lot closed while you were looking at it.</div>';
          return;
        }
        if (!isFinite(amt) || amt <= 0) {
          box.innerHTML = '<div class="bidmsg" data-tone="bad">Enter an amount.</div>';
          return;
        }
        if (amt < need) {
          box.innerHTML = '<div class="bidmsg" data-tone="bad">Too low. The next valid bid is ' +
            money(need) + ".</div>";
          return;
        }
        (DB.bids[lot.id] = DB.bids[lot.id] || []).push({ amt: amt, ts: Date.now() });
        save();
        render();                       /* re-render so history and totals agree */
        const after = $("#bidmsg");
        if (after) after.innerHTML = '<div class="bidmsg" data-tone="good">Bid of ' +
          money(amt) + " placed. You are the highest bidder.</div>";
      });
    }

    /* watch toggle */
    const w = $("#watch");
    if (w) {
      w.addEventListener("click", () => {
        const id = route.id;
        const i = DB.watch.indexOf(id);
        if (i > -1) DB.watch.splice(i, 1); else DB.watch.push(id);
        save();
        w.setAttribute("aria-pressed", String(watching(id)));
        w.textContent = watching(id) ? "Watching" : "Watch lot";
      });
    }

    /* clear everything */
    const wipe = $("#wipe");
    if (wipe) {
      wipe.addEventListener("click", () => {
        if (wipe.dataset.armed !== "1") {
          wipe.dataset.armed = "1";
          wipe.textContent = "Press again to confirm";
          setTimeout(() => {
            if (!wipe.isConnected) return;
            wipe.dataset.armed = "0";
            wipe.textContent = "Clear my bids and watchlist";
          }, 4000);
          return;
        }
        DB.bids = {}; DB.watch = []; save(); render();
      });
    }
  }

  /* ── router ─────────────────────────────────────────────────────── */

  function parse() {
    const h = location.hash.replace(/^#\/?/, "");
    const p = h.split("/").filter(Boolean);
    if (!p.length) return { name: "index" };
    if (p[0] === "lot")     return { name: "lot", id: p[1] };
    if (p[0] === "shop")    return { name: "shop", id: p[1] };
    if (p[0] === "shops")   return { name: "shops" };
    if (p[0] === "closing") return { name: "closing" };
    if (p[0] === "mybids")  return { name: "mybids" };
    if (p[0] === "how")     return { name: "how" };
    return { name: "index" };
  }

  const view = $("#view");
  let lastRoute = "";

  function render() {
    const r = parse();
    const html =
        r.name === "lot"     ? viewLot(r.id)
      : r.name === "shop"    ? viewShop(r.id)
      : r.name === "shops"   ? viewShops()
      : r.name === "closing" ? viewClosing()
      : r.name === "mybids"  ? viewMyBids()
      : r.name === "how"     ? viewHow()
      : viewIndex();

    view.innerHTML = html;
    wireUp(r);

    document.title =
        r.name === "lot"  && LOTS.filter((l) => l.id === r.id)[0]
          ? LOTS.filter((l) => l.id === r.id)[0].title + " — The Store"
      : r.name === "shop" && ART[r.id] ? ART[r.id].name + "'s shop — The Store"
      : "THE STORE — one-of-one lots from 60 artists | People Hate Jazz";

    const key = location.hash;
    if (key !== lastRoute) {
      lastRoute = key;
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener("hashchange", render);
  render();

  /* ── the clock ──────────────────────────────────────────────────────
     One interval for the whole page rather than one per lot. Only the
     text and the state attribute change, so nothing reflows. */

  setInterval(() => {
    $$("[data-clock]").forEach((el) => {
      const lot = LOTS.filter((l) => l.id === el.dataset.clock)[0];
      if (!lot) return;
      const l = left(lot);
      if (el.textContent !== l.text) el.textContent = l.text;
      if (el.dataset.state !== l.state) el.dataset.state = l.state;
    });
  }, 1000);
})();
