# PEOPLE HATE JAZZ

> They don't, obviously. They hate the *word*.

A one-issue online magazine about modern jazz and jazz-adjacent hip-hop, built out of a
single hundred-track playlist ("Jamies"). Sixty artists, one video each. The second half
of the publication is an auction house: sixty private artist shops selling one-of-one
objects and one-on-one time.

**Status:** working prototype. The editorial is real. The auction catalogue is invented
and takes no payment — this is stated above the fold on the store.

---

## The two departments

| | File | Accent | What it is |
|---|---|---|---|
| **Magazine** | `index.html` | flame `#FF3B0F` | Editorial survey — 60 artists, filterable roster, A–Z index, the 100-track playlist |
| **Store** | `store.html` | ultramarine `#1B2ECC` | Hash-routed auction — 140 lots across 60 shops, local bidding |

The accent swap is the primary signal of which half you are in.

---

## Running it

No build step. No framework. No dependencies.

```bash
python -m http.server 8412
```

Then open http://localhost:8412. (There's a `.claude/launch.json` wired to the same port.)

---

## Layout

```
index.html              Magazine
store.html              Store (hash router: #/, #/closing, #/shops, #/shop/<slug>, #/lot/<id>, #/mybids, #/how)
assets/
  css/main.css          Design system + magazine
  css/store.css         Store overrides
  js/data.js            ARTISTS[] — 60 entries, the editorial source of truth
  js/tracklist.js       TRACKLIST[] — the 100 tracks
  js/app.js             Magazine: rendering, filtering, video facades
  js/lots.js            LOTS[] — 140 auction lots
  js/store.js           Store: router, catalogue, generated plate art, bidding
docs/
  signal-engine.md      Spec for the community-monitoring tool (not built yet)
.impeccable.md          Design law. Read before touching anything visual.
```

---

## Rules that must hold

These are load-bearing. Breaking one is a regression, not a preference.

- **No photography exists for any lot.** Never fake a product shot. Lots render a
  generated two-ink plate, chosen by category, deterministic per lot id so it never
  reshuffles between builds.
- **Video facades, never live iframes.** Sixty embedded players would sink the page.
  Thumbnails are click-to-play.
- **The prototype banner stays** on the store, above the fold.
- **Catalogue paginates at 24.** All 140 at once is a 64,000px page that stalls the renderer.
- **Bidding state is `localStorage` only**, under `phj-store-v1`. Nothing is sent anywhere.
- **No cookies, no tracking, no newsletter** — this is promised in the footer of both
  pages. Adding analytics is a product decision, not a technical one.
- Typography is Bricolage Grotesque / Newsreader / Space Mono. **No Inter, Roboto,
  Poppins or Montserrat.**
- Keyboard navigable, `prefers-reduced-motion` respected.

See [`.impeccable.md`](.impeccable.md) for the full design context.

---

## Git hooks

Run once per clone:

```bash
sh tools/hooks/install.sh
```

Installs a `pre-push` hook that refuses direct pushes to `main`. Everything reaches `main`
through a pull request so the owner sees it first. This matters because scheduled shifts run
on this machine, sometimes in bypass-permissions mode, where nothing else would stop a direct
push from skipping review.

Merging a PR is unaffected — that goes through GitHub's API, not a local push.
