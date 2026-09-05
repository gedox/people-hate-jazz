/* The in-memory storage adapter is also the contract every other adapter
 * (GitHub-JSON today, Postgres later) must satisfy. Test the contract here. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryStorage } from "../../api/_lib/storage.mjs";

test("a created lot starts pending and is retrievable by id", async () => {
  const storage = createMemoryStorage();
  const lot = await storage.createLot({ title: "A print", startPrice: 50 });
  assert.equal(lot.status, "pending");
  assert.equal(await storage.getLot(lot.id).then((l) => l.title), "A print");
});

test("listLots filters by status", async () => {
  const storage = createMemoryStorage();
  const a = await storage.createLot({ title: "a", startPrice: 10 });
  await storage.updateLot(a.id, { status: "live" });
  await storage.createLot({ title: "b", startPrice: 10 });

  const live = await storage.listLots({ status: "live" });
  assert.equal(live.length, 1);
  assert.equal(live[0].id, a.id);
});

test("updateLot on an unknown id returns null and creates nothing", async () => {
  const storage = createMemoryStorage();
  assert.equal(await storage.updateLot("nope", { status: "live" }), null);
  assert.deepEqual(await storage.listLots(), []);
});

test("bids accumulate per lot without leaking across lots", async () => {
  const storage = createMemoryStorage();
  await storage.addBid("lot-1", { lotId: "lot-1", bidderId: "a", amount: 10, at: 1 });
  await storage.addBid("lot-1", { lotId: "lot-1", bidderId: "b", amount: 20, at: 2 });
  await storage.addBid("lot-2", { lotId: "lot-2", bidderId: "a", amount: 5, at: 1 });

  assert.equal((await storage.listBids("lot-1")).length, 2);
  assert.equal((await storage.listBids("lot-2")).length, 1);
});

test("upsertAccount is idempotent by email", async () => {
  const storage = createMemoryStorage();
  const first = await storage.upsertAccount("a@example.com");
  const second = await storage.upsertAccount("a@example.com");
  assert.equal(first.id, second.id);
});

test("codes are set, read, and cleared", async () => {
  const storage = createMemoryStorage();
  await storage.setCode("a@example.com", "123456", Date.now() + 1000);
  assert.equal((await storage.getCode("a@example.com")).code, "123456");
  await storage.clearCode("a@example.com");
  assert.equal(await storage.getCode("a@example.com"), null);
});
