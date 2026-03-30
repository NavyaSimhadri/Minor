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

//const stations           = require('../data/mockStations');
const { loadAllStations, simulateInterventions } = require('../services/simulationService');

// ─── GET /stations ────────────────────────────────────────────────────────
/**
 * Returns the full list of 7 mock AQI monitoring stations.
 * TODO: Replace mock dataset with CSV / database later.
 */
const getAllStations = async (req, res) => {
  try {
    let stations = await loadAllStations();

    const { zone, minAqi, maxAqi } = req.query;

    if (zone) {
      stations = stations.filter(s =>
        s.zone_type.toLowerCase() === zone.toLowerCase()
      );
    }

    if (minAqi) stations = stations.filter(s => s.aqi >= minAqi);
    if (maxAqi) stations = stations.filter(s => s.aqi <= maxAqi);

    res.json({
      success: true,
      stations,
      dataSource: 'csv',
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
const simulate = async (req, res) => {
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
    const simResult = await simulateInterventions(station, selectedInterventions);

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
