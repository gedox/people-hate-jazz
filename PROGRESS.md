# PROGRESS

*The 30-second status. Rewritten with every PR.*

**Last updated:** 2026-09-04 (Lane B) · **Phase:** Issue 01 live; building shareable surface

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged** | #1 deploy hardening · #2 shift system · #3 CSS chrome · #4 standing orders · #5 backlog groom · #6 lane system · #7 artist pages · **#10 per-artist social cards** |
| **Open PR** | **#11** Masthead statistics verified; track durations committed (B1) |
| **Closed** | #9 — duplicate of #10, same commit, closed to save a second review |
| **Shifts** | 4 lanes/day: A 08:11 · B 13:12 · C 17:44 (all local) · D 21:10 (cloud) |

**Epic A1 is now half done.** #7 gave every artist a URL; #10 gives every artist a card.
Remaining: A1.3 (link the survey to the pages) and A1.4 (sitemap).

**The front page's numbers are now true and provably so.** Every statistic on it was checked
against the data this shift. All correct — see below.

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why it matters | Cost of waiting |
|---|---|---|---|
| 1 | **Don't run all four shifts at once again — until they get separate worktrees** | They share one git working directory. Today three ran concurrently and fought: one `git checkout` pulled the tree out from under another mid-run, a `git clean -fd` deleted a third's unstaged output, and three commits briefly landed on local `main` having bypassed review entirely | Silent work loss. Nothing was lost today, but only because it was caught |
| 2 | **Analytics: yes or no?** *(now urgent — see below)* | A shift started wiring in Vercel Analytics **and** rewriting the footer promise from *"no tracking"* to *"no ads"* to make room for it. It abandoned the change before committing, so nothing shipped. But the standing order says never add tracking without you, and a shift tried anyway | An undecided rule gets re-litigated by every shift that reads it |
| 3 | **Buy a domain?** | The 60 new cards and their `canonical`/`og:` meta all bake in the `.vercel.app` alias | ~€12/yr. One re-render now; after launch it invalidates cached previews everywhere |
| 4 | **Repo public or private?** | Public is free marketing for a publication | None — reversible |

**Coming, not blocking:** Signal Engine needs a Reddit API key, an Anthropic API key, and `voice.md` written by you.

**Two calls I made in #11 that you can overrule — neither blocks the merge:**

1. **I did not bump `?v=10`.** The new duration field renders nothing (verified: byte-identical
   DOM), and bumping means editing 63 HTML files, 60 of which are Lane A's. Filed as **A7** so
   the next reader-visible change picks it up. Say the word if you'd rather bump now.
2. **The playlist repeats a track.** Otis McDonald's *Stronger* is rows 3 and 57 — two Spotify
   URIs, same recording, same 183,829 ms. 100 rows, 99 distinct recordings. Nothing is wrong
   and the data faithfully reproduces the playlist, but a reader who counts will find the seam.
   Leave it silent, or add a colophon line? Filed as **B6**; I changed nothing.

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

- **#11 (open)** — **the masthead audits clean.** Every number on the front page recomputed
  from the data. **All ten claims correct; nothing needed correcting.**

  | Claim (as printed) | Computed | |
  |---|---|---|
  | Artists **60** | 60 | ✅ |
  | Music videos **29** | 29 | ✅ |
  | Live films **16** | 16 | ✅ |
  | Median track **3:09** | 3:09 (188,834 ms) | ✅ |
  | "Forty-four of the hundred are under three minutes" | 44 | ✅ |
  | "five are under ninety seconds" | 5 | ✅ |
  | "*Ruby Smiles* … is sixty-nine seconds long" | 69,000 ms — **exactly** 69 s | ✅ |
  | "Twenty-nine of them have a proper music video" | 29 | ✅ |
  | Playlist — 100 tracks | 100 | ✅ |
  | Artist `count` values sum to the playlist | 100 | ✅ |

  **The catch:** three of those (median, under-three-minutes, under-ninety-seconds) were
  **not checkable from this repo** — `tracklist.js` had no duration field, so the numbers
  had to be taken on faith. All 100 durations are now committed as `d` (ms, from Spotify's
  public embed payload). The front page is auditable offline from here on.

  Two boundary cases worth knowing, both genuinely true but close: *Elyjah Slaps the Space*
  clears "under ninety seconds" by **257 ms**, and the median is the mean of a 3:08 and a
  3:09 track, so it rounds to 3:09 and floors to 3:08. If the wording ever changes, recheck.
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
| **A** product | **A5 — one worktree per shift** (do this first, it is now blocking safe parallel work), then **A1.3** wire the survey to the 60 pages. New: **A7** — bump `?v=` to 11 on the next reader-visible asset change |
| **B** editorial | **B2** link-rot sweep on the 60 videos, or **B4** the Issue 02 longlist *(still empty — `docs/issue-02/` does not exist yet)*. B1 is done |
| **C** design | **C1** — mobile + accessibility pass. **C5** is now unblocked: #7 shipped the template, #10 shipped its card |
| **D** research | Handover audit + first Issue 02 research note |

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
- **A page can pass your check against a file you didn't change.** Verifying #11 in the
  browser showed the *old* `tracklist.js`: the server was serving the new bytes, but `?v=10`
  was unchanged so the browser reused its cached copy. Fetch the asset with a cache-buster
  and compare, or you are testing yesterday's file and calling it verified.
- **Reading back `innerHTML` is not a faithful comparison.** It re-serialises: an escaped
  `&#39;` comes back as a literal `'`, so an identical render looks like a diff. Compare
  DOM to DOM by parsing both sides through an element first.
- **Headless Chrome will not make a window narrower than ~485px.** A `--window-size=375`
  screenshot is a 485px layout clipped into a 375px image, which reads as a horizontal
  overflow bug that isn't there. Measure inside a sized iframe instead.

---

## 🗒 STANDING NOTES

- `.impeccable.md` is design law. `docs/LANES.md` says which files your lane may touch.
- Store's prototype banner stays; lots are fictional and that stays stated above the fold.
- No build step, no framework, no dependencies **at serve time**. One-time generators under
  `tools/` whose output is committed are fine — that's how the social cards and artist pages work.
- Bump `?v=N` on every asset reference in every HTML file together. They drifted once and it was a bug.
- Regenerating cards: magazine/store in `docs/LANES.md`; all 60 artist cards with
  `node tools/og/build-artists.mjs` (~36s), then `node tools/artists/build.mjs`.
- **Re-checking the masthead numbers** needs no network now: `tracklist.js` carries `d`
  (ms per track), so median / under-3:00 / under-1:30 are all derivable from the repo.
  If you change the prose or the playlist, recompute — two of those claims sit within a
  second of their boundary.
