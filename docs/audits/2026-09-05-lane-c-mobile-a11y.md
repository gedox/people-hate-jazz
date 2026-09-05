# Lane C — mobile & accessibility audit (C1), static pass

**Date:** 2026-09-05 · **Lane:** C — Design & Visual · **Commit audited:** `bf294ae` (`main`)

> ## ⚠ NOT BROWSER-VERIFIED
>
> **No page in this document was rendered.** Lane C's shift ran unattended and could not
> start a server — see [The blocker](#the-blocker). Every finding below is read out of the
> source or computed arithmetically. Nothing here has been seen at 375 / 768 / 1440, no
> screenshot was taken, and no computed style was diffed.
>
> Each finding is tagged **CERTAIN** (follows from the source or from arithmetic, no
> rendering needed) or **LIKELY** (sound reasoning about the cascade, but a browser must
> confirm it before anyone edits CSS on the strength of it).
>
> **No CSS or markup was changed in the PR that carries this file.** This is a work order
> for the next Lane C shift that has a browser, not a fix.

---

## The blocker

C1 is a browser task. This lane could not get one.

| Route tried | Result |
|---|---|
| `preview_start` with the `phj` config in `.claude/launch.json` | Refused: *"Dev servers can't be started from unattended sessions (scheduled-task runs and remote-dispatched trees) — nobody is present to approve the command."* |
| In-app Browser pane on `file:///…/index.html` | Renders as a **static snapshot** on a `data:` URL. Relative `<link>`/`<script>` never resolve, so no CSS and no JS: 0 roster cards, 0 tracklist rows. Page tools then refuse to act on the tab at all. |
| Real Chrome (`claude-in-chrome`) on the same `file://` URL | The extension's `navigate` prepends `https://`, producing `https://file:///C:/…`. `file://` is unreachable through it. |
| Production — `https://people-hate-jazz-gedox3-4185s-projects.vercel.app/` | Redirects to a Vercel login. Deployment protection is on, so the deployed site can't stand in for a local server either. |
| `python -m http.server 8412` via Bash | **Not attempted.** `docs/LANES.md` and this lane's shift prompt both say *never run a server with Bash*. Noted only because `CLAUDE.md`'s "Verify before you claim" section prescribes exactly that command — the two documents contradict each other, and the owner should settle which one wins (filed as **A7**). |

**Consequence.** Every scheduled Lane C shift will hit this wall until it is fixed. The lane
whose entire justification is "the design work exists in your lane precisely because it
cannot be verified any other way" is the one lane whose tool is unavailable when it runs.
Filed as **A7**; it is the highest-value item in this document.

---

## Findings

Ordered by impact. Line numbers are against `bf294ae`.

### 1 · The sticky filter toolbar hides behind the chrome above it — CERTAIN

`assets/css/main.css:500`

```css
.toolbar { position: sticky; top: 3.1rem; z-index: 200; }
```

`3.1rem` is the desktop top-bar height, hard-coded. It is wrong in two places:

**Store, every viewport ≥ 761px.** The stack above the toolbar is the top bar (`3.1rem`
≈ 49.6px) *plus* the sticky prototype banner (`store.css:30–34`, `padding-block: .4rem`
around one line of `--t--1` ≈ 30px) ≈ **79.6px**. The toolbar pins at 49.6px, i.e. ~30px
up inside the banner, and the banner wins the paint (`z-index: 250` vs `200`). Toolbar
height is ~53px, so **roughly 57% of the catalogue's search-and-filter bar is covered by
the prototype banner** whenever the catalogue is scrolled.

**Both pages, ≤ 760px.** The top bar deliberately becomes two rows (`main.css:252–271`):
`3.1rem` + `2.5rem` = `5.6rem`. `store.css:25` already encodes this as
`--topbar-h: 5.6rem`. The toolbar still pins at `3.1rem`, so **~2.5rem of it sits behind
the top bar** on a phone.

This is the exact failure `store.css:9–12` warns about in a comment:

> *"Everything sticky below it reads this rather than hard-coding a height that goes wrong
> at one breakpoint."*

`.demobar` and `.bidbox` read `--topbar-h`. `.toolbar` is the one that doesn't.

**Proposed fix** (needs a browser, and a computed-style diff against `bf294ae`):
1. Move `--topbar-h` from `store.css:12` into `main.css` next to `.topbar` — it describes
   shared chrome, same argument as PR #3, and `main.css` must not depend on a token only
   `store.css` defines.
2. Add `--stickytop` that the store can extend by its banner height, and set
   `.toolbar { top: var(--stickytop); }`.
3. **Below 760px, drop `position: sticky` from `.toolbar` entirely** — see finding 2.

---

### 2 · On a phone the sticky toolbar eats about a third of the viewport — LIKELY

At 375px the toolbar's children wrap. With `@media (pointer: coarse)` forcing 44px chips
(`main.css:524–529`), the run is roughly: search row 44px, four form chips over ~2 rows
(*Bands · Beatmakers · Soloists · Collectives* ≈ 315px of chips into ~340px of usable
width), one row of kind chips, plus the count — **≈190px of permanently pinned toolbar**,
on top of a 5.6rem (≈90px) top bar. That is **~280px of an 812px viewport, ~34%, gone
before any editorial appears** — and per finding 1, part of it is hidden anyway.

The house already has the precedent and the argument, in `store.css:44–50`:

> *"Three lines of disclaimer pinned to the top of an 812px screen is a bad trade — it eats
> an eighth of the viewport on every scroll. Let it scroll away on small screens."*

Same trade, larger. **Recommend `position: static` for `.toolbar` below 760px.** It also
makes finding 1's mobile half disappear.

*Numbers are computed from the type scale, not measured. A browser must confirm the wrap
count before this ships.*

---

### 3 · The roster search input has no visible focus indicator — CERTAIN

`assets/css/main.css:515–520`

```css
.search input { border: 0; background: none; outline: none; … }
```

`.search input` (specificity 0,1,1) beats the global `:focus-visible` (0,1,0) and comes
later in the file, so the outline is removed and **nothing replaces it**. There is no
`.search:focus-within` rule anywhere in `main.css` (grep: the only `:focus-within` on the
site is `store.css:278`).

Tab to the roster search box on `index.html` and there is no indication it is focused.
WCAG 2.4.7 (Focus Visible), Level AA — failure.

The store's bid field does the same thing at `store.css:270–275` but is rescued two lines
later by `.bidfield:focus-within { outline: 3px solid var(--ultra); outline-offset: 2px; }`.
**`.search` needs the identical rule.** The pattern is already in the codebase; it was just
never applied to the search wrapper.

---

### 4 · The store's sort control has no visible focus indicator — CERTAIN

`assets/js/store.js:336`

```js
'<select id="lsort" aria-label="Sort lots" style="…;outline:none">'
```

Inline `outline: none`, so no stylesheet can restore it without `!important`. Same WCAG
2.4.7 failure as finding 3.

**Cross-lane.** The `<select>` is built in `store.js`, which is Lane A's. Lane C's half is
a `.sortfield` class in `store.css` carrying the visual treatment plus a `:focus-visible`
rule; Lane A's half is deleting the inline `style` attribute and adding the class. Filed
for A as **A8**.

---

### 5 · The store announces every countdown tick to screen readers — CERTAIN

`store.html:67`

```html
<div id="view" aria-live="polite"></div>
```

The whole single-page view is a live region. Inside it:

- `store.js:214` — every lot's clock is `<span class="clock" data-clock="…">`, and the
  index route renders 24 of them.
- `store.js:798–807` — a `setInterval(…, 1000)` rewrites each clock's `textContent`
  every second.

Any text mutation inside an `aria-live` container is announced. So a screen-reader user on
the store gets **an announcement roughly every second, forever, listing lot countdowns**,
with no way to stop it. It makes the store unusable with assistive tech.

The same live region also re-announces the *entire* view on every hash route change —
all 24 cards.

**Proposed fix:** delete `aria-live="polite"` from `#view` (Lane C, markup) and add a
visually-hidden `<p class="sr" role="status" id="routestatus">` that `store.js` writes one
short sentence into on route change (Lane A). `store.css:423` already has the `.sr`
visually-hidden helper. Filed for A as **A9**; the markup half is **C6**.

---

### 6 · Four of the store's seven routes have no `<h1>` and no title change — CERTAIN

`store.js:764–789`. `viewIndex` emits an `<h1>`; `viewShop` and `viewLot` emit an `<h1>`.
`viewClosing`, `viewShops`, `viewMyBids` and `viewHow` start at `<h2>` (via `sechead()`).
`document.title` is likewise only rewritten for the `lot` and `shop` routes — the other
five keep the generic store title.

Combined with finding 7 (no focus move), navigating to *Closing soon*, *The 60 shops*,
*My bids* or *How it works* changes neither the title, nor the heading structure's top
level, nor focus. Lane A's file; filed as **A9** alongside the live-region work.

---

### 7 · Route changes and video plays throw focus away — CERTAIN

- `store.js:787` scrolls to top on route change but never moves focus. The activated link
  is gone from the DOM, so focus falls to `<body>`; a keyboard user restarts from the top
  of the tab order on every navigation.
- `app.js:153` and the same block inlined in each artist page (`a/*.html`) do
  `f.replaceWith(frame)` on the play facade. Press Enter on **Play** and the focused
  button is destroyed — focus is lost and the new `<iframe>` is never focused.

Both are Lane A's files (`assets/js/**`). The fix in both cases is to focus the
replacement (`main` / the new `iframe`, both already focusable or trivially made so).
Filed as **A9**.

---

### 8 · `--ink-faint` drops below 4.5:1 on hover backgrounds — CERTAIN (computed)

Measured with the WCAG 2.x relative-luminance formula:

| Combination | Ratio | Needs | |
|---|---|---|---|
| `--ink-faint` `#6e6354` on `--paper` `#e8e2d4` | **4.55** | 4.5 | passes by 0.05 |
| `--ink-faint` on `--wash` (`#e0dacc`, ink 4% over paper) | **4.21** | 4.5 | **fails** |
| dark `--ink-faint` `#8b8171` on dark `--paper` `#14120f` | 4.88 | 4.5 | passes |
| dark `--ink-faint` on dark `--wash` (`#211f1b`) | **4.29** | 4.5 | **fails** |

`--wash` is the hover background of `.tracklist li` (`main.css:763`) and `.lotcard`
(`store.css:105`), and the standing background of `.teaser`. The metadata inside those —
`.tracklist .a` (the artist under each of the 100 tracks), `.lotcard__bid dt`, `.lotcard__n`
— is `--ink-faint`. So **hovering a track or a lot card pushes its own small print below
AA**, in both themes.

The token is knife-edge on the flat paper too: 0.05 of headroom.

**Proposed fix** — one step darker in light, one step lighter in dark, no hue change:

| | now | proposed | on paper | on wash |
|---|---|---|---|---|
| light `--ink-faint` | `#6e6354` | **`#675c4d`** | 5.06 | 4.69 |
| dark `--ink-faint` | `#8b8171` | **`#918776`** | 5.28 | 4.65 |

This touches every metadata line on the site — kickers, rails, captions, the colophon —
and `.impeccable.md` asks for *"loud typography, quiet color"*. **It must be seen before it
ships.** Do not merge this one on arithmetic alone.

---

### 9 · Unpressed filter chips have a 2.04:1 border in the light theme — CERTAIN (computed)

`main.css:530–536`: `.chip { border: 1px solid var(--rule-hard); }`

`--rule-hard` is `color-mix(in srgb, var(--ink) 32%, transparent)`, which over paper
composites to `#a49f95` — **2.04:1 against `#e8e2d4`**. An unpressed chip is otherwise just
text, so that hairline is the entire visual boundary of the control. WCAG 1.4.11
(Non-text Contrast) wants 3:1.

The dark theme uses 38% and lands at **3.13:1** — it passes, which is why this was never
noticed.

Ink percentages over paper, for whoever picks the value: 40% → 2.52 · 44% → 2.80 ·
**48% → 3.13** · 52% → 3.54 · 56% → 3.99.

**Do not simply raise `--rule-hard`** — it is also every hairline rule in `.stats`,
`.spec`, `.entry__rail .sep` and the index grid, and darkening those coarsens the whole
newsprint grid. Give `.chip` its own border token at ≥3:1 and leave `--rule-hard` alone.

---

### 10 · Focus rings on the top-nav links are clipped — LIKELY

`main.css:194–200`: `.topnav { display: flex; align-items: stretch; overflow-x: auto; }`

Per the overflow spec, `overflow-x: auto` with `overflow-y: visible` computes the visible
axis to `auto`, making `.topnav` a scroll container that clips at its padding box. Its
links are `align-items: stretch`, so they exactly fill its height — and the global focus
ring is `outline: 3px solid; outline-offset: 3px` (`main.css:121–124`), drawn entirely
*outside* the link's box.

So tabbing through *Argument · The Sixty · Index · Playlist · Masthead* should show at
best two vertical slivers of ring, and on the first and last items part of that is under
the `mask-image` fade too. **A browser must confirm this** — it is the one finding here
that turns on how a specific engine clips outlines.

If confirmed, the cheap fix is a focus style that paints inside the box for `.topnav a`
(inset `box-shadow`, or `outline-offset: -3px`) rather than loosening the scroll container.

---

### 11 · Tap targets under 44px that the coarse-pointer block misses — CERTAIN

`main.css:524–529` raises `.chip`, `.search`, `.indexgrid a`, `.topnav a` and
`.theme-toggle` to 44px on coarse pointers. `artist.css` does the same for `.artist__nav a`.
Not covered:

| Selector | Approx. height at 375px | Where it bites |
|---|---|---|
| `.btn` (`main.css:275–283`) | ~36px | *Enter the store*, *Place bid*, *Show more*, both 404 links |
| `.crumbs a` (`store.css:189–196`) | ~17px | the store's only way back up from a lot |
| `.caption a` (`main.css:723`) | ~17px | *Open on YouTube*, ×60 |
| `.colophon a` (`main.css:842`) | ~17px | footer links on every page |
| `.mybids a` row (`store.css:384–387`) | ~33px | the saved-bids list |

`.modeswitch a` looks bare in the CSS but is fine in practice — it stretches to the
`3.1rem` row (`main.css:257`), ~50px.

Also note `@media (pointer: coarse)` misses touch-screen laptops, which report
`pointer: fine` for their primary pointer. `@media (hover: none)`, or simply applying the
minimum unconditionally, would cover more people.

---

### 12 · `--topbar-h: 5.6rem` is ~4px short on touch devices — CERTAIN

`store.css:25` assumes the wrapped top bar is `3.1rem` + `2.5rem`. But
`main.css:528` raises `.topnav` and `.theme-toggle` to `44px` (`2.75rem`) on coarse
pointers, making the real height ≈ `5.85rem`.

Harmless today — the only ≤760px consumer of the token, `.demobar`, is `position: static`
at that width (`store.css:48–50`). It becomes a 4px gap the moment anything else sticks to
it. Fix it in the same pass as finding 1.

---

## A note on the regression baseline

`CLAUDE.md` and `docs/LANES.md` both ask a shift to confirm **"the body never scrolls
horizontally."** That check cannot fail: `main.css:110` sets `body { overflow-x: hidden }`,
which hides overflow rather than preventing it. Any element bleeding past the viewport is
silently clipped, and `document.body.scrollWidth` stays equal to the viewport width.

The check that actually detects it:

```js
document.documentElement.scrollWidth - document.documentElement.clientWidth   // > 0 ⇒ overflow
// and, to find the culprit:
[...document.querySelectorAll('*')]
  .filter(el => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
```

`.bigmark` (`main.css:857–867`) is *designed* to bleed and clips itself with its own
`overflow: hidden`, so it should not show up. Anything else that does is a real bug that
the current baseline cannot see. Worth correcting in the standing orders (**D3**).

---

## What a browser still has to check

Nothing above covers these; they need eyes and were the rest of C1's brief:

- Does the roster grid actually reflow at 375 / 768 / 1440? `.entry` switches to two
  columns at 940px and `.entry--spread` at 940px — untested at 768.
- The `900px` gap: `.masthead__deck`, `.storehero__deck` and `.shophead__note` all switch
  at 900px, `.entry` at 940px, `.editorial__grid` and `.playlist__grid` at 1000px.
  Nobody has looked at 900–1000px. This is also **C3**, still open.
- `404.html` at ≤760px: it has no `.topnav`, so the wrap rules leave the theme toggle
  alone on the second row. Probably looks like a mistake. Also settles **C2**.
- Does `prefers-reduced-motion` genuinely suppress the reveals? The CSS looks right
  (`main.css:878–887`, `store.css:426–429`) and `app.js:220` checks the query before
  observing — but it has never been watched with the setting on.
- Contrast of text over the `.facade` flame overprint (`main.css:673–681`,
  `mix-blend-mode: multiply` at `.78`) — not computable from tokens; it needs a
  screenshot and a sampled pixel.
