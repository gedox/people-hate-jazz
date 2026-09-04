# BACKLOG

**Read `docs/LANES.md` first** — it says which lane you're working and what you may touch.
Shifts run in parallel lanes so they never collide.

**Rules:** one item per shift. Confirm your item isn't already done (`git log`, merged PRs)
— the backlog goes stale because only the owner can merge. Don't start work that depends on
an unmerged PR. If you add an item, write it so a stranger could do it.

---

## 🎯 WHAT "GROWTH" MEANS HERE

Issue 01 is finished and live. Polishing it further has sharply diminishing returns.

The strategy is: **build the audience before taking a single client.** That needs things to
distribute. Right now the entire publication is **one URL** — sixty artists and you cannot
share any single one of them. Fixing that multiplies the shareable surface by sixty.

Priority order: **shareable surface → content volume → tooling → polish.**

If an item doesn't move one of those, it's maintenance. Maintenance is allowed, never ahead
of growth.

---

## 🔒 BLOCKED ON OWNER

| Item | What's needed | Impact |
|---|---|---|
| **Domain** | Buy one, or confirm we stay on the `.vercel.app` alias | Every absolute URL and social card hardcodes the alias. Blocks Epic A1 finishing cleanly — 60 new pages would bake in the wrong origin |
| **Repo visibility** | Public or private? | Public is free marketing for a publication |
| **Analytics** | Yes / no / privacy-preserving | Footers promise "no tracking". Undecided means shipping blind |
| **Signal Engine keys** | Reddit API creds + Anthropic API key + `voice.md` | Blocks A2 from finishing (fixture work can proceed) |

---

# 🅰 LANE A — PRODUCT & ENGINEERING  *(local, 08:10)*

## EPIC A1 — Per-artist pages · **the flagship, do this first**

Sixty artists share one URL. This turns the publication into **61 shareable things**, each
with its own social card. Highest-leverage item in the project; the whole distribution
strategy depends on it.

**Constraint.** The *served site* has no build step — that stays true. A one-time generator
whose output is committed is fine; the OG cards already set that precedent.

Shift-sized chunks, in order, one per shift.

### A1.1 — The generator
Write `tools/artists/build.mjs`. Reads `ARTISTS[]` from `assets/js/data.js`, emits one static
page per artist at `a/<slug>.html`. Template beside it. Reuse `main.css` + `store.css`;
introduce no new design language — `.impeccable.md` still governs.
**Each page needs:** the entry and credits, the video as a click-to-play facade (never a live
iframe), prev/next artist links, a link back to the survey, its own `canonical`, and full
`og:`/`twitter:` meta.
**Verify:** generator runs clean, emits exactly 60 files, every slug unique and URL-safe,
`node --check` passes. Commit the generator **and** its output.

### A1.2 — Per-artist social cards · ✅ **DONE — PR #10**
Extend `tools/og/card.html` with an artist variant: the artist's name as the wordmark, their
city and one-line description, flame accent. Render all 60 via headless Chrome into
`assets/og/a/<slug>.png`. Wire each into its page's meta.
**Verify:** 60 PNGs at exactly 1200×630; spot-check five visually; every `og:image` resolves.
*Shipped as `tools/og/build-artists.mjs` (~36s for all 60). Also added the `og:image:alt`
the artist pages were missing. Cards total 21.5 MB — see A6.*

### A1.3 — Wire the survey to the pages
Every roster entry on `index.html` and every index-grid name links to its artist page. Keep
existing on-page anchors working — don't break deep links.
**Verify:** REQUIRES A BROWSER. All 60 links resolve, no 404s, roster still filters.

### A1.4 — Sitemap and discovery
Add all 60 pages to `sitemap.xml`, add prev/next `rel` links, confirm `robots.txt` allows them.

---

### A2 — Signal Engine Phase 1 *(partly blocked)*
Reddit collector → SQLite → relevance scoring → plaintext digest. No UI. Spec in
[`signal-engine.md`](signal-engine.md). **Unblocked work available now:** write the collector
and scorer against committed fixture data so it's testable without credentials. That's a real
shift and it takes the key dependency off the critical path.

### A3 — Measure the 51,000px page
`index.html` is 51,421px tall; desktop load 698ms; nobody has measured a mid-range phone.
Measure before optimizing. If slow, `content-visibility: auto` with `contain-intrinsic-size`
is the cheapest fix — no JS, no build step. **Do not paginate the roster**; reading top to
bottom is the point of the format.

