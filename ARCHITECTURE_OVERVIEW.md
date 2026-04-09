# 🏗️ SYSTEM ARCHITECTURE OVERVIEW

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React/Vite)                            │
│                                                                          │
│  ┌──────────────────┐  ┌─────────────────────┐  ┌─────────────────┐   │
│  │   Dashboard      │→→│ RecommendationPanel │→→│  StatsCards     │   │
│  │   (Component)    │  │  (NEW COMPONENT)    │  │  (Existing)     │   │
│  └────────┬─────────┘  └──────────┬──────────┘  └────────┬────────┘   │
│           │                       │                       │             │
│           └───────────┬───────────┴───────────┬───────────┘             │
│                       │                       │                         │
│           ┌───────────▼─────────────────────┐ │                         │
│           │  api.js (Service Layer)        │ │                         │
│           │  - getRecommendation()  ◄──────┼─┘                         │
│           │  - postSimulate()                │                         │
│           │  - fetchStations()               │                         │
│           └───────────┬─────────────────────┘                         │
│                       │                                                 │
│                       │ HTTP POST                                      │
│                       │ /api/stations/recommend                        │
│                       │                                                 │
└───────────────────────┼─────────────────────────────────────────────────┘
                        │
                        │ JSON
                        │ {stationId: 1}
                        │
┌───────────────────────▼─────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                               │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PORT: 5000                                                     │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌─────────────────────────────────────┐ │  │
│  │  │   Router Layer   │ →│  stationController.js              │ │  │
│  │  │  stations.js     │  │  - recommend()  ◄── NEW           │ │  │
│  │  │  Routes:         │  │  - simulate()                      │ │  │
│  │  │  POST /stations/ │ │  - getAllStations()                │ │  │
│  │  │  recommend ←────┼┘ └─────────────────┬──────────────────┘ │  │
│  │  │  POST /stations/│                    │                     │  │
│  │  │  simulate       │                    │                     │  │
│  │  │  GET /stations  │                    │ imports             │  │
│  │  │  GET /stations/:│                    │                     │  │
│  │  │         id      │                    │                     │  │
│  │  └──────────────────┘                    ▼                     │  │
│  │                                  ┌────────────────────────────┐ │  │
│  │                                  │ recommendationService.js   │ │  │
│  │                                  │ (NEW SERVICE)              │ │  │
│  │                                  │                            │ │  │
│  │  ┌──────────────────────────────┤ Core Functions:            │ │  │
│  │  │                              │ 1. getDominantPollutant()  │ │  │
│  │  │                              │ 2. filterInterventions()   │ │  │
│  │  │                              │ 3. applyIntervention()     │ │  │
│  │  │                              │ 4. predictAQI()           │ │  │
│  │  │                              │ 5. recommendBestIntervention() │ │  │
│  │  │                              └────────┬───────────────────┘ │  │
│  │  │                                       │ imports             │  │
│  │  │                                       ▼                     │  │
│  │  │                              ┌────────────────────────────┐ │  │
│  │  │      simulationService.js ◄──┤ INTERVENTIONS DATA         │ │  │
│  │  │      (Existing)               │ (NEW FILE)                 │ │  │
│  │  │      - simulateInterventions()│ interventions.js           │ │  │
│  │  │                              │                            │ │  │
│  │  │                              │ - Green Walls              │ │  │
│  │  │                              │ - Biofilters               │ │  │
│  │  │                              │ - Roadside Air Purifiers   │ │  │
│  │  │                              │ - Electric Vehicle Adoption│ │  │
│  │  │                              └────────────────────────────┘ │  │
│  │  │                                                             │  │
│  │  └──────────────────────────────────┬──────────────────────────┘  │
│  │                                     │ axios.post()                │  │
│  └─────────────────────────────────────┼────────────────────────────┘  │
│                                        │ {pollutants}                   │
│                                        │ pm25, pm10, no2, so2, co, o3   │
│                                        │                               │
└────────────────────────────────────────┼───────────────────────────────┘
                                         │
                                         │ HTTP POST
                                         │ /predict
                                         │
