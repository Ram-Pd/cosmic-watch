import User from '../models/User.js';
import Alert from '../models/Alert.js';
import { getFeed } from './nasaService.js';
import { analyzeRisk } from './riskEngine.js';
import { RISK_LEVELS } from '../utils/constants.js';

const LEVEL_ORDER = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };

/** Check if user's minRiskLevel is satisfied by this NEO's risk */
function shouldAlertUser(user, riskLevel) {
  const settings = user.alertSettings || {};
  if (!settings.enabled) return false;
  const minLevel = settings.minRiskLevel || 'MODERATE';
  return LEVEL_ORDER[riskLevel] >= LEVEL_ORDER[minLevel];
}

/** Hourly job: fetch feed, run risk, create alerts for users who watch matching asteroids */
export async function runAlertCheck() {
  const neos = await getFeed();
  const users = await User.find({ 'alertSettings.enabled': true }).select('watchedAsteroids alertSettings');
  const asteroidIds = new Set(neos.map((n) => n.id));

  for (const user of users) {
    const watched = (user.watchedAsteroids || []).filter((id) => asteroidIds.has(id));
    if (watched.length === 0) continue;

    for (const neo of neos) {
      if (!watched.includes(neo.id)) continue;
      const result = analyzeRisk(neo);
      if (!shouldAlertUser(user, result.level)) continue;

      await Alert.findOneAndUpdate(
        { userId: user._id, asteroidId: neo.id, closeApproachDate: neo.close_approach_date },
        {
          $setOnInsert: {
            userId: user._id,
            asteroidId: neo.id,
            asteroidName: neo.name,
            closeApproachDate: neo.close_approach_date,
            riskLevel: result.level,
          },
        },
        { upsert: true }
      );
    }
  }
}
