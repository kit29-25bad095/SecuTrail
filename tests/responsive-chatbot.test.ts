import { strict as assert } from "assert";
import { AdaptiveChatEngine } from "../src/services/ai/adaptiveChatEngine";
import { SessionManager } from "../src/services/sessions/sessionManager";

console.log("\n============================================================");
console.log("RUNNING RESPONSIVE CHATBOT & MEMORY RETRIEVAL TEST SUITE");
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

async function runResponsiveTests() {
  const session = SessionManager.createSession();

  // Test A: Evidence Preservation
  await it("Provides specific responsive answer for forensic evidence preservation", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "How should I preserve evidence? Can I shower or change clothes?",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "FORENSIC_EVIDENCE_PRESERVATION");
    assert.ok(res.response.includes("paper bag"), "Must mention paper bag for clothing");
    assert.ok(res.response.toLowerCase().includes("bathe") || res.response.toLowerCase().includes("shower"), "Must advise on bathing/showering");
    assert.ok(res.response.includes("72") || res.response.includes("96"), "Must mention timeframe");
    assert.ok(res.citations.some(c => c.organization.includes("Ministry of Health")), "Must cite MoHFW");
  });

  // Test B: Police refusal recourse
  await it("Provides specific responsive answer when police refuse to file an FIR", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "What can I do if the police refuse to register my FIR?",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "POLICE_REFUSAL_RECOURSE");
    assert.ok(res.response.includes("Section 199 BNS"), "Must cite Section 199 BNS penalty on police");
    assert.ok(res.response.includes("Section 173(4) BNSS"), "Must mention escalation to Superintendent of Police");
    assert.ok(res.citations.some(c => c.title.includes("Bharatiya Nyaya Sanhita")), "Must cite BNS/BNSS");
  });

  // Test C: POSH Workplace Harassment
  await it("Provides specific responsive answer for workplace POSH harassment", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "My manager is harassing me at work. What are my rights under POSH?",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "POSH_WORKPLACE_HARASSMENT");
    assert.ok(res.response.includes("Internal Complaints Committee") || res.response.includes("ICC"), "Must mention ICC");
    assert.ok(res.response.includes("3 months"), "Must mention 3-month filing timeline");
    assert.ok(res.response.includes("Section 16"), "Must mention confidentiality");
    assert.ok(res.citations.some(c => c.title.includes("Workplace")), "Must cite POSH Act");
  });

  // Test D: Guilt & Self-Blame
  await it("Directly validates and deconstructs guilt and self-blame with clinical trauma science", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "I feel so guilty and I keep thinking this is all my fault.",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "TRAUMA_SELF_BLAME_VALIDATION");
    assert.ok(res.response.toLowerCase().includes("not your fault"), "Must state it was not user's fault");
    assert.ok(res.response.toLowerCase().includes("perpetrator"), "Must attribute 100% responsibility to perpetrator");
    assert.ok(res.response.toLowerCase().includes("freeze") || res.response.toLowerCase().includes("tonic immobility"), "Must explain involuntary freeze reflex");
    assert.ok(res.citations.some(c => c.organization.includes("World Health Organization")), "Must cite WHO protocols");
  });

  // Test E: Insomnia & Panic
  await it("Provides specific somatic grounding and Tele-MANAS support for acute panic / insomnia", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "I can't sleep, my heart is pounding and I'm having panic attacks.",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "INSOMNIA_PANIC_STABILIZATION");
    assert.ok(res.response.includes("4-7-8") || res.response.includes("Breathing"), "Must provide breathing technique");
    assert.ok(res.response.includes("Tele-MANAS") && res.response.includes("14416"), "Must provide Tele-MANAS 14416");
  });

  // Test F: Victim Compensation
  await it("Explains NALSA victim compensation and interim relief", async () => {
    const res = await AdaptiveChatEngine.processTurn({
      message: "Can I receive victim financial compensation from the government?",
      sessionId: session.id,
    });

    assert.equal(res.context.conversationTopic, "NALSA_VICTIM_COMPENSATION");
    assert.ok(res.response.includes("4,00,000") || res.response.includes("NALSA"), "Must mention NALSA scheme");
    assert.ok(res.response.includes("DLSA"), "Must mention DLSA");
    assert.ok(res.citations.some(c => c.title.includes("NALSA")), "Must cite NALSA guidelines");
  });

  // Test G: Answers are distinct (not identical across different questions)
  await it("Ensures replies are distinct and responsive, not giving the same reply for different questions", async () => {
    const res1 = await AdaptiveChatEngine.processTurn({ message: "What is PEP?", sessionId: session.id });
    const res2 = await AdaptiveChatEngine.processTurn({ message: "What is Zero FIR?", sessionId: session.id });
    const res3 = await AdaptiveChatEngine.processTurn({ message: "What is consent?", sessionId: session.id });

    assert.notEqual(res1.response, res2.response, "PEP and Zero-FIR responses must be completely distinct");
    assert.notEqual(res2.response, res3.response, "Zero-FIR and Consent responses must be completely distinct");
    assert.notEqual(res1.response, res3.response, "PEP and Consent responses must be completely distinct");
  });

  console.log("\n============================================================");
  console.log(`TOTAL: ${passed + failed} Tests | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runResponsiveTests();
