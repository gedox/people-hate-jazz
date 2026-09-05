import { test } from "node:test";
import assert from "node:assert/strict";
import { issueToken, verifyToken } from "../../api/_lib/session.mjs";

const env = { SESSION_SECRET: "test-secret" };

test("a token issued for an account verifies back to that account", () => {
  const token = issueToken("acct-1", env);
  assert.equal(verifyToken(token, env), "acct-1");
});

test("a token signed with a different secret is rejected", () => {
  const token = issueToken("acct-1", { SESSION_SECRET: "other-secret" });
  assert.equal(verifyToken(token, env), null);
});

test("a tampered account id is rejected", () => {
  const token = issueToken("acct-1", env);
  const [, sig] = token.split(".");
  assert.equal(verifyToken(`acct-2.${sig}`, env), null);
});

test("garbage input is rejected without throwing", () => {
  assert.equal(verifyToken("not-a-token", env), null);
  assert.equal(verifyToken(null, env), null);
  assert.equal(verifyToken(undefined, env), null);
});