┌────────────────────────────────────────▼───────────────────────────────┐
│                   ML SERVICE (Python FastAPI)                          │
│                   PORT: 8000                                           │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  predict.py                                                    │   │
│  │  - Model loaded (trained_model.pkl)                           │   │
│  │  - Endpoint: POST /predict                                    │   │
│  │  - Input: {pm25, pm10, no2, so2, co, o3}                     │   │
│  │  - Output: {predicted_aqi}                                    │   │
│  │                                                                │   │
│  │  ML Pipeline:                                                 │   │
│  │  Pollutants → Feature Engineering → Model → AQI Prediction   │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## DATA FLOW SEQUENCE

```
User Action:
┌─────────────────────────────────────────────────────────────┐
│ SELECT STATION + CLICK "Get AI Recommendation"             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                  ┌───────────────────┐
                  │ Frontend:         │
                  │ RecommendationPanel
                  │ getRecommendation │
                  │ (stationId: 1)    │
                  └────────┬──────────┘
                           │
                           │ POST /api/stations/recommend
                           │ {stationId: 1}
                           │
                           ▼
                  ┌───────────────────┐
                  │ Backend Controller
                  │ recommend()       │
                  │ • Validate input  │
                  │ • Load station    │
                  │ • Call engine     │
                  └────────┬──────────┘
                           │
                           │ station object
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │ recommendBestIntervention()           │
        │ MAIN ORCHESTRATION FUNCTION          │
        │                                       │
        │ ┌─────────────────────────────────┐  │
        │ │ 1. getDominantPollutant()       │  │
        │ │    pollutants: {                │  │
        │ │      pm25: 58.4,                │  │
        │ │      pm10: 92.3, ◄─── DOMINANT │  │
        │ │      no2: 38.1,                 │  │
        │ │      so2: 12.5,                 │  │
        │ │      co: 1.4,                   │  │
        │ │      o3: 44.2                   │  │
        │ │    }                            │  │
        │ │    Returns: "pm10"              │  │
        │ └────────────┬──────────────────┘  │
        │              │                      │
        │ ┌────────────▼──────────────────┐  │
        │ │ 2. filterInterventions()      │  │
        │ │    Filters by:                │  │
        │ │    PRIMARY: targets pm10      │  │
        │ │    SECONDARY: zone=Residential│  │
        │ │                               │  │
        │ │    Candidates: [              │  │
        │ │      "Green Walls"            │  │
        │ │    ]                          │  │
        │ └────────────┬──────────────────┘  │
        │              │                      │
        │ ┌────────────▼──────────────────┐  │
        │ │ 3. For each candidate:        │  │
        │ │                               │  │
        │ │    3a. applyIntervention()    │  │
        │ │        "Green Walls"          │  │
        │ │        Reductions:            │  │
        │ │        pm25: 0.18 (18%)       │  │
        │ │        pm10: 0.22 (22%)  ◄── │  │
        │ │        no2: 0.10 (10%)        │  │
        │ │                               │  │
        │ │        Modified pollutants:   │  │
        │ │        pm25: 58.4 * 0.82=47.89│  │
        │ │        pm10: 92.3 * 0.78=72.01│  │
        │ │        no2: 38.1 * 0.90=34.29 │  │
        │ │        so2: (unchanged)       │  │
        │ │        co: (unchanged)        │  │
        │ │        o3: (unchanged)        │  │
        │ └────────────┬──────────────────┘  │
        │              │                      │
        │ ┌────────────▼──────────────────┐  │
        │ │ 3b. predictAQI()              │  │
        │ │     Axios call to ML service  │  │
        │ │     POST http://127.0.0.1:    │  │
        │ │         8000/predict          │  │
        │ │     {                         │  │
        │ │       pm25: 47.89,            │  │
        │ │       pm10: 72.01,            │  │
        │ │       no2: 34.29,             │  │
        │ │       so2: 12.5,              │  │
        │ │       co: 1.4,                │  │
        │ │       o3: 44.2                │  │
        │ │     }                         │  │
        │ │     ▼                         │  │
        │ │     ML Model predicts...      │  │
        │ │     Returns: 115              │  │
        │ └────────────┬──────────────────┘  │
        │              │                      │
        │ ┌────────────▼──────────────────┐  │
        │ │ 3c. Calculate improvement     │  │
        │ │     (142 - 115) / 142 * 100   │  │
        │ │     = 18.99%                  │  │
        │ │                               │  │
        │ │     Calculate cost            │  │
        │ │     costPerUnit: 2000         │  │
        │ │     cost = 2000 * 1000        │  │
        │ │     = 2,000,000              │  │
        │ │                               │  │
        │ │     Result object:            │  │
        │ │     {                         │  │
        │ │       intervention: "Green    │  │
        │ │        Walls",               │  │
        │ │       predictedAQI: 115,      │  │
        │ │       improvement: 18.99,     │  │
        │ │       cost: 2000000,          │  │
        │ │       dominantPollutant:      │  │
        │ │         "pm10"                │  │
        │ │     }                         │  │
        │ └────────────┬──────────────────┘  │
        │              │                      │
        │ ┌────────────▼──────────────────┐  │
        │ │ 4. Sort & Select Best         │  │
        │ │    (lowest predictedAQI)      │  │
        │ │                               │  │
        │ │    best = above result        │  │
        │ │    all = [above result]       │  │
        │ └────────────┬──────────────────┘  │
        └─────────────┼────────────────────┘
                      │
                      │ Return
                      │ {
                      │   best: {...},
                      │   all: [...]
                      │ }
                      │
                      ▼
        ┌───────────────────────────────┐
        │ Controller formats response   │
        │ JSON                          │
        │ ┌─────────────────────────────┤
        │ │ success: true               │
        │ │ station: "Banjara Hills"    │
        │ │ zone: "Residential"         │
        │ │ currentAQI: 142             │
        │ │ dominantPollutant: "pm10"   │
        │ │ bestIntervention: {...}     │
        │ │ allInterventions: [...]     │
        │ └─────────────────────────────┤
        └─────────────┬─────────────────┘
                      │
                      │ HTTP 200 OK
                      │
                      ▼
        ┌───────────────────────────────┐
        │ Frontend receives JSON        │
        │ setRecommendation(result)     │
        │                               │
        │ Component re-renders with:    │
        │ • Dominant pollutant badge    │
        │ • Best intervention card      │
        │ • All candidates list         │
        └───────────────────────────────┘
```

