# Research note — 2026-09-05 — closing gate #1/#2, and what "no escrow" actually costs

**Why this note.** M1's engineering shipped in #21 (persistence, identity, bidding, all
server-authoritative) and #23 (seller-listing UI), but neither is usable by a real stranger
yet: `api/_lib/mailer.mjs` only logs the one-time code to the server console — nobody
receives it by email — and `api/_lib/github-store.mjs` has never made a real API call. Both
gaps trace to a human gate. This note turns those gates into five-minute tasks, and
separately looks at what small marketplaces without escrow actually do about trust, since
M1's handover is deliberately "arranged by hand" and will need the same thing.

---

## Part 1 — Gate #2, made concrete: a transactional email sender

The mission's gate #2 is "a transactional email sender (free tier)". As of mid-2026:

| Provider | Free tier | Notes |
|---|---|---|
| **Resend** | 3,000 emails/month, 100/day cap, free tier does not expire | Cleanest API, first-class in Node without a heavy SDK — fits `mailer.mjs`'s "plain fetch, no framework" shape better than most. Default choice for small projects in 2026. |
| **Postmark** | 100/month, does not expire | Best deliverability reputation for pure transactional mail (refuses marketing mail entirely), but 100/month is tight if more than ~3 codes/day get requested. |
| **Amazon SES** | 3,000/month, first year only, new AWS account | Cheapest at scale later, but needs an AWS account and domain verification — more setup than a 5-minute gate should cost. |
| **Mailgun** | 100/day | Similar shape to Postmark. |
| **SendGrid** | No longer free (retired May 2025) — 60-day trial only, then $19.95/mo | Rule this one out. |

**Recommendation: Resend.** Highest free ceiling, simplest API (a single POST with a JSON
body and an API key — no SDK required, matching `mailer.mjs`'s existing stub shape), and
plenty of headroom for one-time codes at this project's volume (tens, not thousands, of
verifications a day).

**The actual five-minute task, for the owner:**
1. Sign up at resend.com with the project email address (this is gate #1 — see below;
   Resend accepts a plain inbox, no domain purchase required to start in sandbox mode).
2. Create an API key in the dashboard.
3. Add it to Vercel's project environment variables as `EMAIL_SENDER_API_KEY` (the name
   `api/_lib/mailer.mjs` already checks for and throws loudly if set without a working
   integration — so this alone doesn't finish the wiring, see backlog item M1.6).
4. In sandbox mode Resend can only send to the account's own verified address — fine for
   the owner to test the flow end-to-end, but sending codes to a real seller's inbox needs
   the domain verified (a TXT/DKIM record), which needs gate #1's domain decision (still
   `BLOCKED ON OWNER` in this backlog) or Resend's own subdomain option if a full domain
   purchase stays deferred.

## Part 2 — Gate #1, made concrete: a project email address

Every downstream thing — Resend's sender identity, `settle`'s eventual "who to notify"
step, the seller pitch's own signature — needs one address to send *from* and be reached
*at*. This doesn't need a purchased domain: a plain address at an existing free provider
(the owner's own registrar webmail, or a new Gmail/Proton address made for this project)
is enough to unblock Resend's sandbox mode today. Domain-backed sending (so codes don't
land in spam as "via resend.com") is a real upgrade but is gate #1's *domain* half, already
tracked separately in `BLOCKED ON OWNER` — don't conflate the two: an address alone
unblocks testing; a domain improves deliverability later.

---

## Part 3 — What marketplaces without escrow actually do (informs M1's handover + `sell.html`'s trust copy)

M1 explicitly has no escrow: a lot closes, both parties get each other's contact info, and
they settle by hand. That's not a novel structure — it's exactly how Discogs and (for
non-Authenticated items) Grailed have always worked, and their public trust pages are candid
about what that does and doesn't cover:

- **The platform does not mediate item-condition or shipment disputes once payment moves
  off-platform.** Discogs' own buyer policy states plainly it won't arbitrate a dispute
  about a transaction it "does not control" — it has no access to the item or the shipping
  method chosen by the two parties. **For PHJ:** the seller pitch and `sell.html` already
  say "I'm not in that transaction and don't touch the money" — that's the right instinct,
  already matches how these platforms actually describe their own limits. Worth stating with
  the same directness on the handover screen once it exists, not softened.
- **Reputation is the substitute for escrow, and it's built from feedback, not identity
  verification.** Discogs surfaces seller feedback/rating on every profile; a brand-new
  account with no history is the visible risk signal, not a lack of KYC. **For PHJ:** M1 has
  no feedback system yet and doesn't need one to hit its "done when" bar — but it's the
  natural M2/M3 addition once repeat sellers exist, and cheaper than it sounds (a simple
  "N completed lots" counter per account, before any star-rating UI).
- **Keeping communication on-platform is what makes a dispute resolvable at all.** Discogs
  tells users explicitly that if they move a conversation off-platform, support "cannot
  review communication... and may not be able to assist." **For PHJ, this is the sharpest
  actionable point:** the handover step (M1.6, not yet built) should hand over contact
  info *and* a durable, timestamped record of the lot's final state — final bid, close
  time, both parties' emails — that lives in the same JSON store as everything else, not
  only in a live chat that later vanishes. The adapter already writes auditable JSON to the
  repo; the settlement record just needs to be one more document in it. That's a much
  cheaper "dispute resolution" feature than it sounds, and it's a natural fit for the
  existing storage adapter — no new infrastructure required.

**Net for the backlog:** two items below (M1.6 in Lane A's queue) — send the settlement
notification once gate #1/#2 are live, and persist a settlement record (not just an
in-memory return value) as the record both parties can point back to. Neither needs
escrow, feedback ratings, or identity verification to be worth shipping now.

Sources:
- [Email API Pricing Comparison (July 2026) | Resend, SendGrid, Postmark](https://www.buildmvpfast.com/api-costs/email)
- [Best Transactional Email Services 2026 (API Tested) | EmailToolScout](https://mailtoolscout.com/blog/best-transactional-email-services)
- [Best Transactional Email API in 2026 (Postmark vs Resend vs SendGrid) · EmailSendX](https://emailsendx.com/blog/best-transactional-email-api-2026)
- [Buyer Policy – Discogs](https://support.discogs.com/hc/en-us/articles/14587773391501-Buyer-Policy)
- [Safe Buying Tips for Online Marketplaces | Discogs](https://www.discogs.com/about/trust/safe-buying-tips/)
