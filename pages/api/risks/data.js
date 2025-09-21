/*
 * Helper functions for the risk API.
 * Only the calculateScore function is exported, as persistence is now handled
 * directly with MongoDB via the API routes. If you need additional helpers
 * in the future (e.g. to normalise data across different frameworks), they
 * can be added here.
 */

// Compute the risk score by multiplying likelihood and impact. Both inputs may
// be strings or numbers; they are coerced to numbers before calculation.
function calculateScore(likelihood, impact) {
  return Number(likelihood) * Number(impact);
}

export { calculateScore };
