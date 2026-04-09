/**
 * interventions.js – Intervention Configurations
 * -------------------------------------------------------
 * Defines available air quality interventions with their
 * pollutant reduction rates, suitable zones, and costs.
 *
 * Each intervention targets specific pollutants and is
 * suitable for certain zone types.
 */

const INTERVENTIONS = {
  "Green Walls / Vertical Gardens": {
    reductions: { pm25: 0.18, pm10: 0.22, no2: 0.10 },
    targets: ["pm25", "pm10"],
    suitableZones: ["Residential", "Commercial"],
    costPerUnit: 2000
  },

  "Biofilters (Algae / Moss Systems)": {
    reductions: { pm25: 0.30, pm10: 0.25, no2: 0.18 },
    targets: ["pm25", "pm10", "no2"],
    suitableZones: ["Industrial"],
    costPerUnit: 50000
  },

  "Roadside Air Purifiers": {
    reductions: { pm25: 0.50 },
    targets: ["pm25"],
    suitableZones: ["Commercial", "Industrial"],
    costPerUnit: 100000
  },

  "Electric Vehicle Adoption": {
    reductions: { no2: 0.35, co: 0.45, pm25: 0.15 },
    targets: ["no2", "co"],
    suitableZones: ["Commercial", "Industrial"],
    costPerUnit: 800000
  }
};

module.exports = INTERVENTIONS;
