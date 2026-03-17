/**
 * stationController.js – Request Handlers
 * -------------------------------------------------------
 * Controller functions for station and simulation endpoints.
 *
 * TODO: Replace mock dataset with CSV / database fetch.
 * TODO: Connect ML service for real prediction logic.
 * TODO: Add input validation middleware (Joi / express-validator).
 * FUTURE IMPLEMENTATION: Add caching (Redis) for station data.
 */

const stations           = require('../data/mockStations');
const { simulateInterventions } = require('../services/simulationService');

// ─── GET /stations ────────────────────────────────────────────────────────
/**
 * Returns the full list of 7 mock AQI monitoring stations.
 * TODO: Replace mock dataset with CSV / database later.
 */
const getAllStations = (req, res) => {
  try {
    const { zone, minAqi, maxAqi } = req.query;

    let result = [...stations];

    // Optional zone filter
    if (zone) {
      result = result.filter((s) =>
        s.zone_type.toLowerCase() === zone.toLowerCase()
      );
    }

    // Optional AQI range filter
    if (minAqi) result = result.filter((s) => s.aqi >= parseInt(minAqi, 10));
    if (maxAqi) result = result.filter((s) => s.aqi <= parseInt(maxAqi, 10));

    res.json({
      success: true,
      count: result.length,
      // TODO: Add metadata (timestamp, data source) when real data available.
      dataSource: 'mock',   // TODO: Change to 'live' when connected
      stations: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── GET /stations/:id ────────────────────────────────────────────────────
/**
 * Returns a single station by ID.
 */
const getStationById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const station = stations.find((s) => s.id === id);

  if (!station) {
    return res.status(404).json({ success: false, error: `Station id ${id} not found.` });
  }

  res.json({ success: true, dataSource: 'mock', station });
};

// ─── POST /stations/simulate ──────────────────────────────────────────────
/**
 * Runs a dummy intervention simulation on a station's AQI.
 *
 * Expected body (new): { stationId: number, interventions: string[] }
 * Backward-compatible: { stationId: number, intervention: string }
 *
 * TODO: Replace dummy logic with ML model prediction.
 * TODO: Connect ML service (Python FastAPI) for real predictions.
 * ML INTEGRATION POINT: call Python service here.
 */
const simulate = (req, res) => {
  try {
    const { stationId, intervention, interventions } = req.body;

    // Input Validation
    if (!stationId || (!intervention && !interventions)) {
      return res.status(400).json({
        success: false,
        error: 'stationId and at least one intervention are required.',
      });
    }

    const station = stations.find((s) => s.id === parseInt(stationId, 10));
    if (!station) {
      return res.status(404).json({
        success: false,
        error: `Station id ${stationId} not found.`,
      });
    }

    // ── DUMMY SIMULATION ──────────────────────────────────────────────────
    // TODO: Replace with ML model prediction.
    // TODO: Connect ML service – replace below with axios call to Python API.
    const selectedInterventions = interventions ?? intervention;
    const simResult = simulateInterventions(station.aqi, selectedInterventions);

    res.json({
      success: true,
      dataSource: 'mock-simulation',   // TODO: Change to 'ml-prediction' when ready
      note: 'DUMMY CALCULATION – prototype only. Replace with ML model.',
      input: {
        stationId: station.id,
        stationName: station.name,
        currentAQI: station.aqi,
        interventions: simResult.appliedInterventions,
      },
      result: simResult,
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { getAllStations, getStationById, simulate };
