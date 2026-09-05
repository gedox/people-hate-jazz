/* PEOPLE HATE JAZZ — GitHub-JSON storage adapter.
 *
 * Zero-new-account persistence: reads and writes JSON files in this repo
 * through the GitHub Contents API. Slow (a few hundred ms per write, and
 * writes are serialized below) but free, and every change is a commit —
 * fully auditable, which matters more than speed at this volume.
 *
 * Same interface as api/_lib/storage.mjs's in-memory adapter. Swap this
 * file out for a Postgres adapter later without touching any handler.
 */

const API = "https://api.github.com";
const PATHS = {
  lots: "data/store/lots.json",
  bids: "data/store/bids.json",
  accounts: "data/store/accounts.json",
  codes: "data/store/codes.json",
};

export function createGithubStorage(env = process.env) {
  const repo = env.GITHUB_REPO; // "owner/name"
  const token = env.GITHUB_TOKEN;
  const branch = env.GITHUB_BRANCH || "main";

  async function readJson(path, fallback) {
    const res = await fetch(
      `${API}/repos/${repo}/contents/${path}?ref=${branch}`,
      { headers: authHeaders(token) },
    );
    if (res.status === 404) return { data: fallback, sha: null };
    if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`);
    const body = await res.json();
    const data = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
    return { data, sha: body.sha };
  }

  async function writeJson(path, data, sha, message) {
    const res = await fetch(`${API}/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
        sha: sha ?? undefined,
        branch,
      }),
    });
    if (!res.ok) throw new Error(`GitHub write failed: ${res.status} ${await res.text()}`);
    return res.json();
  }

  // Serializes writes to the same file so two concurrent requests don't race
  // on a stale `sha` and clobber each other. Fine at this volume.
  const locks = new Map();
  async function withLock(key, fn) {
    const prior = locks.get(key) ?? Promise.resolve();
    const run = prior.then(fn, fn);
    locks.set(key, run.catch(() => {}));
    return run;
  }

  async function mutate(kind, fallback, message, mutator) {
    return withLock(kind, async () => {
      const { data, sha } = await readJson(PATHS[kind], fallback);
      const { next, result } = mutator(data);
      await writeJson(PATHS[kind], next, sha, message);
      return result;
    });
  }

  return {
    async listLots({ status } = {}) {
      const { data } = await readJson(PATHS.lots, []);
      return status ? data.filter((l) => l.status === status) : data;
    },

    async getLot(id) {
      const { data } = await readJson(PATHS.lots, []);
      return data.find((l) => l.id === id) ?? null;
    },

    async createLot(partial) {
      return mutate("lots", [], `Submit lot: ${partial.title ?? "untitled"}`, (lots) => {
        const id = `lot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const lot = { id, status: "pending", closesAt: null, createdAt: Date.now(), ...partial };
        return { next: [...lots, lot], result: lot };
      });
    },

    async updateLot(id, patch) {
      return mutate("lots", [], `Update lot ${id}`, (lots) => {
        const idx = lots.findIndex((l) => l.id === id);
        if (idx === -1) return { next: lots, result: null };
        const updated = { ...lots[idx], ...patch };
        const next = [...lots];
        next[idx] = updated;
        return { next, result: updated };
      });
    },

    async listBids(lotId) {
      const { data } = await readJson(PATHS.bids, []);
      return data.filter((b) => b.lotId === lotId);
    },

    async addBid(lotId, bid) {
      return mutate("bids", [], `Bid on ${lotId}: ${bid.amount}`, (bids) => {
        return { next: [...bids, bid], result: bid };
      });
    },

    async getAccountByEmail(email) {
      const { data } = await readJson(PATHS.accounts, []);
      return data.find((a) => a.email === email) ?? null;
    },

    async upsertAccount(email) {
      return mutate("accounts", [], `Register account: ${email}`, (accounts) => {
        const existing = accounts.find((a) => a.email === email);
        if (existing) return { next: accounts, result: existing };
        const account = { email, id: `acct-${Date.now().toString(36)}`, createdAt: Date.now() };
        return { next: [...accounts, account], result: account };
      });
    },

    async setCode(email, code, expiresAt) {
      await mutate("codes", [], `Issue login code`, (codes) => {
        const next = codes.filter((c) => c.email !== email);
        next.push({ email, code, expiresAt });
        return { next, result: null };
      });
    },

    async getCode(email) {
      const { data } = await readJson(PATHS.codes, []);
      return data.find((c) => c.email === email) ?? null;
    },

    async clearCode(email) {
      await mutate("codes", [], `Clear login code`, (codes) => {
        return { next: codes.filter((c) => c.email !== email), result: null };
      });
    },
  };
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "people-hate-jazz",
  };
}
