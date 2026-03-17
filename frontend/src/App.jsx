/**
 * App.jsx – Root Component
 * -------------------------------------------------------
 * Digital Twin Air Quality Monitoring System
 * Hyderabad · Prototype v1.0
 *
 * ARCHITECTURE OVERVIEW:
 *   App → Dashboard → MapView, StatsCards, SimulationPanel,
 *                     StatsCards, Filters, StationPopup, AQILegend
 *
 * FUTURE IMPLEMENTATION:
 *   - Add React Router for /map, /analytics, /reports views.
 *   - Add global state management (Redux / Zustand).
 *   - TODO: Connect backend API later via axios/fetch.
 * ML INTEGRATION POINT:
 *   - /simulate endpoint will call Python prediction service.
 */

import React from 'react';
import Dashboard from './components/Dashboard';

const App = () => <Dashboard />;

export default App;
