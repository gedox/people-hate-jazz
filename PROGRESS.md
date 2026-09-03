# PROGRESS

*The 30-second status. Updated at the end of every work session. Newest at top.*

**Last updated:** 2026-09-03 (scheduled shift) · **Phase:** getting Issue 01 shipped

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **main** | PR #1 is merged — the deploy-hardening work (social cards, meta, 404, caching fix) is live on `main` |
| **Open PR #2** | **Shift system: standing orders, backlog, handover log** (`CLAUDE.md`, `docs/BACKLOG.md`) ← *needs your review* |
| **Open PR #3** | **CSS architecture: move shared chrome out of store.css** (this shift's work) ← *needs your review* |
| **Blocked on you** | Merge review for PR #2 and #3, plus the 3 decisions below |

---

## ⚠️ HEADS UP: this shift ran without CLAUDE.md / BACKLOG.md

The scheduled-shift instructions say to start by reading `CLAUDE.md` and `docs/BACKLOG.md`.
**Neither exists on `main`.** They were drafted in PR #2 (`feat/shift-system`, stacked on
the now-merged `ship/deploy-hardening`) by a previous session, but that PR is still open
and unreviewed — so this shift could not treat its contents as standing orders. **Merging
PR #2 first will fix this for the next scheduled shift.**

In its absence, this shift fell back to: reading `PROGRESS.md`'s "WHAT'S NEXT" table as
the de facto backlog, checking `git branch -a` / `gh pr list` for existing work before
starting, and following the hard rules given directly in the shift prompt (one PR, never
merge own PR, no tracking, no build step/framework/dependency, keep the store's prototype
banner).

---

## 🔴 WHAT I NEED FROM YOU

| # | Decision | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **Review & merge PR #2** (shift system) | Every future scheduled shift starts cold without it — this is the fix for the problem above | Repeated confusion / wasted first minutes each shift |
| 2 | **Review & merge PR #3** (CSS architecture) | Small, mechanical, pure-move refactor — see PR for verification notes | `.modeswitch`/`.btn` stay misplaced in `store.css` |
| 3 | **Buy a domain?** (`peoplehatejazz.com` or similar) | Every social card, canonical URL and sitemap currently hardcodes the ugly `.vercel.app` alias. Changing later means re-rendering all cards | ~€12/yr. Low, but it's a one-line fix now vs. a chore later |
| 4 | **Repo public or private?** | Currently private. Public is free marketing for a publication like this | None — reversible |
| 5 | **Analytics: yes or no?** | Both footers publicly promise *"No cookies, no tracking, no newsletter."* Will not break that promise without you saying so | You fly blind on what's working |

**Not asking yet, but coming:** the Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you. Nothing else is blocked on you.

---

## ✅ WHAT I DID THIS SESSION (scheduled shift, no browser available)

Confirmed PR #1 was already merged (this file was stale — still said "needs your review").
Checked `gh pr list` / `git branch -a` before starting: PR #2 already claims the
shift-system item, so skipped it (unmerged work, not mine to duplicate) and picked the
next unclaimed P1 item instead.

**Opened PR #3 — CSS architecture fix**, the item flagged here last session:
- Moved `.modeswitch` and `.btn` (plus the topbar's mobile-stacking `@media` block) out of
  `store.css` and into `main.css`, verbatim — no property or selector changes. Confirmed by
  grep that both classes render on **all three** pages (`index.html`, `store.html`,
  `404.html`), so they belong in the shared stylesheet, not the store's.
- Left store-only things in `store.css`: the `--topbar-h` custom property (only read by
  `.demobar`/`.bidbox`) and the store-context `.btn` usages (`.bidbox__acts .btn`,
  `.teaser .btn`, `.loadmore .btn`).
- Bumped every `?v=9` → `?v=10` across all three HTML files, keeping the one-shared-version
  convention from PR #1's caching fix intact.
- Verified without a browser: `git diff` shows the moved CSS is byte-identical to what was
  removed; brace-balance check on both CSS files; `node --check` on all JS (untouched);
  grepped that all asset references now share `?v=10`.
- **Not verified:** actual rendering. Said so plainly in the PR — recommend a quick look in
  a real browser at the ~760px breakpoint and the 404 page before treating this as fully
  confirmed.

---

## ▶ WHAT'S NEXT (in order)

| Priority | Item | Notes |
|---|---|---|
| **P0** | Merge PR #2 (shift system) | Unblocks every future scheduled shift from starting cold |
| **P0** | Merge PR #3 (CSS architecture) | Small and mechanical; see PR for verification notes |
| **P1** | **Mobile + accessibility pass** | Needs a real browser — not done in this or any prior scheduled shift |
| **P2** | **Performance: the 51,000px page** | 60 cards + 100 tracks in one document. Fine on desktop, worth measuring on a mid-range phone |
| **P2** | **Domain + re-render cards** | Trivial once decision #3 lands |
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
