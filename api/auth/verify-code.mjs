import { createStorage } from "../_lib/storage.mjs";
import { createIdentity } from "../_lib/identity.mjs";
import { createMailer } from "../_lib/mailer.mjs";
import { issueToken } from "../_lib/session.mjs";
import { json, readJsonBody, methodNotAllowed } from "../_lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { email, code } = await readJsonBody(req);
  if (typeof email !== "string" || typeof code !== "string") {
    return json(res, 400, { error: "invalid_request" });
  }

  const storage = await createStorage();
  const identity = createIdentity(storage, createMailer());
  const result = await identity.verifyCode(email, code);

  if (!result.ok) return json(res, 401, { error: result.reason });

  const token = issueToken(result.account.id);
  json(res, 200, { ok: true, token, accountId: result.account.id });
}
