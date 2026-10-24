const validScore = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
const clampScore = (value, fallback = 0) => Number.isFinite(value) ? Math.round(Math.min(100, Math.max(0, value))) : fallback;

function statusFor(attempts, lastScore, mastery) {
  if (attempts < 1 || lastScore === null) return "New";
  if (lastScore >= 80) return attempts >= 2 && mastery >= 80 ? "Mastered" : "Strong progress";
  if (lastScore >= 50) return "Practising";
  return "Needs support";
}

/** Normalize untrusted browser-stored progress to known lesson IDs and bounded values. */
export function normalizeProgress(saved, lessons, initialProgress) {
  const source = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};

  return Object.fromEntries(lessons.map((lesson) => {
    const base = initialProgress[lesson.id] || { attempts: 0, best: 0, mastery: 0, status: "New", lastScore: null };
    const candidate = source[lesson.id];
    const item = candidate && typeof candidate === "object" && !Array.isArray(candidate) ? candidate : {};

    const attempts = Number.isFinite(item.attempts) && item.attempts >= 0
      ? Math.min(1_000_000, Math.floor(item.attempts))
      : (Number.isFinite(base.attempts) && base.attempts >= 0 ? Math.floor(base.attempts) : 0);
    const lastScore = item.lastScore === null
      ? null
      : validScore(item.lastScore)
        ? Math.round(item.lastScore)
        : (validScore(base.lastScore) ? Math.round(base.lastScore) : null);
    // A score is the evidence that an attempt exists. Discard inconsistent counters when it is missing.
    const normalizedAttempts = lastScore === null ? 0 : Math.max(1, attempts);
    const masteryFallback = normalizedAttempts > 0 && lastScore !== null ? lastScore : 0;
    // With one recorded attempt, mastery must equal that attempt's score. For multiple
    // attempts, constrain the saved average to the mathematically possible range given
    // the latest score and attempt count, so corrupted storage cannot invent impossible mastery.
    let mastery = 0;
    if (normalizedAttempts > 0 && lastScore !== null) {
      if (normalizedAttempts === 1) {
        mastery = lastScore;
      } else {
        const minimum = lastScore / normalizedAttempts;
        const maximum = ((normalizedAttempts - 1) * 100 + lastScore) / normalizedAttempts;
        mastery = Math.round(Math.min(maximum, Math.max(minimum, clampScore(item.mastery, masteryFallback))));
      }
    }
    const best = normalizedAttempts > 0
      ? Math.max(clampScore(base.best, 0), clampScore(item.best, 0), lastScore ?? 0)
      : clampScore(base.best, 0);

    return [lesson.id, {
      attempts: normalizedAttempts,
      best,
      mastery,
      lastScore,
      status: statusFor(normalizedAttempts, lastScore, mastery)
    }];
  }));
}
