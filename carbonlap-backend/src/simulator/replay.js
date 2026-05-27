/**
 * Replay Simulator — Lab Viva Safety Net
 * ─────────────────────────────────────────────────────────────────────────────
 * Loads the Monza lap profile from fake_data.json, generates realistic
 * synthetic telemetry tick-by-tick, passes it through the Math Engine,
 * and broadcasts via Socket.io every 250ms.
 *
 * FLEX: Set SPEED_MULTIPLIER=5 in .env → the evaluator watches the
 * leaderboard shuffle 5× faster without waiting 30 minutes.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const { processLiveTick } = require('../services/mathEngine');
const raceData            = require('./fake_data.json');

// ─── Config ───────────────────────────────────────────────────────────────────
const TICK_INTERVAL_MS  = 250;                                      // 4 updates/sec
const SPEED_MULTIPLIER  = parseFloat(process.env.SPEED_MULTIPLIER) || 1;
const ACTUAL_INTERVAL   = Math.round(TICK_INTERVAL_MS / SPEED_MULTIPLIER);

// Build a flat tick array from the lap profile
const LAP_PROFILE = raceData.lapProfile;
const TOTAL_TICKS = LAP_PROFILE.reduce((sum, s) => sum + s.durationTicks, 0);
const CARS        = raceData.cars;

// ─── Noise Helpers ────────────────────────────────────────────────────────────
const rand    = (min, max) => Math.random() * (max - min) + min;
const jitter  = (value, pct = 0.04) => Math.round(value * (1 + rand(-pct, pct)));

/**
 * Get the lap section that corresponds to a given tick index.
 */
function getSectionForTick(tickIndex) {
  let acc = 0;
  for (const section of LAP_PROFILE) {
    acc += section.durationTicks;
    if (tickIndex < acc) return section;
  }
  return LAP_PROFILE[LAP_PROFILE.length - 1];
}

/**
 * Generate one tick of telemetry for all 20 cars.
 * Each car's values are the section baseline × performance factor + noise.
 */
function generateTick(tickIndex) {
  const section = getSectionForTick(tickIndex % TOTAL_TICKS);

  return CARS.map((car) => {
    const pf = car.performanceFactor;
    return {
      carNumber:  car.carNumber,
      driverCode: car.driverCode,
      team:       car.team,
      rpm:        jitter(Math.round(section.rpm      * pf), 0.03),
      throttle:   Math.min(100, Math.round(section.throttle * pf * rand(0.97, 1.03))),
      speed:      jitter(Math.round(section.speed    * pf), 0.02),
      gear:       section.gear,
    };
  });
}

// ─── Simulator State ──────────────────────────────────────────────────────────
let intervalHandle = null;
let currentTick    = 0;
let currentLap     = 1;
let io             = null; // injected by raceStream.js

/**
 * Inject the Socket.io instance (called from raceStream.js or server.js).
 * @param {object} socketIo  The `io` instance from socket.io
 */
function setIo(socketIo) {
  io = socketIo;
}

/**
 * Start the replay loop.
 * Emits `telemetry_update` every ACTUAL_INTERVAL milliseconds.
 */
function startReplay() {
  if (intervalHandle) return; // already running

  console.log(`🏎️  [Simulator] Starting Monza replay — ${SPEED_MULTIPLIER}× speed (${ACTUAL_INTERVAL}ms interval)`);

  intervalHandle = setInterval(() => {
    if (!io) return;

    const rawTick   = generateTick(currentTick);
    const processed = processLiveTick(rawTick);

    // Track lap transitions
    if (currentTick > 0 && currentTick % TOTAL_TICKS === 0) {
      currentLap++;
      console.log(`🔄 [Simulator] Lap ${currentLap} started`);
    }

    io.emit('telemetry_update', {
      timestamp:  Date.now(),
      lap:        currentLap,
      totalLaps:  raceData.totalLaps,
      circuit:    raceData.circuit,
      section:    getSectionForTick(currentTick % TOTAL_TICKS).section,
      cars:       processed,
    });

    currentTick++;
  }, ACTUAL_INTERVAL);
}

/**
 * Stop the replay loop gracefully.
 */
function stopReplay() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.log('🛑 [Simulator] Replay stopped');
  }
}

/**
 * Reset back to lap 1 tick 0 (useful for demo restarts).
 */
function resetReplay() {
  stopReplay();
  currentTick = 0;
  currentLap  = 1;
  console.log('🔁 [Simulator] Replay reset');
}

module.exports = { startReplay, stopReplay, resetReplay, setIo };
