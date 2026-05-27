/**
 * F1 Telemetry Service
 * ─────────────────────────────────────────────────────────────────────────────
 * Polls the OpenF1 API for live car telemetry.
 * Only used when USE_SIMULATOR=false in .env
 *
 * OpenF1 API docs: https://openf1.org/#car-data
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const fetch = require('node-fetch');

const BASE_URL    = process.env.OPENF1_BASE_URL   || 'https://api.openf1.org/v1';
const SESSION_KEY = process.env.OPENF1_SESSION_KEY || 'latest';

// Cache the last successful response so we don't send null on a failed poll
let lastKnownData = [];

/**
 * Fetches the latest car telemetry from OpenF1.
 * OpenF1 returns an array of objects like:
 *   { driver_number, rpm, throttle, speed, n_gear, session_key, ... }
 *
 * We normalise it to our internal schema.
 * @returns {Promise<Array>} Normalised array of car telemetry objects
 */
async function fetchLiveTelemetry() {
  try {
    const url = `${BASE_URL}/car_data?session_key=${SESSION_KEY}`;
    const res  = await fetch(url, { timeout: 3000 });

    if (!res.ok) throw new Error(`OpenF1 returned ${res.status}`);

    const raw = await res.json();

    // Deduplicate — keep only the latest entry per driver
    const latestPerDriver = {};
    for (const entry of raw) {
      latestPerDriver[entry.driver_number] = entry;
    }

    const normalised = Object.values(latestPerDriver).map((entry) => ({
      carNumber:   entry.driver_number,
      driverCode:  entry.driver_number.toString(), // OpenF1 doesn't return short codes
      team:        'Unknown',
      rpm:         entry.rpm         || 0,
      throttle:    entry.throttle    || 0,
      speed:       entry.speed       || 0,
      gear:        entry.n_gear      || 0,
    }));

    lastKnownData = normalised;
    return normalised;
  } catch (err) {
    console.warn(`⚠️  [F1Telemetry] API poll failed: ${err.message}. Using cached data.`);
    return lastKnownData; // Graceful degradation — never crash on API failure
  }
}

module.exports = { fetchLiveTelemetry };
