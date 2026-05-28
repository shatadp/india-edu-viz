# India Education & Population Viz — Setup (Windows)

This folder is a ready-to-go project for building an interactive visualization
of India's 18–23 population and higher-education enrolment, with state "tank fill"
charts broken down by social group.

## What's in here
```
india-edu-viz/
├─ data/
│  ├─ population_18_23.csv        # cleaned, ready
│  ├─ enrolment_social_group.csv  # cleaned, ready
│  └─ india_states.geojson        # <-- YOU must add this (see step 4)
├─ docs/
│  └─ PRD.md                      # the full build spec for Claude Code
├─ CLAUDE.md                      # project context Claude Code auto-reads
└─ README.md                      # this file
```

## Step 1 — Install prerequisites (one time)
1. **Node.js (LTS)** — download from nodejs.org, run the installer. This also installs `npm`.
   - Verify in a terminal (PowerShell or Command Prompt): `node --version` and `npm --version`.
2. **Claude Code** — install per Anthropic's current instructions for Windows. After install, verify with: `claude --version`.
   - Note: Claude Code on Windows runs well inside **PowerShell** or **Windows Terminal**. WSL (Ubuntu) is also a great option if you have it.

## Step 2 — Put this folder somewhere sensible
e.g. `C:\Users\<you>\projects\india-edu-viz`

## Step 3 — Launch Claude Code in this folder
Open PowerShell, then:
```powershell
cd C:\Users\<you>\projects\india-edu-viz
claude
```
Claude Code will read `CLAUDE.md` and you can then say:
> Read docs/PRD.md and the two CSVs in data/, then scaffold the app described in the PRD. Start with Phase 1.

## Step 4 — Add the India map file (required for the map visuals)
The tank-fill and choropleth visuals need real state boundaries. Download an
**India states GeoJSON or TopoJSON** and save it as:
```
data/india_states.geojson
```
Make sure it includes the modern set of states/UTs (Ladakh separate, J&K, and
"Dadra & Nagar Haveli and Daman & Diu" merged). Then tell Claude Code:
> The GeoJSON is in data/. Wire up the map and print any state names that don't match between the CSVs and the GeoJSON.

## Step 5 — Build and run (Claude Code will set this up)
Typical commands it will create:
```powershell
npm install
npm run dev      # opens a local dev server, usually http://localhost:5173
npm run build    # produces an offline dist/ folder
```

## Adding discipline / UG-PG data later
The two tables you have only break down by **social group (SC/ST/OBC)**.
When you get **discipline-wise** or **level (UG/PG)** data:
1. Save it as a CSV in `data/` with the same shape: one row per state, columns
   ending in `_total` (and optionally `_male` / `_female`) per category.
2. Tell Claude Code the filename and category columns; the PRD asks it to make
   the category-split engine generic, so it should plug in without rewrites.

## Tips for working with Claude Code
- Work in phases (the PRD is ordered). Ask it to complete and verify Phase 1 before Phase 2.
- If a visual looks wrong, describe exactly what you see — like you did with the
  "all bars stretch to 100%" bug. Precise symptoms get precise fixes.
- Ask it to keep everything **offline** (bundle libraries, no CDN links).
