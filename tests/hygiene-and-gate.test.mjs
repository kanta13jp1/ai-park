import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = process.cwd();

function walkFiles(dir, predicate) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full, predicate));
    } else if (predicate(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

test("Source tree and public data contain no local user paths, private keys, or live API secrets", () => {
  const targets = [
    ...walkFiles(path.join(rootDir, "src"), (n) => /\.(ts|tsx|mjs|js)$/.test(n)),
    ...walkFiles(path.join(rootDir, "public", "data"), (n) => n.endsWith(".json")),
  ];

  const windowsUserPath = /[A-Za-z]:\\Users\\[A-Za-z0-9._-]+\\/;
  const unixUserPath = /\/Users\/[A-Za-z0-9._-]+\//;
  const googleApiKey = /AIza[0-9A-Za-z_-]{30,}/;
  const githubPat = /ghp_[0-9A-Za-z]{20,}/;
  const privateKeyBlock = /-----BEGIN [A-Z ]*PRIVATE KEY-----/;

  const leaks = [];
  for (const file of targets) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(rootDir, file).replace(/\\/g, "/");
    if (windowsUserPath.test(content) || unixUserPath.test(content)) {
      leaks.push(`${rel}: local filesystem path`);
    }
    if (googleApiKey.test(content) || githubPat.test(content) || privateKeyBlock.test(content)) {
      leaks.push(`${rel}: secret/token pattern`);
    }
  }

  assert.deepEqual(leaks, [], `Hygiene leak detected:\n${leaks.join("\n")}`);
});

test("Deployment quality gate (verify-deployment-gate.mjs) passes cleanly", () => {
  const stdout = execFileSync(process.execPath, ["scripts/verify-deployment-gate.mjs"], {
    cwd: rootDir,
    encoding: "utf8",
  });
  assert.match(stdout, /品質ゲート通過/);
});
