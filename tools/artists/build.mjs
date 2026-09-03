/* PEOPLE HATE JAZZ — artist page generator.
 *
 * Emits one static page per artist into a/<slug>.html, so every artist in the
 * survey has a URL of its own that can be shared and previewed independently.
 *
 * The SERVED site still has no build step. This runs once, by hand, and its
 * output is committed — the same arrangement as the social cards in tools/og.
 *
 *   node tools/artists/build.mjs
 *
 * Reads the asset version and the canonical origin out of index.html so the
 * generated pages can never drift from the rest of the site.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "a");

/* ── inputs ──────────────────────────────────────────────────────────── */

const dataSrc = readFileSync(join(ROOT, "assets", "js", "data.js"), "utf8");
// data.js declares exactly one top-level const; evaluate it rather than parse it,
// so the generator never drifts from the file's real contents.
const { ARTISTS } = new Function(`${dataSrc}\nreturn { ARTISTS };`)();

const indexSrc = readFileSync(join(ROOT, "index.html"), "utf8");

const version = (indexSrc.match(/assets\/css\/main\.css\?v=(\d+)/) || [])[1];
if (!version) throw new Error("Could not read the asset version from index.html");

const origin = (indexSrc.match(/<link rel="canonical" href="([^"]+)\/">/) || [])[1];
if (!origin) throw new Error("Could not read the canonical origin from index.html");

/* ── helpers ─────────────────────────────────────────────────────────── */

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const KIND_LABEL = { mv: "Music video", live: "Live film", vis: "Visualiser", trk: "Track only" };

const pad = (n) => String(n).padStart(2, "0");

/* Per-artist social cards are rendered separately by tools/og/build-artists.mjs.
   Use one if it exists, otherwise fall back to the magazine card so the meta is
   never broken. */
const cardFor = (slug) =>
  existsSync(join(ROOT, "assets", "og", "a", `${slug}.png`))
    ? `${origin}/assets/og/a/${slug}.png`
    : `${origin}/assets/og/og-magazine.png`;

/* Describes what the card actually says, for readers on a screen reader who get
   the link preview but not the picture. */
const cardAlt = (a) =>
  `${a.name} — No. ${pad(a.n)} in the Jamies Survey. ${a.pull}`;

/* ── template ────────────────────────────────────────────────────────── */

function page(a, prev, next) {
  const v = a.video;
  const url = `${origin}/a/${a.slug}.html`;
  const desc = a.pull;
  const railBits = [
    `<span class="form">${esc(a.form)}</span>`,
    a.origin && a.origin !== "—" ? `<span class="sep">/</span><em>${esc(a.origin)}</em>` : "",
    `<span class="sep">/</span>${a.filed.map(esc).join(' <span class="sep">·</span> ')}`,
    `<span class="sep">/</span>${a.count}${a.count === 1 ? " cut" : " cuts"}`
  ].join("");

  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(a.name)} — People Hate Jazz</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="light dark">

<meta property="og:type" content="article">
<meta property="og:site_name" content="People Hate Jazz">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(a.name)} — People Hate Jazz">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${cardFor(a.slug)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(cardAlt(a))}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.name)} — People Hate Jazz">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${cardFor(a.slug)}">
<meta name="twitter:image:alt" content="${esc(cardAlt(a))}">
<link rel="canonical" href="${url}">
<link rel="prev" href="${origin}/a/${prev.slug}.html">
<link rel="next" href="${origin}/a/${next.slug}.html">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://i.ytimg.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400;12..96,75..100,700;12..96,75..100,800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/main.css?v=${version}">
<link rel="stylesheet" href="../assets/css/store.css?v=${version}">
<link rel="stylesheet" href="../assets/css/artist.css?v=${version}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2314110e'/%3E%3Ctext y='74' x='50' text-anchor='middle' font-family='Arial Black,sans-serif' font-size='72' fill='%23ff3b0f'%3EJ%3C/text%3E%3C/svg%3E">
</head>
<body>

<div class="grain" aria-hidden="true"></div>
<a class="skip" href="#content">Skip to the entry</a>

<div class="topbar">
  <div class="shell topbar__in">
    <a class="topbar__mark" href="../index.html">PEOPLE HATE <b>JAZZ</b></a>
    <div class="modeswitch">
      <a href="../index.html">Magazine</a>
      <a href="../store.html" class="is-store">Store</a>
    </div>
    <nav class="topnav" aria-label="Sections">
      <a href="../index.html#roster">The Sixty</a>
      <a href="../index.html#index">Index</a>
      <a href="../index.html#playlist">Playlist</a>
    </nav>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="false">
      <span id="theme-label">Dark</span>
    </button>
  </div>
</div>

