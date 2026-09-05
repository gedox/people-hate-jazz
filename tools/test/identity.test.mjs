import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryStorage } from "../../api/_lib/storage.mjs";
import { createIdentity } from "../../api/_lib/identity.mjs";

function fakeMailer() {
  const sent = [];
  return { sent, async send(email, code) { sent.push({ email, code }); } };
}

test("requesting a code sends it and never returns it directly", async () => {
  const storage = createMemoryStorage();
  const mailer = fakeMailer();
  const identity = createIdentity(storage, mailer);

  const result = await identity.requestCode("Person@Example.com");
  assert.deepEqual(result, { ok: true });
  assert.equal(mailer.sent.length, 1);
  assert.equal(mailer.sent[0].email, "person@example.com");
});

test("verifying the right code creates an account", async () => {
  const storage = createMemoryStorage();
  const mailer = fakeMailer();
  const identity = createIdentity(storage, mailer);

  await identity.requestCode("a@example.com");
  const { code } = mailer.sent[0];
  const result = await identity.verifyCode("a@example.com", code);

  assert.equal(result.ok, true);
  assert.equal(result.account.email, "a@example.com");
});

test("a wrong code is refused", async () => {
  const storage = createMemoryStorage();
  const identity = createIdentity(storage, fakeMailer());
  await identity.requestCode("a@example.com");

  const result = await identity.verifyCode("a@example.com", "000000");
  assert.equal(result.ok, false);
  assert.equal(result.reason, "wrong_code");
});

test("an expired code is refused even if correct", async () => {
  const storage = createMemoryStorage();
  const mailer = fakeMailer();
  const identity = createIdentity(storage, mailer);
  await identity.requestCode("a@example.com");
  const { code } = mailer.sent[0];

  const farFuture = Date.now() + 24 * 60 * 60 * 1000;
  const result = await identity.verifyCode("a@example.com", code, farFuture);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "expired");
});

test("a code can only be used once", async () => {
  const storage = createMemoryStorage();
  const mailer = fakeMailer();
  const identity = createIdentity(storage, mailer);
  await identity.requestCode("a@example.com");
  const { code } = mailer.sent[0];

  await identity.verifyCode("a@example.com", code);
  const second = await identity.verifyCode("a@example.com", code);
  assert.equal(second.ok, false);
  assert.equal(second.reason, "no_code");
});
