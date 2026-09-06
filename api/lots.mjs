import { createStorage } from "./_lib/storage.mjs";
import { verifyToken } from "./_lib/session.mjs";
import { json, readJsonBody, methodNotAllowed } from "./_lib/http.mjs";

/** GET  /api/lots         -> public, live lots only
 *  POST /api/lots         -> auth required, creates a pending lot for review
 */
export default async function handler(req, res) {
  const storage = await createStorage();

  if (req.method === "GET") {
    const lots = await storage.listLots({ status: "live" });
    return json(res, 200, { lots });
  }

  if (req.method === "POST") {
    const accountId = verifyToken(bearerToken(req));
    if (!accountId) return json(res, 401, { error: "unauthenticated" });

    const body = await readJsonBody(req);
    const errors = validateSubmission(body);
    if (errors.length) return json(res, 400, { error: "invalid_lot", details: errors });

    const lot = await storage.createLot({
      sellerId: accountId,
      title: body.title,
      description: body.description,
      condition: body.condition,
      category: body.category,
      startPrice: body.startPrice,
      reserve: body.reserve ?? null,
      photo: body.photo ?? null,
      // A pending lot has no close time yet — a reviewer sets one on approval.
      status: "pending",
    });
    return json(res, 201, { lot });
  }

  return methodNotAllowed(res, ["GET", "POST"]);
}

function bearerToken(req) {
  const header = req.headers?.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

// Keep in sync with the <select> options in sell.html — these pick which
// deterministic plate art a lot gets, per MISSION.md's no-faked-photography rule.
const CATEGORIES = ["vinyl", "paper", "gear", "tape", "photo", "wearable", "session"];

function validateSubmission(body) {
  const errors = [];
  if (typeof body.title !== "string" || !body.title.trim()) errors.push("title");
  if (typeof body.description !== "string" || !body.description.trim()) errors.push("description");
  if (typeof body.condition !== "string" || !body.condition.trim()) errors.push("condition");
  if (typeof body.category !== "string" || CATEGORIES.indexOf(body.category) === -1) errors.push("category");
  if (!Number.isInteger(body.startPrice) || body.startPrice <= 0) errors.push("startPrice");
  if (body.reserve != null && (!Number.isInteger(body.reserve) || body.reserve < body.startPrice)) {
    errors.push("reserve");
  }
  return errors;
}
