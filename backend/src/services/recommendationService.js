/**
 * recommendationService.js – AI-Driven Intervention Recommendation
 * -------------------------------------------------------
 * Intelligent intervention recommendation engine that:
 *  1. Identifies dominant pollutant
 *  2. Filters interventions by pollutant + zone
 *  3. Applies interventions to predict new AQI
 *  4. Uses ML to predict actual AQI after intervention
 *  5. Ranks by effectiveness and cost
 *
 * CORE LOGIC: PRIMARY filter → dominant pollutant
 *             SECONDARY filter → zone match
 */

const axios = require("axios");
const INTERVENTIONS = require("../data/interventions");

/**
 * Find the dominant (highest concentration) pollutant
 * @param {Object} station - Station data with pollutants
 * @returns {string} - Pollutant key (pm25, pm10, no2, so2, co, o3)
 */
const getDominantPollutant = (station) => {
  const pollutants = {
    pm25: station.pm25,
    pm10: station.pm10,
    no2: station.no2,
    so2: station.so2,
    co: station.co,
    o3: station.o3,
  };

  let maxKey = null;
  let maxValue = -Infinity;

  for (let key in pollutants) {
    if (pollutants[key] > maxValue) {
      maxValue = pollutants[key];
      maxKey = key;
    }
  }

  return maxKey;
};

/**
 * Filter interventions based on:
 *  PRIMARY: targets dominant pollutant
 *  SECONDARY: matches zone type
 *  FALLBACK: if none match, return all
 *
 * @param {Object} station - Station data with zone_type
 * @param {string} dominant - Dominant pollutant
 * @returns {Array} - Names of applicable interventions
 */
const filterInterventions = (station, dominant) => {
  const filtered = [];

  for (let [name, config] of Object.entries(INTERVENTIONS)) {
    
    const targetsMatch = config.targets.includes(dominant);
    const zoneMatch = config.suitableZones.includes(station.zone_type);

    // PRIMARY: pollutant match
    // SECONDARY: zone match
    if (targetsMatch && zoneMatch) {
      filtered.push(name);
    }
  }

  // fallback if empty
  if (filtered.length === 0) {
    return Object.keys(INTERVENTIONS);
  }

  return filtered;
};

/**
 * Apply intervention reductions to a station's pollutants
 * @param {Object} station - Original station data
 * @param {string} intervention - Intervention name
 * @returns {Object} - Modified station with reduced pollutants
 */
const applyIntervention = (station, intervention) => {
  const modified = { ...station };
  const reductions = INTERVENTIONS[intervention].reductions;

  for (let key in reductions) {
    if (modified[key] !== undefined) {
      modified[key] = modified[key] * (1 - reductions[key]);
    }
  }

  return modified;
};

/**
 * Safe conversion to number (handles NaN)
 * @param {any} v - Value to convert
 * @returns {number} - Safe number or 0
 */
const safe = (v) => (isNaN(v) ? 0 : Number(v));

/**
 * Call ML service to predict AQI after intervention
 * @param {Object} data - Pollutant data
 * @returns {Promise<number>} - Predicted AQI
 */
const predictAQI = async (data) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/predict", {
      pm25: safe(data.pm25),
      pm10: safe(data.pm10),
      no2: safe(data.no2),
      so2: safe(data.so2),
      co: safe(data.co),
      o3: safe(data.o3),
    });

    return res.data.predicted_aqi;
  } catch (err) {
    console.error("ML prediction error:", err.message);
    throw err;
  }
};

/**
 * MAIN RECOMMENDATION ENGINE
 * Analyzes all interventions and returns the best one
 *
 * @param {Object} station - Station data
 * @returns {Promise<Object>} - {best, all} interventions with predictions
 */
const recommendBestIntervention = async (station) => {
  const dominant = getDominantPollutant(station);

  console.log(`[RECOMMENDATION] Station: ${station.name}, Dominant: ${dominant}`);

  const candidates = filterInterventions(station, dominant);
  console.log(`[RECOMMENDATION] Filtered candidates: ${candidates.length}`);

  let best = null;
  const results = [];

  for (let intervention of candidates) {
    const modified = applyIntervention(station, intervention);

    try {
      const predictedAQI = await predictAQI(modified);

      const improvement = ((station.aqi - predictedAQI) / station.aqi) * 100;
      const cost = INTERVENTIONS[intervention].costPerUnit * 1000;

      const result = {
        intervention,
        predictedAQI: Number(predictedAQI.toFixed(2)),
        improvement: Number(improvement.toFixed(2)),
        cost,
        dominantPollutant: dominant
      };

      results.push(result);

      if (!best || predictedAQI < best.predictedAQI) {
        best = result;
      }

      console.log(`  ✓ ${intervention}: AQI ${result.predictedAQI} (${result.improvement}%)`);

    } catch (err) {
      console.log(`  ✗ ${intervention}: ML error - ${err.message}`);
    }
  }

  return { best, all: results };
};

module.exports = {
  getDominantPollutant,
  filterInterventions,
  applyIntervention,
  predictAQI,
  recommendBestIntervention
};
