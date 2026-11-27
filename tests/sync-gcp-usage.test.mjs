import assert from "node:assert/strict";
import test from "node:test";
import {
  applySyncFailure,
  maskEmail,
  mergeLoggingEntries,
  sanitizeForPublish,
} from "../scripts/sync-gcp-usage.mjs";

test("maskEmail preserves distinct prefixes and avoids collisions for same initial", () => {
  const m1 = maskEmail("a-user@example.com");
  const m2 = maskEmail("admin-user@example.com");
  const m3 = maskEmail("b-member@example.com");

  assert.equal(m1, "a-***@example.com");
  assert.equal(m2, "ad***@example.com");
  assert.equal(m3, "b-***@example.com");
  assert.notEqual(m1, m2);
});

test("mergeLoggingEntries adds newly observed corporate users and updates summary", () => {
  const initialUsers = [
    {
      id: "U-01",
      name: "利用者A",
      email: "a-***@example.com",
      department: "社内",
      role: "Agent Platform ユーザー",
      requestCount: 10,
      totalTokens: 45000,
      costUsd: 0.24,
      costJpy: 36,
      lastActive: "2026/10/03 11:45",
      status: "active",
      primaryModel: "Vertex AI",
    },
  ];

  const entries = [
    {
      timestamp: "2026-11-27T08:05:00Z",
      protoPayload: { authenticationInfo: { principalEmail: "b-member@example.com" } },
    },
    {
      timestamp: "2026-11-27T08:10:00Z",
      protoPayload: { authenticationInfo: { principalEmail: "b-member@example.com" } },
    },
  ];

  const merged = mergeLoggingEntries(initialUsers, entries);
  assert.equal(merged.users.length, 2);
  assert.equal(merged.users[1].email, "b-***@example.com");
  assert.equal(merged.users[1].requestCount, 2);
  assert.equal(merged.summary.totalUsers, 2);
  assert.equal(merged.summary.activeUsers, 2);
  assert.equal(merged.summary.totalRequests, 12);
});

test("applySyncFailure preserves verified syncedAt and records audit check error", () => {
  const sample = {
    syncedAt: "2026-11-27 21:38",
    syncMode: "snapshot_verified",
    syncDetails: { authVerified: true },
  };
  applySyncFailure(sample, "2026-11-28 09:00", "invalid_rapt", false);

  assert.equal(sample.syncedAt, "2026-11-27 21:38");
  assert.equal(sample.syncMode, "snapshot_verified");
  assert.equal(sample.syncDetails.authVerified, false);
  assert.equal(sample.syncDetails.lastAuditCheck, "2026-11-28 09:00");
  assert.equal(sample.syncDetails.lastSyncError, "invalid_rapt");
});

test("sanitizeForPublish masks project IDs, billing IDs, and emails", () => {
  const payload = sanitizeForPublish({
    gcpInfo: {
      projectId: "real-project-123",
      billingAccountId: "012EB1-REAL-ID",
      orgId: "999999999999",
    },
    users: [{ name: "Real Name", email: "b-member@example.com" }],
  });

  assert.equal(payload.gcpInfo.projectId, "antigravity-pj-xxxxxx");
  assert.equal(payload.gcpInfo.billingAccountId, "012EB1-xxxxxx-xxxxxx");
  assert.equal(payload.gcpInfo.orgId, "xxxxxxxxxxxx");
  assert.equal(payload.users[0].name, "利用者A");
  assert.equal(payload.users[0].email, "b-***@example.com");
});
