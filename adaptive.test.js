import test from "node:test";
import assert from "node:assert/strict";
import { evaluateAttempt, getNextStep } from "../src/adaptive.js";
import { initialProgress, lessons } from "../src/data.js";
import { normalizeProgress } from "../src/progress.js";

const fractions = lessons.find((lesson) => lesson.id === "math-fractions");

function answersFor(lesson, indexes) {
  return Object.fromEntries(indexes.map((answer, index) => [index, answer]));
}

test("scores a partially correct quiz and returns a useful recommendation", () => {
  const result = evaluateAttempt(fractions, answersFor(fractions, [0, 1, 0]));

  assert.equal(result.correct, 2);
  assert.equal(result.score, 67);
  assert.equal(result.attempts, 1);
  assert.equal(result.mastery, 67);
  assert.equal(result.status, "Practising");
  assert.match(result.recommendation, /Review the examples/i);
  assert.ok(Number.isFinite(Date.parse(result.completedAt)));
});

test("does not label a topic mastered after only one high-scoring attempt", () => {
  const result = evaluateAttempt(fractions, answersFor(fractions, [0, 1, 1]));
  assert.equal(result.score, 100);
  assert.equal(result.status, "Strong progress");
});

test("can mark a topic mastered after repeated high-scoring attempts", () => {
  const first = evaluateAttempt(fractions, answersFor(fractions, [0, 1, 1]));
  const second = evaluateAttempt(fractions, answersFor(fractions, [0, 1, 1]), first);

  assert.equal(second.attempts, 2);
  assert.equal(second.mastery, 100);
  assert.equal(second.status, "Mastered");
});

test("treats missing or invalid answers as incorrect rather than crashing", () => {
  const result = evaluateAttempt(fractions, null);
  assert.equal(result.correct, 0);
  assert.equal(result.score, 0);
  assert.equal(result.status, "Needs support");
});

test("rejects a lesson with no questions", () => {
  assert.throws(() => evaluateAttempt({ questions: [] }, {}), /at least one question/i);
});

test("provides appropriate next steps for missing, low, middle, and high results", () => {
  assert.match(getNextStep({}, "math-fractions"), /Start with a short lesson/i);
  assert.match(getNextStep({ "math-fractions": { attempts: 1, lastScore: 33 } }, "math-fractions"), /guided examples/i);
  assert.match(getNextStep({ "math-fractions": { attempts: 1, lastScore: 67 } }, "math-fractions"), /Practise this topic/i);
  assert.match(getNextStep({ "math-fractions": { attempts: 2, lastScore: 100 } }, "math-fractions"), /Schedule a review/i);
});


test("normalizes malformed saved progress without leaking unknown lesson records", () => {
  const normalized = normalizeProgress({
    "math-fractions": { attempts: -3, best: 140, mastery: "high", lastScore: 150, status: "Mastered", extra: "ignored" },
    "unknown-lesson": { attempts: 999, lastScore: 100 }
  }, lessons, initialProgress);

  assert.deepEqual(normalized["math-fractions"], {
    attempts: 0,
    best: 0,
    mastery: 0,
    lastScore: null,
    status: "New"
  });
  assert.equal(Object.hasOwn(normalized, "unknown-lesson"), false);
});

test("normalizes a valid stored attempt and derives a consistent mastery status", () => {
  const normalized = normalizeProgress({
    "math-fractions": { attempts: 2.9, best: 90, mastery: 85, lastScore: 80, status: "New" }
  }, lessons, initialProgress);

  assert.deepEqual(normalized["math-fractions"], {
    attempts: 2,
    best: 90,
    mastery: 85,
    lastScore: 80,
    status: "Mastered"
  });
});


test("lesson content has unique IDs and valid answer keys", () => {
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length);
  for (const lesson of lessons) {
    assert.ok(lesson.title.trim().length > 0);
    assert.ok(lesson.questions.length > 0);
    for (const question of lesson.questions) {
      assert.ok(question.options.length >= 2);
      assert.ok(Number.isInteger(question.answer));
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
    }
  }
});
