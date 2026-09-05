/* PEOPLE HATE JAZZ — shift preflight.
 *
 * Every shift MUST run this before pushing. It makes merge conflicts
 * structurally unlikely rather than merely discouraged:
 *
 *   1. Rebases your branch onto the newest origin/main, so you are never
 *      opening a PR against a stale base. This alone prevents most conflicts.
 *   2. Refuses if you touched a file another lane exclusively owns.
 *   3. Refuses if you touched PROGRESS.md or docs/BACKLOG.md and you are
 *      not Lane D. Those are single-writer — everyone else writes a dated
 *      log under docs/log/, which cannot conflict.
 *
 *   node tools/shift/preflight.mjs --lane a
 *
 * Exits non-zero and explains itself on failure. Do not push past it.
 */

import { execSync } from "node:child_process";

const lane = (process.argv[process.argv.indexOf("--lane") + 1] || "").toLowerCase();
if (!"abcd".includes(lane) || lane.length !== 1) {
  fail("Pass your lane: node tools/shift/preflight.mjs --lane a");
}

function sh(cmd, allowFail = false) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (e) {
    if (allowFail) return null;
    fail(`Command failed: ${cmd}\n${e.stderr || e.message}`);
  }
}

function fail(msg) {
  console.error(`\n  PREFLIGHT FAILED\n\n  ${msg.replace(/\n/g, "\n  ")}\n`);
  process.exit(1);
}

/* ── who owns what ───────────────────────────────────────────────────── */

// Exclusive: only this lane may touch these.
const OWNED = {
  a: [/^tools\/(?!og\/|shift\/)/, /^a\//, /^assets\/js\/(app|store|lots)\.js$/, /^sitemap\.xml$/, /^vercel\.json$/, /^robots\.txt$/],
  b: [/^assets\/js\/(data|tracklist)\.js$/, /^docs\/issue-02\//],
  c: [/^assets\/css\//, /^404\.html$/, /^tools\/og\//],
  d: [/^docs\/research\//, /^tools\/shift\//],  // Lane D owns the process tooling
};

// Shared: any lane may touch, because a rebase merges them cleanly in practice.
const SHARED = [/^index\.html$/, /^store\.html$/, /^README\.md$/, /^\.gitattributes$/, /^\.gitignore$/];

// Single-writer: Lane D only. This is the rule whose absence blocked three PRs.
const SINGLE_WRITER = [/^PROGRESS\.md$/, /^docs\/BACKLOG\.md$/, /^CLAUDE\.md$/, /^docs\/LANES\.md$/];

// Everyone writes their own log. Unique filename, so it can never conflict.
const LOG = /^docs\/log\/\d{4}-\d{2}-\d{2}-lane-[abcd]\.md$/;
const AUDIT = /^docs\/audits\//;

/* ── 1. rebase onto the newest main ──────────────────────────────────── */

const branch = sh("git rev-parse --abbrev-ref HEAD");
if (branch === "main") fail("You are on main. Shifts work on a branch:\n  git checkout -b <lane>/<what-you-did>");

const dirty = sh("git status --porcelain");
if (dirty) fail(`Working tree is dirty. Commit your work first:\n\n${dirty}`);

sh("git fetch -q origin main");
const behind = Number(sh("git rev-list --count HEAD..origin/main"));
if (behind > 0) {
  console.log(`  Branch is ${behind} commit(s) behind origin/main. Rebasing…`);
  const ok = sh("git rebase origin/main", true);
  if (ok === null) {
    sh("git rebase --abort", true);
    fail(
      "Rebase hit a conflict, which means another shift changed the same lines.\n" +
      "Do NOT force it. Resolve deliberately:\n\n" +
      "  git rebase origin/main      # then fix the conflict, git add, git rebase --continue\n\n" +
      "If the conflict is in a generated file under a/, do not hand-edit it —\n" +
      "take origin/main's version and re-run the generator:\n" +
      "  git checkout --theirs a/ && node tools/artists/build.mjs && git add a/"
    );
  }
  console.log("  Rebased cleanly.");
} else {
  console.log("  Already up to date with origin/main.");
}

/* ── 2. check what this branch touched ───────────────────────────────── */

const files = sh("git diff --name-only origin/main...HEAD").split("\n").filter(Boolean);
if (!files.length) fail("This branch changes nothing against origin/main.");

const problems = [];
let wroteLog = false;

for (const f of files) {
  if (LOG.test(f)) {
    if (!f.endsWith(`-lane-${lane}.md`)) problems.push(`${f} — that is another lane's log`);
    else wroteLog = true;
    continue;
  }
  if (AUDIT.test(f) || SHARED.some((r) => r.test(f))) continue;

  if (SINGLE_WRITER.some((r) => r.test(f)) && lane !== "d") {
    problems.push(
      `${f} — single-writer, Lane D only.\n      Put what you wanted to say in your log instead; Lane D folds it in.`
    );
    continue;
  }
  if (SINGLE_WRITER.some((r) => r.test(f))) continue;

  const owner = Object.keys(OWNED).find((k) => OWNED[k].some((r) => r.test(f)));
  if (owner && owner !== lane) {
    problems.push(`${f} — owned by Lane ${owner.toUpperCase()}. File it in your log instead of fixing it.`);
  }
}

if (problems.length) {
  fail(
    `You are Lane ${lane.toUpperCase()} and touched files outside your lane:\n\n  - ` +
    problems.join("\n  - ") +
    "\n\n  Lanes exist so shifts never collide. See docs/LANES.md."
  );
}

if (!wroteLog && lane !== "d") {
  fail(
    `No shift log. Every shift writes exactly one:\n\n` +
    `  docs/log/${new Date().toISOString().slice(0, 10)}-lane-${lane}.md\n\n` +
    `  What you did, what you found, what you propose for the backlog,\n` +
    `  and anything the owner must decide. It is how Lane D learns what happened.`
  );
}

console.log(`  Lane ${lane.toUpperCase()}: ${files.length} file(s), all in your lane.`);
console.log("  Preflight passed — safe to push.\n");
