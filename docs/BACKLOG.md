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

### A7 — Give the scheduled shifts a way to run a server · **blocks Lane C entirely**
*Added by Lane C, 2026-09-05, after failing to render a single page.*

Lane C exists because design work can only be verified in a browser. When the shift runs
unattended on a schedule it cannot get one:

- `preview_start` with the `phj` config is **refused** in scheduled-task runs — "nobody is
  present to approve the command".
- The in-app browser renders local `file://` pages as static `data:` snapshots. Relative
  CSS and JS never load, so it shows 0 roster cards, and page tools then refuse the tab.
- The Chrome extension's `navigate` prepends `https://` to a `file://` URL.
- Production is behind Vercel deployment protection and redirects to a login.

So every scheduled Lane C shift is a no-op until this is fixed. Options, cheapest first:
**(a)** run Lane C attended rather than scheduled; **(b)** keep a server up and add an
attach-only entry to `.claude/launch.json` (`url` + no command) that the sandbox will
accept; **(c)** settle the contradiction in **A7b** and let the shift start its own.
**Verify:** run the scheduled shift and confirm it renders `index.html` with 60 cards.

### A7b — Settle the "never run a server with Bash" contradiction
`docs/LANES.md` (and the Lane C shift prompt) say **never run a server with Bash**.
`CLAUDE.md`'s "Verify before you claim" section prescribes `python -m http.server 8412`
in a bash block. A shift that reads both cannot obey both. Pick one and make the other
match. Owner's call — it is a rule about how shifts are allowed to work.

### A8 — Remove the inline `outline:none` from the store's sort control
*Added by Lane C, 2026-09-05. Pairs with C7.*

`store.js:336` builds `<select id="lsort" style="…;outline:none">`. Inline, so no
stylesheet can restore the focus ring without `!important`, and the control has no visible
focus state. Move the whole inline `style` to a class (Lane C supplies it in `store.css`)
and drop the attribute. One line.

### A9 — Focus and announcements on the store's routes
*Added by Lane C, 2026-09-05. Detail: findings 5, 6 and 7 in the audit.*

Three related defects in `assets/js/**`, all cheap:

1. **Route changes throw focus away.** `store.js:787` scrolls to top but never moves focus;
   the activated link is gone, so focus falls to `<body>` and a keyboard user restarts from
   the top of the tab order on every navigation. Focus `#content` instead.
2. **Four routes have no `<h1>` and never change the title.** `viewClosing`, `viewShops`,
   `viewMyBids` and `viewHow` start at `<h2>`, and `document.title` is only rewritten for
   `lot` and `shop`. Nothing tells assistive tech the page changed.
3. **Playing a video destroys focus.** `app.js:153` — and the same block inlined in all 60
   `a/*.html` pages — does `f.replaceWith(frame)`. Press Enter on **Play** and the focused
   button ceases to exist. Focus the new `<iframe>`.

Also write one short sentence into the `role="status"` node **C6** adds.
**Verify:** REQUIRES A BROWSER. Tab-only walk of the store, then a route change.

### A4 — Swap in the real domain *(blocked)*
Update `ORIGIN` in the meta on every page (including the 60 new ones), `robots.txt` and
`sitemap.xml`, then re-render all social cards. Command in `docs/LANES.md`.

---

# 🅱 LANE B — EDITORIAL & CONTENT  *(local, 13:10)*

Owns words and data. Never touches CSS or layout.

### B1 — Verify the masthead's own statistics · **do this first**
`index.html` states as fact: 29 music videos, 16 live films, median track 3:09, 44 tracks
under three minutes, five under ninety seconds. **Nobody has checked these against `data.js`
and `tracklist.js`.** A magazine printing a wrong number about its own contents is the worst
kind of error, and it's on the front page.
**Do:** recompute every claim from the data. Fix whichever is wrong — prose or data,
whichever the evidence supports. Report each claim confirmed or corrected.

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

