/**
 * MapView.jsx
 * -------------------------------------------------------
 * Renders the interactive Leaflet map with 7 AQI station
 * circle markers, popups, and the AQI legend overlay.
 *
 * Libraries: react-leaflet v4, leaflet v1.9
 *
 * FUTURE IMPLEMENTATION:
 *   - Add heatmap layer for spatial AQI interpolation.
 *   - Animate marker size on AQI threshold breaches.
 *   - TODO: Connect backend API later – fetch station list from
 *           GET /api/stations instead of local mock data.
 */

import React from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';
import AQILegend from './AQILegend';
import StationPopup from './StationPopup';
import { getAQIColor, getCircleRadius } from '../utils/aqiUtils';
// Stations are passed as a prop from Dashboard (fetched from backend).

// ─── Hyderabad Map Center ─────────────────────────────────────────────────
const HYDERABAD_CENTER = [17.385, 78.4867];
const DEFAULT_ZOOM = 11;

// ─── Legend Overlay Controller ────────────────────────────────────────────
// React-Leaflet v4 requires DOM elements to be injected through useMap()
const LegendControl = () => {
  // Legend is rendered as absolute-positioned div inside MapContainer's parent.
  // See parent div positioning below.
  return null;
};

// ─── MapView Component ────────────────────────────────────────────────────
const MapView = ({ stations = [], selectedStationId, onStationSelect, filterZone }) => {
  // Apply zone_type filter if provided
  const visibleStations = filterZone
    ? stations.filter((s) => s.zone_type === filterZone)
    : stations;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={HYDERABAD_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        zoomControl={true}
      >
        {/* Tile Layer – OpenStreetMap (no API key required) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ── Station Circle Markers ───────────────────────────────────── */}
        {visibleStations.map((station) => {
          const color = getAQIColor(station.aqi);
          const radius = getCircleRadius(station.aqi);
          const isSelected = station.id === selectedStationId;

          return (
            <CircleMarker
              key={station.id}
              center={[station.latitude, station.longitude]}
              radius={isSelected ? 22 : 16}
              pathOptions={{
                color: isSelected ? '#ffffff' : color,
                fillColor: color,
                fillOpacity: 0.75,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onStationSelect && onStationSelect(station),
              }}
            >
              <Popup
                minWidth={220}
                maxWidth={260}
                className="custom-popup"
              >
                <StationPopup station={station} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* AQI Legend Overlay (positioned within map container) */}
      <AQILegend />
    </div>
  );
};

export default MapView;
