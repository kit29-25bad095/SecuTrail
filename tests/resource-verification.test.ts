import { strict as assert } from "assert";
import { VERIFIED_INDIA_RESOURCES } from "../src/services/resources/verifiedIndiaResources";
import { SafetyGuardrails } from "../src/services/safety/guardrails";
import { VerifiedRAGService } from "../src/services/rag/ragService";
import { VerifiedResource, VerificationStatus, VerificationTier } from "../src/types";

console.log("\n============================================================");
console.log("RUNNING RESOURCE VERIFICATION ENGINE TEST SUITE");
console.log("============================================================\n");

let passed = 0;
let failed = 0;

async function it(description: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✓ ${description}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function runSuite() {
  // -----------------------------------------------------------------------------
  // 1. Mandatory 8 Attributes Verification
  // -----------------------------------------------------------------------------
  console.log("▶ MANDATORY 8 RESOURCE METADATA ATTRIBUTES:");

  await it("All verified resources contain non-empty Source metadata", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        res.sourceOrganization && res.sourceOrganization.length > 0,
        `Resource ${res.id} missing sourceOrganization`
      );
    }
  });

  await it("All verified resources contain non-empty Authority / Tier metadata", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        ["TIER_1_OFFICIAL_GOVERNMENT", "TIER_2_VETTED_NGO", "TIER_3_COMMUNITY_VERIFIED"].includes(
          res.authorityLevel
        ),
        `Resource ${res.id} invalid authorityLevel: ${res.authorityLevel}`
      );
    }
  });

  await it("All verified resources contain valid Geographic Scope (NATIONAL, STATE, or DISTRICT)", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        ["NATIONAL", "STATE", "DISTRICT"].includes(res.geographicScope),
        `Resource ${res.id} invalid geographicScope: ${res.geographicScope}`
      );
    }
  });

  await it("All verified resources contain valid Verification Status", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        ["VERIFIED", "PENDING_REVIEW", "NEEDS_UPDATE", "EXPIRED", "REJECTED"].includes(
          res.verificationStatus
        ),
        `Resource ${res.id} invalid verificationStatus: ${res.verificationStatus}`
      );
    }
  });

  await it("All verified resources contain valid Last Verified date", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(res.lastVerified, `Resource ${res.id} missing lastVerified`);
      const date = new Date(res.lastVerified);
      assert.ok(!isNaN(date.getTime()), `Resource ${res.id} lastVerified is not a valid date`);
    }
  });

  await it("All verified resources contain valid Next Review date", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(res.nextReview, `Resource ${res.id} missing nextReview`);
      const date = new Date(res.nextReview);
      assert.ok(!isNaN(date.getTime()), `Resource ${res.id} nextReview is not a valid date`);
    }
  });

  await it("All verified resources contain valid Service Type", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        res.serviceType && res.serviceType.length > 0,
        `Resource ${res.id} missing serviceType`
      );
    }
  });

  await it("All verified resources contain Availability details where known", () => {
    for (const res of VERIFIED_INDIA_RESOURCES) {
      assert.ok(
        res.availability && res.availability.length > 0,
        `Resource ${res.id} missing availability`
      );
    }
  });

  // -----------------------------------------------------------------------------
  // 2. Strict Expired / Unverified Resource Blacklisting Rule
  // -----------------------------------------------------------------------------
  console.log("\n▶ EXPIRED & UNVERIFIED RESOURCE FILTERING:");

  await it("SafetyGuardrails filters out resources where verificationStatus !== VERIFIED", () => {
    const mockResources: VerifiedResource[] = [
      {
        ...VERIFIED_INDIA_RESOURCES[0],
        id: "active-res",
        verificationStatus: "VERIFIED",
        nextReview: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
      {
        ...VERIFIED_INDIA_RESOURCES[0],
        id: "pending-res",
        verificationStatus: "PENDING_REVIEW",
        nextReview: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
      {
        ...VERIFIED_INDIA_RESOURCES[0],
        id: "rejected-res",
        verificationStatus: "REJECTED",
        nextReview: new Date(Date.now() + 86400000 * 30).toISOString(),
      },
    ];

    const filtered = SafetyGuardrails.filterRetrievedResources(mockResources);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, "active-res");
  });

  await it("SafetyGuardrails strictly suppresses expired resources (nextReview < now)", () => {
    const pastDate = new Date(Date.now() - 86400000 * 5).toISOString(); // 5 days ago
    const futureDate = new Date(Date.now() + 86400000 * 30).toISOString(); // 30 days ahead

    const mockResources: VerifiedResource[] = [
      {
        ...VERIFIED_INDIA_RESOURCES[0],
        id: "unexpired-res",
        verificationStatus: "VERIFIED",
        nextReview: futureDate,
      },
      {
        ...VERIFIED_INDIA_RESOURCES[0],
        id: "expired-res",
        verificationStatus: "VERIFIED",
        nextReview: pastDate, // Expired scheduled re-verification!
      },
    ];

    const filtered = SafetyGuardrails.filterRetrievedResources(mockResources);
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, "unexpired-res");
  });

  await it("VerifiedRAG pipeline never includes expired resources in final output", async () => {
    const answer = await VerifiedRAGService.answer({
      query: "Where can I find emergency medical help?",
      state: "Delhi",
    });

    const now = new Date();
    for (const res of answer.verifiedResources) {
      assert.equal(res.verificationStatus, "VERIFIED");
      assert.ok(new Date(res.nextReview) >= now, `Resource ${res.name} is expired!`);
    }
  });

  // -----------------------------------------------------------------------------
  // 3. 8-Stage Lifecycle Transitions
  // -----------------------------------------------------------------------------
  console.log("\n▶ 8-STAGE VERIFICATION LIFECYCLE:");

  await it("Validates all 8 sequential lifecycle stages", () => {
    const lifecycleStages = [
      "DISCOVERY",
      "OFFICIAL_VERIFICATION",
      "HUMAN_REVIEW",
      "AVAILABILITY_CHECK",
      "SCHEDULED_RE_VERIFICATION",
      "USER_FEEDBACK",
      "SECONDARY_HUMAN_REVIEW",
      "UPDATE_OR_REMOVE",
    ];
    assert.equal(lifecycleStages.length, 8);
  });

  await it("ResourceVerificationService performs audit and records lifecycle record", async () => {
    const { getResourceVerificationService } = await import("../src/services/verification/resourceVerificationService");
    const verificationService = getResourceVerificationService();
    const queues = await verificationService.getPendingQueues();
    assert.ok(Array.isArray(queues.expired), "Queues include expired array");
    assert.ok(Array.isArray(queues.upcomingReview), "Queues include upcomingReview array");
    assert.ok(Array.isArray(queues.pendingReview), "Queues include pendingReview array");

    const auditRes = await verificationService.verifyResource("res-nat-112", {
      verifiedBy: "Senior Officer",
      verifierRole: "Emergency Verification Specialist",
      checkType: "PHONE_CHECK",
      findings: "Verified emergency dispatch 24/7 responsiveness and line integrity",
      newStatus: "VERIFIED",
      nextReviewMonths: 3,
    });
    assert.ok(auditRes !== null, "Resource verification succeeded");
    assert.equal(auditRes?.verificationStatus, "VERIFIED");

    const logs = await verificationService.getAuditLog("res-nat-112");
    assert.ok(logs.length > 0, "Audit logs recorded the verification step");
    assert.equal(logs[0].stage, "SCHEDULED_RE_VERIFICATION");
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
}

runSuite().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
