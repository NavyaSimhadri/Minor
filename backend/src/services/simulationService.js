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
const axios = require('axios');

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATA_DIR = path.join(__dirname, '../data/aqi');

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
const simulateInterventions = async (station, interventions) => {
  let modified = { ...station };

  // Apply intervention effects
  if (interventions.includes('Green Belt')) {
    modified.pm25 *= 0.9;
  }

  if (interventions.includes('Dust Control')) {
    modified.pm10 *= 0.85;
  }

  if (interventions.includes('Emission Control')) {
    modified.no2 *= 0.8;
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/predict', {
      pm25: modified.pm25,
      pm10: modified.pm10,
      no2: modified.no2,
      so2: modified.so2,
      co: modified.co,
      o3: modified.o3,
    });

    const predictedAQI = response.data.predicted_aqi;

    return {
      predictedAQI,
      improvementPct: Math.round(
        ((station.aqi - predictedAQI) / station.aqi) * 100
      ),
      aqiReduction: station.aqi - predictedAQI,
      appliedInterventions: interventions,
    };

  } catch (err) {
    throw new Error("ML service error: " + err.message);
  }
};

// Backward-compatible wrapper for legacy single-intervention calls.
const simulateIntervention = (aqi, intervention) =>
  simulateInterventions(aqi, [intervention]);

function loadAllStations() {
  return new Promise((resolve, reject) => {
    const results = [];
    const files = fs.readdirSync(DATA_DIR);

    let pending = files.length;

    files.forEach(file => {
      fs.createReadStream(path.join(DATA_DIR, file))
        .pipe(csv())
        .on('data', (row) => {
          results.push({
            id: results.length + 1,
            name: row.station || "Station",
            aqi: Number(row.FINAL_AQI),
            pm25: Number(row['PM2.5']),
            pm10: Number(row['PM10']),
            no2: Number(row['NO2']),
            so2: Number(row['SO2']),
            co: Number(row['CO']),
            o3: Number(row['O3']),
            humidity: 50,
            zone_type: "Urban",
            latitude: 17.3 + Math.random() * 0.3,
            longitude: 78.3 + Math.random() * 0.3,
          });
        })
        .on('end', () => {
          pending--;
          if (pending === 0) resolve(results);
        })
        .on('error', reject);
    });
  });
}
module.exports = { simulateIntervention, simulateInterventions, REDUCTION_FACTORS,loadAllStations };
