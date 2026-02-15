import { RISK_LEVELS } from '../utils/constants.js';

/**
 * Risk score: 0–100. Higher = more risk.
 * Factors: hazardous flag, diameter (size), miss_distance (closer = riskier), velocity (faster = riskier).
 * Scientifically reasonable: NASA's "potentially hazardous" + size + proximity + speed.
 */
function computeScore({ hazardous, diameter, miss_distance, velocity }) {
  let score = 0;

  if (hazardous) score += 30;
  if (diameter != null && diameter > 0) {
    const sizeFactor = Math.min(diameter * 15, 25);
    score += sizeFactor;
  }
  if (miss_distance != null && miss_distance > 0) {
    const proximityFactor = Math.min(1e6 / miss_distance, 25);
    score += proximityFactor;
  }
  if (velocity != null && velocity > 0) {
    const velocityFactor = Math.min(velocity * 2, 20);
    score += velocityFactor;
  }

  return Math.min(Math.round(score), 100);
}

function scoreToLevel(score) {
  if (score >= 75) return RISK_LEVELS.CRITICAL;
  if (score >= 50) return RISK_LEVELS.HIGH;
  if (score >= 25) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

function explanation(level, score, neo) {
  const parts = [];
  if (neo.hazardous) parts.push('NASA classified as potentially hazardous');
  if (neo.diameter != null) parts.push(`size ~${neo.diameter.toFixed(2)} km`);
  if (neo.miss_distance != null) parts.push(`miss distance ~${Number(neo.miss_distance).toLocaleString()} km`);
  if (neo.velocity != null) parts.push(`velocity ~${neo.velocity.toFixed(1)} km/s`);
  return `Score ${score}/100 (${level}): ${parts.join('; ')}.`;
}

/** Run risk analysis on a single NEO. Returns { level, score, explanation } */
export function analyzeRisk(neo) {
  const score = computeScore(neo);
  const level = scoreToLevel(score);
  return {
    level,
    score,
    explanation: explanation(level, score, neo),
    ...neo,
  };
}

/** Run risk on many NEOs and return categorized list */
export function categorizeByRisk(neos) {
  const categorized = { LOW: [], MODERATE: [], HIGH: [], CRITICAL: [] };
  for (const neo of neos) {
    const result = analyzeRisk(neo);
    if (categorized[result.level]) {
      categorized[result.level].push(result);
    }
  }
  return categorized;
}
