# PROGRESS

*The 30-second status. Updated at the end of every work session. Newest at top.*

**Last updated:** 2026-09-03 · **Phase:** getting Issue 01 shipped

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Open PR** | **#1 — Deploy hardening & social cards** ← *needs your review* |
| **Blocked on you** | 3 decisions, listed below |

---

## 🔴 WHAT I NEED FROM YOU

| # | Decision | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **Review & merge PR #1** | Nothing is public until this lands | Site stays unshipped |
| 2 | **Buy a domain?** (`peoplehatejazz.com` or similar) | Every social card, canonical URL and sitemap currently hardcodes the ugly `.vercel.app` alias. Changing later means re-rendering all cards | ~€12/yr. Low, but it's a one-line fix now vs. a chore later |
| 3 | **Repo public or private?** | Currently private. Public is free marketing for a publication like this | None — reversible |
| 4 | **Analytics: yes or no?** | Both footers publicly promise *"No cookies, no tracking, no newsletter."* I will not break that promise without you saying so | You fly blind on what's working |

**Not asking yet, but coming:** the Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you. Nothing else is blocked on you.

---

## ✅ WHAT I DID THIS SESSION

- **Found the existing site** — magazine (60 artists) + store (140 lots). Audited it: zero console errors, 698 ms load, video facades correct, all images lazy + alt'd, clean heading order. **Base quality is high.**
- **Made it a repository.** Git init, `.gitignore`, `.gitattributes`, README documenting the load-bearing rules.
- **Wired Vercel** to the repo — production on `main`, preview URL on every PR.
- **Opened PR #1**, containing:
  - **Social cards** — generated 1200×630 OG images in house style (flame for magazine, ultramarine for store), rendered from a committed HTML template via headless Chrome so they're regenerable
  - **Full OG / Twitter / canonical meta** on both pages — links previewed as blank cards before this
  - **Fixed a real caching bug** — `store.html` loaded `data.js` unversioned while `index.html` loaded `data.js?v=8`; a CDN would have served two different cached copies of the same file to the two pages. All assets now on one version
  - `vercel.json` — security headers, immutable caching on `/assets`, revalidate on HTML
  - `robots.txt`, `sitemap.xml`, and a **404 page** in house style

---

## ▶ WHAT'S NEXT (in order)

| Priority | Item | Notes |
|---|---|---|
| **P0** | Merge PR #1 | Then the site is genuinely live |
| **P1** | **CSS architecture fix** | `.topbar`, `.modeswitch` and `.btn` are shared chrome but live in `store.css`. Caught this when the 404 page rendered unstyled. Extract to `main.css` or a `chrome.css` |
| **P1** | **Mobile + accessibility pass** | Run `/audit`, `/critique`, `/polish` per the global workflow. Not yet done on either page |
| **P2** | **Performance: the 51,000px page** | 60 cards + 100 tracks in one document. Fine on desktop, worth measuring on a mid-range phone |
| **P2** | **Domain + re-render cards** | Trivial once decision #2 lands |
| **P3** | **Signal Engine, Phase 1** | Spec is in `docs/signal-engine.md`. Blocked on your API keys + `voice.md` |

---

## 📌 WHAT WE HAD (before this session)

A polished but **unshipped** static site sitting in a local folder — no git, no host, no social presence, no way for anyone to see it. Two departments (magazine + store), a genuinely sophisticated design system in `.impeccable.md`, and a written spec for a community-monitoring tool that doesn't exist yet.

## 🎯 WHERE THIS IS GOING

Issue 01 public and shareable → audience built on the strength of the writing and the look → *then* artists, roster, and the Signal Engine. Per the strategy: **build the audience before taking a single client.**

---

## 🗒 STANDING NOTES

- `.impeccable.md` is design law. Read it before touching anything visual.
- The store's prototype banner stays. Lots are fictional; that must remain stated above the fold.
- No build step, no framework, no dependencies. Keep it that way — it's why this deploys anywhere.
- Bidding state is `localStorage` only (`phj-store-v1`). Nothing is sent anywhere.
