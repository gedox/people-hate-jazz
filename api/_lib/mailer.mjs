/* PEOPLE HATE JAZZ — mailer adapter. This is human gate #2.
 *
 * `createMailer` returns the console stub until the owner supplies a
 * transactional email sender (free tier, e.g. Resend or Postmark) and its
 * API key as an env var. When that lands, add a branch here that calls it
 * — no handler or identity.mjs code changes.
 */

export function createMailer(env = process.env) {
  if (env.EMAIL_SENDER_API_KEY) {
    throw new Error(
      "EMAIL_SENDER_API_KEY is set but no sender integration is wired up yet — " +
      "add one in api/_lib/mailer.mjs and remove this guard.",
    );
  }
  return createConsoleMailer();
}

/** Stub: logs the code instead of sending it. Lets the whole identity flow
 *  run end-to-end today — a developer (or, in a pinch, the owner) reads the
 *  code from function logs — with zero behavior change once gate #2 clears. */
export function createConsoleMailer() {
  return {
    async send(email, code) {
      console.log(`[stub mailer] one-time code for ${email}: ${code}`);
    },
  };
}
