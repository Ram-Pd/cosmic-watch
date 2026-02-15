import { getFeed, getNeoById } from "../services/nasaService.js";

/**
 * GET /api/asteroids/feed
 */
export async function feed(req, res) {
  try {
    const asteroids = await getFeed();

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

/**
 * GET /api/asteroids/:id
 */
export async function getById(req, res) {
  try {
    const asteroid = await getNeoById(req.params.id);

    res.json({
      success: true,
      asteroid,
    });
  } catch (err) {
    console.error("GET BY ID ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

/**
 * GET /api/asteroids/risk
 */
export async function risk(req, res) {
  try {
    const asteroids = await getFeed();

    // simple risk sorting
    const sorted = [...asteroids].sort(
      (a, b) =>
        (a.miss_distance || Infinity) -
        (b.miss_distance || Infinity)
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
