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

const safe = (v) => (isNaN(v) ? 0 : Number(v));

// ─── Hyderabad Station Coordinates ────────────────────────────────────────
const STATION_COORDINATES = {
  'Bollaram Industrial Area': { lat: 17.5304, lng: 78.2678 },
  'Central University': { lat: 17.4599, lng: 78.3320 },
  'ECIL KAPRA': { lat: 17.4800, lng: 78.5700 },
  'ICRISAT Patancheru': { lat: 17.5115, lng: 78.2751 },
  'IDA Pashamylaram': { lat: 17.5303, lng: 78.1820 },
  'IITH': { lat: 17.5931, lng: 78.1236 },
  'KHAIRTHABAD': { lat: 17.4128, lng: 78.4580 },
  'KOKAPET': { lat: 17.3954, lng: 78.3346 },
  'KOMPALLY': { lat: 17.5333, lng: 78.4833 },
  'MALAKPET': { lat: 17.3775, lng: 78.5026 },
  'NACHARAM': { lat: 17.4308, lng: 78.5595 },
  'SYMPHONY': { lat: 17.4333, lng: 78.3833 },
  'ECIL': { lat: 17.4640, lng: 78.5789 },
  'Sanathnagar': { lat: 17.4562, lng: 78.4435 },
  'Zoo Park': { lat: 17.3511, lng: 78.4497 },
};

const REDUCTION_FACTORS = {
  'Green Walls / Vertical Gardens':         0.82, // 18% AQI reduction
  'Biofilters (Algae / Moss Systems)':      0.70, // 30% AQI reduction
  'Roadside Air Purifiers':                 0.50, // 50% AQI reduction
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
 *   Example: ['Green Walls / Vertical Gardens','Biofilters (Algae / Moss Systems)'] => 0.82 * 0.70 = 0.574
 *
 * TODO: Replace with ML model prediction.
 */
const simulateInterventions = async (station, interventions) => {
  let modified = { ...station };

  // Apply intervention effects
  if (interventions.includes('Green Walls / Vertical Gardens')) {
    modified.pm25 *= 0.88;
    modified.pm10 *= 0.80;
  }

  if (interventions.includes('Biofilters (Algae / Moss Systems)')) {
    modified.pm25 *= 0.75;
    modified.pm10 *= 0.75;
    modified.no2 *= 0.82;
  }

  if (interventions.includes('Roadside Air Purifiers')) {
    modified.pm25 *= 0.60;
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
          const zones = ['Residential', 'Industrial', 'Commercial'];
          const stationName = row.station || "Station";
          const coords = STATION_COORDINATES[stationName] || {
            lat: 17.3 + Math.random() * 0.3,
            lng: 78.3 + Math.random() * 0.3
          };

          results.push({
            id: results.length + 1,
            name: stationName,
            pm25: safe(row.pm25),
            pm10: safe(row.pm10),
            no2: safe(row.no2),
            so2: safe(row.so2),
            co: safe(row.co),
            o3: safe(row.o3),
            humidity: safe(row.humidity || 50),
            aqi: safe(row.FINAL_AQI),   
            zone_type: zones[Math.floor(Math.random() * zones.length)],
            latitude: coords.lat,
            longitude: coords.lng,
            
          });
        })
        .on('end', () => {
          pending--;
          if (pending === 0) {
  // 🔥 GROUP BY STATION NAME
  const stationMap = {};

  results.forEach((row) => {
    const key = row.name;

    if (!stationMap[key]) {
      stationMap[key] = { ...row, count: 1 };
    } else {
      const s = stationMap[key];
      s.aqi += row.aqi;
      s.pm25 += row.pm25;
      s.pm10 += row.pm10;
      s.no2 += row.no2;
      s.so2 += row.so2;
      s.co += row.co;
      s.o3 += row.o3;
      s.count++;
    }
  });

  // 🔥 CREATE FINAL AVERAGED DATA
  const finalStations = Object.values(stationMap).map((s, i) => ({
    id: i + 1,
    name: s.name,
    aqi: s.aqi / s.count,
    pm25: s.pm25 / s.count,
    pm10: s.pm10 / s.count,
    no2: s.no2 / s.count,
    so2: s.so2 / s.count,
    co: s.co / s.count,
    o3: s.o3 / s.count,
    humidity: s.humidity,
    zone_type: s.zone_type,
    latitude: s.latitude,
    longitude: s.longitude,
  }));

  resolve(finalStations); // ✅ IMPORTANT
}
        })
        .on('error', reject);
    });
  });
}
module.exports = { simulateIntervention, simulateInterventions, REDUCTION_FACTORS,loadAllStations };
