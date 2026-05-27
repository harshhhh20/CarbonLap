/**
 * CarbonLap Backend — Main Entry Point
 * ─────────────────────────────────────────────────────────────────────────────
 * Stack:
 *   Express.js  — HTTP REST routes (login, predict, profile)
 *   Socket.io   — Real-time telemetry streaming (4 updates/sec)
 *   Prisma ORM  — SQLite (dev) / PostgreSQL (prod) via DATABASE_URL
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();

const express        = require('express');
const http           = require('http');
const { Server }     = require('socket.io');
const cors           = require('cors');
const { connectDB }  = require('./config/db');
const { initRaceStream } = require('./sockets/raceStream');
const gamification   = require('./controllers/gamification');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3001;

// ─── Socket.io ─────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin:  process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`📨 [HTTP] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'CarbonLap Backend',
    timestamp: new Date().toISOString(),
    mode:      process.env.USE_SIMULATOR === 'true' ? 'SIMULATOR' : 'LIVE',
    speedMultiplier: parseFloat(process.env.SPEED_MULTIPLIER) || 1,
  });
});

// ─── Socket.io Test Page (open in browser during viva) ─────────────────────
app.get('/test', (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CarbonLap Socket.io Test</title>
  <style>
    body { background: #0a0a0f; color: #e2e8f0; font-family: monospace; padding: 2rem; }
    h1   { color: #00D4FF; }
    pre  { background: #111; border: 1px solid #333; padding: 1rem; border-radius: 8px;
           max-height: 70vh; overflow-y: auto; font-size: 0.78rem; }
    .tag { color: #10B981; }
  </style>
</head>
<body>
  <h1>🏎️ CarbonLap — Live Telemetry Monitor</h1>
  <p>Events received: <span id="count">0</span></p>
  <pre id="log">Connecting…</pre>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const log    = document.getElementById('log');
    const count  = document.getElementById('count');
    let   n      = 0;
    socket.on('connect',          ()  => { log.textContent = '✅ Connected as ' + socket.id + '\\n'; });
    socket.on('telemetry_update', (d) => {
      n++;
      count.textContent = n;
      const topCar = d.cars?.[0];
      log.textContent = JSON.stringify({ lap: d.lap, section: d.section, top: topCar }, null, 2)
        + '\\n\\n' + log.textContent.slice(0, 4000);
    });
    socket.on('points_awarded',   (d) => { log.textContent = '🏆 POINTS: ' + JSON.stringify(d) + '\\n' + log.textContent; });
    socket.on('pit_window_open',  (d) => { log.textContent = '🔔 PIT: ' + JSON.stringify(d) + '\\n' + log.textContent; });
  </script>
</body>
</html>`);
});

// ─── API Routes ────────────────────────────────────────────────────────────
// Users
app.post('/api/users',           gamification.createUser);
app.get('/api/users/:id/profile', gamification.getUserProfile);

// Sessions
app.get('/api/sessions',                        gamification.getSessions);
app.post('/api/sessions',                       gamification.createSession);
app.patch('/api/sessions/:id/toggle-live',      gamification.toggleLive);
app.post('/api/sessions/:id/award',             gamification.awardPoints);

// Predictions
app.post('/api/predict', gamification.submitPrediction);

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ─── Boot ──────────────────────────────────────────────────────────────────
async function boot() {
  await connectDB();
  initRaceStream(io);

  server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║        🏎️  CarbonLap Backend Online          ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║  HTTP   → http://localhost:${PORT}              ║`);
    console.log(`║  WS     → ws://localhost:${PORT}                ║`);
    console.log(`║  Test   → http://localhost:${PORT}/test          ║`);
    console.log(`║  Health → http://localhost:${PORT}/health        ║`);
    console.log(`║  Mode   → ${process.env.USE_SIMULATOR === 'true' ? 'SIMULATOR 🎮 (fake_data.json)  ' : 'LIVE 🌐 (OpenF1 API)          '}  ║`);
    console.log(`║  Speed  → ${process.env.SPEED_MULTIPLIER || 1}×                                ║`);
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
  });
}

boot().catch((err) => {
  console.error('Fatal boot error:', err);
  process.exit(1);
});