**Still open.** A static pass on 2026-09-05 found twelve issues and wrote them up with
line numbers, arithmetic and proposed fixes in
[`docs/audits/2026-09-05-lane-c-mobile-a11y.md`](audits/2026-09-05-lane-c-mobile-a11y.md).
**Nothing was rendered and no CSS was changed** — that shift ran unattended and could not
start a server (see **A7**). Read the audit first: with a browser, the headline items
(sticky toolbar occlusion, the invisible search focus ring) are a short shift, not a long
one. Do not ship any of it on the audit's word alone; it says so itself.

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

### C6 — Take the live region off the store's view container
*Added by Lane C, 2026-09-05. Detail: finding 5 in the audit.*

`store.html:67` is `<div id="view" aria-live="polite">`. The whole SPA view is a live
region, and `store.js` rewrites 24 lot countdowns inside it **every second** — so a screen
reader announces lot clocks roughly once a second, forever. It also re-reads the entire
catalogue on every hash route change.

**Do:** delete `aria-live="polite"` from `#view`, and add a visually-hidden
`<p class="sr" role="status">` for route announcements. `store.css:423` already has the
`.sr` helper. Pairs with **A9**, which writes to it; ship C6 first — removing the live
region is an improvement on its own.
**Verify:** REQUIRES A BROWSER, and ideally a screen reader.

### C7 — Give the search box and the sort control a focus ring
*Added by Lane C, 2026-09-05. Detail: findings 3 and 4.*

`main.css:516` kills the outline on the roster search input and nothing replaces it —
tab to it and there is no focus indicator at all. WCAG 2.4.7 failure, on the magazine's
only form control. `store.css:278` already solves the identical problem for the bid field
with `:focus-within`; copy it to `.search`.

The store's sort `<select>` has the same hole, from an inline `outline:none` in
`store.js:336`. Lane C's half is a class in `store.css`; **A8** is Lane A's half.
**Verify:** REQUIRES A BROWSER. Tab through both toolbars.

### C8 — Contrast: `--ink-faint` on hover, and the chip border
*Added by Lane C, 2026-09-05. Detail: findings 8 and 9, with the arithmetic.*

Two computed AA failures. `--ink-faint` on the `--wash` hover background is 4.21:1 light /
4.29:1 dark (needs 4.5) — that is the artist line under every one of the 100 tracks, and
the metadata on every lot card, dropping below AA the moment you hover it. And unpressed
`.chip` borders are `--rule-hard`, which is **2.04:1** in the light theme (needs 3:1);
dark passes at 3.13, which is why nobody caught it.

Candidate values are in the audit. **Both touch the whole newsprint palette — look at them
before shipping.** `.impeccable.md` asks for quiet colour and these make it slightly louder;
that is a design call, not a lint fix. Don't raise `--rule-hard` globally to fix the chip.
**Verify:** REQUIRES A BROWSER, at 375 and 1440, both themes.

---

# 🅳 LANE D — RESEARCH & GROOMING  *(cloud, 21:10)*

Owns no code.

### D1 — Audit the handover
Is `PROGRESS.md` true? Compare against open PRs, merged PRs, recent commits. Fix what's
stale. It's the project's only memory between shifts.

### D3 — Fix the horizontal-overflow check in the standing orders
*Added by Lane C, 2026-09-05.*

`CLAUDE.md` and `docs/LANES.md` both ask a shift to confirm "the body never scrolls
horizontally". That check can never fail: `main.css:110` sets `body { overflow-x: hidden }`,
so overflow is clipped, not prevented, and `body.scrollWidth` always equals the viewport.
Replace it with `documentElement.scrollWidth > documentElement.clientWidth`, plus the
bounding-rect sweep that names the offending element. Both snippets are at the end of
[`docs/audits/2026-09-05-lane-c-mobile-a11y.md`](audits/2026-09-05-lane-c-mobile-a11y.md).

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
