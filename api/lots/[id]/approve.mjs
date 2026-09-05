import { createStorage } from "../../_lib/storage.mjs";
import { json, readJsonBody, methodNotAllowed } from "../../_lib/http.mjs";

/** POST /api/lots/:id/approve
 *
 * Moves a lot out of the review queue and live, setting its close time.
 * There's no reviewer UI yet — this is the seat belt so a submitted lot
 * can never go live by itself. Gated on ADMIN_TOKEN (a shared secret the
 * owner sets in Vercel env vars) until there's a real reviewer flow.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  if (!process.env.ADMIN_TOKEN || bearerToken(req) !== process.env.ADMIN_TOKEN) {
    return json(res, 401, { error: "unauthenticated" });
  }

  const { id } = req.query;
  const { closesAt } = await readJsonBody(req);
  if (!Number.isInteger(closesAt) || closesAt <= Date.now()) {
    return json(res, 400, { error: "invalid_closes_at" });
  }

  const storage = await createStorage();
  const lot = await storage.getLot(id);
  if (!lot) return json(res, 404, { error: "lot_not_found" });
  if (lot.status !== "pending") return json(res, 409, { error: "not_pending" });

  const updated = await storage.updateLot(id, { status: "live", closesAt });
  json(res, 200, { lot: updated });
}

function bearerToken(req) {
  const header = req.headers?.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}
