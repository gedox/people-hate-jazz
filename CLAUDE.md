# Standing orders — PEOPLE HATE JAZZ

You are working a **shift** on this project. You start cold: you have no memory of
previous sessions. Everything you need is in this repo.

## Start every shift like this

1. Read **`PROGRESS.md`** — current status, open PRs, what's blocked on the owner.
2. Read **`docs/BACKLOG.md`** — the prioritized queue.
3. Read **`.impeccable.md`** — design law. Non-optional before touching anything visual.
4. Check open PRs: `gh pr list`. **If a PR is awaiting review, do not start work that
   depends on it.** Pick the highest-priority item that doesn't conflict.
5. Do the work. One item per shift unless they're trivially small.
6. Open a PR. Update `PROGRESS.md`. Stop.

## The owner's role

The owner (`gedox`) reviews and merges PRs. That is their **only** job in this loop.
So: PRs must be small enough to review in a few minutes, self-explanatory, and
accompanied by evidence that you actually verified the change.

## Never do these without explicit permission

- **Merge your own PR.** Ever.
- **Add analytics or any tracking.** Both page footers publicly promise *"No cookies,
  no tracking, no newsletter."* That is a commitment to readers, not a technical default.
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

- No build step, no framework, no runtime dependencies.
- `assets/css/store.css` currently holds shared chrome (`.topbar`, `.modeswitch`,
  `.btn`) as well as store styles. Any page that uses the topbar must load **both**
  stylesheets until that's refactored. See the backlog.
- Store routes are hash-based, so the server never sees them. No rewrite rules needed.
- Bidding state: `localStorage` under `phj-store-v1`. Nothing is sent anywhere.
- Social cards are generated, not drawn: edit `tools/og/card.html`, then re-render with
  headless Chrome (the command is in `docs/BACKLOG.md`).

## End every shift by updating PROGRESS.md

Keep it scannable in 30 seconds. Say what you did, what's next, and what you need from
the owner. If you were blocked, say so plainly and say why.
