import assert from "node:assert/strict";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function runProductionDeploymentVerification() {
  console.log("============================================================");
  console.log("SECUTRAIL PRODUCTION DEPLOYMENT VERIFICATION SUITE");
  console.log(`Target URL: ${BASE_URL}`);
  console.log("============================================================\n");

  let passed = 0;
  let failed = 0;

  async function check(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ [FAIL] ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. SMOKE TESTS
  console.log("▶ 1. PRODUCTION SMOKE TESTS (CORE ROUTES):");
  const smokeRoutes = [
    "/",
    "/awareness",
    "/awareness/consent",
    "/awareness/boundaries",
    "/awareness/bystander-support",
    "/awareness/digital-safety",
    "/awareness/get-help",
    "/survivor",
    "/survivor/safety",
    "/survivor/triage",
    "/survivor/options",
    "/survivor/action",
    "/survivor/assistant",
    "/survivor/resources",
    "/privacy",
    "/resources",
    "/api/health"
  ];

  for (const r of smokeRoutes) {
    await check(`Route ${r} returns HTTP 200 OK`, async () => {
      const res = await fetch(`${BASE_URL}${r}`);
      assert.equal(res.status, 200, `Expected 200 but got ${res.status}`);
    });
  }

  // 2. SURVIVOR FLOW TEST (Full Service Pipeline)
  console.log("\n▶ 2. CONTROLLED SURVIVOR SCENARIO TEST:");
  await check("Full Survivor Pipeline: Input -> Safety -> Triage -> RAG -> Options", async () => {
    // Step A: Session Creation
    const sessRes = await fetch(`${BASE_URL}/api/session`, { method: "POST" });
    assert.equal(sessRes.status, 200);
    const session = await sessRes.json();
    assert.ok(session.sessionId.startsWith("sess_"));

    // Step B: Classification
    const classRes = await fetch(`${BASE_URL}/api/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "I want to understand what support options are available to me.",
        input: "I want to understand what support options are available to me.",
        sessionId: session.sessionId,
      }),
    });
    const classData = await classRes.json();
    const classification = classData.classification;
    assert.ok(classification.category);
    assert.equal(classification.requiresEmergencyRouting, false);

    // Step C: Triage evaluation
    const triageRes = await fetch(`${BASE_URL}/api/triage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domains: ["MEDICAL", "EMOTIONAL", "LEGAL"],
        timeframe: "WITHIN_72_HOURS",
        locationConsent: "STATE_ONLY",
      }),
    });
    assert.equal(triageRes.status, 200);
    const triage = await triageRes.json();
    assert.ok(triage.options.length >= 3);
    assert.ok(triage.triage.timeframeAlerts.length > 0); // 72-hour PEP alert

    // Step D: Verified RAG query
    const ragRes = await fetch(`${BASE_URL}/api/assistant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "What is the 72 hour medical window for PEP?",
        sessionId: session.sessionId,
      }),
    });
    assert.equal(ragRes.status, 200);
    const rag = await ragRes.json();
    assert.ok(rag.structuredExplanation);
    assert.ok(rag.citations.length > 0);
  });

  // 3. QUICK EXIT PRODUCTION VERIFICATION
  console.log("\n▶ 3. QUICK EXIT PRODUCTION VERIFICATION:");
  await check("Health endpoint confirms Quick Exit points to https://www.google.com", async () => {
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    assert.equal(health.services.quickExit.destination, "https://www.google.com");
  });

  await check("Session Exit endpoint invalidates session without blocking", async () => {
    const exitRes = await fetch(`${BASE_URL}/api/session/exit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: "sess_test_123" }),
    });
    assert.equal(exitRes.status, 200);
    const exitData = await exitRes.json();
    assert.equal(exitData.success, true);
  });

  // 4. PRIVACY & SECURITY TEST
  console.log("\n▶ 4. PRIVACY & SECURITY CHECKS:");
  await check("API responses contain hardened security headers", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.equal(res.headers.get("x-frame-options"), "DENY");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.ok(res.headers.get("strict-transport-security"));
  });

  await check("No sensitive data in client error responses", async () => {
    const res = await fetch(`${BASE_URL}/api/classify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "" }), // empty input
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(!data.stack); // No stack trace exposed
  });

  await check("Invalid route returns safe 404", async () => {
    const res = await fetch(`${BASE_URL}/nonexistent-route-testing-404`);
    assert.equal(res.status, 404);
  });

  console.log("\n============================================================");
  console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionDeploymentVerification();