### A5 — One git worktree per shift · **now blocking safe parallel work**
*Added by Lane A, 2026-09-04, after three shifts ran concurrently and fought over one tree.*

The lane system partitions **files**. It does not partition the **checkout**. Three local
shifts sharing one working directory produced, in about ten minutes: a `git checkout` that
moved the branch under another shift mid-run (three commits landed on local `main`, having
bypassed review), a `git clean -fd` that deleted another shift's unstaged generator and 60
rendered PNGs, and the same work delivered twice as two PRs on the same commit.

**Do:** give each shift its own worktree (`git worktree add ../phj-lane-a lane-a/<work>`),
or serialise the schedule so no two local shifts overlap. A shift should also refuse to
start if the tree is dirty with work that isn't its own.
**Verify:** run two shifts at once and confirm neither sees the other's files.

### A6 — Shrink the sixty artist cards
*Added by Lane A, 2026-09-04, while shipping A1.2.*

`assets/og/a/` is **21.5 MB** — 60 PNGs at ~368 KB. The baked-in grain plate is noise and
compresses badly as truecolour. Every card is comfortably under the ~1 MB that scrapers
care about, so this is repo weight, not a reader-facing bug.

Measured: palette-quantising one card to 256 colours took it 329 KB → 154 KB (**53% off**,
~11 MB across the set) with no visible change, since the artwork is four flat inks plus
noise. Pillow does it in three lines but is a Python dependency in a Node generator; a
palette encoder on `node:zlib` avoids that. **Do not** reduce the grain to save bytes —
it is the same plate as the site and Lane C owns it.

### A7 — Bump `?v=` to 11 on the next reader-visible asset change
*Added by Lane B, 2026-09-04, while verifying B1. Deliberately NOT done in that PR.*

B1 changed `assets/js/tracklist.js` (added a `d` duration field) without bumping `?v=10`.
That was a judgement call, and the owner may want to overrule it:

- **Why not bumped:** `d` is data nothing renders — `app.js` reads only `n`, `t`, `a`.
  Verified in-browser that the new file produces byte-identical DOM. Bumping means editing
  the `?v=` on every asset reference in **63 HTML files** — including all 60 under `a/**`,
  which is **Lane A's territory and Lane B may not touch it**. A 63-file cross-lane diff
  for an invisible field is exactly the unreviewable PR the standing orders warn against.
- **The cost:** a returning reader with `tracklist.js?v=10` cached keeps the old copy. Today
  that is harmless. It stops being harmless the moment anything *renders* a duration.

**So:** whoever next changes a reader-visible asset bumps every file to `?v=11` together —
which also picks this up. Do not bump only `index.html`; they must never drift apart.

### A4 — Swap in the real domain *(blocked)*
Update `ORIGIN` in the meta on every page (including the 60 new ones), `robots.txt` and
`sitemap.xml`, then re-render all social cards. Command in `docs/LANES.md`.

---

# 🅱 LANE B — EDITORIAL & CONTENT  *(local, 13:10)*

Owns words and data. Never touches CSS or layout.

