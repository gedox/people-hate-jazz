# Standing orders — PEOPLE HATE JAZZ

You are working a **shift** on this project. You start cold: you have no memory of
previous sessions. Everything you need is in this repo.

## Start every shift like this

1. Read **`docs/MISSION.md`** — **the active mission. It decides what you work on.**
   Not the backlog. If your idea doesn't advance the mission, it isn't this shift's work.
2. Read **`docs/LANES.md`** — which lane you are, and which files you may touch. Shifts
   run in parallel lanes so they never collide. **Never edit another lane's files.**
3. Read **`PROGRESS.md`** — current status, open PRs, what's blocked on the owner.
4. Read **`docs/BACKLOG.md`** — supporting detail, *not* the priority source — the prioritized queue.
5. Read **`.impeccable.md`** — design law. Non-optional before touching anything visual.
6. Check open PRs: `gh pr list`. **If a PR is awaiting review, do not start work that
   depends on it.** Pick the highest-priority item that doesn't conflict.
7. **Confirm the work isn't already done.** The backlog goes stale: only the owner can
   merge, so a correction can sit unmerged while you read the old version. Before starting,
   check `git log --oneline -20` and `gh pr list --state merged --limit 10` for work that
   already covers it. If it's done, mark it done in the backlog, say so in `PROGRESS.md`,
   and move to the next item — that alone is a worthwhile shift.
8. Do the work. One mission workstream per shift unless they're trivially small.
9. Write your shift log at `docs/log/YYYY-MM-DD-lane-<x>.md`.
10. **Run preflight. This is mandatory, not advisory:**

   ```bash
   node tools/shift/preflight.mjs --lane <a|b|c|d>
   ```

   It rebases you onto the newest `origin/main`, refuses if you touched another lane's
   files or a single-writer file, and refuses if you forgot your log. **Do not push past
   a failure** — it is telling you a conflict is about to happen.
11. Open a PR. Stop.

**Do not edit `PROGRESS.md` or `docs/BACKLOG.md` unless you are Lane D.** They are
single-writer. Everyone else writes a dated log file, which cannot conflict. This rule
exists because ignoring it blocked three PRs in one afternoon — see `docs/LANES.md`.

## What counts as a good shift

**Read `docs/MISSION.md`. Work the active mission. That is the whole instruction.**

The point of this project is a marketplace where real artists list real things and real
people bid on them. The magazine, the design and the tooling exist only to make that happen.

Judge your shift against one question:

> **Did this get us closer to a stranger completing a transaction?**

If the answer is no, it was a wasted shift no matter how clean the diff. Accessibility
passes, file-size reductions, refactors and backlog grooming are **not** shift work unless
the mission names them. They are how a project stays busy while going nowhere.

**If you cannot advance the mission, write that in your log and stop.** Do not fall back to
polishing. An honest empty shift tells the owner we are blocked; a tidy-up hides it.

Where a human gate blocks you (see MISSION.md), **build right up to it** — the whole flow
with the gated call stubbed behind an adapter — so it ships the moment the owner clears it.

## The owner's role

The owner (`gedox`) reviews and merges PRs. That is their **only** job in this loop.
So: PRs must be small enough to review in a few minutes, self-explanatory, and
accompanied by evidence that you actually verified the change.

## Never do these without explicit permission

- **Merge your own PR.** Ever.
- **Widen what we collect about readers.** Page analytics were approved by the owner and
  shipped in #16: Vercel Insights on all 63 pages, and the footer line *"No cookies, no
  tracking, no newsletter"* was removed with it. That approval covers **page analytics and
  nothing else.** Cookies, cross-site or persistent identifiers, third-party trackers, and
  anything that stores reader data off-device — E1.2 included — still need the owner to say
  yes, each time. Never re-word a reader-facing promise to make room for a feature.
- **Break the design law** in `.impeccable.md` — the fonts, the palette, the hard NOs.
- **Add a build step, a framework, or an npm dependency to the site.** The site is
  static and deploys anywhere. That is a feature. Tooling under `tools/` is fine.
- **Remove the store's prototype banner** or imply the lots are real.
- **Buy a domain, post publicly, or contact anyone.** Outward-facing actions are the
  owner's call.
- **Fake a product photograph** for any lot. Lots get generated two-ink plates.

## Verify before you claim

A change is not done because the file saved. Before opening a PR:

```bash
python -m http.server 8412
```

Then, via the browser tools: load the affected pages, check `read_console_messages`
for errors, and confirm the thing you changed actually renders. Screenshot it if it's
visual. **Report failures honestly** — a PR that says "verified" when it wasn't is
worse than no PR.

Regression baseline: `index.html` renders 60 roster cards and 100 tracklist rows;
`store.html` reports 140 lots across 60 shops. Zero console errors on both.

## Conventions

- Branch names: `ship/…`, `fix/…`, `feat/…`, `chore/…`
- One concern per PR. If you notice something unrelated, add it to `docs/BACKLOG.md`
  rather than smuggling it into the diff.
- Commit messages: what changed and **why**, in prose. End with:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- PR bodies: what, why, how to review, and anything you deliberately left out.
  End with: `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- Bump the `?v=N` on **every** local asset reference, in **every** HTML file, together.
  They must never drift apart — that was a real bug once.

## Architecture notes

- **The public site stays static** — no build step, no framework, no runtime dependencies.
  That is why it deploys anywhere and why it is fast.
- **Server code lives in `/api` as Vercel Functions.** M1 needs a server: listings and bids
  cannot live in `localStorage` if two strangers are to transact. Plain `.mjs` handlers, node
  stdlib only, no framework. The static pages keep working with the API switched off.
- **Auction rules live in `api/_lib/auction.mjs` and are the authority.** The browser may
  compute the same numbers to render a hint; it is never trusted. Money is whole-unit
  integers, never floats. Tests: `node --test tools/test/auction.test.mjs`.
- `assets/css/store.css` currently holds shared chrome (`.topbar`, `.modeswitch`,
  `.btn`) as well as store styles. Any page that uses the topbar must load **both**
  stylesheets until that's refactored. See the backlog.
- Store routes are hash-based, so the server never sees them. No rewrite rules needed.
- Bidding state: `localStorage` under `phj-store-v1`. Nothing is sent anywhere.
- Social cards are generated, not drawn: edit `tools/og/card.html`, then re-render with
  headless Chrome (the command is in `docs/BACKLOG.md`).

## End every shift by writing your log

`docs/log/YYYY-MM-DD-lane-<x>.md`. What you did, what you found, what you propose for the
backlog, what the owner needs to decide. Scannable in 30 seconds.

Only Lane D writes `PROGRESS.md` and `docs/BACKLOG.md`, folding every log in at 21:10.
