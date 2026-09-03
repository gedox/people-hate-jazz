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

## P1 — next up

### 1. Extract shared chrome out of `store.css`

**Problem.** `.topbar`, `.modeswitch` and `.btn` are used by every page but defined in
`assets/css/store.css`. Found this when `404.html` rendered with an unstyled topbar
because it only loaded `main.css`. Any new page hits the same trap.

**Do.** Move genuinely shared chrome into `main.css` (or a new `chrome.css` loaded
first). Leave store-specific overrides in `store.css`. Then confirm every page still
renders identically — this is a pure refactor, zero visual change is the success test.

**Verify.** Screenshot `index.html`, `store.html`, `404.html` before and after. Topbar,
mode switch and buttons must be pixel-identical. Zero console errors.

---

### 2. Mobile and accessibility pass

**Problem.** Neither page has been checked below desktop width, and no a11y audit has
been run. This is a publication — a large share of readers arrive from a phone link.

**Do.** Per the global workflow, run `/audit`, then `/critique`, then `/polish`. Check
at 375px, 768px and 1440px. Specifically verify: the roster grid reflows, the store
catalogue is usable one-handed, tap targets are ≥44px, focus rings are visible on the
newsprint ground, and `prefers-reduced-motion` actually suppresses the reveal animations.

**Verify.** `resize_window` to each breakpoint, screenshot each, and read the page for
overflow. The body must never scroll horizontally.

---

## P2 — soon

### 3. Measure the 51,000px page

**Problem.** `index.html` renders 60 roster cards plus 100 tracklist rows in one
document — 51,421px tall. Desktop load is 698ms, which is fine. Nobody has measured a
mid-range phone.

**Do.** Measure first, optimize second. If it's genuinely slow, the cheapest fix is
`content-visibility: auto` with `contain-intrinsic-size` on the roster entries — no JS,
no virtualization, keeps the no-build-step constraint. Do **not** paginate the roster;
reading top to bottom is the point of the format.

---

### 4. Swap in the real domain *(blocked — see above)*

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

### 5. Signal Engine, Phase 1 *(blocked — needs keys)*

Reddit collector → SQLite → relevance scoring → plaintext digest. No UI. Full spec in
[`signal-engine.md`](signal-engine.md). Success test: the owner reads the digest and
thinks *"I'd actually reply to three of these."* Four hours of work that answers whether
the whole tool is worth building.

### 6. Per-artist share cards

The OG template already parameterizes by department. Extending it to render a card per
artist would make every individual artist link shareable. Only worth doing if artists get
their own URLs, which they currently don't.

### 7. Issue 02

Out of scope until Issue 01 is public and has been seen by actual readers.

---

## ✅ DONE

- **PR #1** — deploy hardening: OG cards, social meta, `vercel.json`, `robots.txt`,
  `sitemap.xml`, 404 page, and a real caching bug fixed (`store.html` loaded `data.js`
  unversioned while `index.html` loaded `data.js?v=8`)
- Repo created, Vercel linked, production + preview deploys working
