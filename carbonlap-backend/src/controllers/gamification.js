/**
 * Gamification Controller
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles all prediction and points logic:
 *   POST /api/predict            — Submit a tire prediction
 *   POST /api/sessions/:id/award — Award points when actual tire is revealed
 *   GET  /api/users/:id/profile  — Fetch a user's stats + history
 *   GET  /api/sessions           — List all race sessions
 *   POST /api/users              — Create a new user (demo helper)
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const { prisma }   = require('../config/db');

const PREDICTION_WINDOW_MS = 10_000; // 10-second window — validated SERVER SIDE
const POINTS_FOR_CORRECT   = 120;

// ─── Singleton reference to Socket.io (set by raceStream.js) ─────────────────
let _io = null;
function setIo(io) { _io = io; }

// ─── POST /api/predict ────────────────────────────────────────────────────────
async function submitPrediction(req, res) {
  try {
    const { userId, raceSessionId, lapNumber, tireChoice, timestamp } = req.body;

    // 1. Validate payload
    if (!userId || !raceSessionId || !lapNumber || !tireChoice || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validTires = ['SOFT', 'MEDIUM', 'HARD'];
    if (!validTires.includes(tireChoice.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid tire choice. Use SOFT, MEDIUM, or HARD.' });
    }

    // 2. State Machine check — reject if race is not live
    const session = await prisma.raceSession.findUnique({ where: { id: raceSessionId } });
    if (!session) return res.status(404).json({ error: 'Race session not found' });
    if (!session.isLive) {
      return res.status(400).json({ error: 'Race session is not live. Predictions are closed.' });
    }

    // 3. Time window validation — NEVER trust the frontend timer
    const submittedAt  = new Date(timestamp).getTime();
    const serverNow    = Date.now();
    const windowOpenAt = serverNow - PREDICTION_WINDOW_MS;

    if (submittedAt < windowOpenAt) {
      return res.status(400).json({ error: 'Window Closed. Prediction submitted after the 10-second window.' });
    }

    // 4. Write to DB — unique constraint handles duplicate taps gracefully
    const prediction = await prisma.prediction.create({
      data: {
        userId,
        raceSessionId,
        lapNumber: parseInt(lapNumber),
        predictedTire: tireChoice.toUpperCase(),
        timestamp:     new Date(timestamp),
      },
    });

    // Update the user's lastActive timestamp
    await prisma.user.update({
      where: { id: userId },
      data:  { lastActive: new Date() },
    });

    return res.status(201).json({ message: 'Prediction recorded!', predictionId: prediction.id });

  } catch (err) {
    if (err.code === 'P2002') {
      // Prisma unique constraint violation — duplicate prediction
      return res.status(409).json({ error: 'You already predicted for this lap. One prediction per lap.' });
    }
    console.error('[Gamification] submitPrediction error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── POST /api/sessions/:id/award ────────────────────────────────────────────
async function awardPoints(req, res) {
  try {
    const { id: raceSessionId } = req.params;
    const { actualTire, lapNumber, driverCode } = req.body;

    if (!actualTire || !lapNumber) {
      return res.status(400).json({ error: 'actualTire and lapNumber are required' });
    }

    // Find all correct predictions for this lap
    const correctPredictions = await prisma.prediction.findMany({
      where: {
        raceSessionId,
        lapNumber:    parseInt(lapNumber),
        predictedTire: actualTire.toUpperCase(),
      },
    });

    if (correctPredictions.length === 0) {
      return res.status(200).json({ message: 'No correct predictions for this lap.' });
    }

    // Award points to each correct user
    const userIds = correctPredictions.map((p) => p.userId);

    await prisma.prediction.updateMany({
      where: { raceSessionId, lapNumber: parseInt(lapNumber), predictedTire: actualTire.toUpperCase() },
      data:  { pointsAwarded: POINTS_FOR_CORRECT },
    });

    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data:  { totalFantasyPoints: { increment: POINTS_FOR_CORRECT } },
    });

    // Fire real-time Socket.io event so app UI updates instantly
    if (_io) {
      _io.emit('points_awarded', {
        points:     POINTS_FOR_CORRECT,
        driverCode: driverCode || 'Unknown',
        actualTire: actualTire.toUpperCase(),
        lapNumber,
        winnersCount: userIds.length,
      });
    }

    console.log(`🏆 [Gamification] ${POINTS_FOR_CORRECT} pts awarded to ${userIds.length} users — Lap ${lapNumber}`);
    return res.status(200).json({
      message:      `Points awarded to ${userIds.length} users`,
      points:       POINTS_FOR_CORRECT,
      winnersCount: userIds.length,
    });

  } catch (err) {
    console.error('[Gamification] awardPoints error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── GET /api/users/:id/profile ───────────────────────────────────────────────
async function getUserProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where:   { id: req.params.id },
      include: {
        predictions: {
          orderBy: { timestamp: 'desc' },
          take:    20, // last 20 predictions
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('[Gamification] getUserProfile error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── GET /api/sessions ────────────────────────────────────────────────────────
async function getSessions(req, res) {
  try {
    const sessions = await prisma.raceSession.findMany({ orderBy: { startedAt: 'desc' } });
    return res.status(200).json(sessions);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── POST /api/users (demo helper — create a user quickly) ────────────────────
async function createUser(req, res) {
  try {
    const { username, email, favoriteDriverId } = req.body;
    if (!username || !email) return res.status(400).json({ error: 'username and email are required' });

    const user = await prisma.user.create({
      data: { username, email, favoriteDriverId: favoriteDriverId || null },
    });
    return res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Username or email already exists' });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── POST /api/sessions (create a session for the demo) ──────────────────────
async function createSession(req, res) {
  try {
    const { circuitName, totalLaps } = req.body;
    if (!circuitName || !totalLaps) return res.status(400).json({ error: 'circuitName and totalLaps are required' });

    const session = await prisma.raceSession.create({
      data: {
        circuitName,
        totalLaps: parseInt(totalLaps),
        isLive:    false,
      },
    });
    return res.status(201).json(session);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ─── PATCH /api/sessions/:id/toggle-live ─────────────────────────────────────
async function toggleLive(req, res) {
  try {
    const session = await prisma.raceSession.findUnique({ where: { id: req.params.id } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const updated = await prisma.raceSession.update({
      where: { id: req.params.id },
      data:  {
        isLive:    !session.isLive,
        startedAt: !session.isLive ? new Date() : session.startedAt,
      },
    });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  submitPrediction,
  awardPoints,
  getUserProfile,
  getSessions,
  createUser,
  createSession,
  toggleLive,
  setIo,
};
