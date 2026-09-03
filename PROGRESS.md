# PROGRESS

*The 30-second status. Rewritten with every PR.*

**Last updated:** 2026-09-04 · **Phase:** Issue 01 live; building shareable surface

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged** | #1 deploy hardening · #2 shift system · #3 CSS chrome · #4 standing orders · #5 backlog groom · #6 lane system |
| **Open PR** | **#7** Artist pages (A1.1) — 60 new URLs |
| **Shifts** | 4 lanes/day: A 08:11 · B 13:12 · C 17:44 (all local) · D 21:10 (cloud) |

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **"Run now" once on Lane B and Lane C** (`phj-lane-b-editorial`, `phj-local-browser-shift`) — Lane A is done | They use browser control; approvals are stored per task | Those two stall on a permission prompt with nobody there to click |
| 2 | **Repo public, or GitHub Pro?** | GitHub refuses branch protection on a free private repo. A local pre-push hook now covers the real risk, but server-side protection needs one of these | Low — the hook holds for local shifts |
| 3 | **Buy a domain?** | Now urgent: 60 new artist pages bake the `.vercel.app` alias into their canonical and social meta | ~€12/yr. One regenerate now; after launch it invalidates cached previews everywhere |
| 4 | **Analytics: yes or no?** | Both footers promise readers *"No cookies, no tracking, no newsletter."* I won't break that without you saying so | You ship blind |

**Coming, not blocking:** Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you.

---

## ✅ DONE

- **#8 (open)** — pre-push hook blocking direct pushes to `main`. Verified it blocks a real
  push. Saying "merge" in chat is unaffected — that's a GitHub API call, not a local push.

- **#7 (open)** — artist page generator + 60 static pages. Takes the publication from **1 shareable URL to 61**.
- **#6** — four-lane shift system; three shifts moved from cloud to local so they have a browser
- **#5** — groomed backlog; shifts now confirm an item isn't already done before starting
- **#4** — restored `CLAUDE.md`/`BACKLOG.md` to `main` after a stacked-PR mistake stranded them
- **#3** — `.modeswitch`/`.btn` into `main.css`; incidentally fixed a 44px tap-target rule that `store.css` had been silently overriding
- **#2** — shift system · **#1** — deploy hardening, social cards, and a real caching bug

---

## ▶ NEXT

Full queue in [`docs/BACKLOG.md`](docs/BACKLOG.md), by lane.

| Lane | Next up |
|---|---|
| **A** product | **A1.2** — per-artist social cards (60 PNGs), then A1.3 wire the survey to the pages |
| **B** editorial | **B1** — verify the masthead's own statistics *(spot-checked: the 29 mv / 16 live claims are correct)* |
| **C** design | **C1** — mobile + accessibility pass |
| **D** research | Handover audit + first Issue 02 research note |

---

## ⚠ LESSONS

- **No stacked PRs.** One PR at a time off `main` — a stacked one stranded two files on an already-merged branch.
- **Diff computed styles, not just the source diff,** on any CSS move. A byte-identical move between stylesheets can flip the cascade.
- **Never write a silent-fallthrough edit.** A conditional string replace that didn't match left stale "merge PR #2" items in this file for a day.

---

## 🗒 STANDING NOTES

- `.impeccable.md` is design law. `docs/LANES.md` says which files your lane may touch.
- Store's prototype banner stays; lots are fictional and that stays stated above the fold.
- No build step, no framework, no dependencies **at serve time**. One-time generators under `tools/` whose output is committed are fine — that's how the social cards and artist pages work.
- Bump `?v=N` on every asset reference in every HTML file together. They drifted once and it was a bug.
