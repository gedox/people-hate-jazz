# PROGRESS

*The 30-second status. Rewritten with every PR.*

**Last updated:** 2026-09-04 (Lane D — handover audit) · **Phase:** Issue 01 live; a strategy
change is up for review, see below before you pick your next item

---

## 🚨 READ THIS BEFORE PICKING AN ITEM — two PRs in flight would change what "next" means

**PR #12 — "Repoint the project at the store" (open, unreviewed, authored directly, not a
shift).** Proposes a real pivot: the auction becomes the flagship (not per-artist pages),
editorial becomes explicitly "supply acquisition," and priority order changes from
`shareable surface → content volume → tooling → polish` to
`prove demand → recruit supply → hand-run one auction → build the platform`. It rewrites
`CLAUDE.md` and the top of `docs/BACKLOG.md`, and adds a **new EPIC A5 ("Prove the demand")**.

**That collides with the existing `A5` in this backlog ("one git worktree per shift").** Two
different epics both numbered A5 — one shipped by Lane A today, one proposed in #12. Whoever
merges #12 needs to renumber one of them; this audit did not renumber it for you because doing
so on the live backlog would just create a second, uncoordinated edit to fight #12's diff.
**Until #12 is decided, do not start A1.3 or A1.4 assuming per-artist pages are still the
flagship** — they might not be. Cheap maintenance and Lane D/research work are unaffected.

**PR #11 — masthead statistics verified (B1), open, unreviewed.** All ten front-page claims
checked out; nothing was wrong. It also commits per-track durations (`d`, ms) to
`tracklist.js` so the numbers are auditable offline going forward, and files two follow-ups
(**A7** — bump `?v=` to 11 on the next reader-visible change, **B6** — an editorial call on a
duplicate track in the playlist). **Do not re-run B1** — it's done, just not merged yet.

