/**
 * stations.js – Express Router
 * -------------------------------------------------------
 * Routes for AQI station data and intervention simulation.
 *
 * Endpoints:
 *   GET  /stations               → All 7 stations (supports ?zone= &minAqi= &maxAqi=)
 *   GET  /stations/:id           → Single station by ID
 *   POST /stations/simulate      → Run dummy intervention simulation
 *
 * TODO: Add authentication middleware (JWT) to protect routes.
 * TODO: Add rate limiting middleware.
 * FUTURE IMPLEMENTATION: Add POST /stations/bulk-import for CSV upload.
 */

const express     = require('express');
const router      = express.Router();
const {
  getAllStations,
  getStationById,
  simulate,
  recommend,
} = require('../controllers/stationController');

// ── Station Routes ─────────────────────────────────────────────────────────
router.get('/',          getAllStations);    // GET  /stations
router.get('/:id',       getStationById);   // GET  /stations/:id
router.post('/simulate', simulate);         // POST /stations/simulate
router.post('/recommend', recommend);       // POST /stations/recommend

module.exports = router;
