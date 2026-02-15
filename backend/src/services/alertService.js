import User from "../models/User.js";
import Alert from "../models/Alert.js";
import { getFeed } from "./nasaService.js";
import { analyzeRisk } from "./riskEngine.js";

/* ----------------------------------------------------
   Risk level priority
---------------------------------------------------- */
const LEVEL_ORDER = {
  CRITICAL: 4,
  HIGH: 3,
  MODERATE: 2,
  LOW: 1,
};

/* ----------------------------------------------------
   Check if user should receive alert
---------------------------------------------------- */
function shouldAlertUser(user, riskLevel) {
  const settings = user.alertSettings || {};

  if (!settings.enabled) return false;

  const minLevel = settings.minRiskLevel || "MODERATE";

  return (
    (LEVEL_ORDER[riskLevel] || 0) >=
    (LEVEL_ORDER[minLevel] || 0)
  );
}

/* ----------------------------------------------------
   Hourly Alert Scheduler
---------------------------------------------------- */
export async function runAlertCheck() {
  console.log("🔔 Running alert scheduler...");

  try {
    // Fetch live asteroid feed
    const neos = await getFeed();
    if (!Array.isArray(neos)) return;

    // Active users only
    const users = await User.find({
      "alertSettings.enabled": true,
    }).select("_id watchedAsteroids alertSettings");

    if (!users.length) {
      console.log("ℹ️ No users with alerts enabled.");
      return;
    }

    // Fast lookup of available asteroid IDs
    const asteroidIds = new Set(neos.map((n) => n.id));

    for (const user of users) {
      const watched = (user.watchedAsteroids || []).filter(
        (id) => asteroidIds.has(id)
      );

      if (!watched.length) continue;

      for (const neo of neos) {
        if (!watched.includes(neo.id)) continue;

        // Risk analysis
        const result = analyzeRisk(neo);

        if (!shouldAlertUser(user, result.level)) continue;

        // Prevent duplicate alerts
        await Alert.findOneAndUpdate(
          {
            userId: user._id,
            asteroidId: neo.id,
            closeApproachDate: neo.close_approach_date,
          },
          {
            $setOnInsert: {
              userId: user._id,
              asteroidId: neo.id,
              asteroidName: neo.name,
              closeApproachDate:
                neo.close_approach_date || null,
              riskLevel: result.level,
              createdAt: new Date(),
            },
          },
          {
            upsert: true,
            new: false,
          }
        );
      }
    }

    console.log("✅ Alert scheduler completed.");
  } catch (err) {
    console.error("❌ ALERT SCHEDULER ERROR:", err.message);
  }
}