<main id="content" tabindex="-1">
  <article class="artist shell">

    <nav class="crumb" aria-label="Breadcrumb">
      <a href="../index.html#roster">The Sixty</a>
      <span class="sep">/</span>
      <span>No. ${pad(a.n)}</span>
    </nav>

    <header class="artist__head">
      <p class="artist__num">${pad(a.n)}</p>
      <h1 class="artist__name">${esc(a.name)}</h1>
      <div class="entry__rail">${railBits}</div>
    </header>

    <div class="artist__body">
      <div class="artist__text">
        <p class="entry__pull">&ldquo;${esc(a.pull)}&rdquo;</p>
        <p class="entry__blurb">${esc(a.blurb)}</p>

        <div class="entry__tracks">
          <b>On the playlist</b>
          <ul>${a.tracks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="artist__media">
        <div class="entry__media">
          <button class="facade" type="button" data-vid="${esc(v.id)}"
            aria-label="Play ${esc(a.name)} — ${esc(v.title)}">
            <img loading="lazy" decoding="async" alt=""
              src="https://i.ytimg.com/vi/${esc(v.id)}/maxresdefault.jpg"
              data-fallback="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg">
            <span class="facade__tag" data-kind="${esc(v.kind)}">${KIND_LABEL[v.kind]}</span>
            <span class="facade__play">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>Play
            </span>
          </button>
          <div class="caption">
            <b>${esc(v.title)}</b>
            <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener noreferrer">Open on YouTube &#8599;</a>
          </div>
        </div>
      </div>
    </div>

    <nav class="artist__nav" aria-label="Other artists">
      <a class="artist__nav-prev" href="${esc(prev.slug)}.html" rel="prev">
        <span>&#8592; No. ${pad(prev.n)}</span><b>${esc(prev.name)}</b>
      </a>
      <a class="artist__nav-all" href="../index.html#${esc(a.slug)}">See it in the survey</a>
      <a class="artist__nav-next" href="${esc(next.slug)}.html" rel="next">
        <span>No. ${pad(next.n)} &#8594;</span><b>${esc(next.name)}</b>
      </a>
    </nav>

  </article>
</main>

<footer class="colophon shell">
  <div class="colophon__end">
    <span>Issue 01</span>
    <span><a href="../index.html">Back to the survey &#8599;</a></span>
    <span>No cookies, no tracking, no newsletter</span>
    <span class="end-note">&#9670; Play it loud</span>
  </div>
</footer>

<script>
(function () {
  "use strict";
  var root = document.documentElement,
      btn  = document.getElementById('theme-toggle'),
      lbl  = document.getElementById('theme-label'),
      KEY  = 'phj-theme';

  function apply(t) {
    root.setAttribute('data-theme', t);
    if (lbl) lbl.textContent = t === 'dark' ? 'Light' : 'Dark';
    if (btn) btn.setAttribute('aria-pressed', String(t === 'dark'));
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if (btn) btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });

  // Thumbnail fallback: YouTube answers 200 with a 120x90 grey placeholder when
  // maxresdefault is missing, so onerror never fires. Detect it by size.
  var img = document.querySelector('.facade img');
  function useFallback() {
    if (!img || !img.dataset.fallback || img.dataset.fell) return;
    img.dataset.fell = '1';
    img.src = img.dataset.fallback;
  }
  if (img) {
    img.addEventListener('error', useFallback);
    img.addEventListener('load', function () { if (img.naturalWidth <= 121) useFallback(); });
    if (img.complete && img.naturalWidth > 0 && img.naturalWidth <= 121) useFallback();
  }

  // Click-to-play. No live iframe until the reader asks for one.
  var f = document.querySelector('.facade');
  if (f) f.addEventListener('click', function () {
    var frame = document.createElement('iframe');
    frame.className = 'player';
    frame.src = 'https://www.youtube-nocookie.com/embed/' + f.dataset.vid +
                '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    frame.title = f.getAttribute('aria-label') || 'Video player';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.setAttribute('loading', 'eager');
    f.replaceWith(frame);
  });

  // Arrow keys move between artists, matching the prev/next links.
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || e.target.isContentEditable) return;
    var sel = e.key === 'ArrowLeft' ? '.artist__nav-prev'
            : e.key === 'ArrowRight' ? '.artist__nav-next' : null;
    if (!sel) return;
    var link = document.querySelector(sel);
    if (link) location.href = link.getAttribute('href');
  });
})();
</script>
</body>
</html>
`;
}

/* ── build ───────────────────────────────────────────────────────────── */

const ordered = [...ARTISTS].sort((a, b) => a.n - b.n);

// Fail loudly rather than emitting a broken set.
const seen = new Set();
for (const a of ordered) {
  if (!a.slug) throw new Error(`Artist ${a.n} (${a.name}) has no slug`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug)) throw new Error(`Slug not URL-safe: "${a.slug}"`);
  if (seen.has(a.slug)) throw new Error(`Duplicate slug: "${a.slug}"`);
  seen.add(a.slug);
  if (!a.video || !a.video.id) throw new Error(`Artist ${a.name} has no video`);
  if (!KIND_LABEL[a.video.kind]) throw new Error(`Unknown video kind "${a.video.kind}" for ${a.name}`);
}

// Clear stale pages so a renamed slug never leaves an orphan behind.
if (existsSync(OUT_DIR)) {
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith(".html")) rmSync(join(OUT_DIR, f));
  }
}
mkdirSync(OUT_DIR, { recursive: true });

ordered.forEach((a, i) => {
  const prev = ordered[(i - 1 + ordered.length) % ordered.length];
  const next = ordered[(i + 1) % ordered.length];
  writeFileSync(join(OUT_DIR, `${a.slug}.html`), page(a, prev, next), "utf8");
});

const withCards = ordered.filter((a) => cardFor(a.slug).includes("/og/a/")).length;
console.log(`Wrote ${ordered.length} artist pages to a/`);
console.log(`  asset version : v=${version}`);
console.log(`  origin        : ${origin}`);
console.log(`  social cards  : ${withCards}/${ordered.length} per-artist (rest fall back to the magazine card)`);
