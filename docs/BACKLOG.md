# BACKLOG

Prioritized queue. Each item is self-contained — a cold session should be able to pick
the top unblocked item and work it without asking anything.

**Rules:** one item per shift. Don't start work that depends on an unmerged PR. If you
add an item, put it in priority order and write it so a stranger could do it.

---

## 🔒 BLOCKED ON OWNER

| Item | What's needed | Impact |
|---|---|---|
| **Domain decision** | Buy a domain, or confirm we stay on the `.vercel.app` alias | Every absolute URL and both social cards hardcode the alias. One commit to change before launch; after launch it invalidates cached social previews everywhere |
| **Repo visibility** | Public or private? Currently private | Public repo is free marketing for a publication |
| **Analytics** | Yes / no / privacy-preserving only | Footers promise "no tracking". Without a decision we ship blind |
| **Signal Engine keys** | Reddit API creds + Anthropic API key + `voice.md` written by the owner | Blocks the entire tool in `docs/signal-engine.md` |

---

## ☁ CLOUD-SAFE QUEUE — take from here first if you have no browser

Everything in P1/P2 below needs a browser or a decision from the owner. A cloud shift
should work **these** instead. All are verifiable programmatically.

### C1. Verify the masthead statistics against the data

**Problem.** `index.html` states as fact: 60 artists, 100 tracks, **29 music videos**,
**16 live films**, **median track 3:09**, "44 of the hundred are under three minutes, five
are under ninety seconds". Nobody has checked these against `data.js` and `tracklist.js`.
A publication printing a wrong number about its own contents is the worst kind of error.

**Do.** Write a throwaway script that recomputes every claim from the data. Fix whichever
number is wrong — the prose or the data, whichever the evidence says. Report each claim as
confirmed or corrected in the PR.

**Verify.** The script output. Show it in the PR body.

---

### C2. Link-rot check on all 60 videos

**Problem.** Every artist entry carries a YouTube ID. Videos get deleted, go private, or
get region-locked. A dead embed in a published magazine is embarrassing and invisible until
someone clicks.

**Do.** For each ID in `data.js`, request `https://www.youtube.com/oembed?url=...&format=json`.
A 200 means it's alive; 401/403/404 means it's gone. Rate-limit politely. Report every
failure in the PR with the artist name so a human can pick a replacement — **do not silently
swap a video**, the choice of video is editorial.

**Verify.** The check output.

---

### C3. Data integrity audit of `ARTISTS[]`

**Problem.** 60 hand-written records. Nobody has checked them for structural consistency.

**Do.** Verify: every entry has the same field set; no duplicate `id`/slug; no empty strings
where a value is expected; consistent casing on city and label; `form` and `kind` values are
from the known sets the filter chips use (`BAND`/`BEATMAKER`/`SOLOIST`/`COLLECTIVE`, `mv`/`live`);
every `id` is a valid HTML id and matches its anchor. Fix what's mechanical, report what
needs an editorial decision.

**Verify.** The audit script output, plus `node --check` on the file.

---

### C4. Accessibility audit of the markup

**Problem.** No a11y pass has been run. Much of it is readable from source without a browser.

**Do.** Check: landmark structure (`main`, `nav`, `header`, `footer`); heading order with no
skipped levels; `alt` text that actually describes the image rather than repeating the title;
accessible names on every icon-only control; link text that means something out of context;
`lang` on `html`; the search input's label. Fix what you can see; queue anything needing
visual confirmation (focus rings, contrast) as a browser item.

**Verify.** Grep-based checks, quoted in the PR. **Do not claim contrast or focus-visibility
compliance — those need a browser.**

---

### C5. Add JSON-LD structured data

**Problem.** No structured data. For a publication, that's a free win in search results and
richer link previews.

**Do.** Add a `Periodical`/`Article` JSON-LD block to `index.html` and a suitable type to
`store.html`. Use the real values already in the meta tags — do not invent an author, a date,
or an ISSN.

**Verify.** `JSON.parse` the block, and confirm every field matches an existing meta tag.

---

## P1 — next up

### 1. Mobile and accessibility pass

**Problem.** Neither page has been checked below desktop width, and no a11y audit has
been run. This is a publication — a large share of readers arrive from a phone link.

