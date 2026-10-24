// Transparent demo adaptation rules. This is not a trained machine-learning model.
function validateLesson(lesson) {
  if (!lesson || !Array.isArray(lesson.questions) || lesson.questions.length === 0) {
    throw new TypeError("A lesson with at least one question is required.");
  }

  lesson.questions.forEach((question, index) => {
    const validQuestion = question &&
      typeof question === "object" &&
      Array.isArray(question.options) &&
      question.options.length >= 2 &&
      Number.isInteger(question.answer) &&
      question.answer >= 0 &&
      question.answer < question.options.length;

    if (!validQuestion) {
      throw new TypeError(`Question ${index + 1} must have at least two options and a valid answer index.`);
    }
  });
}

export function evaluateAttempt(lesson, answers, previous = {}) {
  validateLesson(lesson);

  const safeAnswers = answers && typeof answers === "object" && !Array.isArray(answers)
    ? answers
    : {};
  const questions = lesson.questions;
  const correct = questions.reduce(
    (count, item, index) => count + (Number.isInteger(safeAnswers[index]) && safeAnswers[index] === item.answer ? 1 : 0),
    0
  );
  const score = Math.round((correct / questions.length) * 100);
  const previousAttempts = Number.isFinite(previous?.attempts) && previous.attempts > 0
    ? Math.min(1_000_000, Math.floor(previous.attempts))
    : 0;
  const previousMastery = Number.isFinite(previous?.mastery)
    ? Math.min(100, Math.max(0, previous.mastery))
    : 0;
  const attempts = previousAttempts + 1;
  const mastery = Math.round(((previousMastery * previousAttempts) + score) / attempts);

  let status;
  let recommendation;
  if (score >= 80) {
    // A single quiz is not enough evidence to label a learner as having mastered a topic.
    status = attempts >= 2 && mastery >= 80 ? "Mastered" : "Strong progress";
    recommendation = "Great work. Try a short review later, then move to the next topic when your teacher agrees.";
  } else if (score >= 50) {
    status = "Practising";
    recommendation = "You are building understanding. Review the examples, then try this lesson again.";
  } else {
    status = "Needs support";
    recommendation = "Let's slow down. Re-read the explanation and ask a teacher or parent to work through an example with you.";
  }

  return {
    score,
    correct,
    attempts,
    mastery,
    status,
    recommendation,
    completedAt: new Date().toISOString()
  };
}

export function getNextStep(progress, lessonId) {
  const p = progress && typeof progress === "object" && !Array.isArray(progress)
    ? progress[lessonId]
    : null;
  const validAttempt = p && Number.isInteger(p.attempts) && p.attempts >= 1 &&
    Number.isFinite(p.lastScore) && p.lastScore >= 0 && p.lastScore <= 100;

  if (!validAttempt) return "Start with a short lesson and check what you already know.";
  if (p.lastScore < 50) return "Repeat this lesson with guided examples.";
  if (p.lastScore < 80) return "Practise this topic again before moving on.";
  return "Schedule a review, then continue to the next topic.";
}
