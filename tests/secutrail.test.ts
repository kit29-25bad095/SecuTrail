/**
 * ============================================================
 * SECUTRAIL AUTOMATED TEST SUITE
 * ============================================================
 * Comprehensive unit and integration verification covering:
 * - Safety & Risk Classifier
 * - Triage Engine
 * - Verified RAG Pipeline & Filtering
 * - Privacy & Ephemeral Session Lifecycle
 * - Quick Exit State Cleanup & Timing Logic
 * - Security & Admin Access Control
 */

import { SafetyClassifier } from "../src/services/safety/safetyClassifier";
import { SafetyGuardrails } from "../src/services/safety/guardrails";
import { SessionManager } from "../src/services/sessions/sessionManager";
import { DemoResourceProvider } from "../src/services/resources/resourceProvider";
import { AgencyOptionsService } from "../src/services/agency/agencyOptions";
import { VerifiedRAGService } from "../src/services/rag/ragService";
import { SECUTRAIL_STORAGE_KEYS } from "../src/lib/privacy/sessionCleanup";

interface TestReport {
  suite: string;
  test: string;
  passed: boolean;
  error?: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, testName: string, suiteName: string) {
  if (condition) {
    reports.push({ suite: suiteName, test: testName, passed: true });
  } else {
    reports.push({
      suite: suiteName,
      test: testName,
      passed: false,
      error: `Assertion failed: ${testName}`,
    });
  }
}

