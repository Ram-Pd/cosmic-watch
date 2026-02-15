import { getFeed, getNeoById } from "../services/nasaService.js";

/* ----------------------------------------------------
   🧠 Risk Analysis Engine
---------------------------------------------------- */
function calculateRisk(asteroid) {
  const diameter = asteroid.diameter || 0;
  const missDistance = asteroid.miss_distance || Infinity;
  const hazardous = asteroid.hazardous;

  let score = 0;

  // Hazardous bonus
  if (hazardous) score += 50;

  // Diameter contribution (larger = riskier)
  score += Math.min(diameter * 20, 30);

  // Miss distance contribution (closer = more risk)
  if (missDistance !== Infinity) {
    score += Math.max(0, 30 - missDistance / 1000000);
  }

  // Risk category
  let category = "LOW";
  if (score > 70) category = "CRITICAL";
  else if (score > 50) category = "HIGH";
  else if (score > 30) category = "MEDIUM";

  return {
    score: Math.round(score),
    category,
  };
}

/* ----------------------------------------------------
   GET /api/asteroids/feed
---------------------------------------------------- */
export async function feed(req, res) {
  try {
    const rawAsteroids = await getFeed();

    // Add risk analysis to each asteroid
    const asteroids = rawAsteroids.map((a) => {
      const risk = calculateRisk(a);

      return {
        ...a,
        risk_score: risk.score,
        risk_category: risk.category,
      };
    });

    res.json({
      success: true,
      count: asteroids.length,
      asteroids,
    });
  } catch (err) {
    console.error("FEED ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

/* ----------------------------------------------------
   GET /api/asteroids/:id
---------------------------------------------------- */
export async function getById(req, res) {
  try {
    const asteroid = await getNeoById(req.params.id);

    const risk = calculateRisk(asteroid);

    res.json({
      success: true,
      asteroid: {
        ...asteroid,
        risk_score: risk.score,
        risk_category: risk.category,
      },
    });
  } catch (err) {
    console.error("GET BY ID ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

/* ----------------------------------------------------
   GET /api/asteroids/risk
---------------------------------------------------- */
export async function risk(req, res) {
  try {
    const rawAsteroids = await getFeed();

    // Add risk data
    const asteroids = rawAsteroids.map((a) => {
      const risk = calculateRisk(a);

      return {
        ...a,
        risk_score: risk.score,
        risk_category: risk.category,
      };
    });

    // Sort by risk score (highest first)
    const sorted = [...asteroids].sort(
      (a, b) => b.risk_score - a.risk_score
    );

    res.json({
      success: true,
      asteroids: sorted,
    });
  } catch (err) {
    console.error("RISK ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
