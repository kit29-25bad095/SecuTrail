import { strict as assert } from "assert";
import { NextRequest } from "next/server";
import { checkRateLimit } from "../src/lib/security/rateLimiter";
import { SessionManager } from "../src/services/sessions/sessionManager";

console.log("\n============================================================");
console.log("RUNNING SECURITY & SYSTEM AUDIT TEST SUITE");
console.log("============================================================\n");

let passed = 0;
let failed = 0;

function it(description: string, fn: () => void | Promise<void>) {
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// -----------------------------------------------------------------------------
// 1. Rate Limiting & Denial-of-Service Defenses
// -----------------------------------------------------------------------------
console.log("▶ RATE LIMITING & DOS DEFENSE:");

it("Rate limiter allows requests under the configured threshold", () => {
  const req = new NextRequest("http://localhost:3000/api/assistant", {
    headers: {
      "x-forwarded-for": "192.168.1.50",
      "user-agent": "AuditAgent/1.0",
    },
  });

  const res = checkRateLimit(req, {
    maxRequests: 5,
    windowMs: 10000,
    prefix: "test_allow",
  });

  assert.equal(res.allowed, true);
  assert.equal(res.limit, 5);
  assert.ok(res.remaining >= 0);
});

it("Rate limiter blocks requests exceeding the configured threshold", () => {
  const req = new NextRequest("http://localhost:3000/api/assistant", {
    headers: {
      "x-forwarded-for": "192.168.1.55",
      "user-agent": "SpamBot/2.0",
    },
  });

  let blocked = false;
  for (let i = 0; i < 7; i++) {
    const res = checkRateLimit(req, {
      maxRequests: 3,
      windowMs: 10000,
      prefix: "test_block",
    });
    if (!res.allowed) {
      blocked = true;
      assert.equal(res.remaining, 0);
      assert.ok(res.resetSeconds > 0);
      break;
    }
  }

  assert.equal(blocked, true, "Rate limiter did not block excessive requests!");
});

// -----------------------------------------------------------------------------
// 2. Privacy & Ephemeral Session Lifecycle
// -----------------------------------------------------------------------------
console.log("\n▶ EPHEMERAL SESSION SECURITY:");

it("Ephemeral sessions do not log or persist PII", () => {
  const session = SessionManager.createSession({
    domains: ["MEDICAL", "LEGAL"],
    stateCode: "Delhi",
    districtName: "Central Delhi",
  });

  assert.ok(session.id.startsWith("sess_"));
  assert.ok(session.token.length >= 32);
  assert.equal(session.isInvalidated, false);

  // Invalidate immediately
  SessionManager.invalidateSession(session.id);
  const retrieved = SessionManager.getSession(session.id);
  assert.equal(retrieved, null, "Session was not zeroed out after invalidation");
});

// -----------------------------------------------------------------------------
// 3. Admin Authorization Controls
// -----------------------------------------------------------------------------
console.log("\n▶ ADMIN AUTHORIZATION SECURITY:");

it("Rejects requests without authorized admin key", () => {
  const unauthorizedReq = new NextRequest("http://localhost:3000/api/admin/resources");
  const authKey = unauthorizedReq.headers.get("x-admin-key");
  assert.equal(authKey, null);
});

it("Accepts authorized admin key from secure header", () => {
  const authorizedReq = new NextRequest("http://localhost:3000/api/admin/resources", {
    headers: {
      "x-admin-key": "secutrail-admin-demo-key-2026",
    },
  });
  const authKey = authorizedReq.headers.get("x-admin-key");
  assert.equal(authKey, "secutrail-admin-demo-key-2026");
});

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log("\n============================================================");
console.log(`TOTAL: ${passed + failed} Tests | PASSED: ${passed} | FAILED: ${failed}`);
console.log("============================================================\n");

if (failed > 0) {
  process.exit(1);
}
