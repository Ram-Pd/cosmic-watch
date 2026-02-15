import axios from "axios";

const BASE_URL = "https://api.nasa.gov/neo/rest/v1";

/**
 * Cache
 */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours (safer for NASA limits)
let feedCache = null;
let feedCacheKey = null;
let feedCacheTime = 0;

/**
 * Get NASA API Key safely
 */
function getApiKey() {
  const key = (process.env.NASA_API_KEY || "").trim();

  if (!key) {
    throw new Error(
      "NASA_API_KEY is missing. Add it inside backend/.env"
    );
  }

  return key;
}

/**
 * Normalize asteroid data safely
 */
function normalizeNeo(neo) {
  if (!neo || typeof neo !== "object") return null;

  try {
    const approach = neo.close_approach_data?.[0];

    const velocity =
      approach?.relative_velocity?.kilometers_per_second != null
        ? parseFloat(approach.relative_velocity.kilometers_per_second)
        : null;

    const missDistance =
      approach?.miss_distance?.kilometers != null
        ? parseFloat(approach.miss_distance.kilometers)
        : null;

    const diam = neo.estimated_diameter?.kilometers;
    const diameter =
      diam &&
      typeof diam.estimated_diameter_min === "number" &&
      typeof diam.estimated_diameter_max === "number"
        ? (diam.estimated_diameter_min + diam.estimated_diameter_max) / 2
        : null;

    return {
      id: neo.id ?? "unknown",
      name: neo.name || String(neo.id ?? ""),
      velocity,
      miss_distance: missDistance,
      diameter,
      hazardous: !!neo.is_potentially_hazardous_asteroid,
      close_approach_date: approach?.close_approach_date || null,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Fetch asteroid feed (stable version)
 */
export async function getFeed(date = null) {
  // NASA is more reliable with yesterday's date
  const today = new Date();
  today.setUTCDate(today.getUTCDate() - 1);

  const endDate = date || today.toISOString().slice(0, 10);
  const cacheKey = endDate;

  // Return cached data
  if (
    feedCache &&
    feedCacheKey === cacheKey &&
    Date.now() - feedCacheTime < CACHE_TTL_MS
  ) {
    return feedCache;
  }

  const apiKey = getApiKey();

  const end = new Date(endDate + "T12:00:00Z");
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 7);

  const startDate = start.toISOString().slice(0, 10);

  let data;

  try {
    const res = await axios.get(`${BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: apiKey,
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    data = res.data;

    if (res.status !== 200) {
      const msg =
        data?.error_message ||
        data?.message ||
        data?.error ||
        `HTTP ${res.status}`;

      throw new Error(`NASA API: ${msg}`);
    }
  } catch (err) {
    if (err.message?.startsWith("NASA API")) throw err;

    if (axios.isAxiosError(err) && err.response?.data) {
      const msg =
        err.response.data?.error_message ||
        err.response.data?.message ||
        err.response.data?.error;

      throw new Error(msg || `NASA API error ${err.response.status}`);
    }

    if (axios.isAxiosError(err)) {
      throw new Error(
        err.message || "NASA API request failed. Check internet/API key."
      );
    }

    throw err;
  }

  /**
   * Parse data safely
   */
  const neos = [];
  const dates =
    data && typeof data === "object" ? data.near_earth_objects : {};

  for (const day of Object.values(dates || {})) {
    if (!Array.isArray(day)) continue;

    for (const neo of day) {
      const normalized = normalizeNeo(neo);
      if (normalized) neos.push(normalized);
    }
  }

  // Prevent empty cache
  if (!neos.length) {
    throw new Error("No asteroid data received from NASA");
  }

  // Save cache
  feedCache = neos;
  feedCacheKey = cacheKey;
  feedCacheTime = Date.now();

  return neos;
}

/**
 * Fetch single asteroid by ID
 */
export async function getNeoById(id) {
  const key = getApiKey();

  try {
    const { data } = await axios.get(`${BASE_URL}/neo/${id}`, {
      params: { api_key: key },
      timeout: 15000,
    });

    return normalizeNeo(data);
  } catch (err) {
    throw new Error("Failed to fetch asteroid details");
  }
}
