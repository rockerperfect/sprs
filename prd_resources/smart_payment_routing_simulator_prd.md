# 📄 Product Requirements Document (PRD)

# Smart Payment Routing Simulator (SPRS)

---

# 1. Executive Summary

Smart Payment Routing Simulator (SPRS) is a full-stack distributed system that simulates intelligent payment orchestration. The system dynamically routes payment requests across multiple gateways using health scoring, failure tracking, circuit breaker protection, and anomaly detection. A real-time dashboard provides system observability.

The project is designed to demonstrate backend architecture maturity, reliability engineering, applied ML concepts, and production-grade structuring.

---

# 2. Core Objectives

## Primary Goals

- Build an intelligent routing engine
- Simulate multiple payment gateways
- Implement retry + fallback strategy
- Implement circuit breaker pattern
- Maintain rolling health metrics
- Detect gateway degradation
- Expose REST APIs
- Provide real-time monitoring dashboard
- Deploy publicly

## Secondary Goals (Scalability Ready)

- Modular architecture
- Clean folder structure
- Extensible gateway design
- Easily pluggable ML scoring logic
- Clear separation of concerns

---

# 3. System Architecture Overview

Frontend (React Dashboard)
        ↓
Backend API Layer (Express)
        ↓
Routing Engine (Core Logic)
        ↓
Gateway Modules
        ↓
PostgreSQL (Metrics & State)

---

# 4. Technology Stack

## Backend
- Node.js
- Express.js
- PostgreSQL
- Docker

## Frontend
- React
- Axios
- Recharts / Chart.js

## Deployment
- Railway / Render (Backend)
- Vercel (Frontend)

---

# 5. Detailed Backend Architecture

## 5.1 Backend Folder Structure (Scalable & Maintainable)

backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │
│   ├── routes/
│   │   ├── payment.routes.js
│   │   ├── metrics.routes.js
│   │   ├── gateway.routes.js
│   │
│   ├── controllers/
│   │   ├── payment.controller.js
│   │   ├── metrics.controller.js
│   │   ├── gateway.controller.js
│   │
│   ├── services/
│   │   ├── routing.service.js
│   │   ├── health.service.js
│   │   ├── circuitBreaker.service.js
│   │   ├── anomaly.service.js
│   │
│   ├── gateways/
│   │   ├── gatewayA.js
│   │   ├── gatewayB.js
│   │   ├── gatewayC.js
│   │   ├── baseGateway.js
│   │
│   ├── models/
│   │   ├── transaction.model.js
│   │   ├── gatewayStats.model.js
│   │
│   ├── repositories/
│   │   ├── transaction.repository.js
│   │   ├── gateway.repository.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│
├── tests/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

---

## 5.2 Backend Responsibility Breakdown

### Routes
Only define endpoints and connect to controllers.

### Controllers
Handle request/response lifecycle.

### Services
Contain business logic:
- Routing decisions
- Health score calculation
- Circuit breaker logic
- Anomaly detection

### Gateways
Encapsulated gateway simulation logic.
Each gateway extends baseGateway.

### Models
Database structure definitions.

### Repositories
Database queries abstracted from business logic.

### Middleware
Centralized error handling and logging.

This structure ensures scalability and clarity.

---

# 6. Frontend Architecture

## 6.1 Frontend Folder Structure (Clean & Scalable)

frontend/
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── api/
│   │   ├── payment.api.js
│   │   ├── metrics.api.js
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PageContainer.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MetricsTable.jsx
│   │   │   ├── PaymentSimulator.jsx
│   │   │   ├── TrafficPieChart.jsx
│   │   │   ├── SuccessRateChart.jsx
│   │   │   ├── FailureBarChart.jsx
│   │
│   ├── hooks/
│   │   ├── useMetrics.js
│   │   ├── useSimulation.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │
│   ├── styles/
│
├── package.json
└── README.md

---

# 7. Functional Requirements

## 7.1 Payment Endpoint

POST /pay

- Accept payment payload
- Invoke routing service
- Retry if needed
- Fallback if failure
- Persist transaction
- Return response

---

## 7.2 Bulk Simulation

POST /simulate-bulk

- Accept count
- Trigger multiple payments
- Update metrics dynamically

---

## 7.3 Metrics Endpoint

GET /metrics

Return:
- Total transactions
- Success rate
- Failure rate
- Traffic distribution

---

## 7.4 Gateway Health Endpoint

GET /gateway-health

Return per gateway:
- Success rate
- Avg latency
- Health score
- Circuit breaker state
- Consecutive failures
- Status (Healthy / Degraded / Open)

---

# 8. Core Algorithms

## 8.1 Health Score

Score = (0.6 × SuccessRate) + (0.4 × (1 / AvgLatency))

Updated every 20 transactions.

---

## 8.2 Circuit Breaker Logic

- 5 consecutive failures → OPEN
- 60 sec cooldown
- HALF-OPEN test
- Success → CLOSED
- Failure → OPEN

---

## 8.3 Anomaly Detection

If:
CurrentSuccessRate < HistoricalAverage - 20%

Mark gateway as DEGRADED.

---

# 9. Database Design

## Database: PostgreSQL

### Table: transactions

- id (UUID)
- gateway (TEXT)
- status (TEXT)
- latency (FLOAT)
- timestamp (TIMESTAMP)

### Table: gateway_stats

- gateway (TEXT)
- success_rate (FLOAT)
- avg_latency (FLOAT)
- total_requests (INT)
- health_score (FLOAT)
- consecutive_failures (INT)
- status (TEXT)
- circuit_state (TEXT)

---

# 10. Development Workflow (Execution Plan)

## Phase 1 – Backend Core
1. Setup project structure
2. Setup PostgreSQL connection
3. Implement gateway simulation modules
4. Build routing service
5. Add fallback logic
6. Implement circuit breaker service
7. Store transactions in DB

## Phase 2 – Intelligence Layer
1. Implement rolling success tracking
2. Health score computation
3. Anomaly detection logic
4. Metrics aggregation service

## Phase 3 – Frontend Dashboard
1. Setup React project
2. Create API abstraction layer
3. Build Dashboard layout
4. Add metrics table
5. Add charts
6. Add simulation buttons

## Phase 4 – Deployment
1. Dockerize backend
2. Deploy backend
3. Configure CORS
4. Deploy frontend
5. Update README with demo link

---

# 11. Non-Functional Requirements

- Modular codebase
- Clean naming conventions
- No business logic inside routes
- Reusable services
- Centralized error handling
- Environment-based config

---

# 12. Success Criteria

Project is complete when:

- 100+ payments can be simulated
- Routing dynamically adapts
- Circuit breaker triggers correctly
- Dashboard reflects real-time data
- Backend and frontend are publicly deployed
- System architecture can be clearly explained

---

# 13. Scalability Considerations

Future-ready for:

- Adding new gateway modules
- Replacing scoring formula with ML model
- Adding Redis caching
- Adding authentication
- Horizontal scaling

---

# 14. Positioning Statement

Smart Payment Routing Simulator is a production-style distributed backend system that intelligently routes simulated payment traffic across multiple gateways using dynamic health scoring, anomaly detection, and circuit breaker patterns, with a real-time monitoring dashboard and scalable architecture.

