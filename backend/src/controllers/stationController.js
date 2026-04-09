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
const { recommendBestIntervention } = require('../services/recommendationService');

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

    if (!stationId || (!intervention && !interventions)) {
      return res.status(400).json({
        success: false,
        error: 'stationId and at least one intervention are required.',
      });
    }

    // ✅ LOAD REAL DATA
    const allStations = await loadAllStations();

    const station = allStations.find(
      (s) => s.id === parseInt(stationId, 10)
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        error: `Station id ${stationId} not found.`,
      });
    }

    const selectedInterventions = interventions ?? intervention;

    // ✅ ML CALL
    const simResult = await simulateInterventions(
      station,
      selectedInterventions
    );

    res.json({
      success: true,
      dataSource: 'ml-prediction',
      input: {
        stationId: station.id,
        stationName: station.name,
        currentAQI: station.aqi,
        interventions: selectedInterventions,
      },
      result: simResult,
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ─── POST /stations/recommend ────────────────────────────────────────────
/**
 * AI-driven intervention recommendation engine.
 * 
 * Steps:
 *  1. Identifies dominant pollutant
 *  2. Filters interventions by pollutant + zone
 *  3. Applies each intervention
 *  4. Uses ML to predict AQI after intervention
 *  5. Ranks by effectiveness
 *
 * Expected body: { stationId: number }
 * 
 * Returns: {
 *   station: string,
 *   zone: string,
 *   currentAQI: number,
 *   dominantPollutant: string,
 *   bestIntervention: { intervention, predictedAQI, improvement, cost },
 *   allInterventions: Array
 * }
 */
const recommend = async (req, res) => {
  try {
    const { stationId } = req.body;

    if (!stationId) {
      return res.status(400).json({
        success: false,
        error: 'stationId is required.',
      });
    }

    // ✅ LOAD REAL DATA
    const allStations = await loadAllStations();
    const station = allStations.find(s => s.id === parseInt(stationId));

    if (!station) {
      return res.status(404).json({
        success: false,
        error: `Station id ${stationId} not found.`,
      });
    }

    // ✅ GET RECOMMENDATION
    const result = await recommendBestIntervention(station);

    res.json({
      success: true,
      dataSource: 'ml-recommendation',
      station: station.name,
      zone: station.zone_type,
      currentAQI: station.aqi,
      dominantPollutant: result.best?.dominantPollutant,
      bestIntervention: result.best,
      allInterventions: result.all
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { getAllStations, getStationById, simulate, recommend };