Neither PR has a human review comment yet (only Vercel's deploy bot). This handover previously
listed #10 as an open PR — it merged Sept 3, 23:14 UTC (see `Merged` below); the "Open PR" line
had gone stale.

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged** | #1 deploy hardening · #2 shift system · #3 CSS chrome · #4 standing orders · #5 backlog groom · #6 lane system · #7 artist pages · #10 per-artist social cards |
| **Open PRs** | **#12** strategy pivot (store-first) — see banner above · **#11** masthead stats verified (B1) — see banner above |
| **Closed, not merged** | #9 — duplicate of #10, same commit, closed to save a second review · #8 — pre-push hook guarding `main`; see note below |
| **Shifts** | 4 lanes/day: A 08:11 · B 13:12 · C 17:44 (all local) · D 21:10 (cloud) |

**Epic A1 (per-artist pages) is half done — #7 gave every artist a URL, #10 gave every artist a
card — and whether it keeps being "the flagship" is exactly what #12 is asking the owner to
decide.** Don't assume either answer.

**#8 (closed, unmerged) tried real GitHub branch protection first and hit a 403:** GitHub
refuses classic protection and rulesets alike unless the repo is **public or on a paid plan**.
It shipped a local `pre-push` hook instead (only covers this machine, not the cloud shift, and
`--no-verify` bypasses it). Worth knowing when you decide repo visibility below — going public
would also unlock real server-side branch protection, not just "free marketing."

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **Don't run all four shifts at once again — until they get separate worktrees** | They share one git working directory. Today three ran concurrently and fought: one `git checkout` pulled the tree out from under another mid-run, a `git clean -fd` deleted a third's unstaged output, and three commits briefly landed on local `main` having bypassed review entirely | Silent work loss. Nothing was lost today, but only because it was caught |
| 2 | **Analytics: yes or no?** *(now urgent — see below)* | A shift started wiring in Vercel Analytics **and** rewriting the footer promise from *"no tracking"* to *"no ads"* to make room for it. It abandoned the change before committing, so nothing shipped. But the standing order says never add tracking without you, and a shift tried anyway | An undecided rule gets re-litigated by every shift that reads it |
| 3 | **Buy a domain?** | The 60 new cards and their `canonical`/`og:` meta all bake in the `.vercel.app` alias | ~€12/yr. One re-render now; after launch it invalidates cached previews everywhere |
| 4 | **Repo public or private?** | Public is free marketing for a publication — **and per #8, it's also the only free way to get real GitHub branch protection on `main`**, instead of a local hook that only covers one machine | None — reversible |

**Coming, not blocking:** Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you.

---

## ⚠ WHAT HAPPENED TODAY — read this before running shifts again

Three local shifts ran **simultaneously in one working tree**. The lane system partitions
*files*; it does not partition the *checkout*. Two agents, one tree, is a design flaw:

- A `git checkout main` from one shift moved the branch under another shift mid-run. Its
  next three commits landed on local `main` instead of its own branch — **unreviewed work
  on `main`**, which is exactly what the standing orders exist to prevent.
- A `git clean -fd` from one shift deleted another's unstaged output: a generator and 60
  rendered PNGs. They were re-made in about a minute, but they were gone.
- The same work was delivered twice, as #9 and #10, pointing at the identical commit.

`main` has been reset to `origin/main` and all the work is on `feat/artist-og-cards`.
Nothing was lost. **The fix is one git worktree per shift** — filed under Lane A.

---

## ✅ DONE

- **#10** — per-artist social cards. 60 PNGs at 1200×630, wired into every page's
  `og:`/`twitter:` meta, plus the `og:image:alt` the artist pages never had. Sixty URLs
  that used to preview as the same picture now preview as themselves.
- **#7** — artist page generator + 60 static pages. 1 shareable URL → 61.
- **#6** — four-lane shift system; three shifts moved local so they have a browser
- **#5** — groomed backlog; shifts now confirm an item isn't already done before starting
- **#4** — restored `CLAUDE.md`/`BACKLOG.md` after a stacked-PR mistake stranded them
- **#3** — `.modeswitch`/`.btn` into `main.css`; fixed a 44px tap-target rule `store.css` had been overriding
- **#2** — shift system · **#1** — deploy hardening, social cards, and a real caching bug

---

## ▶ NEXT

Full queue in [`docs/BACKLOG.md`](docs/BACKLOG.md), by lane.

| Lane | Next up |
|---|---|
| **A** product | **Blocked on #12's outcome for anything A1/A5-shaped** — don't start A1.3/A1.4 or the worktree A5 assuming either survives the pivot. **A6** (shrink the OG cards) and **A4** (domain, itself blocked) are safe regardless |
| **B** editorial | B1 is done (open PR #11, awaiting review — don't redo it). Safe next: **B2** link-rot sweep, or **B4** the Issue 02 longlist — Lane D just left 7 sourced candidates in `docs/research/2026-09-04-issue-02-artists.md` |
| **C** design | **C1** — mobile + accessibility pass. Unaffected by #12. **C5** (design the artist page) is only worth doing once #12 confirms artist pages stay in scope |
| **D** research | This shift: handover audit (above), first Issue 02 research note (artists), this table |

---

## ⚠ LESSONS

- **One working tree cannot hold two shifts.** Branch switches and `git clean` from one
  agent silently destroy another's work. Worktrees, or run them one at a time.
- **Commit early when you can be clobbered.** Today's rescue worked because the source was
  committed before the slow render step, so only regenerable output was at risk.
- **No stacked PRs.** One PR at a time off `main`.
- **Diff computed styles, not just the source diff,** on any CSS move.
- **Never write a silent-fallthrough edit.** A conditional string replace that didn't match
  left stale items in this file for a day.
- **Headless Chrome will not make a window narrower than ~485px.** A `--window-size=375`
  screenshot is a 485px layout clipped into a 375px image, which reads as a horizontal
  overflow bug that isn't there. Measure inside a sized iframe instead.
- **A doc PR can go stale exactly like a code PR.** #10 sat marked "open" in this file for a
  full cycle after it actually merged, because nothing forced a re-check against `gh pr list`.
  This file is only as true as its last audit — that's the whole reason Lane D exists.
- **Two open PRs can each invent the same epic number.** #12 adds an `EPIC A5` that collides
  with the `A5` Lane A already shipped today. Structural backlog edits happening in an
  unmerged PR aren't visible to a shift reading the live file — check open PR diffs, not just
  the file on disk, before assuming the backlog's numbering is uncontested.

---

## 🗒 STANDING NOTES

- `.impeccable.md` is design law. `docs/LANES.md` says which files your lane may touch.
- Store's prototype banner stays; lots are fictional and that stays stated above the fold.
- No build step, no framework, no dependencies **at serve time**. One-time generators under
  `tools/` whose output is committed are fine — that's how the social cards and artist pages work.
- Bump `?v=N` on every asset reference in every HTML file together. They drifted once and it was a bug.
- Regenerating cards: magazine/store in `docs/LANES.md`; all 60 artist cards with
  `node tools/og/build-artists.mjs` (~36s), then `node tools/artists/build.mjs`.