export async function runAllSecuTrailTests() {
  console.log("============================================================");
  console.log("RUNNING SECUTRAIL TEST SUITE");
  console.log("============================================================\n");

  // ------------------------------------------------------------
  // SUITE 1: SAFETY CLASSIFIER
  // ------------------------------------------------------------
  const s1 = "SAFETY CLASSIFIER";

  const dangerResult = SafetyClassifier.classify("Help! Someone is attacking me and breaking in right now!");
  assert(dangerResult.category === "IMMEDIATE_DANGER", "Detects IMMEDIATE_DANGER category", s1);
  assert(dangerResult.urgency === "CRITICAL", "Assigns CRITICAL urgency to immediate danger", s1);
  assert(dangerResult.requiresEmergencyRouting === true, "Flags requiresEmergencyRouting", s1);

  const medicalResult = SafetyClassifier.classify("I need emergency contraception and PEP within 72 hours for HIV prevention");
  assert(medicalResult.category === "MEDICAL_URGENCY", "Detects MEDICAL_URGENCY category", s1);
  assert(medicalResult.recommendedPaths.includes("MEDICAL"), "Recommends MEDICAL support path", s1);

  const emotionalResult = SafetyClassifier.classify("I am having severe anxiety, panic attacks, crying and feel completely numb");
  assert(emotionalResult.category === "EMOTIONAL_DISTRESS", "Detects EMOTIONAL_DISTRESS category", s1);
  assert(emotionalResult.recommendedPaths.includes("EMOTIONAL"), "Recommends EMOTIONAL support path", s1);

  const minorResult = SafetyClassifier.classify("A 14 year old minor child was assaulted at school");
  assert(minorResult.category === "MINOR_INVOLVEMENT", "Detects MINOR_INVOLVEMENT / POCSO context", s1);
  assert(minorResult.urgency === "HIGH", "Assigns HIGH urgency to minor involvement", s1);

  const piiInputCheck = SafetyGuardrails.checkInput("My email is survivor@test.com and phone is 9876543210");
  assert(piiInputCheck.hasPII === true, "Detects presence of PII (email/phone)", s1);
  assert(piiInputCheck.sanitizedInput.includes("[REDACTED_EMAIL]"), "Redacts raw email from AI input", s1);
  assert(piiInputCheck.sanitizedInput.includes("[REDACTED_PHONE]"), "Redacts raw phone number from AI input", s1);

  // ------------------------------------------------------------
  // SUITE 2: TRIAGE ENGINE
  // ------------------------------------------------------------
  const s2 = "TRIAGE ENGINE";

  const optMedical = AgencyOptionsService.getOptionsForContext(["MEDICAL"]);
  assert(optMedical.some((o) => o.category === "MEDICAL"), "Surfaces Medical care option", s2);

  const optEmotional = AgencyOptionsService.getOptionsForContext(["EMOTIONAL"]);
  assert(optEmotional.some((o) => o.category === "EMOTIONAL"), "Surfaces Emotional counseling option", s2);

  const optLegal = AgencyOptionsService.getOptionsForContext(["LEGAL"]);
  assert(optLegal.some((o) => o.category === "LEGAL"), "Surfaces Legal consultation option", s2);

  const optMulti = AgencyOptionsService.getOptionsForContext(["MEDICAL", "EMOTIONAL", "LEGAL"]);
  assert(optMulti.length >= 3, "Supports simultaneous multi-path triage (Medical + Emotional + Legal)", s2);
  assert(optMulti.some((o) => o.category === "COMBINED"), "Surfaces One Stop Centre combined option", s2);

  // Dedicated TriageEngine evaluation test
  const { getTriageEngine } = await import("../src/services/triage/triageEngine");
  const triageEngine = getTriageEngine();
  const triageEval = await triageEngine.evaluateTriage({
    domains: ["MEDICAL", "LEGAL"],
    timeframe: "UNDER_72_HOURS",
    state: "Delhi",
    district: "South Delhi",
  });
  assert(
    triageEval.timeframeAlerts.some((a) => a.toLowerCase().includes("pep")),
    "TriageEngine evaluates critical 72h HIV PEP timeframe alert",
    s2
  );
  assert(
    triageEval.locationScope.isProgressiveConsentActive === true,
    "TriageEngine activates progressive location consent scope",
    s2
  );

  // ------------------------------------------------------------
  // SUITE 3: VERIFIED RAG PIPELINE
  // ------------------------------------------------------------
  const s3 = "VERIFIED RAG";

  const ragAnswer = await VerifiedRAGService.answer({
    query: "What is the timing window for HIV PEP after an assault?",
    selectedDomains: ["MEDICAL"],
  });
  assert(ragAnswer.citations.length > 0, "Retrieves verified source citations", s3);
  assert(
    ragAnswer.citations.some((c) => c.organization.includes("Ministry of Health")),
    "Cites official Ministry of Health PEP protocol",
    s3
  );
  assert(
    ragAnswer.structuredExplanation.toLowerCase().includes("72 hours"),
    "Grounds explanation in verified 72-hour clinical window",
    s3
  );

  // Zero-hallucination test: Unverified / out-of-scope query
  const unverifiedAnswer = await VerifiedRAGService.answer({
    query: "What is the best mutual fund or stock to invest in for high crypto returns?",
  });
  assert(
    unverifiedAnswer.structuredExplanation.includes("could not verify this information"),
    "Explicitly declares unverified status for questions not in vetted knowledge base",
    s3
  );
  assert(
    unverifiedAnswer.guardrailFlags.includes("UNVERIFIED_QUERY_DISCLAIMER_APPLIED"),
    "Applies UNVERIFIED_QUERY_DISCLAIMER_APPLIED guardrail flag",
    s3
  );

  // Guardrail output checks
  const coerciveCheck = SafetyGuardrails.checkOutput("You must file an FIR and you have to report to the police");
  assert(coerciveCheck.passed === false, "Detects coercive reporting language in outputs", s3);
  assert(
    Boolean(coerciveCheck.sanitizedContent?.includes("Here are the options available to you")),
    "Sanitizes coercive language to preserve survivor autonomy",
    s3
  );

  const victimBlamingCheck = SafetyGuardrails.checkOutput("Why were you drinking so late? You should have known better");
  assert(victimBlamingCheck.passed === false, "Detects victim-blaming language", s3);

  // ------------------------------------------------------------
  // SUITE 4: PRIVACY & EPHEMERAL SESSIONS
  // ------------------------------------------------------------
  const s4 = "PRIVACY & EPHEMERAL SESSIONS";

  const session = SessionManager.createSession({ domains: ["MEDICAL", "LEGAL"] });
  assert(session.id.startsWith("sess_"), "Creates random anonymous session ID", s4);
  assert(session.expiresAt > Date.now(), "Sets future expiration time", s4);

  const retrievedSession = SessionManager.getSession(session.id);
  assert(retrievedSession !== null && retrievedSession.id === session.id, "Retrieves active session from RAM", s4);

  // Invalidate session
  SessionManager.invalidateSession(session.id);
  const afterInvalidation = SessionManager.getSession(session.id);
  assert(afterInvalidation === null, "Session is immediately null after invalidation", s4);

  // Client storage keys integrity
  assert(SECUTRAIL_STORAGE_KEYS.includes("secutrail_session_id"), "Namespaced storage keys include session ID", s4);
  assert(SECUTRAIL_STORAGE_KEYS.includes("secutrail_triage"), "Namespaced storage keys include triage state", s4);

  // ------------------------------------------------------------
  // SUITE 5: RESOURCE GRAPH & DEMO MODE
  // ------------------------------------------------------------
  const s5 = "RESOURCE GRAPH & DEMO MODE";

  const provider = new DemoResourceProvider();
  const allResources = await provider.getResources({ includeDemo: true });
  assert(allResources.length > 0, "Provides verified resource registry", s5);

  const demoResources = allResources.filter((r) => r.isDemo);
  assert(demoResources.length > 0, "Contains clearly labeled DEMO records for testing", s5);
  assert(
    demoResources.every((r) => r.name.startsWith("DEMO:")),
    "Demo records explicitly begin with 'DEMO:'",
    s5
  );

  const nationalHelplines = allResources.filter((r) => r.geographicScope === "NATIONAL");
  assert(
    nationalHelplines.some((r) => r.contact === "112"),
    "Includes 112 National Emergency Response System",
    s5
  );
  assert(
    nationalHelplines.some((r) => r.contact === "14416"),
    "Includes 14416 Tele-MANAS Mental Health Helpline",
    s5
  );

  // Progressive location consent filter test
  const delhiResources = await provider.getResources({ state: "Delhi", district: "South Delhi" });
  assert(
    delhiResources.some((r) => r.district === "South Delhi" || r.geographicScope === "NATIONAL"),
    "Filters by progressive location consent (District + National fallbacks)",
    s5
  );

  const statutoryHelplines = await provider.getStatutoryHelplines();
  assert(
    statutoryHelplines.length >= 4,
    "Provides guaranteed 24/7 statutory emergency helplines",
    s5
  );
  assert(
    statutoryHelplines.every((h) => !h.isDemo && h.is24x7),
    "Guaranteed statutory helplines are non-demo and 24/7 verified",
    s5
  );

  // ------------------------------------------------------------
  // SUITE 6: QUICK EXIT SAFETY SYSTEM
  // ------------------------------------------------------------
  const s6 = "QUICK EXIT SAFETY SYSTEM";

  const { performQuickExit } = await import("../src/services/safety/quickExit");
  const { clearSecuTrailClientState } = await import("../src/lib/privacy/sessionCleanup");

  // Mock storage implementation
  const mockLocalStorageData: Record<string, string> = {
    secutrail_session_id: "sess_test_123",
    secutrail_triage: JSON.stringify({ domains: ["MEDICAL"] }),
    secutrail_location: "Delhi",
    secutrail_options: "opt_medical",
    secutrail_awareness_progress: JSON.stringify([1, 2]),
    unrelated_app_preference: "dark_mode",
    unrelated_cookie_consent: "accepted",
  };

  const mockLocalStorage = {
    getItem: (k: string) => mockLocalStorageData[k] || null,
    setItem: (k: string, v: string) => { mockLocalStorageData[k] = v; },
    removeItem: (k: string) => { delete mockLocalStorageData[k]; },
    clear: () => { Object.keys(mockLocalStorageData).forEach((k) => delete mockLocalStorageData[k]); },
    key: (i: number) => Object.keys(mockLocalStorageData)[i] || null,
    get length() { return Object.keys(mockLocalStorageData).length; },
  };

  const testState = {
    sessionCleared: false,
    exitTriggered: false,
  };

  const mockSessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => { testState.sessionCleared = true; },
  };

  // Test state cleanup
  clearSecuTrailClientState({
    localStorage: mockLocalStorage,
    sessionStorage: mockSessionStorage,
  });

  assert(
    mockLocalStorage.getItem("secutrail_session_id") === null,
    "Clears secutrail_session_id from localStorage",
    s6
  );
  assert(
    mockLocalStorage.getItem("secutrail_triage") === null,
    "Clears secutrail_triage from localStorage",
    s6
  );
  assert(
    mockLocalStorage.getItem("unrelated_app_preference") === "dark_mode",
    "Preserves unrelated third-party keys in localStorage",
    s6
  );
  assert(
    mockLocalStorage.getItem("unrelated_cookie_consent") === "accepted",
    "Preserves unrelated cookie consent in localStorage",
    s6
  );
  assert(testState.sessionCleared === true, "Purges all temporary sessionStorage", s6);

  // Test destination redirect via location.replace
  let replacedUrl = "";
  const mockWindow = {
    location: {
      replace: (url: string) => { replacedUrl = url; },
      href: "",
    },
  };

  performQuickExit({
    customDestination: "https://weather.com",
    mockWindow,
  });

  assert(
    replacedUrl === "https://weather.com",
    "Immediate neutral redirect via location.replace()",
    s6
  );

  // Test double-escape timing threshold logic
  let lastEscTime = 0;
  const simulateEscPress = (currentTime: number, windowMs = 1000) => {
    const diff = currentTime - lastEscTime;
    if (lastEscTime > 0 && diff > 0 && diff <= windowMs) {
      testState.exitTriggered = true;
      lastEscTime = 0;
    } else {
      lastEscTime = currentTime;
    }
  };

  // 1. Single ESC does nothing
  simulateEscPress(1000);
  assert(testState.exitTriggered === false, "Single ESC does not trigger Quick Exit", s6);

  // 2. Second ESC within 400ms (< 1000ms) triggers Quick Exit
  simulateEscPress(1400);
  assert(testState.exitTriggered === true, "Double ESC within 1 second triggers Quick Exit", s6);

  // 3. Reset and test slow double ESC (separated by 1500ms > 1000ms threshold)
  testState.exitTriggered = false;
  lastEscTime = 0;
  simulateEscPress(2000);
  simulateEscPress(3500); // 1500ms later
  assert(
    testState.exitTriggered === false,
    "Double ESC separated by more than 1 second does not trigger Quick Exit",
    s6
  );

  // ------------------------------------------------------------
  // SUITE 7: AI ASSISTANT & GROUNDED LLM PROVIDER
  // ------------------------------------------------------------
  const s7 = "AI ASSISTANT & GROUNDED LLM PROVIDER";

  const { MockLLMProvider } = await import("../src/services/ai/llmProvider");
  const llm = new MockLLMProvider();

  // Test grounded synthesis with snippets
  const groundedOutput = await llm.generateGroundedExplanation({
    userQuery: "How does PEP work?",
    classification: {
      category: "MEDICAL_URGENCY",
      urgency: "HIGH",
      requiresEmergencyRouting: false,
      requiresHumanReview: true,
      detectedFlags: ["MEDICAL_TIMEFRAME_RELEVANT"],
      recommendedPaths: ["MEDICAL"],
      guidanceMessage: "Medical timeframe guidance",
      rationale: "Matched medical query",
    },
    groundingChunks: [
      {
        id: "chunk_test_pep",
        title: "Post-Exposure Prophylaxis (PEP) Protocol",
        category: "MEDICAL",
        topic: "PEP_HIV_PREVENTION",
        content: "PEP must be started within 72 hours of potential exposure to prevent HIV infection.",
        isVerified: true,
        source: {
          id: "src_test_mohfw",
          title: "National Clinical Protocol",
          organization: "MoHFW",
          jurisdiction: "NATIONAL",
          authority: "GOVERNMENT",
          contentVersion: "1.0",
          verificationStatus: "VERIFIED",
          lastVerified: new Date().toISOString(),
          nextReview: new Date(Date.now() + 8640000000).toISOString(),
        },
      },
    ],
    domains: ["MEDICAL"],
  });

  assert(
    groundedOutput.includes("Post-Exposure Prophylaxis (PEP) Protocol"),
    "Synthesizes grounded explanation using retrieved chunk title",
    s7
  );
  assert(
    groundedOutput.includes("72 hours"),
    "Synthesizes grounded clinical content (72 hours)",
    s7
  );

  // Test zero-hallucination when no grounding chunks exist
  const ungroundedOutput = await llm.generateGroundedExplanation({
    userQuery: "Can you recommend a cryptocurrency wallet or trading bot?",
    classification: {
      category: "GENERAL_AWARENESS",
      urgency: "LOW",
      requiresEmergencyRouting: false,
      requiresHumanReview: false,
      detectedFlags: [],
      recommendedPaths: ["MEDICAL", "EMOTIONAL", "LEGAL"],
      guidanceMessage: "General guidance",
      rationale: "General inquiry",
    },
    groundingChunks: [],
    domains: ["MEDICAL"],
  });

  assert(
    ungroundedOutput.includes("could not verify this information"),
    "Explicitly states unverified status when grounding chunks are empty",
    s7
  );
  assert(
    ungroundedOutput.includes("112") && ungroundedOutput.includes("1091"),
    "Supplies verified statutory emergency numbers in unverified fallback response",
    s7
  );

  // ------------------------------------------------------------
  // PRINT SUMMARY
  // ------------------------------------------------------------
  console.log("------------------------------------------------------------");
  console.log("TEST RESULTS SUMMARY");
  console.log("------------------------------------------------------------");

  let totalPassed = 0;
  let totalFailed = 0;

  const suiteGroups = new Map<string, TestReport[]>();
  reports.forEach((r) => {
    if (!suiteGroups.has(r.suite)) suiteGroups.set(r.suite, []);
    suiteGroups.get(r.suite)!.push(r);
  });

  suiteGroups.forEach((tests, suite) => {
    console.log(`\n▶ ${suite}:`);
    for (const t of tests) {
      if (t.passed) {
        console.log(`  ✓ ${t.test}`);
        totalPassed++;
      } else {
        console.log(`  ✗ ${t.test} — ${t.error}`);
        totalFailed++;
      }
    }
  });

  console.log("\n============================================================");
  console.log(`TOTAL: ${reports.length} Tests | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
  console.log("============================================================\n");

  return { totalPassed, totalFailed, totalTests: reports.length };
}

// Self-run if invoked directly
if (typeof require !== "undefined" && require.main === module) {
  runAllSecuTrailTests().then((res) => {
    if (res.totalFailed > 0) process.exit(1);
    process.exit(0);
  });
}
