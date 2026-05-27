/**
 * CarbonLap Math Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Converts raw F1 telemetry (RPM, Throttle) into estimated CO2 emissions.
 *
 * Physics Model:
 *   FuelFlow_t = k × (RPM_t / MaxRPM) × (Throttle_t / 100)
 *   CO2_live   = FuelFlow_t × 2.31   (kg of CO2 per litre of fuel combusted)
 *
 * Reference: Simplified model based on F1 hybrid power unit fuel-flow limits
 * (FIA Technical Regulations Article 5.10 — max fuel flow 100 kg/h).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const MAX_RPM      = 15_000;  // FIA hybrid-era RPM ceiling
const K            = 0.95;    // Peak fuel-flow scalar (L/s at WOT + max RPM)
const CO2_PER_LITRE = 2.31;   // kg CO2 released per litre of F1 fuel

/**
 * Compute emissions for a single car's telemetry snapshot.
 * @param {object} car  Raw telemetry object
 * @returns {object}    Enriched object with fuelFlow + co2Live
 */
function computeEmissions(car) {
  const { carNumber, driverCode, rpm = 0, throttle = 0, speed = 0, gear = 0, team = 'Unknown' } = car;

  // Clamp to valid physical ranges
  const safeRPM      = Math.max(0, Math.min(rpm, MAX_RPM));
  const safeThrottle = Math.max(0, Math.min(throttle, 100));

  const fuelFlow = K * (safeRPM / MAX_RPM) * (safeThrottle / 100);
  const co2Live  = fuelFlow * CO2_PER_LITRE;

  return {
    carNumber,
    driverCode,
    team,
    rpm:       safeRPM,
    throttle:  safeThrottle,
    speed,
    gear,
    fuelFlow:   parseFloat(fuelFlow.toFixed(4)),   // L/s
    co2Live:    parseFloat(co2Live.toFixed(4)),    // kg/s
    co2Display: `${(co2Live * 1000).toFixed(1)} g/s`, // human-readable for UI
  };
}

/**
 * Process an entire tick (array of 20 cars) through the Math Engine.
 * Returns results sorted by descending speed for a live leaderboard feel.
 * @param {Array} carsArray  Raw telemetry for all cars in one tick
 * @returns {Array}          Enriched + sorted telemetry
 */
function processLiveTick(carsArray) {
  return carsArray
    .map(computeEmissions)
    .sort((a, b) => b.speed - a.speed);
}

module.exports = { computeEmissions, processLiveTick, MAX_RPM, K, CO2_PER_LITRE };
