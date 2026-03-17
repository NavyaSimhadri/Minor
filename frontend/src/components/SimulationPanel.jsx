/**
 * SimulationPanel.jsx
 * -------------------------------------------------------
 * Allows user to select a station and an intervention type,
 * then runs a DUMMY simulation to show predicted AQI improvement.
 *
 * ⚠️  DUMMY SIMULATION – Prototype only.
 *      Reduction factors are hardcoded percentages.
 *
 * TODO: Replace dummy logic with ML model prediction.
 * TODO: Connect backend API later – POST /api/simulate with
 *       { station, intervention } and receive model-predicted AQI.
 * TODO: ML INTEGRATION POINT – simulateIntervention() should call
 *       the Python prediction service once the model is trained.
 */

import React, { useState } from 'react';
import { INTERVENTION_OPTIONS, getAQIColor } from '../utils/aqiUtils';
import { postSimulate } from '../services/api';
// Stations are passed as a prop from Dashboard (fetched from backend).

// ─── Result Block ─────────────────────────────────────────────────────────
const ResultBlock = ({ result, stationName, interventions }) => {
  const currentColor  = getAQIColor(result.currentAQI);
  const predictedColor = getAQIColor(result.predictedAQI);

  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(15, 23, 42, 0.7)',
      border: '1px solid rgba(96,165,250,0.3)',
      borderRadius: '8px',
      padding: '14px',
    }}>
      {/* Dummy flag */}
      <div style={{
        background: 'rgba(251,191,36,0.15)',
        border: '1px solid rgba(251,191,36,0.4)',
        borderRadius: '4px',
        padding: '4px 10px',
        marginBottom: '12px',
        fontSize: '0.7rem',
        color: '#fbbf24',
        textAlign: 'center',
      }}>
        ⚠️ DUMMY SIMULATION RESULT — Prototype Only
      </div>

      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
        Station: <strong style={{ color: '#e2e8f0' }}>{stationName}</strong>
        &nbsp;·&nbsp;
        Interventions: <strong style={{ color: '#e2e8f0' }}>{interventions.join(', ')}</strong>
      </div>

      {/* AQI Comparison */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Current AQI */}
        <div style={{
          flex: 1,
          background: 'rgba(30,41,59,0.9)',
          border: `1px solid ${currentColor}55`,
          borderRadius: '6px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '4px' }}>
            CURRENT AQI
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: currentColor }}>
            {result.currentAQI}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '1.5rem', color: '#38bdf8' }}>→</div>

        {/* Predicted AQI */}
        <div style={{
          flex: 1,
          background: 'rgba(30,41,59,0.9)',
          border: `1px solid ${predictedColor}55`,
          borderRadius: '6px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '4px' }}>
            PREDICTED AQI
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: predictedColor }}>
            {result.predictedAQI}
          </div>
        </div>
      </div>

      {/* Improvement Badge */}
      <div style={{
        marginTop: '10px',
        textAlign: 'center',
        background: 'rgba(16,185,129,0.15)',
        border: '1px solid rgba(16,185,129,0.35)',
        borderRadius: '6px',
        padding: '8px',
      }}>
        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
          ↓ {result.improvementPct}% Improvement
        </span>
        <div style={{ fontSize: '0.68rem', color: '#6b7280', marginTop: '2px' }}>
          AQI reduced by {result.currentAQI - result.predictedAQI} units
        </div>
      </div>

      {/* TODO comment callout */}
      <div style={{
        marginTop: '10px',
        fontSize: '0.65rem',
        color: '#475569',
        borderTop: '1px solid rgba(148,163,184,0.1)',
        paddingTop: '8px',
      }}>
        {/* TODO: Replace with ML model prediction later */}
        {/* TODO: Connect backend API later */}
        💡 Future: This result will come from a trained Random Forest ML model
        via <code style={{ color: '#60a5fa' }}>POST /api/stations/simulate</code>
      </div>
    </div>
  );
};

