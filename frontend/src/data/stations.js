/**
 * Mock Dataset – 7 Hyderabad AQI Monitoring Stations
 * -------------------------------------------------------
 * PROTOTYPE DATA: All values are realistic but STATIC mock data.
 * TODO: Replace mock dataset with real-time CSV / database feed.
 * TODO: Connect backend API later to fetch live sensor readings.
 *
 * AQI Scale Reference:
 *   0–50   → Good
 *   51–100  → Satisfactory
 *   101–200 → Moderate / Poor
 *   201–300 → Very Poor
 *   300+   → Severe
 */
/*
const stations = [
  {
    id: 1,
    name: 'Banjara Hills',
    latitude: 17.4156,
    longitude: 78.4347,
    aqi: 142,
    aqi_category: 'Poor',
    pm25: 58.4,
    pm10: 92.3,
    no2: 38.1,
    so2: 12.5,
    co: 1.4,
    o3: 44.2,
    humidity: 61,
    zone_type: 'Residential',
  },
  {
    id: 2,
    name: 'Secunderabad',
    latitude: 17.4399,
    longitude: 78.4983,
    aqi: 175,
    aqi_category: 'Poor',
    pm25: 74.6,
    pm10: 118.2,
    no2: 52.3,
    so2: 21.0,
    co: 2.1,
    o3: 38.7,
    humidity: 55,
    zone_type: 'Industrial',
  },
  {
    id: 3,
    name: 'HITEC City',
    latitude: 17.4435,
    longitude: 78.3772,
    aqi: 98,
    aqi_category: 'Satisfactory',
    pm25: 36.2,
    pm10: 68.4,
    no2: 24.7,
    so2: 8.3,
    co: 0.9,
    o3: 52.1,
    humidity: 65,
    zone_type: 'Commercial',
  },
  {
    id: 4,
    name: 'Kukatpally',
    latitude: 17.4849,
    longitude: 78.3996,
    aqi: 165,
    aqi_category: 'Poor',
    pm25: 68.9,
    pm10: 108.7,
    no2: 47.8,
    so2: 18.4,
    co: 1.8,
    o3: 41.6,
    humidity: 58,
    zone_type: 'Residential',
  },
  {
    id: 5,
    name: 'LB Nagar',
    latitude: 17.3478,
    longitude: 78.5529,
    aqi: 188,
    aqi_category: 'Poor',
    pm25: 82.1,
    pm10: 126.5,
    no2: 58.9,
    so2: 24.3,
    co: 2.4,
    o3: 36.2,
    humidity: 52,
    zone_type: 'Industrial',
  },
  {
    id: 6,
    name: 'Patancheru',
    latitude: 17.5325,
    longitude: 78.2640,
    aqi: 210,
    aqi_category: 'Very Poor',
    pm25: 96.3,
    pm10: 148.9,
    no2: 67.4,
    so2: 32.7,
    co: 3.1,
    o3: 29.8,
    humidity: 48,
    zone_type: 'Industrial',
  },
  {
    id: 7,
    name: 'Jubilee Hills',
    latitude: 17.4318,
    longitude: 78.4072,
    aqi: 85,
    aqi_category: 'Satisfactory',
    pm25: 30.7,
    pm10: 58.2,
    no2: 19.4,
    so2: 6.8,
    co: 0.7,
    o3: 56.4,
    humidity: 68,
    zone_type: 'Residential',
  },
];

export default stations;
 */