# PROGRESS

*The 30-second status. **Single-writer: only Lane D edits this file.** Every other shift
writes `docs/log/YYYY-MM-DD-lane-<x>.md` instead — see `docs/LANES.md`.*

**Last updated:** 2026-09-05 · **Phase:** repointed at the store; proving demand

---

## ⬤ RIGHT NOW

| | |
|---|---|
| **Repo** | [gedox/people-hate-jazz](https://github.com/gedox/people-hate-jazz) — **public** |
| **Production** | https://people-hate-jazz-gedox3-4185s-projects.vercel.app |
| **Merged** | #1–#11, **#15**. Issue 01 live; 60 artist pages, each with its own social card |
| **Open PRs** | **none.** #12, #13 and #14 were closed — folded into #15, which merged 09-05 02:34 UTC |
| **Shifts** | A 08:11 · B 13:12 · C 17:44 (local) · D 21:10 (cloud) |

---

## 🔴 WHAT I NEED FROM YOU

| # | Item | Why |
|---|---|---|
| 1 | **"Run now" on Lane B and Lane C** in the Scheduled sidebar | Lane C ran on 09-05 and **could not start a server** — it did an honest static audit instead. The browser lane has no browser until you pre-approve it |
| 2 | **Analytics** — approved, not yet built | It is now the critical path: E1.1 cannot measure demand without it |
| 3 | **E1.2 storage decision** | First thing storing data off-device. Smallest option — a hosted form endpoint, not a backend |

**Deferred by you:** domain (staying on the `.vercel.app` alias for now).

---

## ⚠ THE OUTAGE, AND WHAT CHANGED

**2026-09-05.** Three PRs (#12, #13, #14) all conflicted. Cause: `PROGRESS.md` and
`docs/BACKLOG.md` were writable by every lane, so four shifts a day rewriting two shared
files meant **every open PR conflicted with every other one.** No merge order worked. The
owner was out for an afternoon — the exact case the system exists to support.

**Fix:** those two files are now **single-writer, Lane D only.** Every other shift writes a
dated log file that cannot conflict. Lane D folds the logs in each evening.

Also found: an `A7` id collision between two branches, same root cause.

---

## ✅ RECENT

- **#11** Lane B — verified all ten masthead statistics (**every one correct**) and committed
  track durations so they are auditable offline. Found *Elyjah Slaps the Space* clears "under
  ninety seconds" by 257 ms.
- **#10** Lane A — 60 per-artist social cards, all 1200×630
- **#7** artist pages — 1 shareable URL became 61
- **#6** lane system · **#3** CSS chrome, which incidentally fixed a 44px tap-target rule

---

## ▶ NEXT

By lane, full detail in [`docs/BACKLOG.md`](docs/BACKLOG.md).

| Lane | Next |
|---|---|
| **A** product | **E1 — prove the demand** (flagship), then A10: give shifts a way to run a server |
| **B** editorial | B2 link-rot sweep, then B4 Issue 02 longlist — 7 candidates already researched |
| **C** design | C1 mobile + a11y, **needs a browser**; 12 issues already filed statically |
| **D** research | Fold the logs in; next research note |

---

## 🗒 LESSONS

- **Shared files are single-writer.** Coordination files that everyone edits block the queue.
- **No stacked PRs.** One at a time off `main`.
- **Diff computed styles, not the source diff,** on any CSS move.
- **Never write a silent-fallthrough edit** — a conditional replace that didn't match left
  stale items in this file for a day.
- **One working tree per shift** (A5) — three shifts sharing one checkout deleted each
  other's work.
