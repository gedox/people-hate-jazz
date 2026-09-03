# PROGRESS

*The 30-second status. Updated at the end of every shift.*

**Last updated:** 2026-09-03 · **Phase:** getting Issue 01 shipped

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Open PRs** | **#1** Deploy hardening ← *review this first* <br> **#2** Shift system *(stacked on #1)* |
| **Blocked on you** | 4 decisions, below |

---

## 🔴 WHAT I NEED FROM YOU

| # | Decision | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **Review & merge PR #1, then #2** | Nothing is public until #1 lands. #2 stacks on it | Site stays unshipped |
| 2 | **Buy a domain?** | Every social card, canonical URL and sitemap hardcodes the ugly `.vercel.app` alias | ~€12/yr. One commit now; after launch it invalidates cached social previews everywhere |
| 3 | **Repo public or private?** | Currently private. Public is free marketing for a publication | None — reversible |
| 4 | **Analytics: yes or no?** | Both footers publicly promise *"No cookies, no tracking, no newsletter."* I won't break that without you saying so | You ship blind |

**Coming, not blocking yet:** the Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you.

---

## ✅ DONE SO FAR

**Shipped into PR #1 — deploy hardening**
- Audited the existing site: zero console errors, 698 ms load, video facades correct, images lazy + alt'd, clean heading order. **Base quality was already high.**
- Made it a repo; wired Vercel (production on `main`, preview URL per PR).
- Generated 1200×630 **social cards** in house style, flame for magazine / ultramarine for store, rendered from a committed template so they're regenerable.
- Full `og:` / `twitter:` / `canonical` meta. Links previewed as blank cards before this.
- **Fixed a real caching bug:** `store.html` loaded `data.js` unversioned while `index.html` loaded `data.js?v=8` — a CDN would serve two different cached copies of the same file to the two pages.
- `vercel.json` (security headers, asset caching), `robots.txt`, `sitemap.xml`, 404 page.

**Shipped into PR #2 — shift system**
- `CLAUDE.md` — standing orders so a cold session can work a shift without you re-explaining anything.
- `docs/BACKLOG.md` — prioritized, self-contained work queue.
- This file, as the handover log.

---

## ▶ NEXT UP

Full detail in [`docs/BACKLOG.md`](docs/BACKLOG.md). Top of queue:

| Priority | Item |
|---|---|
| **P1** | Extract shared chrome (`.topbar`, `.modeswitch`, `.btn`) out of `store.css` — pure refactor, caught when the 404 page rendered unstyled |
| **P1** | Mobile + accessibility pass at 375 / 768 / 1440 (`/audit`, `/critique`, `/polish`) |
| **P2** | Measure the 51,000px page on a real phone before optimizing anything |
| **P2** | Domain swap + re-render cards *(blocked)* |
| **P3** | Signal Engine Phase 1 *(blocked on keys)* |

---

## 🔁 HOW THE SHIFTS WORK

Three shifts a day. Each one starts **cold** — no memory of any previous session. The
handover is this file plus `CLAUDE.md` plus `docs/BACKLOG.md`, which is exactly why they
have to stay accurate.

Each shift: read the three files → check open PRs → take the top unblocked item → build →
verify in a real browser → open a PR → update this file → stop.

**One PR per shift.** Small enough to review in a few minutes.

---

## 📌 WHERE THIS IS GOING

Issue 01 public and shareable → audience built on the writing and the look → *then*
artists, roster, and the Signal Engine. Per the strategy: **build the audience before
taking a single client.**

---

## 🗒 STANDING NOTES

- `.impeccable.md` is design law. Read before touching anything visual.
- The store's prototype banner stays. Lots are fictional; that stays stated above the fold.
- No build step, no framework, no dependencies. It's why this deploys anywhere.
- Bidding state is `localStorage` only (`phj-store-v1`). Nothing is sent anywhere.
- Bump `?v=N` on every asset reference in every HTML file *together*. They drifted once and it was a bug.
