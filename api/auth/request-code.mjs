import { createStorage } from "../_lib/storage.mjs";
import { createIdentity } from "../_lib/identity.mjs";
import { createMailer } from "../_lib/mailer.mjs";
import { json, readJsonBody, methodNotAllowed } from "../_lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { email } = await readJsonBody(req);
  if (!isValidEmail(email)) return json(res, 400, { error: "invalid_email" });

  const storage = await createStorage();
  const identity = createIdentity(storage, createMailer());
  await identity.requestCode(email);

  // Deliberately uninformative: never reveal whether the account existed.
  json(res, 200, { ok: true });
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
