# Digital Twin – Air Quality Monitoring System

> **Prototype v1.0** · Static Mock Data · No real ML or live backend yet.

A full-stack Digital Twin prototype for monitoring air quality across **7 Hyderabad AQI stations**. The system visualises pollutant data on an interactive map and simulates the effect of environmental interventions using **dummy logic** (to be replaced by real ML predictions).

---

## Project Structure

```
Mini Project/
├── frontend/            # React + Vite + React Leaflet
│   └── src/
│       ├── components/
│       │   ├── MapView.jsx          ← Interactive Leaflet map
│       │   ├── StationPopup.jsx     ← Station detail popup
│       │   ├── AQILegend.jsx        ← Map colour legend
│       │   ├── Dashboard.jsx        ← Main layout
│       │   ├── SimulationPanel.jsx  ← Intervention simulator
│       │   ├── StatsCards.jsx       ← Summary metric cards
│       │   └── Filters.jsx          ← Zone / AQI filters
│       ├── data/
│       │   └── stations.js          ← 7 Hyderabad mock stations
│       └── utils/
│           └── aqiUtils.js          ← AQI colours, simulation logic
│
├── backend/             # Node.js + Express REST API
│   ├── server.js
│   └── src/
│       ├── routes/stationRoutes.js
│       ├── controllers/stationController.js
│       ├── services/simulationService.js
│       └── data/mockStations.js
│
└── ml-service/          # Python ML Placeholder (NOT implemented yet)
    ├── train_model.py   ← Future: Random Forest training
    ├── predict.py       ← Future: FastAPI prediction endpoint
    └── requirements.txt
```

---

## Quick Start

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
# → http://localhost:5000
```

### 3. ML Service (placeholder — not runnable yet)

```bash
cd ml-service
pip install -r requirements.txt
# TODO: Implement train_model.py first, then:
# python train_model.py
# uvicorn predict:app --port 8000
```

---

## Mock Stations (7 Hyderabad Locations)

| # | Station       | AQI | Category    | Zone Type   |
|---|---------------|-----|-------------|-------------|
| 1 | Banjara Hills | 142 | Poor        | Residential |
| 2 | Secunderabad  | 175 | Poor        | Industrial  |
| 3 | HITEC City    |  98 | Satisfactory| Commercial  |
| 4 | Kukatpally    | 165 | Poor        | Residential |
| 5 | LB Nagar      | 188 | Poor        | Industrial  |
| 6 | Patancheru    | 210 | Very Poor   | Industrial  |
| 7 | Jubilee Hills |  85 | Satisfactory| Residential |

---

## API Endpoints (Backend)

| Method | Endpoint               | Description                      |
|--------|------------------------|----------------------------------|
| GET    | `/stations`            | List all 7 mock stations         |
| GET    | `/stations/:id`        | Get single station by ID         |
| POST   | `/stations/simulate`   | Run dummy intervention simulation|
| GET    | `/health`              | Service health check             |

### POST `/stations/simulate` — Example

**Request:**
```json
{
  "stationId": 6,
  "intervention": "Emission Control"
}
```

**Response:**
```json
{
  "success": true,
  "dataSource": "mock-simulation",
  "note": "DUMMY CALCULATION – prototype only.",
  "input": {
    "stationName": "Patancheru",
    "currentAQI": 210,
    "intervention": "Emission Control"
  },
  "result": {
    "predictedAQI": 179,
    "improvementPct": 15,
    "aqiReduction": 31
  }
}
```

---

## Simulation Logic (Dummy)

| Intervention     | Reduction Factor | AQI Change |
|------------------|-----------------|------------|
| Green Belt       | × 0.92          | −8%        |
| Dust Control     | × 0.88          | −12%       |
| Emission Control | × 0.85          | −15%       |

> **TODO:** Replace with Random Forest ML model prediction.

---

## Roadmap / TODO Comments in Code

All placeholder areas are marked clearly in the source code:

- `TODO: Replace mock dataset with CSV` — backend data layer
- `TODO: Connect backend API later` — frontend API calls
- `TODO: Replace with ML model prediction` — simulation engine
- `TODO: Train Random Forest model` — ml-service/train_model.py
- `TODO: Add database later` — backend persistence
- `FUTURE IMPLEMENTATION` — UI features awaiting backend/ML
- `ML INTEGRATION POINT` — exact lines where ML connects

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18, Vite, React Leaflet |
| Map        | Leaflet + OpenStreetMap tiles |
| Charts     | Recharts                      |
| Backend    | Node.js, Express              |
| ML Service | Python (FastAPI – placeholder)|

---

*Prototype built for architecture demonstration. All data is static mock data.*
