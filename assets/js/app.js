/* PEOPLE HATE JAZZ — rendering, filtering, video facades */
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const KIND_LABEL = {
    mv:   "Music video",
    live: "Live film",
    vis:  "Visualiser",
    trk:  "Track only"
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));

  /* ── theme ──────────────────────────────────────────────────────── */

  const root = document.documentElement;
  const btn  = $("#theme-toggle");
  const lbl  = $("#theme-label");

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    btn.setAttribute("aria-pressed", String(t === "dark"));
    lbl.textContent = t === "dark" ? "Light" : "Dark";
    try { localStorage.setItem("phj-theme", t); } catch (e) { /* private mode */ }
  }

  let stored = null;
  try { stored = localStorage.getItem("phj-theme"); } catch (e) { /* ignore */ }
  applyTheme(
    stored ||
    (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  btn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ── ticker ─────────────────────────────────────────────────────── */

  const names = ARTISTS.map((a) => a.name);
  const tick  = names.concat(names).map((n) => "<span>" + esc(n) + "</span>").join("");
  $("#ticker-track").innerHTML = tick;

  /* ── entry markup ───────────────────────────────────────────────── */

  function entryHTML(a, i) {
    // vary the rhythm: every 6th is a full-width spread, odd ones flip sides
    const spread = (i + 1) % 6 === 0;
    const flip   = !spread && i % 2 === 1;
    const cls = "entry reveal" + (spread ? " entry--spread" : flip ? " entry--flip" : "");

    const num = String(a.n).padStart(2, "0");

    const tracks =
      '<div class="entry__tracks"><b>On the playlist</b><ul>' +
      a.tracks.map((t) => "<li>" + esc(t) + "</li>").join("") +
      "</ul></div>";

    const rail =
      '<div class="entry__rail">' +
        '<span class="form">' + esc(a.form) + "</span>" +
        (a.origin && a.origin !== "—"
          ? '<span class="sep">/</span><em>' + esc(a.origin) + "</em>" : "") +
        '<span class="sep">/</span>' +
        a.filed.map(esc).join(' <span class="sep">·</span> ') +
        '<span class="sep">/</span>' +
        a.count + (a.count === 1 ? " cut" : " cuts") +
      "</div>";

    const text =
      '<div class="entry__text">' +
        "<div>" +
          '<span class="entry__num">' + num + "</span>" +
          '<h3 class="entry__name" id="a-' + a.slug + '">' + esc(a.name) + "</h3>" +
          rail +
        "</div>" +
        "<div>" +
          '<p class="entry__pull">&ldquo;' + esc(a.pull) + "&rdquo;</p>" +
          '<p class="entry__blurb">' + esc(a.blurb) + "</p>" +
          tracks +
        "</div>" +
      "</div>";

    const v = a.video;
    const media =
      '<div class="entry__media">' +
        '<button class="facade" type="button" data-vid="' + esc(v.id) + '" ' +
          'aria-label="Play ' + esc(a.name) + " — " + esc(v.title) + '">' +
          '<img loading="lazy" decoding="async" alt="" ' +
            'src="https://i.ytimg.com/vi/' + esc(v.id) + '/maxresdefault.jpg" ' +
            'data-fallback="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg">' +
          '<span class="facade__tag" data-kind="' + esc(v.kind) + '">' + KIND_LABEL[v.kind] + "</span>" +
          '<span class="facade__play">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>Play' +
          "</span>" +
        "</button>" +
        '<div class="caption">' +
          "<b>" + esc(v.title) + "</b>" +
          '<a href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener noreferrer">Open on YouTube &#8599;</a>' +
        "</div>" +
      "</div>";

    return '<article class="' + cls + '" id="' + a.slug + '" aria-labelledby="a-' + a.slug +
           '" data-form="' + esc(a.form) +
           '" data-kind="' + esc(v.kind) + '" data-hay="' +
           esc((a.name + " " + a.origin + " " + a.form + " " + a.filed.join(" ") + " " +
                a.tracks.join(" ") + " " + a.blurb).toLowerCase()) +
           '">' + text + media + "</article>";
  }

  const list = $("#roster-list");
  list.innerHTML = ARTISTS.map(entryHTML).join("");

  /* ── thumbnail fallback ─────────────────────────────────────────────
     Videos with no maxresdefault do not 404 — YouTube answers 200 with a
     120x90 grey placeholder, so `onerror` never fires. Detect it by size
     and fall back to hqdefault (always present).                        */

  function useFallback(img) {
    const fb = img.dataset.fallback;
    if (!fb || img.dataset.fell) return;
    img.dataset.fell = "1";
    img.src = fb;
  }

  $$(".facade img", list).forEach((img) => {
    img.addEventListener("error", () => useFallback(img));
    img.addEventListener("load", () => {
      if (img.naturalWidth <= 121) useFallback(img);
    });
    // an image cached before the listeners attached
    if (img.complete && img.naturalWidth > 0 && img.naturalWidth <= 121) useFallback(img);
  });

  /* ── click-to-play facades ──────────────────────────────────────── */

  list.addEventListener("click", (e) => {
    const f = e.target.closest(".facade");
    if (!f) return;
    const id = f.dataset.vid;
    const frame = document.createElement("iframe");
    frame.className = "player";
    frame.src = "https://www.youtube-nocookie.com/embed/" + id +
                "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
    frame.title = f.getAttribute("aria-label") || "Video player";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.setAttribute("loading", "eager");
    f.replaceWith(frame);
  });

  /* ── A–Z index ──────────────────────────────────────────────────── */

  const collator = new Intl.Collator("en", { sensitivity: "base" });
  $("#indexgrid").innerHTML = ARTISTS
    .slice()
    .sort((a, b) => collator.compare(a.name, b.name))
    .map((a) =>
      '<a href="#' + a.slug + '"><span class="ig-n">' +
      String(a.n).padStart(2, "0") + '</span><span class="ig-name">' +
      esc(a.name) + "</span></a>"
    ).join("");

  /* ── playlist ───────────────────────────────────────────────────── */

  $("#tracklist").innerHTML = TRACKLIST.map((t) =>
    '<li><span class="no">' + String(t.n).padStart(3, "0") + "</span>" +
    '<span class="t">' + esc(t.t) +
    '<span class="a">' + esc(t.a) + "</span></span></li>"
  ).join("");

  /* ── filtering ──────────────────────────────────────────────────── */

  const entries = $$(".entry", list);
  const countEl = $("#count");
  const emptyEl = $("#empty");
  const qEl     = $("#q");
  const state   = { q: "", form: null, kind: null };

  function apply() {
    let shown = 0;
    entries.forEach((el) => {
      const okQ    = !state.q || el.dataset.hay.indexOf(state.q) > -1;
      const okForm = !state.form || el.dataset.form === state.form;
      const okKind = !state.kind || el.dataset.kind === state.kind;
      const ok = okQ && okForm && okKind;
      el.hidden = !ok;
      if (ok) shown++;
    });
    countEl.innerHTML = "<b>" + shown + "</b> showing";
    emptyEl.hidden = shown !== 0;
  }

  let t;
  qEl.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = qEl.value.trim().toLowerCase(); apply(); }, 120);
  });

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.filter;
      const val = chip.dataset.value;
      const on  = state[key] === val;
      // one active chip per group
      $$('.chip[data-filter="' + key + '"]').forEach((c) =>
        c.setAttribute("aria-pressed", "false"));
      state[key] = on ? null : val;
      chip.setAttribute("aria-pressed", String(!on));
      apply();
    });
  });

  /* ── reveal on scroll ───────────────────────────────────────────── */

  if ("IntersectionObserver" in window &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((rows) => {
      rows.forEach((r) => {
        if (r.isIntersecting) { r.target.classList.add("is-in"); io.unobserve(r.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    entries.forEach((el) => io.observe(el));
  } else {
    entries.forEach((el) => el.classList.add("is-in"));
  }

  /* ── deep link from #slug ───────────────────────────────────────── */

  function clearFilters() {
    state.q = ""; state.form = null; state.kind = null;
    qEl.value = "";
    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
    apply();
  }

  function jump() {
    const h = location.hash.slice(1);
    if (!h) return;
    const el = document.getElementById(h);
    if (!el || !el.classList.contains("entry")) return;
    // an index link to someone the current filter excludes: drop the filter
    // rather than surfacing one row while the toolbar claims otherwise
    if (el.hidden) clearFilters();
    el.classList.add("is-in");
  }
  window.addEventListener("hashchange", jump);
  jump();
})();
