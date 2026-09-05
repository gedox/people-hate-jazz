# Lot copy — the questions to ask, and the pattern to write in

**Status: draft, ready to use the moment a real seller says yes.** This isn't the
seller-facing form (that's a Lane A build — see `docs/BACKLOG.md`); it's the prompt list
and voice guide for whoever writes up the answers, so the first real lot doesn't read
like a form response, and doesn't drift from the site's voice.

The current 140 lots in `store.html` are invented placeholders and must stay clearly
marked as such until a real one replaces them. This guide is for that replacement.

---

## The five questions to ask a seller

Ask these in order. Most sellers will answer 1–2 fully and 3–5 in one line — that's fine,
a one-line answer to "why does this exist" is often the best copy anyway.

1. **What is it, exactly?** Physical description a stranger could picture: size,
   material, condition, any damage or wear. Be specific — "a cracked ride cymbal" beats
   "some old gear."
2. **Where does it come from?** The specific session, show, or moment it's tied to — not
   "from my studio" but "the cymbal that cracked on the last night of the [tour/session]
   in [place/year]." If there's no specific story, say so; don't invent one.
3. **Why does it matter to you?** One honest sentence. This is usually the best line in
   the final copy — sellers undersell this by default, so push for it if the first answer
   is generic.
4. **What's the reserve, if any?** A floor they won't sell under, or none.
5. **How long should it run?** A close date, or a default (see `api/_lib/auction.mjs` for
   the site's standard windows once that's wired in).

Never invent an answer to any of these. If a seller doesn't know or won't say, leave it
blank rather than filling it with something that sounds plausible — the colophon on
`store.html` already promises "origins are given where confirmed and left blank where
they aren't," and a lot is exactly the place that promise gets tested.

## The copy pattern

Existing lot copy on the site is invented and doesn't yet have a real-seller pattern to
copy from directly, so use the **artist blurb voice** in `assets/js/data.js` as the
model — it's the site's established voice and a lot description is the same job at
shorter length: opinionated, dry, specific, no adjectives doing work a fact could do
instead.

**Structure, roughly two to four sentences:**

1. Lead with the object and the one specific fact that makes it real (not "a guitar
   pedal" — "the pedal that's on the bridge of [track]").
2. One line of story or context — where it's from, per question 2 above.
3. One line of honest color — condition, quirk, or the seller's own one-liner from
   question 3. This is where the voice lives; don't sand it down into marketing copy.
4. Optional close: what the winner actually gets (the item alone, or item plus a
   story/message/session — be concrete about what ships).

**Example, built from a real artist's public description already on this site** (Otis
McDonald, `assets/js/data.js`) **to show the pattern — not a real lot, not to be
published**:

> The Rhodes patch behind "Should I Buy Bitcoin," exported as stems. Recorded in one
> take in a Bay Area bedroom because the amp was too loud to re-track twice. Otis says
> he almost cut it for being too simple — it's the reason the track works. Comes with
> the original session notes, three lines, handwritten.

Note what that example does: no superlatives ("amazing," "incredible"), one verifiable
claim per sentence, and it ends on a concrete deliverable, not a vibe.

## Guardrails

- **Never present an invented lot as real**, and never blur the line between the
  placeholder catalogue and a real one — a real lot should read as more specific, not
  less, than the fiction next to it.
- **Don't write the seller's quote for them.** Question 3's answer goes in close to
  verbatim, even if it's rougher than the house style — an artist's actual voice in their
  own lot is more credible than a smoothed-over version.
- **If a photo doesn't exist yet, say so** rather than describing the item as if a photo
  is attached — see `MISSION.md`'s rule against faking a product photograph; that rule
  covers copy implying a photo as much as it covers generating one.
