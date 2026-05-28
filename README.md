# India Education & Population Visualization

An interactive, offline-capable browser app that visualizes India's 18–23 age
population and higher-education enrolment by state, with "tank fill" charts
segmented by social group (SC / ST / OBC / Other).

## What's in here
```
india-edu-viz/
├─ data/
│  ├─ population_18_23.csv        # cleaned, ready
│  ├─ enrolment_social_group.csv  # cleaned, ready
│  └─ india_states.geojson        # state boundary shapes
├─ docs/
│  └─ PRD.md                      # full product spec
├─ src/                           # React + TypeScript source
└─ README.md                      # this file
```

## Prerequisites
- **Node.js (LTS)** — download from nodejs.org, run the installer.
  Verify: `node --version` and `npm --version`.

## Getting started
```powershell
cd india-edu-viz
npm install
npm run dev        # opens dev server at http://localhost:5173
```

## Production build (fully offline)
```powershell
npm run build      # produces dist/ folder
npm run preview    # preview the production build locally
```
The `dist/` folder is self-contained — no network access required.

## Adding discipline / UG-PG data later
The current datasets break down by **social group (SC / ST / OBC)**.
When you have **discipline-wise** or **level (UG/PG)** data:
1. Save it as a CSV in `data/` with the same shape: one row per state, columns
   ending in `_total` (and optionally `_male` / `_female`) per category.
2. Add a new `DatasetConfig` entry in `src/config/datasets.ts` naming the file
   and its category columns. The category-split engine is generic, so new
   datasets plug in without code changes.

## Tech stack
Vite + React + TypeScript + D3.js + PapaParse
