# 🔀 Smart Payment Routing Simulator (SPRS)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)

A full-stack, enterprise-grade distributed system simulator that orchestrates high-concurrency payment traffic across multiple simulated gateway nodes. It features real-time **Circuit Breaking**, mathematical **Anomaly Detection**, atomic concurrency management, and an interactive React dashboard.

---

## 🏗️ Architecture & Mechanics

SPRS simulates how massive payment processors (like Stripe or PayPal) handle extreme network conditions. Instead of pushing traffic to a single server, SPRS smartly cascades traffic across primary and fallback gateways based on mathematical health scores and consecutive failure triggers.

### 1. The Gateways (The Network)
The system is built on 3 mock payment gateways, each with inherent "Jitter" (randomized latency variance) and hardcoded success baselines to mimic real-world unpredictability:
* 🟢 **Gateway-A (Primary):** High priority. 60% baseline success rate. ~300ms latency.
* 🟡 **Gateway-B (Fallback 1):** Medium priority. 50% baseline success rate. ~150ms latency.
* 🔴 **Gateway-C (Fallback 2 / Safety Net):** Lowest priority. 100% success rate. ~600ms latency.

### 2. High-Concurrency Traffic Routing
When 100+ concurrent requests hit the `/simulate-bulk` API, it triggers the router:
* Traffic hits **Gateway-A**. 
* If a payment fails, the system instantly catches the error and silently cascades those specific users to **Gateway-B**.
* If B drops the ball, the system forces the traffic directly onto the slow, but hyper-reliable **Gateway-C**.

### 3. Circuit Breaker (`HALF-OPEN` Cooldown Mechanism)
SPRS features a true distributed Circuit Breaker pattern to protect failing gateways from being suffocated by "Stampede" traffic. 
* **OPEN State:** If a gateway registers **5 consecutive failures**, its circuit snaps `OPEN`. The gateway is immediately taken completely offline, and all future traffic perfectly bypasses it directly to the next fallback node.
* **HALF-OPEN State:** After exactly **60 seconds**, the circuit tries to recover. If 1,000 new requests hit the network, the database locks the gateway in a `HALF-OPEN` state. It allows *exactly 1 request* to slip through as a "probe", while instantly rerouting the other 999 requests to safety. If the probe succeeds, the circuit repairs itself (`CLOSED`). If it fails, it violently snaps shut again (`OPEN`) for another 60 seconds.

### 4. Intelligence Layer & Mathematical Aggregation
* **Rolling Health:** Every gateway constantly calculates its health using a sliding metric formula over its last 20 requests: `(0.6 * SuccessRate) + (0.4 * (1/AvgLatency))`.
* **Anomaly Detection:** If a gateway's live success rate drops 20% below its statistical baseline, it is instantly flagged as `Degraded`.
* **Atomic Validation:** Counters are completely immune to Javascript Read-Modify-Write Race Conditions. By leveraging native `PostgreSQL ACID` triggers and `EXTRACT(EPOCH)` timezone normalization, 10,000 concurrent requests will increment flawlessly.

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js** (v18+)
2. **PostgreSQL** (v15+) or Docker Desktop

### 1. Database Setup
Ensure PostgreSQL is running on your machine.
Create a database named `sprs_db`.

### 2. Backend Initialization
```bash
cd backend

# Install dependencies
npm install

# Create environment config
cp .env.example .env
# (Ensure DATABASE_URL in .env matches your local PostgreSQL credentials)

# Bootstrap the Database Schema
npm run init-db

# Start the API Server (Runs on port 5000)
npm run dev
```

### 3. Frontend Initialization
```bash
cd frontend

# Install dependencies
npm install

# Start the Vite React Dashboard (Runs on port 5173)
npm run dev
```

---

## 🎮 How to Test Like an Engineer (Chaos Testing)

Open your browser to the React Dashboard (`http://localhost:5173`).

### Scenario 1: The "Avalanche"
1. Click **Reset Data** (Red button top right).
2. Set the slider to **1,000 Transactions**.
3. Click **Run Simulation**. 
4. *Watch the safety net:* Notice that 1,000 users initiate payments, but the network processes 1,600+ attempts under the hood. Gateway-C will successfully catch and process immense overflow without dropping a single payment.

### Scenario 2: The "Rollercoaster Recovery"
1. Hit **Reset Data**.
2. Run **100 Transactions**. Gateways A and B will fail and trip to **OPEN**.
3. Put down your mouse and start a timer. Wait exactly **60 seconds**.
4. Set the slider to **10 Transactions**. Hit **Run**.
5. *Watch the locking mechanism:* You will visually see exactly *1 request* hit Gateway-A, and *1 request* hit Gateway-B. The `HALF-OPEN` circuit locked the doors and safely rerouted the other 8 requests. If the probe succeeds, watch the Consecutive Failures plunge directly to 0!

---

## 🛠️ Technology Stack
* **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide-React, Axios.
* **Backend:** Node.js, Express.js, PostgreSQL, `pg` driver, UUID.
* **Architecture:** Abstracted Class Models, Repository Pattern, Stateful Services. 

---

*Built for High-Concurrency, Resiliency Validation, and Chaos Engineering.*