---

## FILE STRUCTURE (Post-Implementation)

```
Mini-Project/
├── IMPLEMENTATION_GUIDE.md ................... [NEW] Complete reference
├── QUICK_INTEGRATION.md ..................... [NEW] Dashboard integration guide
├── TESTING_GUIDE.md ......................... [NEW] Testing & debugging
├── ARCHITECTURE_OVERVIEW.md ................. [NEW] This file
│
├── backend/
│   ├── package.json ......................... Has axios
│   ├── server.js
│   ├── src/
│   │   ├── controllers/
│   │   │   └── stationController.js ......... [UPDATED] Added recommend()
│   │   ├── services/
│   │   │   ├── simulationService.js ........ [EXISTING]
│   │   │   └── recommendationService.js .... [NEW] Core recommendation engine
│   │   ├── routes/
│   │   │   └── stations.js ................. [UPDATED] Added /recommend route
│   │   └── data/
│   │       ├── mockStations.js ............ [EXISTING]
│   │       ├── interventions.js ........... [NEW] Intervention database
│   │       └── aqi/
│   │           └── *.csv .................. [EXISTING] Historical data
│   │
│   └── ml-service/
│       ├── predict.py ..................... [EXISTING] ML model service
│       ├── train_model.py ................. [EXISTING]
│       ├── requirements.txt ............... [EXISTING]
│       └── models/
│           └── trained_model.pkl .......... [EXISTING]
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx .............. [TODO] Integrate RecommendationPanel
│   │   │   ├── MapView.jsx ............... [EXISTING]
│   │   │   ├── SimulationPanel.jsx ........ [EXISTING]
│   │   │   ├── StatsCards.jsx ............ [EXISTING]
│   │   │   ├── RecommendationPanel.jsx .... [NEW] UI component
│   │   │   ├── RecommendationPanel.css .... [NEW] Styling
│   │   │   └── ...others
│   │   ├── services/
│   │   │   └── api.js ..................... [UPDATED] Added getRecommendation()
│   │   └── ...others
│   └── ...
```

