/**
 * StatsCards.jsx
 * -------------------------------------------------------
 * Displays summary statistics computed across all 7 monitoring
 * stations: average AQI, worst/best station, PM2.5 avg, and
 * station status distribution.
 *
 * FUTURE IMPLEMENTATION:
 *   - Add trend indicators (↑↓) comparing to previous hour.
 *   - TODO: Connect backend API later – stats derived from live data.
 */

import React from 'react';
import { computeStats, getAQIColor } from '../utils/aqiUtils';
// Stations are now passed as a prop from Dashboard (fetched from backend).

// ─── Individual Stat Card ─────────────────────────────────────────────────
const Card = ({ title, value, sub, accentColor, icon }) => (
  <div style={{
    background: 'rgba(30, 41, 59, 0.85)',
    border: `1px solid ${accentColor}44`,
    borderLeft: `4px solid ${accentColor}`,
    borderRadius: '8px',
    padding: '14px 16px',
    flex: '1 1 140px',
    minWidth: '130px',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </span>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    </div>
    <div style={{
      fontSize: '1.8rem',
      fontWeight: 800,
      color: accentColor,
      lineHeight: 1.1,
      margin: '4px 0 2px',
    }}>
      {value}
    </div>
    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{sub}</div>
  </div>
);

// ─── Station Status Pills ─────────────────────────────────────────────────
const StatusPills = ({ stats }) => (
  <div style={{
    background: 'rgba(30, 41, 59, 0.85)',
    border: '1px solid rgba(148,163,184,0.15)',
    borderRadius: '8px',
    padding: '14px 16px',
    flex: '1 1 200px',
    minWidth: '180px',
  }}>
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
      Station Status
    </div>
    {[
      { label: 'Critical (>200)', count: stats.criticalCount, color: '#ff0000' },
      { label: 'Poor (101–200)',  count: stats.poorCount,     color: '#ff7e00' },
      { label: 'Good (≤100)',     count: stats.goodCount,     color: '#00e400' },
    ].map(({ label, count, color }) => (
      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{label}</span>
        </div>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color }}>{count}</span>
      </div>
    ))}
  </div>
);

// ─── StatsCards Component ─────────────────────────────────────────────────
// Receives stations array as prop from Dashboard (fetched from backend).
const StatsCards = ({ stations = [] }) => {
  if (!stations.length) return null;

  const stats        = computeStats(stations);
  const worstStation = stations.reduce((a, b) => (a.aqi > b.aqi ? a : b));
  const bestStation  = stations.reduce((a, b) => (a.aqi < b.aqi ? a : b));

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '16px',
    }}>
      <Card
        title="Average AQI"
        value={stats.avgAQI}
        sub={`All ${stations.length} stations`}
        accentColor={getAQIColor(parseFloat(stats.avgAQI))}
        icon="📊"
      />
      <Card
        title="Worst Station"
        value={stats.maxAQI}
        sub={worstStation.name}
        accentColor="#ff0000"
        icon="⚠️"
      />
      <Card
        title="Best Station"
        value={stats.minAQI}
        sub={bestStation.name}
        accentColor="#00e400"
        icon="✅"
      />
      <Card
        title="Avg PM2.5"
        value={stats.avgPM25}
        sub="µg/m³ across all"
        accentColor="#60a5fa"
        icon="🌫️"
      />
      <Card
        title="Avg PM10"
        value={stats.avgPM10}
        sub="µg/m³ across all"
        accentColor="#a78bfa"
        icon="💨"
      />
      <StatusPills stats={stats} />
    </div>
  );
};

export default StatsCards;
