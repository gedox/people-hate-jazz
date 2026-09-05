import { createStorage } from "../../_lib/storage.mjs";
import { settle, outbidders } from "../../_lib/auction.mjs";
import { json, methodNotAllowed } from "../../_lib/http.mjs";

/** POST /api/lots/:id/settle
 *
 * The handover: once a lot's clock has run out, this decides the outcome
 * and marks the lot closed so it can't be settled twice. No side is told
 * anything here beyond what this endpoint returns — sending the winner and
 * seller their contact details is the next piece of the handover, and it
 * needs gates #1/#2 (a project email address and sender) to notify anyone
 * off-site. For now the response carries everything a client needs to show
 * both parties the outcome and let them arrange settlement by hand.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { id } = req.query;
  const storage = await createStorage();
  const lot = await storage.getLot(id);
  if (!lot) return json(res, 404, { error: "lot_not_found" });
  if (lot.status === "closed") return json(res, 409, { error: "already_settled" });

  const bids = await storage.listBids(id);
  const outcome = settle(lot, bids);
  if (!outcome) return json(res, 409, { error: "still_running", closesAt: lot.closesAt });

  await storage.updateLot(id, { status: "closed" });

  const losers = outcome.winnerId ? outbidders(bids, outcome.winnerId) : outbidders(bids, null);
  json(res, 200, { outcome, losers });
}
