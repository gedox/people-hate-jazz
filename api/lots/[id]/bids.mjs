import { createStorage } from "../../_lib/storage.mjs";
import { verifyToken } from "../../_lib/session.mjs";
import { placeBid } from "../../_lib/auction.mjs";
import { json, readJsonBody, methodNotAllowed } from "../../_lib/http.mjs";

/** GET  /api/lots/:id/bids -> public, existing bids on the lot
 *  POST /api/lots/:id/bids -> auth required, the server is the only
 *                             authority on whether a bid stands
 */
export default async function handler(req, res) {
  const { id } = req.query;
  const storage = await createStorage();

  if (req.method === "GET") {
    const bids = await storage.listBids(id);
    return json(res, 200, { bids });
  }

  if (req.method === "POST") {
    const accountId = verifyToken(bearerToken(req));
    if (!accountId) return json(res, 401, { error: "unauthenticated" });

    const lot = await storage.getLot(id);
    if (!lot || lot.status !== "live") return json(res, 404, { error: "lot_not_found" });

    const { amount } = await readJsonBody(req);
    const bids = await storage.listBids(id);
    const result = placeBid(lot, bids, { bidderId: accountId, amount });

    if (!result.ok) return json(res, 409, { error: result.reason, minimum: result.minimum });

    await storage.addBid(id, result.bid);
    if (result.closesAt !== lot.closesAt) {
      await storage.updateLot(id, { closesAt: result.closesAt });
    }
    return json(res, 201, { bid: result.bid, closesAt: result.closesAt, reserveMet: result.reserveMet });
  }

  return methodNotAllowed(res, ["GET", "POST"]);
}

function bearerToken(req) {
  const header = req.headers?.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}
