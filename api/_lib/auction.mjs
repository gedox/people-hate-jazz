/* PEOPLE HATE JAZZ — auction rules.
 *
 * Pure functions, no I/O, no dependencies. This is the authority on what a
 * valid bid is. The browser may compute the same numbers to render a hint,
 * but the browser is never trusted — every bid is re-validated here.
 *
 * Money is handled in whole units (dollars) as integers. Never floats:
 * 0.1 + 0.2 problems in an auction are unforgivable.
 */

/** Minimum increment at a given price. Matches the published rules in the
 *  store's footer, which readers can see — so it must not drift from them. */
export function step(value) {
  if (value < 200) return 10;
  if (value < 500) return 25;
  if (value < 1000) return 50;
  if (value < 2500) return 100;
  return 250;
}

/** The lowest bid that would be accepted right now. */
export function minNext(current) {
  return current + step(current);
}

/** A bid inside this window pushes the close back, so a lot cannot be sniped
 *  in the last second. Standard practice, and it materially changes what
 *  sellers get. */
export const SOFT_CLOSE_MS = 5 * 60 * 1000;

export const REJECT = {
  CLOSED: "closed",
  TOO_LOW: "too_low",
  ALREADY_WINNING: "already_winning",
  NOT_A_NUMBER: "not_a_number",
  NO_BIDDER: "no_bidder",
};

/**
 * Decide whether a bid stands.
 *
 * @param {object}   lot        { id, startPrice, reserve?, closesAt }
 * @param {object[]} bids       existing bids, any order
 * @param {object}   incoming   { bidderId, amount }
 * @param {number}   now        epoch ms
 * @returns {{ok: true, bid, closesAt, reserveMet} | {ok: false, reason, minimum?}}
 */
export function placeBid(lot, bids, incoming, now = Date.now()) {
  const { bidderId, amount } = incoming;

  if (!bidderId) return { ok: false, reason: REJECT.NO_BIDDER };
  if (!Number.isInteger(amount) || amount <= 0) {
    return { ok: false, reason: REJECT.NOT_A_NUMBER };
  }
  if (now >= lot.closesAt) return { ok: false, reason: REJECT.CLOSED };

  const top = highestBid(bids);
  const current = top ? top.amount : lot.startPrice;
  const floor = top ? minNext(current) : lot.startPrice;

  // Re-bidding while already winning just inflates the price against yourself.
  if (top && top.bidderId === bidderId) {
    return { ok: false, reason: REJECT.ALREADY_WINNING };
  }
  if (amount < floor) {
    return { ok: false, reason: REJECT.TOO_LOW, minimum: floor };
  }

  const closesAt =
    lot.closesAt - now < SOFT_CLOSE_MS ? now + SOFT_CLOSE_MS : lot.closesAt;

  return {
    ok: true,
    bid: { lotId: lot.id, bidderId, amount, at: now },
    closesAt,
    reserveMet: lot.reserve == null || amount >= lot.reserve,
  };
}

/** Highest bid, ties broken by whoever got there first. */
export function highestBid(bids) {
  let best = null;
  for (const b of bids) {
    if (!best || b.amount > best.amount || (b.amount === best.amount && b.at < best.at)) {
      best = b;
    }
  }
  return best;
}

/**
 * Settle a closed lot.
 * Returns null while it is still running, so callers can't accidentally
 * settle early.
 */
export function settle(lot, bids, now = Date.now()) {
  if (now < lot.closesAt) return null;

  const top = highestBid(bids);
  if (!top) return { lotId: lot.id, outcome: "no_bids" };

  if (lot.reserve != null && top.amount < lot.reserve) {
    return {
      lotId: lot.id,
      outcome: "reserve_not_met",
      highest: top.amount,
      bidderId: top.bidderId,
    };
  }
  return {
    lotId: lot.id,
    outcome: "sold",
    winnerId: top.bidderId,
    amount: top.amount,
    bidCount: bids.length,
  };
}

/** Everyone who bid and lost — they need telling too. */
export function outbidders(bids, winnerId) {
  return [...new Set(bids.map((b) => b.bidderId))].filter((id) => id !== winnerId);
}
