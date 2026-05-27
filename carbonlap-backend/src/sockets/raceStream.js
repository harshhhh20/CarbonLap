/**
 * Socket.io Race Stream Handler
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages all real-time connections and telemetry broadcasting.
 * Data throttling: collects incoming telemetry but only emits every 250ms.
 * This prevents battery drain and bandwidth overload on mobile devices.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const { fetchLiveTelemetry } = require('../services/f1Telemetry');
const { processLiveTick }    = require('../services/mathEngine');
const simulator              = require('../simulator/replay');
const gamification           = require('../controllers/gamification');

const USE_SIMULATOR  = process.env.USE_SIMULATOR === 'true';
const EMIT_INTERVAL  = 250; // ms — 4 updates per second (battery-friendly)

let liveInterval = null;

/**
 * Initialise all Socket.io handlers.
 * Called once from server.js with the `io` instance.
 * @param {object} io  Socket.io server instance
 */
function initRaceStream(io) {
  // Share `io` with the simulator and gamification controller
  simulator.setIo(io);
  gamification.setIo(io);

  // ─── Connection Handler ─────────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const clientAddr = socket.handshake.address;
    console.log(`🔌 [Socket.io] Client connected: ${socket.id} from ${clientAddr}`);

    // Client can subscribe to a specific session
    socket.on('subscribe_session', ({ sessionId }) => {
      socket.join(`session:${sessionId}`);
      console.log(`📡 [Socket.io] ${socket.id} subscribed to session ${sessionId}`);
      socket.emit('subscribed', { sessionId, message: 'Listening for live telemetry updates.' });
    });

    // Allow admin to trigger a pit window from the frontend (demo use)
    socket.on('trigger_pit_window', ({ driverCode, message }) => {
      io.emit('pit_window_open', {
        driverCode,
        message:       message || `${driverCode} is boxing. Predict tire!`,
        windowSeconds: 10,
        openedAt:      Date.now(),
      });
      console.log(`🔔 [Socket.io] Pit window triggered for ${driverCode}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 [Socket.io] Client disconnected: ${socket.id} (${reason})`);
    });
  });

  // ─── Start Data Source ──────────────────────────────────────────────────────
  if (USE_SIMULATOR) {
    console.log('🎮 [Stream] Running in SIMULATOR mode — using fake_data.json');
    simulator.startReplay();
  } else {
    console.log('🌐 [Stream] Running in LIVE mode — polling OpenF1 API');
    startLivePolling(io);
  }
}

/**
 * Live mode: polls the OpenF1 API and broadcasts processed telemetry.
 * Throttled to EMIT_INTERVAL ms regardless of API update frequency.
 */
function startLivePolling(io) {
  liveInterval = setInterval(async () => {
    const rawData  = await fetchLiveTelemetry();
    if (!rawData || rawData.length === 0) return;

    const processed = processLiveTick(rawData);
    io.emit('telemetry_update', {
      timestamp: Date.now(),
      cars:      processed,
    });
  }, EMIT_INTERVAL);
}

function stopLivePolling() {
  if (liveInterval) {
    clearInterval(liveInterval);
    liveInterval = null;
  }
}

module.exports = { initRaceStream, stopLivePolling };
