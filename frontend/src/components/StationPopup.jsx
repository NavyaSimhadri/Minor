/**
 * StationPopup.jsx
 * -------------------------------------------------------
 * Renders the Leaflet popup content for an AQI station marker.
 * Shows all pollutant readings and station metadata.
 *
 * FUTURE IMPLEMENTATION: Add real-time trend sparklines per pollutant.
 * TODO: Connect backend API later to fetch live station data on open.
 */

import React from 'react';
import { getAQIColor, getAQICategory } from '../utils/aqiUtils';

const StationPopup = ({ station }) => {
  if (!station) return null;

  const aqiColor = getAQIColor(station.aqi);
  const category = getAQICategory(station.aqi);

  const pollutants = [
    { label: 'PM2.5',    value: station.pm25, unit: 'µg/m³' },
    { label: 'PM10',     value: station.pm10, unit: 'µg/m³' },
    { label: 'NO₂',      value: station.no2,  unit: 'µg/m³' },
    { label: 'SO₂',      value: station.so2,  unit: 'µg/m³' },
    { label: 'CO',       value: station.co,   unit: 'mg/m³' },
    { label: 'O₃',       value: station.o3,   unit: 'µg/m³' },
    { label: 'Humidity', value: station.humidity, unit: '%' },
  ];

  return (
    <div style={{ minWidth: '200px', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Station Header */}
      <div style={{
        background: aqiColor,
        color: station.aqi <= 100 ? '#1a1a1a' : '#ffffff',
        padding: '8px 10px',
        borderRadius: '4px 4px 0 0',
        marginBottom: '0',
      }}>
        <strong style={{ fontSize: '0.95rem' }}>{station.name}</strong>
        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{station.zone_type}</div>
      </div>

      {/* AQI Value */}
      <div style={{
        background: '#1e293b',
        padding: '8px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(148,163,184,0.15)',
      }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>AQI</span>
        <span style={{
          color: aqiColor,
          fontWeight: 800,
          fontSize: '1.3rem',
        }}>{station.aqi}</span>
        <span style={{
          color: aqiColor,
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>{category}</span>
      </div>

      {/* Pollutant Grid */}
      <div style={{
        background: '#1e293b',
        padding: '8px 10px',
        borderRadius: '0 0 4px 4px',
      }}>
        {pollutants.map((p) => (
          <div key={p.label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '2px 0',
            borderBottom: '1px solid rgba(148,163,184,0.08)',
          }}>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{p.label}</span>
            <span style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600 }}>
              {p.value} {p.unit}
            </span>
          </div>
        ))}

        {/* Coordinates */}
        <div style={{ marginTop: '6px', fontSize: '0.68rem', color: '#475569' }}>
          📍 {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
        </div>
      </div>
    </div>
  );
};

export default StationPopup;
