/**
 * api.js – Frontend API Service Layer
 * -------------------------------------------------------
 * Centralised HTTP client for all backend calls.
 * All fetch() calls go through this module so the base URL
 * is configured in one place.
 *
 * Base URL is proxied through Vite dev server → http://localhost:5000
 * (see vite.config.js proxy rule: /api → http://localhost:5000)
 *
 * Endpoints consumed:
 *   GET  /api/stations              → list all stations
 *   GET  /api/stations/:id          → single station
 *   POST /api/stations/simulate     → intervention simulation
 */

const BASE = '/api';

// ─── Helper ───────────────────────────────────────────────────────────────
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
};

// ─── Stations ─────────────────────────────────────────────────────────────

/**
 * Fetch all 7 stations from the backend.
 * @param {{ zone?: string, minAqi?: number, maxAqi?: number }} filters
 */
export const fetchStations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.zone)   params.set('zone',   filters.zone);
  if (filters.minAqi) params.set('minAqi', filters.minAqi);
  if (filters.maxAqi) params.set('maxAqi', filters.maxAqi);

  const query = params.toString() ? `?${params}` : '';
  const res   = await fetch(`${BASE}/stations${query}`);
  const data  = await handleResponse(res);
  return data.stations;  // array of station objects
};

/**
 * Fetch a single station by ID.
 * @param {number} id
 */
export const fetchStationById = async (id) => {
  const res  = await fetch(`${BASE}/stations/${id}`);
  const data = await handleResponse(res);
  return data.station;
};

// ─── Simulation ────────────────────────────────────────────────────────────

/**
 * POST a simulation request to the backend.
 * Returns { predictedAQI, improvementPct, aqiReduction }
 *
 * @param {number} stationId
 * @param {string[]|string} interventions  One or more intervention names
 */
export const postSimulate = async (stationId, interventions) => {
  const selectedInterventions = Array.isArray(interventions)
    ? interventions
    : (interventions ? [interventions] : []);

  const res = await fetch(`${BASE}/stations/simulate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ stationId, interventions: selectedInterventions }),
  });
  const data = await handleResponse(res);
  // Flatten: { input: { currentAQI }, result: { predictedAQI, improvementPct, aqiReduction } }
  return {
    currentAQI:     data.input.currentAQI,
    predictedAQI:   data.result.predictedAQI,
    improvementPct: data.result.improvementPct,
    aqiReduction:   data.result.aqiReduction,
    appliedInterventions: data.input.interventions || [],
    factor:         data.result.factor,
    dataSource:     data.dataSource,
  };
};

// ─── Recommendation ────────────────────────────────────────────────────────

/**
 * POST a recommendation request to the backend.
 * Engine automatically selects best intervention based on:
 *  1. Dominant pollutant (primary filter)
 *  2. Zone type (secondary filter)
 *  3. ML prediction of AQI after intervention
 *
 * @param {number} stationId
 * @returns {Promise} { station, zone, currentAQI, dominantPollutant, bestIntervention, allInterventions }
 */
export const getRecommendation = async (stationId) => {
  const res = await fetch(`${BASE}/stations/recommend`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ stationId }),
  });
  const data = await handleResponse(res);
  return {
    station:             data.station,
    zone:                data.zone,
    currentAQI:          data.currentAQI,
    dominantPollutant:   data.dominantPollutant,
    bestIntervention:    data.bestIntervention,
    allInterventions:    data.allInterventions,
    dataSource:          data.dataSource,
  };
};