---

## COMPONENT INTERACTIONS

### recommendationService.js (Core Engine)

```javascript
export {
  getDominantPollutant,      // Step 1: Find highest pollutant
  filterInterventions,        // Step 2: Filter by pollutant + zone
  applyIntervention,          // Step 3: Apply reductions
  predictAQI,                 // Step 4: Call ML model
  recommendBestIntervention   // Step 5: Orchestrate all steps
}
```

### Dependency Chain

```
recommendBestIntervention()
  ├─→ getDominantPollutant()
  │   └─→ returns: "pm10"
  │
  ├─→ filterInterventions(station, "pm10")
  │   ├─→ matches: targets.includes("pm10")
  │   ├─→ matches: suitableZones.includes(station.zone_type)
  │   └─→ returns: ["Green Walls", "Roadside Purifiers"]
  │
  ├─→ for each intervention:
  │
  │   ├─→ applyIntervention(station, "Green Walls")
  │   │   └─→ returns: modified_station with reduced pollutants
  │   │
  │   ├─→ predictAQI(modified_station)
  │   │   ├─→ axios.post(ML_SERVICE/predict)
  │   │   └─→ returns: predictedAQI value
  │   │
  │   └─→ calculate: improvement %, cost
  │
  └─→ returns: {best, all}
```

---

## Error Handling Flow

```
recommendBestIntervention() called
  │
  ├─→ getDominantPollutant()
  │   └─→ throw if: no valid pollutants
  │
  ├─→ filterInterventions()
  │   └─→ fallback if: no matches found → return ALL
  │
  ├─→ for each candidate:
  │
  │   ├─→ applyIntervention()
  │   │   └─→ throw if: undefined pollutant keys
  │   │
  │   └─→ predictAQI()
  │       ├─→ catch: ML service timeout
  │       ├─→ catch: invalid response
  │       ├─→ catch: connection refused
  │       └─→ log error, skip intervention
  │
  └─→ return partial results if errors occurred
```

---

## Performance Characteristics

| Layer | Operation | Time | Bottleneck |
|-------|-----------|------|-----------|
| Frontend | Render UI | 50ms | Browser rendering |
| Network | HTTP roundtrip | 20ms | Network latency |
| Backend | Analyze station | 5ms | CPU-bound |
| Backend | Filter interventions | 1ms | I/O |
| Backend | Apply reductions | 5ms | CPU-bound |
| ML Service | Predict AQI | 500-2000ms | **ML inference** |
| Total | End-to-end | 600-2100ms | **ML Service** |

**Optimization opportunities:**
- Cache ML predictions
- Batch multiple stations
- Pre-compute common scenarios

---

## Security Considerations

✅ Implemented:
- Input validation (stationId must exist)
- Error handling (graceful fallback)

⚠️ TODO:
- [ ] Rate limiting (prevent abuse)
- [ ] Authentication (verify user)
- [ ] CORS headers (cross-origin)
- [ ] Input sanitization (prevent injection)

---

## Scalability Path

**Current:** Single ML model, synchronous calls
```
User → Backend → ML Service (1 call)
```

**Future:** Batch processing
```
Users (N) → Backend → ML Service (batch of N calls)
```

**Even Further:** Caching + Async
```
Users → Cache Layer → Async Queue → ML Service (background)
```

---

**Ready to implement! 🚀**

Refer to [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed explanation of each component.
