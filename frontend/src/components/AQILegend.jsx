/**
 * AQILegend.jsx
 * -------------------------------------------------------
 * Displays a colour-coded AQI scale legend on the map.
 * Positioned as an overlay inside the Leaflet map container.
 */

import React from 'react';

const legendItems = [
  { range: '0–50',   label: 'Good',          color: '#00e400' },
  { range: '51–100', label: 'Satisfactory',   color: '#ffff00' },
  { range: '101–200',label: 'Poor',           color: '#ff7e00' },
  { range: '201–300',label: 'Very Poor',      color: '#ff0000' },
  { range: '300+',   label: 'Severe',         color: '#8f3f97' },
];

const styles = {
  container: {
    position: 'absolute',
    bottom: '30px',
    right: '10px',
    zIndex: 1000,
    background: 'rgba(15, 23, 42, 0.92)',
    border: '1px solid rgba(148,163,184,0.25)',
    borderRadius: '8px',
    padding: '12px 16px',
    minWidth: '170px',
    backdropFilter: 'blur(6px)',
  },
  title: {
    color: '#94a3b8',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '5px',
  },
  swatch: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.15)',
  },
  rangeText: {
    fontSize: '0.72rem',
    color: '#cbd5e1',
    minWidth: '52px',
  },
  labelText: {
    fontSize: '0.72rem',
    color: '#94a3b8',
  },
};

const AQILegend = () => (
  <div style={styles.container}>
    <div style={styles.title}>AQI Legend</div>
    {legendItems.map((item) => (
      <div key={item.range} style={styles.row}>
        <div style={{ ...styles.swatch, backgroundColor: item.color }} />
        <span style={styles.rangeText}>{item.range}</span>
        <span style={styles.labelText}>{item.label}</span>
      </div>
    ))}
  </div>
);

export default AQILegend;