### B1 — Verify the masthead's own statistics · ✅ **DONE — 2026-09-04**
All ten checked claims are **correct**; nothing needed correcting. But three of them
(median 3:09, 44 under three minutes, five under ninety seconds) were not checkable from
this repo at all — `tracklist.js` had no duration field. Durations for all 100 tracks are
now committed as `d` (milliseconds, from Spotify's public embed payload), so the front
page is auditable offline from here on. Full table in `PROGRESS.md`.

### B2 — Link-rot sweep on all 60 videos
Videos get deleted, go private, get region-locked; a dead embed is invisible until a reader
clicks. Request `https://www.youtube.com/oembed?url=...&format=json` per ID — 200 alive,
401/403/404 gone. Rate-limit politely. **Report failures by artist name; never silently swap
a video.** Choosing a replacement is an editorial decision.

### B3 — Data integrity audit of `ARTISTS[]`
Sixty hand-written records, never checked. Verify identical field sets, no duplicate
`id`/slug, no empty strings where a value is expected, consistent city/label casing,
`form`/`kind` drawn from the sets the filter chips use, every `id` a valid HTML id matching
its anchor. Fix what's mechanical; report what needs an editorial call.

### B4 — Issue 02 artist pipeline · **recurring, high value**
Issue 01 is closed; Issue 02 needs a longlist. Each shift add 3–5 candidates to
`docs/issue-02/longlist.md`: artist, release, label, city, why they fit, link. Prefer the
genuinely under-covered over the obvious. Draw on `docs/research/`.
**This is the content pipeline. It should never be empty.**

### B6 — Decide the duplicate "Stronger"
*Added by Lane B, 2026-09-04, while verifying B1.*

The playlist has 100 rows but only 99 distinct recordings. Otis McDonald's *Stronger*
appears twice — row 3 (`1aihLLEUnSYPptVj42wraV`) and row 57 (`0DMmuamiQ9tRdXfFLrEADn`):
two different Spotify URIs, identical duration (183,829 ms), so it is the same recording
issued on two releases rather than an alternate take.

Nothing is *wrong* — `count:8` for Otis correctly counts playlist rows, `tracks[]`
correctly lists 7 distinct titles, and the source playlist is reproduced faithfully, which
is what the colophon promises. But an attentive reader who counts will find the seam.
**Editorial call for the owner, not a bug to fix silently:** leave it and say nothing,
or add one line to the colophon noting the playlist repeats a track.

### B5 — Enrich the existing sixty
Several entries have blank origins, left blank rather than guessed — the colophon says so,
keep that honesty. Research what can be **confirmed** and fill it, citing the source in the
PR. Leave anything unconfirmable blank.

---

# 🅲 LANE C — DESIGN & VISUAL  *(local, 17:40 — the browser lane)*

Owns how it looks. Load `/frontend-design` before UI work; finish with `/critique`,
`/audit`, `/polish`.

### C1 — Mobile and accessibility pass · **do this first**
Neither page has been checked below desktop width; no a11y audit has run. Most readers
arrive from a phone link. Check 375 / 768 / 1440. Verify: roster grid reflows, store
catalogue usable one-handed, tap targets ≥44px, focus rings visible on the newsprint ground,
`prefers-reduced-motion` genuinely suppresses the reveal animations, body never scrolls
horizontally.

### C2 — Drop `store.css` from `404.html`
It loads both stylesheets — a workaround from PR #1, before `.modeswitch`/`.btn` moved into
`main.css`. Probably unnecessary now. Remove and see what breaks; anything that does is also
shared chrome and belongs in `main.css`.

### C3 — Confirm the 760px breakpoint at 900px
PR #3 moved a `@media (max-width: 760px)` block between stylesheets. Verified at 375 and
1440, never at 900. Compare computed styles against commit `a3153cc`.

### C4 — Accessibility of the markup
Landmarks, heading order, alt text that describes rather than repeats, accessible names on
icon-only controls, meaningful link text, the search input's label. You have a browser, so
**do** check contrast and focus visibility rather than skipping them.

### C5 — Design the artist page *(after A1.1 exists)*
The generator ships a functional template; Lane C makes it good. A real design brief, not a
polish pass — this is the page most new readers will land on.

---

# 🅳 LANE D — RESEARCH & GROOMING  *(cloud, 21:10)*

Owns no code.

### D1 — Audit the handover
Is `PROGRESS.md` true? Compare against open PRs, merged PRs, recent commits. Fix what's
stale. It's the project's only memory between shifts.

### D2 — One research note per shift
Dated note in `docs/research/`. Rotate topics; check what's already covered. Feed findings
into B4.
- Artists for Issue 02 — recent releases, under-covered over obvious
- Where this could be seen — radio, blogs, newsletters, curators, forums. **Research only, contact nobody.**
- Reference publications — how comparable magazines structure issues and archives
- Technical/design opportunities, written up as proper backlog items

---

## ✅ DONE

- **PR #5** — groomed the backlog; hardened standing orders against stale work orders
- **PR #4** — restored `CLAUDE.md`/`BACKLOG.md` to `main` after they were stranded
- **PR #3** — moved `.modeswitch`/`.btn` into `main.css`. Local verification found it also
  flipped a cascade race: a 44px tap-target rule had been silently overridden by
  `store.css`'s `2.5rem`. Net effect an accessibility fix. **Lesson: "pure move" refactors
  between stylesheets can change the cascade — diff computed styles, not just the diff.**
- **PR #2** — shift system
- **PR #1** — deploy hardening: social cards, meta, `vercel.json`, robots, sitemap, 404, and
  a real caching bug (`store.html` loaded `data.js` unversioned)
