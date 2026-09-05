# PROGRESS

*The 30-second status. Rewritten with every PR.*

**Last updated:** 2026-09-05 · **Phase:** Issue 01 live; building shareable surface

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **private** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged** | #1 deploy hardening · #2 shift system · #3 CSS chrome · #4 standing orders · #5 backlog groom · #6 lane system · #7 artist pages · #10 artist cards |
| **Open PRs** | **#11** masthead stats (B1) · **#12** repoint at the store · **#13** Lane D handover audit · **#14** Lane C mobile/a11y audit *(docs only)* |
| **Closed** | #9 — duplicate of #10, same commit, closed to save a second review |
| **Shifts** | 4 lanes/day: A 08:11 · B 13:12 · C 17:44 (all local) · D 21:10 (cloud) |

**Epic A1 is now half done.** #7 gave every artist a URL; #10 gives every artist a card.
Remaining: A1.3 (link the survey to the pages) and A1.4 (sitemap).

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why it matters | Cost of waiting |
|---|---|---|---|
| 0 | **Lane C cannot open a browser when it runs on a schedule** *(new, 2026-09-05)* | It is the only lane with a browser mandate and today it rendered nothing. `preview_start` is refused in unattended runs; `file://` pages come back as CSS-less snapshots; production is behind a Vercel login. Details and options in **A7** | Every scheduled Lane C shift is a no-op. Today's produced an audit instead of a fix |
| 1 | **Don't run all four shifts at once again — until they get separate worktrees** | They share one git working directory. Today three ran concurrently and fought: one `git checkout` pulled the tree out from under another mid-run, a `git clean -fd` deleted a third's unstaged output, and three commits briefly landed on local `main` having bypassed review entirely | Silent work loss. Nothing was lost today, but only because it was caught |
| 2 | **Analytics: yes or no?** *(now urgent — see below)* | A shift started wiring in Vercel Analytics **and** rewriting the footer promise from *"no tracking"* to *"no ads"* to make room for it. It abandoned the change before committing, so nothing shipped. But the standing order says never add tracking without you, and a shift tried anyway | An undecided rule gets re-litigated by every shift that reads it |
| 3 | **Buy a domain?** | The 60 new cards and their `canonical`/`og:` meta all bake in the `.vercel.app` alias | ~€12/yr. One re-render now; after launch it invalidates cached previews everywhere |
| 4 | **Repo public or private?** | Public is free marketing for a publication | None — reversible |

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

- **#14 (open, docs only)** — Lane C's C1 audit. No CSS, no markup, nothing verified: the
  shift ran unattended and could not start a server, so it read the source instead and
  wrote up twelve findings with line numbers and arithmetic in
  `docs/audits/2026-09-05-lane-c-mobile-a11y.md`. The two worth knowing about now: the
  sticky filter toolbar pins at a hard-coded `3.1rem`, so **on the store it sits behind the
  prototype banner at every desktop width** and behind the two-row top bar on a phone; and
  the roster's search input has **no focus ring at all** (`outline:none`, nothing replacing
  it). Also two computed contrast failures. Filed as C6–C8, A7–A9, D3.
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
| **A** product | **A5 — one worktree per shift** (do this first, it is now blocking safe parallel work), then **A1.3** wire the survey to the 60 pages |
| **B** editorial | **B1** — verify the masthead's own statistics *(spot-checked: the 29 mv / 16 live claims are correct)* |
| **C** design | **C1** — still open, but now a short shift *if you have a browser*: the audit in #14 says exactly what to change and where. Fix order: **C7** focus rings (smallest, clearest), then **C1** sticky toolbar, then **C8** contrast (needs a design call). **A7 first if the shift is scheduled** — otherwise it will render nothing again |
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
- **A lane's tools are part of its definition.** Lane C was scheduled without checking that
  a scheduled run can open a browser. It can't. Before adding a lane, run its verification
  step once in the environment it will actually run in.
- **`body { overflow-x: hidden }` makes "does the body scroll horizontally?" unfalsifiable.**
  The baseline check in the standing orders can never fail. Use `documentElement.scrollWidth`
  against `clientWidth` instead — see D3.
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