// ─── SimulationPanel Component ────────────────────────────────────────────
// Receives stations array as prop from Dashboard (fetched from backend).
const SimulationPanel = ({ stations = [] }) => {
  const [selectedStationId, setSelectedStationId]   = useState('');
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const selectedStation = stations.find((s) => s.id === parseInt(selectedStationId));

  const [apiError, setApiError] = useState(null);

  const handleSimulate = async () => {
    if (!selectedStation || !selectedInterventions.length) return;

    setRunning(true);
    setResult(null);
    setApiError(null);

    try {
      // Real API call to backend POST /api/stations/simulate
      // TODO: Replace with ML model prediction later when Python service is ready.
      const data = await postSimulate(selectedStation.id, selectedInterventions);
      setResult(data);
    } catch (err) {
      setApiError(`Backend error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedStationId('');
    setSelectedInterventions([]);
    setApiError(null);
  };

  const toggleIntervention = (value) => {
    setSelectedInterventions((previous) => {
      const exists = previous.includes(value);
      if (exists) return previous.filter((item) => item !== value);
      return [...previous, value];
    });
    setResult(null);
  };

  const interventionDescriptions = {
    'Green Belt': '🌳 Plant trees & green corridors. Dummy: AQI × 0.92 (−8%)',
    'Dust Control': '💧 Water sprinklers & road sweeping. Dummy: AQI × 0.88 (−12%)',
    'Emission Control': '🏭 Restrict industrial emissions. Dummy: AQI × 0.85 (−15%)',
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(148,163,184,0.25)',
    borderRadius: '6px',
    padding: '8px 10px',
    color: '#e2e8f0',
    fontSize: '0.82rem',
    outline: 'none',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontSize: '0.72rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.85)',
      border: '1px solid rgba(148,163,184,0.15)',
      borderRadius: '10px',
      padding: '16px',
    }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#38bdf8', fontWeight: 700 }}>
            🔬 Intervention Simulator
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#64748b' }}>
            Powered by backend API · Dummy logic (ML pending)
          </p>
        </div>
        <span style={{
          background: 'rgba(56,189,248,0.15)',
          border: '1px solid rgba(56,189,248,0.4)',
          color: '#38bdf8',
          fontSize: '0.6rem',
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: '10px',
          textTransform: 'uppercase',
        }}>
          Demo Mode
        </span>
      </div>

      {/* Station Select */}
      <div style={{ marginBottom: '12px' }}>
        <label style={labelStyle}>Select Station</label>
        <select
          style={inputStyle}
          value={selectedStationId}
          onChange={(e) => { setSelectedStationId(e.target.value); setResult(null); }}
        >
          <option value="">-- Choose a station --</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (AQI: {s.aqi} · {s.zone_type})
            </option>
          ))}
        </select>
      </div>

      {/* Intervention Select (Multiple) */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Select Intervention(s)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {INTERVENTION_OPTIONS.map((opt) => {
            const checked = selectedInterventions.includes(opt.value);
            return (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  background: checked ? 'rgba(56,189,248,0.12)' : 'rgba(15, 23, 42, 0.8)',
                  border: checked
                    ? '1px solid rgba(56,189,248,0.5)'
                    : '1px solid rgba(148,163,184,0.25)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleIntervention(opt.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#e2e8f0', fontSize: '0.82rem', fontWeight: 600 }}>
                    {opt.label}
                  </span>
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.74rem' }}>≈ {opt.reduction}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Intervention Description */}
      {selectedInterventions.length > 0 && (
        <div style={{
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '6px',
          padding: '8px 10px',
          marginBottom: '12px',
          fontSize: '0.72rem',
          color: '#94a3b8',
        }}>
          {selectedInterventions.map((item) => (
            <div key={item} style={{ marginBottom: '4px' }}>
              {interventionDescriptions[item]}
            </div>
          ))}
          <br /><span style={{ color: '#475569' }}>
            {/* TODO: Replace with ML model prediction later */}
            TODO: Replace with ML model prediction later
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleSimulate}
          disabled={!selectedStation || !selectedInterventions.length || running}
          style={{
            flex: 1,
            background: (!selectedStation || !selectedInterventions.length || running)
              ? 'rgba(56,189,248,0.2)'
              : 'rgba(56,189,248,0.85)',
            color: '#0f172a',
            border: 'none',
            borderRadius: '6px',
            padding: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: (!selectedStation || !selectedInterventions.length) ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {running ? '⏳ Simulating...' : '▶ Run Simulation'}
        </button>
        {result && (
          <button
            onClick={handleReset}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1px solid rgba(148,163,184,0.25)',
              borderRadius: '6px',
              padding: '10px 14px',
              cursor: 'pointer',
              fontSize: '0.82rem',
            }}
          >
            ↺ Reset
          </button>
        )}
      </div>

      {/* API Error */}
      {apiError && (
        <div style={{
          marginTop: '10px',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '0.78rem',
          color: '#f87171',
        }}>
          ⚠️ {apiError}
        </div>
      )}

      {/* Simulation Result */}
      {result && (
        <ResultBlock
          result={result}
          stationName={selectedStation?.name}
          interventions={result.appliedInterventions?.length ? result.appliedInterventions : selectedInterventions}
        />
      )}
    </div>
  );
};

export default SimulationPanel;
