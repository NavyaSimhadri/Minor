/**
 * Dashboard.jsx
 * -------------------------------------------------------
 * Main dashboard layout for the Digital Twin AQI System.
 * Assembles all panels: header, stats cards, map, simulation
 * panel, and station data table.
 *
 * Layout  (desktop):
 *   ┌─ Header ──────────────────────────────────────────┐
 *   ├─ Stats Cards ──────────────────────────────────────┤
 *   ├─ Filters ──────────────────────────────────────────┤
 *   ├─────────────────────────┬──────────────────────────┤
 *   │  Map (60%)              │  Simulation Panel (40%)  │
 *   ├─────────────────────────┴──────────────────────────┤
 *   │  Station Data Table                                │
 *   └────────────────────────────────────────────────────┘
 *
 * FUTURE IMPLEMENTATION:
 *   - Add chart panel with AQI trend over time.
 *   - Add alert notification feed.
 *   - TODO: Connect backend API later.
 */

import React, { useState, useEffect, useCallback } from 'react';
import MapView          from './MapView';
import StatsCards       from './StatsCards';
import SimulationPanel  from './SimulationPanel';
import Filters          from './Filters';
import { getAQIColor, getAQICategory } from '../utils/aqiUtils';
import { fetchStations } from '../services/api';

// ─── Station Table Row ────────────────────────────────────────────────────
const TableRow = ({ station, isSelected, onSelect }) => {
  const color = getAQIColor(station.aqi);
  return (
    <tr
      onClick={() => onSelect(station)}
      style={{
        cursor: 'pointer',
        background: isSelected ? 'rgba(56,189,248,0.1)' : 'transparent',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
        transition: 'background 0.15s',
      }}
    >
      <td style={{ padding: '8px 10px', color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
        {station.name}
      </td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>
        {station.zone_type}
      </td>
      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
        <span style={{
          background: `${color}22`,
          color,
          border: `1px solid ${color}55`,
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.82rem',
        }}>
          {station.aqi}
        </span>
      </td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color, fontWeight: 600 }}>
        {getAQICategory(station.aqi)}
      </td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>{station.pm25}</td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>{station.pm10}</td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>{station.no2}</td>
      <td style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>{station.humidity}%</td>
    </tr>
  );
};

// ─── Dashboard Component ──────────────────────────────────────────────────
const Dashboard = () => {
  const [stations,        setStations]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [fetchError,      setFetchError]      = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filterZone,      setFilterZone]      = useState(null);
  const [filterAQIRange,  setFilterAQIRange]  = useState('all');

  // Fetch stations from backend on mount
  const loadStations = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await fetchStations();
      setStations(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStations(); }, [loadStations]);

  // Apply filters to station table
  const filteredStations = stations.filter((s) => {
    const zoneOk = !filterZone || s.zone_type === filterZone;
    let aqiOk = true;
    if (filterAQIRange === 'good')     aqiOk = s.aqi <= 100;
    if (filterAQIRange === 'poor')     aqiOk = s.aqi > 100 && s.aqi <= 200;
    if (filterAQIRange === 'critical') aqiOk = s.aqi > 200;
    return zoneOk && aqiOk;
  });

  // ─── Loading / Error States ─────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px' }}>
      <div style={{ fontSize: '2rem' }}>🌐</div>
      <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1rem' }}>Connecting to backend…</div>
      <div style={{ color: '#475569', fontSize: '0.78rem' }}>GET /api/stations via http://localhost:5000</div>
    </div>
  );

  if (fetchError) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px' }}>
      <div style={{ fontSize: '2rem' }}>⚠️</div>
      <div style={{ color: '#f87171', fontWeight: 700 }}>Backend unreachable</div>
      <div style={{ color: '#64748b', fontSize: '0.78rem', maxWidth: '360px', textAlign: 'center' }}>{fetchError}</div>
      <button
        onClick={loadStations}
        style={{ marginTop: '8px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '12px 16px', gap: '0' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0 12px',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.01em' }}>
            🌐 Digital Twin – Air Quality Monitoring
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            Hyderabad · {stations.length} Stations · Live from Backend API
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Backend-connected badge */}
          <span style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '10px',
            textTransform: 'uppercase',
          }}>⚙ Prototype</span>

          {/* Live badge */}
          <span style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Backend Connected
          </span>

          <span style={{ fontSize: '0.72rem', color: '#475569' }}>
            {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
          </span>
        </div>
      </header>

      {/* ── Stats Cards ───────────────────────────────────────────────── */}
      <StatsCards stations={stations} />

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <Filters
        selectedZone={filterZone}
        onZoneChange={setFilterZone}
        selectedAQIRange={filterAQIRange}
        onAQIRangeChange={setFilterAQIRange}
      />

      {/* ── Map + Simulation Panel ────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flex: '1 1 380px',
        minHeight: '380px',
        marginBottom: '12px',
      }}>
        {/* Map */}
        <div style={{ flex: '0 0 60%', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.15)' }}>
          <MapView
            stations={stations}
            selectedStationId={selectedStation?.id}
            onStationSelect={setSelectedStation}
            filterZone={filterZone}
          />
        </div>

        <div style={{ flex: '0 0 calc(40% - 12px)', overflowY: 'auto' }}>
          <SimulationPanel stations={stations} selectedStation={selectedStation} />
        </div>
      </div>

      {/* ── Station Data Table ────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.85)',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '12px',
        height: 'calc(100vh - 560px)',
        minHeight: '320px',
        maxHeight: '70vh',
        overflowY: 'auto',
        overflowX: 'auto',
      }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Station Data — {filteredStations.length} of {stations.length} stations
          </h3>
          <span style={{ fontSize: '0.7rem', color: '#475569' }}>
            Live from backend API · Click row to highlight on map
          </span>
        </div>

        <table style={{ minWidth: '900px', width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#0f172a', zIndex: 1 }}>
            <tr>
              {['Station', 'Zone', 'AQI', 'Category', 'PM2.5', 'PM10', 'NO₂', 'Humidity'].map((h) => (
                <th key={h} style={{
                  padding: '7px 10px',
                  textAlign: h === 'AQI' ? 'center' : 'left',
                  fontSize: '0.68rem',
                  color: '#64748b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStations.map((s) => (
              <TableRow
                key={s.id}
                station={s}
                isSelected={selectedStation?.id === s.id}
                onSelect={setSelectedStation}
              />
            ))}
          </tbody>
        </table>

        {filteredStations.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: '0.82rem' }}>
            No stations match the selected filters.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ fontSize: '0.65rem', color: '#334155', textAlign: 'center', paddingBottom: '4px' }}>
        Digital Twin AQI · Prototype v1.0 · Hyderabad, India ·
        &nbsp;Backend API Connected · Dummy simulation logic (ML pending)
      </footer>
    </div>
  );
};

export default Dashboard;
