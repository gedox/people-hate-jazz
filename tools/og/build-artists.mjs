/* PEOPLE HATE JAZZ — per-artist social cards.
 *
 * Renders tools/og/card.html once per artist through headless Chrome and writes
 * assets/og/a/<slug>.png, so every artist page previews as itself when shared
 * rather than borrowing the magazine card.
 *
 * Same arrangement as the other two cards: this runs once, by hand, and its
 * output is committed. The SERVED site still has no build step.
 *
 *   node tools/og/build-artists.mjs            # all 60
 *   node tools/og/build-artists.mjs otis-mcdonald rob-araujo   # just these
 *
 * Chrome is found at the usual Windows install path; override with CHROME=...
 * After this, re-run `node tools/artists/build.mjs` so the pages pick the new
 * cards up in their og:image meta.
 */

import { readFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_DIR = join(ROOT, "assets", "og", "a");
const CARD = pathToFileURL(join(HERE, "card.html"));

const CHROME = process.env.CHROME ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

if (!existsSync(CHROME)) {
  console.error(`Chrome not found at:\n  ${CHROME}\nSet CHROME=<path to chrome.exe> and re-run.`);
  process.exit(1);
}

/* ── inputs ──────────────────────────────────────────────────────────── */

const dataSrc = readFileSync(join(ROOT, "assets", "js", "data.js"), "utf8");
const { ARTISTS } = new Function(`${dataSrc}\nreturn { ARTISTS };`)();

const only = process.argv.slice(2);
const ordered = [...ARTISTS].sort((a, b) => a.n - b.n)
  .filter((a) => only.length === 0 || only.includes(a.slug));

if (only.length && ordered.length !== only.length) {
  const found = new Set(ordered.map((a) => a.slug));
  console.error(`Unknown slug(s): ${only.filter((s) => !found.has(s)).join(", ")}`);
  process.exit(1);
}

/* ── helpers ─────────────────────────────────────────────────────────── */

const pad = (n) => String(n).padStart(2, "0");

/* PNG header: width and height are big-endian u32 at byte 16 and 20. Reading
   them straight out of the file is how we prove 1200x630 without a dependency. */
function pngSize(file) {
  const b = readFileSync(file);
  if (b.length < 24 || b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length };
}

function urlFor(a) {
  const u = new URL(CARD);
  u.searchParams.set("dept", "artist");
  u.searchParams.set("n", pad(a.n));
  u.searchParams.set("name", a.name);
  u.searchParams.set("city", a.origin || "");
  u.searchParams.set("form", a.form || "");
  u.searchParams.set("pull", a.pull);
  u.searchParams.set("cuts", String(a.count));
  return u.href;
}

/* ── render ──────────────────────────────────────────────────────────── */

// Clear stale cards so a renamed slug never leaves an orphan behind.
if (existsSync(OUT_DIR) && only.length === 0) {
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith(".png")) rmSync(join(OUT_DIR, f));
  }
}
mkdirSync(OUT_DIR, { recursive: true });

// Own profile dir: the owner usually has Chrome open, and headless will not
// share a running instance's user-data-dir.
const PROFILE = join(tmpdir(), `phj-og-${process.pid}`);

const bad = [];
let totalBytes = 0;

ordered.forEach((a, i) => {
  const out = join(OUT_DIR, `${a.slug}.png`);
  const r = spawnSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=9000",
    "--window-size=1200,630",
    `--user-data-dir=${PROFILE}`,
    `--screenshot=${out}`,
    urlFor(a)
  ], { stdio: "ignore", timeout: 90_000 });

  const size = existsSync(out) ? pngSize(out) : null;
  const ok = r.status === 0 && size && size.w === 1200 && size.h === 630;
  if (!ok) {
    bad.push(`${a.slug} (${r.status === 0 ? size ? `${size.w}x${size.h}` : "no file" : `chrome exit ${r.status}`})`);
  } else {
    totalBytes += size.bytes;
  }
  process.stdout.write(`\r  ${String(i + 1).padStart(2)}/${ordered.length}  ${ok ? "ok  " : "FAIL"}  ${a.slug}`.padEnd(64));
});

rmSync(PROFILE, { recursive: true, force: true });

console.log(`\n\nWrote ${ordered.length - bad.length}/${ordered.length} cards to assets/og/a/`);
console.log(`  every card  : 1200x630`);
console.log(`  total size  : ${(totalBytes / 1024 / 1024).toFixed(1)} MB`);
if (bad.length) {
  console.error(`\n${bad.length} FAILED:\n  ${bad.join("\n  ")}`);
  process.exit(1);
}
