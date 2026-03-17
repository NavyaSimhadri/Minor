/**
 * server.js – Express Entry Point
 * -------------------------------------------------------
 * Digital Twin Air Quality Monitoring System
 * Backend API – Prototype v1.0
 *
 * TODO: Add database connection (MongoDB / PostgreSQL) later.
 * TODO: Add authentication middleware later.
 * TODO: Connect ML service (Python FastAPI) via HTTP later.
 * FUTURE IMPLEMENTATION: Replace all mock data with real sensor feeds.
 */

require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const stationRoutes = require('./src/routes/stations');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
app.use(express.json());

// ─── Request Logger (prototype) ───────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/stations', stationRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0-prototype',
    mode: 'mock',
    timestamp: new Date().toISOString(),
    // TODO: Add ML service health check here later.
    mlService: 'not-connected',
  });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Digital Twin Backend running on http://localhost:${PORT}`);
  console.log(`   Mode     : PROTOTYPE (mock data)`);
  console.log(`   Stations : GET  /stations`);
  console.log(`   Simulate : POST /stations/simulate`);
  console.log(`   Health   : GET  /health\n`);
  // TODO: Replace mock dataset with CSV / database when ready.
});

module.exports = app;
