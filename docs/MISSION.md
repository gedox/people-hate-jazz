# MISSION

**This file, not the backlog, decides what a shift works on.**

There is exactly one active mission at a time. Every shift works it until it is done. A shift
that ships a piece of the mission is a good shift. A shift that improves something outside
the mission is a wasted shift, however clean the diff.

If you cannot advance the mission, say so in your log and stop. **Do not fall back to
polishing.** An empty shift is honest; a tidy-up is noise that hides the fact we are stuck.

---

## THE POINT

In three months the store has real artists listing real things and real people bidding on
them. Everything else — the magazine, the design, the tooling — exists only to make that
happen.

Judge every shift against: **did this get us closer to a stranger completing a transaction?**

---

## ⬤ ACTIVE MISSION — M1: A real listing, a real bid

**Done when:** a person who is not the owner can, in a browser, create a listing that
persists on a server, and a different person can bid on it, and at close the system picks a
winner and tells both of them. Real data, no fixtures, no `localStorage`-only state.

**Explicitly not in M1:** card payments, a legal entity, a take-rate. First settlements are
arranged by hand between the two parties, and the site says so plainly. Nobody incorporates
a company before a single stranger has proved they will bid.

**Workstreams** — pick the one that is furthest behind:

1. **Persistence.** Server-side storage for lots, bids and accounts. Zero-new-account option
   first: Vercel Functions writing JSON to this repo through the GitHub API. Slow writes are
   fine at this volume and every change is auditable. Design the data layer behind one
   adapter interface so it can be swapped for Postgres later without touching callers.
2. **Identity.** Enough to attribute a bid to a person and let them come back. Email plus a
   one-time code is enough. No passwords.
3. **Seller flow.** An artist submits a lot: what it is, condition, reserve, close date,
   photo or generated plate. Goes to a review queue, not straight live.
4. **Bidding.** Real increments, real clock, outbid state, close, winner. The current store's
   rules already exist — make them authoritative on the server rather than in the browser.
5. **The handover.** When a lot closes, both parties get what they need to settle between
   themselves, and the outcome is recorded.

**Whoever finishes a workstream picks up the next one.** Do not wait for permission.

---

## THE HUMAN GATES

Four things I cannot do myself. Not budget — identity and consent. They are sequenced as
late as possible on purpose, and each costs the owner minutes, not money.

| # | Gate | Needed for | When |
|---|---|---|---|
| 1 | **An email address for the project** | Sending one-time codes, and later talking to artists | M1 identity, M2 |
| 2 | **A transactional email sender** (free tier) | Delivering those codes | M1 identity |
| 3 | **A place to post as PHJ** | Reaching artists and buyers at all | M2 |
| 4 | **Stripe + a legal entity** | Taking a percentage | **M4 only.** Not before real transactions exist |

I cannot create accounts, enter payment details, or sign up as the owner — those are hard
limits, not preferences. Everything else I build.

**Where a gate blocks a workstream, build right up to it** — the whole flow, with the gated
call stubbed behind the adapter — so the day the owner spends five minutes on it, the
feature is already finished.

---

## QUEUED MISSIONS

**M2 — Sellers.** Real artists with real listings. Target: 10 lots from 5 artists that the
owner did not create. Needs M1 and gates 1 and 3.

**M3 — Buyers.** People arriving and bidding. The magazine and the 60 artist pages are the
top of this funnel — that is what they were always for.

**M4 — Money.** Stripe Connect, take-rate, payouts. Only once M2 and M3 have produced
transactions worth taking a percentage of.

---

## RULES THAT SURVIVE THE MISSION

These are not process for its own sake; each one was paid for.

- **Never fake supply.** The prototype banner stays until lots are real, and invented lots
  are never presented as available. Credibility is the entire asset.
- **Never contact anyone or post anywhere without the owner's word.** Draft it, don't send it.
- **Never widen what we collect about readers** beyond the page analytics already approved.
- Single-writer files and `preflight.mjs` stay — they exist because ignoring them blocked
  the queue for a day.
