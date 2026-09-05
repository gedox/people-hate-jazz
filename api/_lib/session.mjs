/* PEOPLE HATE JAZZ — session tokens.
 *
 * A bid must be attributable to a verified account, not just a client-sent
 * id (that would let anyone bid as anyone). So verifyCode hands back a
 * signed token — HMAC over the account id, node stdlib only, no library —
 * and every bid must present it. Short of real auth infra, this is the
 * minimum that stops a stranger from forging someone else's bid.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

function secret(env = process.env) {
  if (!env.SESSION_SECRET) {
    if (env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set in production");
    }
    return "dev-only-insecure-secret";
  }
  return env.SESSION_SECRET;
}

export function issueToken(accountId, env = process.env) {
  const sig = createHmac("sha256", secret(env)).update(accountId).digest("hex");
  return `${accountId}.${sig}`;
}

export function verifyToken(token, env = process.env) {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [accountId, sig] = token.split(".");
  const expected = createHmac("sha256", secret(env)).update(accountId).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return accountId;
}
