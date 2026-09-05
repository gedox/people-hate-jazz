/* PEOPLE HATE JAZZ — storage adapter interface.
 *
 * Every API handler talks to this interface, never to a specific backend.
 * That is the whole point: M1 ships on a GitHub-JSON adapter because it is
 * free and auditable at this volume, and it can be swapped for Postgres
 * later without touching a single handler.
 *
 * All methods are async so both adapters satisfy the same shape.
 */

/**
 * @typedef {object} Lot
 * @property {string} id
 * @property {"pending"|"live"|"closed"} status
 * @property {string} sellerEmail
 * @property {string} title
 * @property {string} description
 * @property {string} condition
 * @property {number} startPrice
 * @property {number|null} reserve
 * @property {string|null} photo   data URL or hosted URL; null falls back to a generated plate
 * @property {number} closesAt     epoch ms; set when a reviewer approves the lot
 * @property {number} createdAt
 */

/**
 * @typedef {object} Bid
 * @property {string} lotId
 * @property {string} bidderId
 * @property {number} amount
 * @property {number} at
 */

/**
 * @typedef {object} Account
 * @property {string} email
 * @property {string} id
 * @property {number} createdAt
 */

/** Picks the adapter for the current environment. GitHub-backed in
 *  production; in-memory when the repo isn't configured, which is also what
 *  keeps `node --test` free of network calls. */
export async function createStorage(env = process.env) {
  if (env.GITHUB_TOKEN && env.GITHUB_REPO) {
    const { createGithubStorage } = await import("./github-store.mjs");
    return createGithubStorage(env);
  }
  return createMemoryStorage();
}

/** Reference implementation. Also what tests run against, since it satisfies
 *  the exact same interface as the real adapter. */
export function createMemoryStorage() {
  const lots = new Map();
  const bids = new Map(); // lotId -> Bid[]
  const accounts = new Map(); // email -> Account
  const codes = new Map(); // email -> { code, expiresAt }
  let nextLotId = 1;
  let nextAccountId = 1;

  return {
    async listLots({ status } = {}) {
      const all = [...lots.values()];
      return status ? all.filter((l) => l.status === status) : all;
    },

    async getLot(id) {
      return lots.get(id) ?? null;
    },

    async createLot(partial) {
      const id = `lot-${nextLotId++}`;
      const lot = {
        id,
        status: "pending",
        closesAt: null,
        createdAt: Date.now(),
        ...partial,
      };
      lots.set(id, lot);
      return lot;
    },

    async updateLot(id, patch) {
      const current = lots.get(id);
      if (!current) return null;
      const next = { ...current, ...patch };
      lots.set(id, next);
      return next;
    },

    async listBids(lotId) {
      return bids.get(lotId) ?? [];
    },

    async addBid(lotId, bid) {
      const existing = bids.get(lotId) ?? [];
      existing.push(bid);
      bids.set(lotId, existing);
      return bid;
    },

    async getAccountByEmail(email) {
      return accounts.get(email) ?? null;
    },

    async upsertAccount(email) {
      const existing = accounts.get(email);
      if (existing) return existing;
      const account = { email, id: `acct-${nextAccountId++}`, createdAt: Date.now() };
      accounts.set(email, account);
      return account;
    },

    async setCode(email, code, expiresAt) {
      codes.set(email, { code, expiresAt });
    },

    async getCode(email) {
      return codes.get(email) ?? null;
    },

    async clearCode(email) {
      codes.delete(email);
    },
  };
}
