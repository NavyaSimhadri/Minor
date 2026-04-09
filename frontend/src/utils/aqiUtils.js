/**
 * AQI Utility Functions
 * -------------------------------------------------------
 * Provides colour coding, category labels, and simulation
 * helpers for the Digital Twin prototype.
 *
 * TODO: Replace dummy simulation logic with ML model prediction.
 * TODO: ML INTEGRATION POINT – simulateIntervention() will call
 *       the ML service endpoint once the model is trained.
 */

// ─── AQI Colour Mapping ────────────────────────────────────────────────────
/**
 * Returns a hex colour string for a given AQI value.
 * Matches the standard Indian CPCB AQI colour scheme.
 */
export const getAQIColor = (aqi) => {
  if (aqi <= 50)  return '#00e400';   // Good           – Green
  if (aqi <= 100) return '#ffff00';   // Satisfactory   – Yellow
  if (aqi <= 200) return '#ff7e00';   // Moderate/Poor  – Orange
  if (aqi <= 300) return '#ff0000';   // Very Poor      – Red
  return '#8f3f97';                   // Severe         – Purple
};

// ─── AQI Category Label ────────────────────────────────────────────────────
/**
 * Returns a human-readable category string for a given AQI value.
 */
export const getAQICategory = (aqi) => {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate / Poor';
  if (aqi <= 300) return 'Very Poor';
  return 'Severe';
};

// ─── AQI Category Background (for UI badges) ──────────────────────────────
export const getAQIBadgeStyle = (aqi) => ({
  backgroundColor: getAQIColor(aqi),
  color: aqi <= 100 ? '#1a1a1a' : '#ffffff',
  padding: '2px 8px',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '0.8rem',
});

// ─── Circle Radius Helper ─────────────────────────────────────────────────
/**
 * Maps AQI value to a circle radius for Leaflet map markers.
 * Higher AQI → larger circle to draw visual attention.
 */
export const getCircleRadius = (aqi) => {
  if (aqi <= 100) return 800;
  if (aqi <= 200) return 1100;
  return 1500;
};

// ─── Intervention Simulation (DUMMY LOGIC) ────────────────────────────────
/**
 * simulateIntervention(aqi, intervention)
 *
 * Applies a hardcoded percentage reduction to simulate the effect
 * of environmental interventions on AQI.
 *
 * ⚠️  DUMMY LOGIC – for prototype demonstration only.
 * TODO: Replace with ML model prediction (Random Forest / XGBoost).
 * TODO: ML INTEGRATION POINT – send {station, intervention, pollutants}
 *       to /api/simulate and receive model-predicted AQI.
 *
 * @param {number} aqi         - Current AQI value of the station
 * @param {string} intervention - One of: 'Green Walls / Vertical Gardens',
 *                                        'Biofilters (Algae / Moss Systems)',
 *                                        'Roadside Air Purifiers'
 * @returns {{ predictedAQI: number, improvementPct: number }}
 */
export const simulateIntervention = (aqi, intervention) => {
  // TODO: Replace with ML model prediction.
  let factor = 1;

  if (intervention === 'Green Walls / Vertical Gardens')       factor = 0.82;  // 18% reduction
  else if (intervention === 'Biofilters (Algae / Moss Systems)')  factor = 0.70;  // 30% reduction
  else if (intervention === 'Roadside Air Purifiers') factor = 0.50; // 50% reduction

  const predictedAQI = Math.round(aqi * factor);
  const improvementPct = Math.round((1 - factor) * 100);

  return { predictedAQI, improvementPct };
};

// ─── Intervention Options List ────────────────────────────────────────────
export const INTERVENTION_OPTIONS = [
  { value: 'Green Walls / Vertical Gardens',               label: 'Vertical Gardens',      reduction: '18%' },
  { value: 'Biofilters (Algae / Moss Systems)',            label: 'Biofilters',           reduction: '30%' },
  { value: 'Roadside Air Purifiers',                       label: 'Roadside Air Purifiers', reduction: '50%' },
];

// ─── Summary Statistics Helper ────────────────────────────────────────────
/**
 * Computes aggregate statistics across all stations.
 * @param {Array} stations - Array of station objects
 */
export const computeStats = (stations) => {
  const aqiValues = stations.map((s) => s.aqi);
  const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

  return {
    avgAQI:      avg(aqiValues),
    maxAQI:      Math.max(...aqiValues),
    minAQI:      Math.min(...aqiValues),
    criticalCount: stations.filter((s) => s.aqi > 200).length,
    poorCount:     stations.filter((s) => s.aqi > 100 && s.aqi <= 200).length,
    goodCount:     stations.filter((s) => s.aqi <= 100).length,
    avgPM25:     avg(stations.map((s) => s.pm25)),
    avgPM10:     avg(stations.map((s) => s.pm10)),
  };
};