**Do.** Per the global workflow, run `/audit`, then `/critique`, then `/polish`. Check
at 375px, 768px and 1440px. Specifically verify: the roster grid reflows, the store
catalogue is usable one-handed, tap targets are ≥44px, focus rings are visible on the
newsprint ground, and `prefers-reduced-motion` actually suppresses the reveal animations.

**Verify.** `resize_window` to each breakpoint, screenshot each, and read the page for
overflow. The body must never scroll horizontally.

---

### 2. Drop `store.css` from `404.html`

**Problem.** `404.html` loads both stylesheets. That was a workaround from PR #1, before
`.modeswitch` and `.btn` moved into `main.css` (PR #3). It may now be unnecessary.

**Do.** Remove the `store.css` link from `404.html`, then check whether anything on that
page loses styling. If something does, that rule is also shared chrome and belongs in
`main.css` — move it and note which.

**Verify.** REQUIRES A BROWSER. Compare `404.html` before and after at 375px and 1440px;
the topbar, mode switch and both buttons must be unchanged.

---

### 3. Confirm the 760px breakpoint at 900px width

**Problem.** PR #3 moved a `@media (max-width: 760px)` block between stylesheets. It was
verified at 375px and 1440px, but not at 900px. Low risk, unclosed gap.

**Do.** Load all three pages at 900px and compare computed styles for `.topbar`,
`.topbar__in`, `.modeswitch`, `.topnav`, `.theme-toggle` against `main` before PR #3
(commit `a3153cc`).

**Verify.** REQUIRES A BROWSER.

---

## P2 — soon

### 2. Measure the 51,000px page

**Problem.** `index.html` renders 60 roster cards plus 100 tracklist rows in one
document — 51,421px tall. Desktop load is 698ms, which is fine. Nobody has measured a
mid-range phone.

**Do.** Measure first, optimize second. If it's genuinely slow, the cheapest fix is
`content-visibility: auto` with `contain-intrinsic-size` on the roster entries — no JS,
no virtualization, keeps the no-build-step constraint. Do **not** paginate the roster;
reading top to bottom is the point of the format.

---

### 3. Swap in the real domain *(blocked — see above)*

Once a domain exists: update `ORIGIN` in the `og:`/`twitter:`/`canonical` meta on
`index.html` and `store.html`, in `robots.txt` and in `sitemap.xml`, then re-render both
social cards:

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
BASE='C:\Users\gil-e\Desktop\new code\in progress\people hate jazz'
SRC="file:///C:/Users/gil-e/Desktop/new%20code/in%20progress/people%20hate%20jazz/tools/og/card.html"
for d in magazine store; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=9000 --window-size=1200,630 \
    --screenshot="$BASE\\assets\\og\\og-$d.png" "$SRC?dept=$d"
done
```

Then point Vercel at the domain and verify the cards resolve at the new origin.

---

## P3 — later

### 4. Signal Engine, Phase 1 *(blocked — needs keys)*

Reddit collector → SQLite → relevance scoring → plaintext digest. No UI. Full spec in
[`signal-engine.md`](signal-engine.md). Success test: the owner reads the digest and
thinks *"I'd actually reply to three of these."* Four hours of work that answers whether
the whole tool is worth building.

### 5. Per-artist share cards

The OG template already parameterizes by department. Extending it to render a card per
artist would make every individual artist link shareable. Only worth doing if artists get
their own URLs, which they currently don't.

### 6. Issue 02

Out of scope until Issue 01 is public and has been seen by actual readers.

---

## ✅ DONE

- **PR #4** — restored `CLAUDE.md` and `docs/BACKLOG.md` to `main` after they were
  stranded on an already-merged branch
- **PR #3** — moved `.modeswitch` and `.btn` out of `store.css` into `main.css`.
  Local verification found it also flipped a cascade race: the 44px tap-target rule in
  `main.css` had been silently overridden by `store.css`'s `2.5rem`. Net effect is an
  accessibility fix. **Lesson: "pure move" refactors between stylesheets can change the
  cascade — diff computed styles, not just the diff.**
- **PR #1** — deploy hardening: OG cards, social meta, `vercel.json`, `robots.txt`,
  `sitemap.xml`, 404 page, and a real caching bug fixed (`store.html` loaded `data.js`
  unversioned while `index.html` loaded `data.js?v=8`)
- Repo created, Vercel linked, production + preview deploys working
