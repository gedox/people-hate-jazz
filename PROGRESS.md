# PROGRESS

*The 30-second status. **Single-writer: only Lane D edits this file.** Every other shift
writes `docs/log/YYYY-MM-DD-lane-<x>.md` instead — see `docs/LANES.md`.*

**Last updated:** 2026-09-05 (evening fold) · **Phase:** M1 — a real listing, a real bid
(see `docs/MISSION.md`)

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **public** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged today** | #16 analytics · #17 handover fix · #18 mobile/a11y · #19 standing-orders alignment · #20 mission goal-driven (started M1) · #21 M1 persistence/identity/bidding API · #23 seller-listing page (`sell.html`) |
| **Open PRs** | **#22** — Lane B's seller-pitch/target-list/lot-copy drafts (`docs/outreach/**`). Pure review, nothing sent or posted, blocks nothing else |
| **Shifts today** | A · C (twice) · D. No Lane B code shift logged (B's only activity today is #22, still open) |

---

## 🎯 IS M1 ACTUALLY CLOSER TO DONE? — honest read, not a status roll-up

**Judged against the mission's own bar: "a person who is not the owner can, in a browser,
create a listing that persists on a server, and a different person can bid on it, and at
close the system picks a winner and tells both of them."**

**Real progress, not busywork:** #21 built the entire server side properly — a swappable
storage adapter (tested against 28 passing cases), identity via email + one-time code (no
passwords), signed sessions, and four endpoint groups, with the auction rules server-
authoritative rather than trusted from the client, exactly as `MISSION.md` demands. #23 built
a real seller-facing form, not a mock. That is substantive engineering, not polish.

**But nobody outside this repo could complete the mission's own test today, for three
concrete reasons, not vague ones:**
1. `assets/js/store.js` — the actual bidding UI a stranger would use — **still reads and
   writes only to `localStorage`.** It never calls the API #21 built. A stranger placing a
   "bid" today still isn't touching the server, no matter how solid that server is.
2. `sell.html` has **no link pointing at it from anywhere on the site.** A real artist
   cannot find the listing form by browsing.
3. The one-time code identity **has nowhere real to go** — `api/_lib/mailer.mjs` logs the
   code to a server console. Gate #2 (email sender) isn't closed, so nobody but someone with
   server-log access could ever complete the identity flow.

**Verdict: closer to done in engineering terms, not yet closer in the sense the mission
actually measures.** The scaffolding is real and mostly good; the last mile connecting it to
an actual stranger's browser is the part that's missing, and it's a small, well-defined
amount of work (filed as **M1.1–M1.3** in `docs/BACKLOG.md`, in priority order). Whoever picks
up Lane A next should treat wiring `store.js` to the API as the single highest-priority item
in this repo — ahead of any new server-side feature — since more server capability doesn't
move the mission until the client actually uses it.

**One accuracy note on #21's own log, for the record, not a rebuke:** it reported "28 new
tests... alongside the existing 13... 41 total." Re-run just now: `node --test
tools/test/*.test.mjs` → **28 tests total** (13 in `auction.test.mjs`, 15 new across
`identity`/`session`/`storage`), all passing. The work is real and green; the arithmetic in
the log was off by 13. Flagging so nobody cites "41 tests" from memory later.

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why |
|---|---|---|
| 1 | **Gate #1 — a project email address.** Any inbox, no domain required to start | Unblocks Identity actually delivering a one-time code, and settlement notifications (M1.6) |
| 2 | **Gate #2 — a transactional email sender.** Recommend **Resend** (free tier, 3,000/mo, simplest integration) — full comparison and the exact 5-minute steps in [`docs/research/2026-09-05-gates-and-handover-trust.md`](docs/research/2026-09-05-gates-and-handover-trust.md) | Same as above. `mailer.mjs` is built and waiting on just the API key |
| 3 | **Set `GITHUB_TOKEN`, `GITHUB_REPO`, `ADMIN_TOKEN` in Vercel's env vars** | `api/_lib/github-store.mjs` (#21) has never made a real API call — this is what lets the next shift verify it for real before a real seller's submission depends on it |
| 4 | **Review PR #22** when convenient | Low urgency — drafts only, nothing sent |

**Deferred by you:** domain (staying on the `.vercel.app` alias). **Resolved since last
update:** repo visibility (public), page analytics (shipped in #16, footer's tracking promise
updated to match).

---

## ✅ RECENT (since the last fold)

- **#21** M1 persistence — storage adapter (swappable, GitHub-JSON backend), identity
  (email + one-time code, no passwords), signed sessions, and the full `/api/lots` +
  `/api/lots/[id]/{bids,approve,settle}` + `/api/auth/*` surface, all server-authoritative
  against the existing `auction.mjs` rules. 28 tests, all passing. **Not yet wired to the
  client — see the honest read above.**
- **#23** `sell.html` — a real three-step seller listing form (verify email → describe lot →
  submitted-to-review), genuinely calling #21's endpoints. **Not yet linked from the site,
  and its round trip has never been run against a live server — see above.**
- **#18** Mobile + accessibility pass, **browser-verified this time** (the previous shift
  had no browser and did a static audit instead; this one found a way around that with
  headless Chrome and no server — see A10 in the backlog). All 12 audited findings held up;
  8 fixed in this PR (toolbar offset, sticky-toolbar viewport eating, search focus ring,
  two contrast failures, top-nav focus clipping, tap targets, a stale token). 4 remain,
  filed to Lane A (A11, A12) and as new items C9–C11.
- **#16** Page analytics (Vercel Insights, all 63 pages) — the owner-approved scope only;
  the "no cookies, no tracking" footer promise was reworded to match, not removed wholesale.
- **#20** Restructured the standing orders around a single active mission (`docs/MISSION.md`)
  instead of a static backlog, and named **M1** as that mission.

---

## ▶ NEXT

Full detail in [`docs/BACKLOG.md`](docs/BACKLOG.md). **M1 supersedes every other epic in
this lane** — see `docs/MISSION.md`.

| Lane | Next |
|---|---|
| **A** product | **M1.1 — wire `store.js` to the live API.** This is the actual bottleneck; everything else in M1 is secondary until it's done. Then M1.2–M1.6 in order |
| **B** editorial | PR #22 is with the owner. Once M1.1 ships and a lot can really go live, B4's Issue 02 pipeline and revisiting `store.html`'s prototype-banner copy (per #22's log) both become live again |
| **C** design | M1.7 needs Lane A to extract the bid/outbid/won/lost views out of `store.js` before design work can start on them. Until then: C6, C9 (needs an owner call), C10, C11 |
| **D** research | This fold, plus a new note on the gates and no-escrow handover trust (see above) |

---

## 🗒 LESSONS

- **Judge the mission by its own "done when," not by how much code shipped.** A fully
  server-authoritative bidding API that the client never calls hasn't moved the needle yet —
  it's necessary, not sufficient. Say so plainly rather than counting PRs merged.
- **Check a shift's own arithmetic, not just its conclusion.** "41 tests" vs. the 28 that
  actually run is a small thing, but it's exactly the kind of drift Lane D exists to catch
  before it gets repeated as fact.
- **Shared files are single-writer.** Coordination files that everyone edits block the queue.
- **No stacked PRs.** One at a time off `main`.
- **Diff computed styles, not the source diff,** on any CSS move.
- **One working tree per shift** (A5) — three shifts sharing one checkout deleted each
  other's work; a later Lane C shift worked around a live collision the same way (its own
  worktree) without needing to touch the other shift's branch.
