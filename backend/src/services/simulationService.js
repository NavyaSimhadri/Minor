/**
 * simulationService.js – Intervention Simulation Engine
 * -------------------------------------------------------
 * Applies dummy percentage-based reductions to AQI values.
 * Supports both single and multiple interventions.
 *
 * ⚠️  DUMMY LOGIC – Prototype only.
 *
 * TODO: Replace with ML model prediction (Random Forest / XGBoost).
 * TODO: Connect ML service – send features to Python FastAPI and
 *       receive model-predicted AQI.
 * TODO: Add pollutant reduction logic per intervention type.
 * ML INTEGRATION POINT: replace simulateInterventions() body with
 *   const res = await axios.post('http://localhost:8000/predict', payload);
 *   return res.data;
 */

// ─── Reduction Factors (DUMMY) ────────────────────────────────────────────
const REDUCTION_FACTORS = {
  'Green Belt':        0.92,   // 8% AQI reduction
  'Dust Control':      0.88,   // 12% AQI reduction
  'Emission Control':  0.85,   // 15% AQI reduction
};

const normalizeInterventions = (interventions) => {
  const values = Array.isArray(interventions)
    ? interventions
    : (interventions ? [interventions] : []);

  const cleaned = values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  return [...new Set(cleaned)];
};

const validateInterventions = (interventions) => {
  const invalid = interventions.filter((item) => !REDUCTION_FACTORS[item]);
  if (invalid.length) {
    throw new Error(
      `Unknown intervention(s): ${invalid.join(', ')}. ` +
      `Valid options: ${Object.keys(REDUCTION_FACTORS).join(', ')}`
    );
  }
};

/**
 * simulateInterventions
 *
 * @param {number} aqi - Current station AQI
 * @param {string[]|string} interventions - One or more intervention names
 * @returns {{
 *   predictedAQI: number,
 *   improvementPct: number,
 *   aqiReduction: number,
 *   factor: number,
 *   appliedInterventions: string[],
 *   individualFactors: { intervention: string, factor: number }[]
 * }}
 *
 * Dummy combination logic:
 *   Final factor = product of selected intervention factors
 *   Example: ['Green Belt','Dust Control'] => 0.92 * 0.88 = 0.8096
 *
 * TODO: Replace with ML model prediction.
 */
const simulateInterventions = (aqi, interventions) => {
  // TODO: Replace with ML model prediction.
  const appliedInterventions = normalizeInterventions(interventions);

  if (!appliedInterventions.length) {
    throw new Error('At least one intervention is required.');
  }

  validateInterventions(appliedInterventions);

  const factor = appliedInterventions.reduce(
    (combined, intervention) => combined * REDUCTION_FACTORS[intervention],
    1
  );

  const predictedAQI   = Math.round(aqi * factor);
  const improvementPct = Math.round((1 - factor) * 100);
  const aqiReduction   = aqi - predictedAQI;

  return {
    predictedAQI,
    improvementPct,
    aqiReduction,
    factor: Number(factor.toFixed(4)),
    appliedInterventions,
    individualFactors: appliedInterventions.map((intervention) => ({
      intervention,
      factor: REDUCTION_FACTORS[intervention],
    })),
    // TODO: Add per-pollutant reduction breakdown later.
    // TODO: Add database later to persist simulation results.
  };
};

// Backward-compatible wrapper for legacy single-intervention calls.
const simulateIntervention = (aqi, intervention) =>
  simulateInterventions(aqi, [intervention]);

module.exports = { simulateIntervention, simulateInterventions, REDUCTION_FACTORS };
