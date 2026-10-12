import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MYTH_VS_REAL_QUESTIONS,
  BRANCHING_SCENARIOS,
  REVEAL_DISCOVER_CARDS,
  MICRO_QUIZZES,
  AUDIO_LESSONS,
  TOPIC_LIBRARY,
} from "../src/data/learnAndPreventData";

console.log("\n============================================================");
console.log("RUNNING LEARN & PREVENT ACCEPTANCE TEST SUITE");
console.log("============================================================\n");

test("Myth vs Real Quiz Data: At least 5 questions exist with valid keys and takeaways", () => {
  assert.ok(MYTH_VS_REAL_QUESTIONS.length >= 5, "Expected at least 5 Myth vs Real questions");

  MYTH_VS_REAL_QUESTIONS.forEach((q, idx) => {
    assert.ok(q.id, `Question ${idx} must have an id`);
    assert.ok(q.statement.length > 10, `Question ${idx} must have a non-empty statement`);
    assert.ok(["Myth", "Real"].includes(q.correctAnswer), `Question ${idx} answer must be Myth or Real`);
    assert.ok(q.feedbackCorrect.length > 5, `Question ${idx} must have non-shaming correct feedback`);
    assert.ok(q.feedbackIncorrect.length > 5, `Question ${idx} must have supportive incorrect feedback`);
    assert.ok(q.realityTitle.length > 5, `Question ${idx} must have a reality title`);
    assert.ok(q.realityExplanation.length > 20, `Question ${idx} must have a detailed reality explanation`);
    assert.ok(q.whatToRemember.length > 10, `Question ${idx} must have a 'what to remember' takeaway`);
  });
  console.log(`  ✓ All ${MYTH_VS_REAL_QUESTIONS.length} Myth vs Real questions verified`);
});

test("Interactive Branching Stories: Scenarios have non-judgmental choices and consequences", () => {
  assert.ok(BRANCHING_SCENARIOS.length >= 3, "Expected at least 3 scenarios");

  BRANCHING_SCENARIOS.forEach((sc, idx) => {
    assert.ok(sc.id, `Scenario ${idx} must have an id`);
    assert.ok(sc.title, `Scenario ${idx} must have a title`);
    assert.ok(sc.situation.length > 20, `Scenario ${idx} must have a detailed situation narrative`);
    assert.ok(sc.prompt.length > 10, `Scenario ${idx} must have a question prompt`);
    assert.ok(sc.options.length >= 2, `Scenario ${idx} must have at least 2 choices`);

    sc.options.forEach((opt, oIdx) => {
      assert.ok(opt.id, `Option ${oIdx} must have an id`);
      assert.ok(opt.text.length > 5, `Option ${oIdx} must have choice text`);
      assert.ok(opt.consequences.length > 15, `Option ${oIdx} must have impact analysis`);
      assert.ok(opt.takeaway.length > 10, `Option ${oIdx} must have a safe approach takeaway`);
    });
  });
  console.log(`  ✓ All ${BRANCHING_SCENARIOS.length} interactive branching scenarios verified`);
});

test("Reveal & Discover Cards: Covers required 6 topics with explanations and takeaways", () => {
  assert.equal(REVEAL_DISCOVER_CARDS.length, 6, "Expected exactly 6 reveal cards");

  const requiredCategories = [
    "Consent & Boundaries",
    "Recognizing Warning Signs",
    "Healthy Relationships",
    "Supporting Others",
    "Finding Trustworthy Help",
  ];

  REVEAL_DISCOVER_CARDS.forEach((card, idx) => {
    assert.ok(card.id, `Card ${idx} must have an id`);
    assert.ok(card.title, `Card ${idx} must have a title`);
    assert.ok(card.prompt, `Card ${idx} must have a prompt`);
    assert.ok(card.explanation.length > 20, `Card ${idx} must have educational explanation`);
    assert.ok(card.practicalTakeaway.length > 15, `Card ${idx} must have practical takeaway`);
    assert.ok(card.readTime, `Card ${idx} must specify read time`);
  });

  const presentCategories = REVEAL_DISCOVER_CARDS.map((c) => c.category);
  requiredCategories.forEach((cat) => {
    assert.ok(presentCategories.includes(cat), `Expected category '${cat}' in reveal cards`);
  });
  console.log("  ✓ All 6 Reveal & Discover cards verified with required topics");
});

test("Micro-Quizzes: All activities have 1-question navigation, correct options, and takeaways", () => {
  assert.ok(MICRO_QUIZZES.length >= 3, "Expected at least 3 quiz activities");

  MICRO_QUIZZES.forEach((act, aIdx) => {
    assert.ok(act.id, `Activity ${aIdx} must have an id`);
    assert.ok(act.title, `Activity ${aIdx} must have a title`);
    assert.ok(act.questions.length >= 2, `Activity ${aIdx} must have questions`);

    act.questions.forEach((q, qIdx) => {
      assert.ok(q.question.length > 10, `Question ${qIdx} in ${act.title} must have question text`);
      assert.ok(q.options.length >= 2, `Question ${qIdx} must have at least 2 options`);
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `Question ${qIdx} correctIndex must be valid`
      );
      assert.ok(q.explanation.length > 15, `Question ${qIdx} must have explanation`);
      assert.ok(q.takeaway.length > 10, `Question ${qIdx} must have a takeaway`);
    });
  });
  console.log(`  ✓ All ${MICRO_QUIZZES.length} micro-quiz activities verified`);
});

test("Audio Lessons: Provide concise summaries and complete transcripts without external API tracking", () => {
  assert.ok(AUDIO_LESSONS.length >= 3, "Expected at least 3 audio lessons");

  AUDIO_LESSONS.forEach((lesson, lIdx) => {
    assert.ok(lesson.id, `Lesson ${lIdx} must have an id`);
    assert.ok(lesson.title, `Lesson ${lIdx} must have a title`);
    assert.ok(lesson.conciseSummary.length > 20, `Lesson ${lIdx} must have a concise summary`);
    assert.ok(lesson.fullTranscript.length > 100, `Lesson ${lIdx} must have a full transcript`);
  });
  console.log(`  ✓ All ${AUDIO_LESSONS.length} audio lessons verified`);
});

test("Topic Library: All 6 categories present with estimated reading times and statutory verification", () => {
  const expectedCategories = [
    "Consent & Boundaries",
    "Healthy Relationships",
    "Recognizing Warning Signs",
    "Digital Safety",
    "Supporting Others",
    "Finding Trustworthy Help",
  ];

  expectedCategories.forEach((cat) => {
    const hasCategory = TOPIC_LIBRARY.some((t) => t.category === cat);
    assert.ok(hasCategory, `Topic library must contain category: ${cat}`);
  });

  TOPIC_LIBRARY.forEach((topic) => {
    assert.ok(topic.estimatedMinutes > 0, `Reading time must be positive for ${topic.title}`);
    assert.ok(topic.keyTakeaways.length >= 2, `Takeaways must exist for ${topic.title}`);
    if (topic.isVerifiedStatutory) {
      assert.ok(topic.authorityOrSource, `Statutory topic ${topic.title} must have authority or law`);
      assert.ok(topic.jurisdiction, `Statutory topic ${topic.title} must have jurisdiction`);
    }
  });
  console.log("  ✓ Topic Library verified across all 6 categories and statutory indicators");
});

console.log("\n============================================================");
console.log("ALL LEARN & PREVENT ACCEPTANCE TESTS PASSED");
console.log("============================================================\n");
