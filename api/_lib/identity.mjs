/* PEOPLE HATE JAZZ — identity: email + one-time code. No passwords.
 *
 * Sending the code is behind an adapter (see mailer.mjs) because it needs
 * gate #2 (a transactional email sender) that only the owner can supply.
 * Everything up to that call is finished and testable today; the day the
 * owner picks a sender, only `createMailer` changes.
 */

const CODE_TTL_MS = 10 * 60 * 1000;

function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * @param {import("./storage.mjs")} storage
 * @param {{send(email: string, code: string): Promise<void>}} mailer
 */
export function createIdentity(storage, mailer) {
  return {
    /** Issues a code and hands it to the mailer. Never reveals whether an
     *  account already existed, and never returns the code itself — the
     *  caller (an API handler) must not leak it into a response body. */
    async requestCode(email) {
      const normalized = normalizeEmail(email);
      const code = randomCode();
      await storage.setCode(normalized, code, Date.now() + CODE_TTL_MS);
      await mailer.send(normalized, code);
      return { ok: true };
    },

    /** Verifies a code and creates the account on first success. */
    async verifyCode(email, code, now = Date.now()) {
      const normalized = normalizeEmail(email);
      const record = await storage.getCode(normalized);
      if (!record) return { ok: false, reason: "no_code" };
      if (now >= record.expiresAt) return { ok: false, reason: "expired" };
      if (record.code !== String(code)) return { ok: false, reason: "wrong_code" };

      await storage.clearCode(normalized);
      const account = await storage.upsertAccount(normalized);
      return { ok: true, account };
    },
  };
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}
