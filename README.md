# TransitOps — Fleet & Transport Management System

## Problem Statement

Small and mid-size transport companies still rely on spreadsheets, phone calls, and paper logs to manage their fleets. This leads to:

- **No real-time visibility** into which vehicles are on the road, idle, or in the shop.
- **Untracked fuel costs** that silently eat into margins — operators cannot correlate fuel spend with actual trips.
- **Manual driver-vehicle assignment** with no validation, risking overloaded vehicles and dispatching drivers with expired licenses.
- **Disconnected maintenance records** — breakdowns happen because service schedules are tracked separately (or not at all).
- **No unified reporting** — fleet utilization, fuel efficiency, and operational costs are impossible to calculate without pulling data from five different places.

The core challenge: **build an integrated operations platform that connects vehicles, drivers, trips, maintenance, and expenses into a single source of truth — with enforced business rules and live analytics.**

---

## Our Solution

**TransitOps** is a full-stack web application that replaces fragmented spreadsheets with an integrated fleet management dashboard. Every entity (vehicle, driver, trip, maintenance log, expense) is linked, and every action enforces real business rules.

### Key Features & How They Solve the Problem

| Problem | Feature | How It Works |
|---|---|---|
| No fleet visibility | **Live Dashboard** | Real-time KPIs: available vehicles, active trips, drivers on duty, fleet utilization % |
| Overloaded trucks | **Cargo Weight Validation** | Trip creation blocks submission if cargo exceeds the selected vehicle's max capacity (client + server validation) |
| Expired license risk | **Driver Eligibility Filter** | Only drivers with `Available` status AND valid (non-expired) licenses appear in the trip assignment dropdown |
| Manual status tracking | **Automatic Status Transitions** | Dispatching a trip flips vehicle & driver to "On Trip"; completing or cancelling reverts them to "Available" — all in a single database transaction |
| Untracked fuel spend | **Trip Completion Logging** | On trip completion, the operator enters distance traveled + fuel consumed + fuel cost. This creates a linked `FuelLog` and updates the vehicle's odometer automatically |
| Unrealistic metrics | **Realistic Fuel Efficiency** | Calculated as `(total distance from completed trips) ÷ (total fuel liters logged)`. Shows "N/A" if no completed trips exist — never a fake number |
| Inconsistent reports | **Unified Formulas** | Dashboard and Reports use the exact same calculation: `Fleet Utilization = vehicles On Trip ÷ total non-retired vehicles × 100` |
| No cost tracking | **Expense & Maintenance Tracking** | Log maintenance events (with cost) and general expenses. Operational Cost = fuel cost + maintenance cost, calculated automatically |
| No actionable insights | **Reports & Analytics** | Per-vehicle breakdown showing completed trips, total distance, acquisition cost, and fleet-wide ROI |

### Business Rules Enforced

1. **Cargo ≤ Vehicle Capacity** — Validated on both client (dynamic `max` attribute) and server (action rejects with error message).
2. **Driver Must Be Available** — Suspended or already-dispatched drivers are excluded from trip creation.
3. **License Must Be Valid** — Expired licenses are filtered out at the database query level.
4. **Status Transitions Are Atomic** — Dispatch, Complete, and Cancel operations update trip + vehicle + driver statuses inside a single `$transaction`, preventing inconsistent states.
5. **Cancel Only Reverts If Dispatched** — Cancelling a Draft trip doesn't touch vehicle/driver status; cancelling a Dispatched trip restores both to Available.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Vanilla CSS with glassmorphism design system |
| Database | SQLite via Prisma ORM |
| Auth | JWT sessions via `jose` (cookie-based) |
| Icons | Lucide React |
| Deployment | Render |

---

## Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client & create database
npx prisma generate
npx prisma db push

# (Optional) Seed demo data
node seed.js

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with any email (e.g. `manager@transitops.com`).

---

## Architecture

```
app/
├── dashboard/      → Live KPIs (utilization, active trips, drivers on duty)
├── vehicles/       → CRUD for fleet registry
├── drivers/        → CRUD for driver management
├── trips/          → Create → Dispatch → Complete/Cancel lifecycle
├── maintenance/    → Log and close maintenance events
├── expenses/       → Track fuel + maintenance + general costs
├── reports/        → Analytics: fuel efficiency, ROI, per-vehicle breakdown
└── login/          → Email/password authentication
```
