/**
 * Filters.jsx
 * -------------------------------------------------------
 * Provides filter controls for the map and station list:
 *   - Zone type filter (Residential / Industrial / Commercial)
 *   - AQI range filter
 *
 * FUTURE IMPLEMENTATION:
 *   - Add date/time range picker for historical data.
 *   - TODO: Connect backend API later – send filter params as query
 *           string to GET /api/stations?zone=Industrial&minAqi=150
 */

import React from 'react';

const ZONE_TYPES  = ['All', 'Residential', 'Industrial', 'Commercial'];
const AQI_RANGES  = [
  { label: 'All AQI',       value: 'all' },
  { label: 'Good (≤100)',   value: 'good' },
  { label: 'Poor (101–200)',value: 'poor' },
  { label: 'Critical (>200)',value: 'critical' },
];

const pillBase = {
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap',
};

const Filters = ({ selectedZone, onZoneChange, selectedAQIRange, onAQIRangeChange }) => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(148,163,184,0.15)',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '12px',
  }}>
    {/* Zone Filter */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Zone:
      </span>
      {ZONE_TYPES.map((zone) => {
        const active = (selectedZone || 'All') === zone;
        return (
          <button
            key={zone}
            onClick={() => onZoneChange(zone === 'All' ? null : zone)}
            style={{
              ...pillBase,
              background: active ? 'rgba(56,189,248,0.85)' : 'rgba(30,41,59,0.9)',
              color:       active ? '#0f172a'               : '#94a3b8',
              borderColor: active ? 'transparent'           : 'rgba(148,163,184,0.2)',
            }}
          >
            {zone}
          </button>
        );
      })}
    </div>

    <div style={{ width: '1px', height: '22px', background: 'rgba(148,163,184,0.15)' }} />

    {/* AQI Range Filter */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        AQI:
      </span>
      {AQI_RANGES.map((range) => {
        const active = (selectedAQIRange || 'all') === range.value;
        return (
          <button
            key={range.value}
            onClick={() => onAQIRangeChange(range.value)}
            style={{
              ...pillBase,
              background: active ? 'rgba(167,139,250,0.85)' : 'rgba(30,41,59,0.9)',
              color:       active ? '#0f172a'                : '#94a3b8',
              borderColor: active ? 'transparent'            : 'rgba(148,163,184,0.2)',
            }}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default Filters;
