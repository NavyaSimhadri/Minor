/**
 * RecommendationPanel.jsx – AI Intervention Recommendation Display
 * -------------------------------------------------------
 * Intelligent UI for displaying ML-powered intervention recommendations.
 *
 * Features:
 *  ✓ Shows dominant pollutant
 *  ✓ Highlights best intervention (primary)
 *  ✓ Lists all candidates ranked by effectiveness
 *  ✓ Displays cost estimation
 *  ✓ Shows AQI improvement percentage
 */

import { useState } from 'react';
import { getRecommendation } from '../services/api';
import './RecommendationPanel.css';

export default function RecommendationPanel({ selectedStation, onClose }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const handleGetRecommendation = async () => {
    if (!selectedStation) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getRecommendation(selectedStation.id);
      setRecommendation(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStation) {
    return (
      <div className="recommendation-panel">
        <div className="recommendation-message">
          Select a station to get AI-powered intervention recommendations
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-panel">
      <div className="recommendation-header">
        <h3>🧠 AI Intervention Recommendation</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="recommendation-station">
        <p><strong>Station:</strong> {selectedStation.name}</p>
        <p><strong>Zone:</strong> {selectedStation.zone_type}</p>
        <p><strong>Current AQI:</strong> {selectedStation.aqi} ({selectedStation.aqi_category})</p>
      </div>

      {!recommendation ? (
        <button
          onClick={handleGetRecommendation}
          disabled={loading}
          className="btn-recommend"
        >
          {loading ? '⏳ Analyzing...' : '🚀 Get Recommendation'}
        </button>
      ) : (
        <div className="recommendation-results">
          {/* Dominant Pollutant */}
          <div className="result-section dominant-pollutant">
            <div className="section-title">Dominant Pollutant</div>
            <div className="pollutant-badge">
              {recommendation.dominantPollutant?.toUpperCase()}
            </div>
            <p className="pollutant-value">
              {selectedStation[recommendation.dominantPollutant]?.toFixed(1)} µg/m³
            </p>
          </div>

          {/* Best Intervention */}
          {recommendation.bestIntervention && (
            <div className="result-section best-intervention">
              <div className="section-title">✨ Best Intervention</div>
              <div className="intervention-card featured">
                <h4>{recommendation.bestIntervention.intervention}</h4>
                
                <div className="metric">
                  <span className="label">Predicted AQI:</span>
                  <span className="value">{recommendation.bestIntervention.predictedAQI}</span>
                </div>

                <div className="metric improvement">
                  <span className="label">Improvement:</span>
                  <span className="value {recommendation.bestIntervention.improvement > 0 ? 'positive' : 'neutral'}">
                    {recommendation.bestIntervention.improvement > 0 ? '↓' : '→'} {Math.abs(recommendation.bestIntervention.improvement).toFixed(2)}%
                  </span>
                </div>

                <div className="metric cost">
                  <span className="label">Cost (Estimated):</span>
                  <span className="value">₹{(recommendation.bestIntervention.cost / 100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>
          )}

          {/* All Candidates */}
          {recommendation.allInterventions && recommendation.allInterventions.length > 1 && (
            <div className="result-section all-interventions">
              <div className="section-title">
                📋 All Options ({recommendation.allInterventions.length})
              </div>
              <div className="candidates-list">
                {recommendation.allInterventions
                  .sort((a, b) => b.improvement - a.improvement)
                  .map((intervention, idx) => (
                    <div key={idx} className="intervention-card candidate">
                      <div className="rank">#{idx + 1}</div>
                      <div className="name">{intervention.intervention}</div>
                      <div className="aqi">AQI: {intervention.predictedAQI}</div>
                      <div className="improvement">
                        {intervention.improvement > 0 ? '↓' : '→'} {Math.abs(intervention.improvement).toFixed(2)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setRecommendation(null)}
            className="btn-reset"
          >
            🔄 Get New Recommendation
          </button>
        </div>
      )}

      {error && <div className="error-message">❌ {error}</div>}
    </div>
  );
}
