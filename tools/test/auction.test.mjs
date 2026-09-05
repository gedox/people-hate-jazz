/* Auction rules — run with:  node --test tools/test/
 * No test framework, no dependencies: node's built-in runner.
 * These rules decide who owes whom money, so they get tested. */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  step, minNext, placeBid, highestBid, settle, outbidders, REJECT, SOFT_CLOSE_MS,
} from "../../api/_lib/auction.mjs";

const T0 = 1_800_000_000_000;
const lot = (over = {}) => ({
  id: "l1", startPrice: 50, reserve: null, closesAt: T0 + 86_400_000, ...over,
});

test("increments match the rules published in the store footer", () => {
  assert.equal(step(10), 10);
  assert.equal(step(199), 10);
  assert.equal(step(200), 25);
  assert.equal(step(499), 25);
  assert.equal(step(500), 50);
  assert.equal(step(999), 50);
  assert.equal(step(1000), 100);
  assert.equal(step(2499), 100);
  assert.equal(step(2500), 250);
  assert.equal(minNext(195), 205);
});

test("first bid may equal the start price", () => {
  const r = placeBid(lot(), [], { bidderId: "a", amount: 50 }, T0);
  assert.equal(r.ok, true);
  assert.equal(r.bid.amount, 50);
});

test("first bid below the start price is refused", () => {
  const r = placeBid(lot(), [], { bidderId: "a", amount: 49 }, T0);
  assert.equal(r.ok, false);
  assert.equal(r.reason, REJECT.TOO_LOW);
  assert.equal(r.minimum, 50);
});

test("a later bid must clear the increment, not merely beat the top", () => {
  const bids = [{ lotId: "l1", bidderId: "a", amount: 100, at: T0 }];
  const tooLow = placeBid(lot(), bids, { bidderId: "b", amount: 105 }, T0 + 1);
  assert.equal(tooLow.ok, false);
  assert.equal(tooLow.minimum, 110);

  const ok = placeBid(lot(), bids, { bidderId: "b", amount: 110 }, T0 + 1);
  assert.equal(ok.ok, true);
});

test("you cannot bid against yourself while winning", () => {
  const bids = [{ lotId: "l1", bidderId: "a", amount: 100, at: T0 }];
  const r = placeBid(lot(), bids, { bidderId: "a", amount: 500 }, T0 + 1);
  assert.equal(r.ok, false);
  assert.equal(r.reason, REJECT.ALREADY_WINNING);
});

test("bids are refused once closed", () => {
  const l = lot({ closesAt: T0 });
  const r = placeBid(l, [], { bidderId: "a", amount: 500 }, T0);
  assert.equal(r.ok, false);
  assert.equal(r.reason, REJECT.CLOSED);
});

test("money must be a whole positive number", () => {
  for (const bad of [10.5, -5, 0, NaN, "100"]) {
    const r = placeBid(lot(), [], { bidderId: "a", amount: bad }, T0);
    assert.equal(r.ok, false, `accepted ${bad}`);
    assert.equal(r.reason, REJECT.NOT_A_NUMBER);
  }
});

test("a late bid extends the close, so a lot cannot be sniped", () => {
  const closesAt = T0 + 60_000;              // one minute left
  const r = placeBid(lot({ closesAt }), [], { bidderId: "a", amount: 50 }, T0);
  assert.equal(r.ok, true);
  assert.equal(r.closesAt, T0 + SOFT_CLOSE_MS);
  assert.ok(r.closesAt > closesAt);
});

test("an early bid leaves the close alone", () => {
  const r = placeBid(lot(), [], { bidderId: "a", amount: 50 }, T0);
  assert.equal(r.closesAt, lot().closesAt);
});

test("ties go to whoever bid first", () => {
  const top = highestBid([
    { bidderId: "b", amount: 100, at: T0 + 10 },
    { bidderId: "a", amount: 100, at: T0 },
  ]);
  assert.equal(top.bidderId, "a");
});

test("settle refuses to run early", () => {
  assert.equal(settle(lot(), [], T0), null);
});

test("settle reports no bids, reserve not met, and sold", () => {
  const closed = lot({ closesAt: T0, reserve: 300 });
  assert.equal(settle(closed, [], T0).outcome, "no_bids");

  const low = [{ bidderId: "a", amount: 100, at: T0 - 1 }];
  assert.equal(settle(closed, low, T0).outcome, "reserve_not_met");

  const high = [{ bidderId: "a", amount: 300, at: T0 - 1 }];
  const s = settle(closed, high, T0);
  assert.equal(s.outcome, "sold");
  assert.equal(s.winnerId, "a");
  assert.equal(s.amount, 300);
});

test("losers are identified once, for notifying them", () => {
  const bids = [
    { bidderId: "a", amount: 100, at: T0 },
    { bidderId: "b", amount: 200, at: T0 + 1 },
    { bidderId: "a", amount: 300, at: T0 + 2 },
  ];
  assert.deepEqual(outbidders(bids, "a"), ["b"]);
});
