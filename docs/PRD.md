# PRD — India Education & Population Visualization

## 1. Goal
Build an interactive, browser-based web app that visualizes India's **population (18–23 years)** and **higher-education enrolment** by state, with drill-downs into social-group composition. The signature visual is a **"tank fill"**: each state is shown as its own geographic shape, filled like liquid in a tank to a height proportional to a chosen metric, then segmented by category (SC / ST / OBC / Other).

The app must run **fully offline** (no external CDN calls) once built. The user is on **Windows**.

## 2. Tech stack
- **Vite + React + TypeScript** for the app shell.
- **D3.js** for geo projection, scales, and the clip-mask tank fills.
- **TopoJSON/GeoJSON** of Indian states for shapes (see §6).
- No backend. Data is loaded from local CSV/JSON in `/data`.
- Bundle everything for offline use; `npm run build` should produce a self-contained `dist/` that opens via `index.html` or a local static server.

## 3. Data (already provided in `/data`)
- `population_18_23.csv` — Source: "Table 38, Population (18–23 years) 2021–22". Columns: state, then Male/Female/Total for **All categories, Scheduled Caste, Scheduled Tribe**. Last row is `All India` (national totals). Some cells are blank where the source had no data — treat blanks as "no data", NOT zero.
- `enrolment_social_group.csv` — Source: "Table 14, State-wise Enrolment for different Social Groups (including Estimation)". Columns: state, then Male/Female/Total for **All categories, Scheduled Caste, Scheduled Tribe, Other Backward Class**. Last row is `All India`.

### Important data semantics (do not get this wrong)
- SC, ST, OBC are **subsets** of "All categories" — they must never be summed alongside "All categories" or shown as a pie *with* All categories, because that double-counts.
- For a valid composition pie/segmented tank of the total, compute **"Other / General" = All − SC − ST − OBC** (enrolment) or **"Other" = All − SC − ST** (population). Clamp at 0 if a rounding artifact makes it slightly negative.
- The population and enrolment totals are NOT directly comparable as a ratio without care (different universes), but a "what share of the 18–23 population is enrolled" view is acceptable IF clearly labeled as an approximate gross indicator, not a precise enrolment ratio.

## 4. Core features (build in this order)

### Phase 1 — Foundations
1. Load and parse both CSVs into a typed in-memory store keyed by state.
2. A normalized state-name map (the two tables and the GeoJSON may spell names differently — e.g. "Tamil Nadu" vs "Tamilnadu", "Dadra and Nagar Haveli and Daman and Diu"). Provide a single canonical name list and aliases.
3. Render the India map (states as SVG paths via D3 geo projection, `geoMercator` or `geoConicConformal` centered on India).

### Phase 2 — The "tank fill" state visual
4. Clicking a state opens a **detail panel** showing that state as a large shape.
5. The shape acts as a clip-mask. A colored rectangle rises from the bottom; its **height = (value / max_reference) × shape_height**. Use the national max or the all-states max as the reference so fills are comparable across states.
6. Segment the fill by category: stacked bands (Other / OBC / SC / ST) within the filled liquid, each band's height proportional to its share. Animate the fill rising on open (~800ms ease-out).
7. Toggle the metric driving the tank: **Population total**, **Enrolment total**, **Male**, **Female**.

### Phase 3 — Comparisons
8. Side-by-side: **Population in State X** tank next to **Enrolment in State X** tank.
9. National choropleth: color each state on the map by a chosen metric (total enrolment, or enrolment-to-population indicator). Legend + hover tooltip with exact figures (Indian comma format, e.g. 69,73,424).

### Phase 4 — Extensible splits (STRUCTURE NOW, DATA LATER)
10. The user wants additional tank breakdowns by **academic discipline** and by **level (UG / PG / etc.)**. **This data is NOT yet provided.** Build the category-split engine generically so that a new CSV with the same `state, <group>_total...` shape can drive a new tank segmentation with zero code changes — just a config entry naming the file and its category columns. Add a clearly-labeled placeholder/empty state in the UI for "Discipline" and "Level" until their CSVs are dropped into `/data`.

## 5. UX / quality bar
- Offline-first, no CDN. Bundle fonts/libs locally.
- Indian number formatting (lakh/crore aware, e.g. "69.73 L", with exact value in tooltip).
- Accessible: keyboard-selectable states, `aria-label`s, color choices distinguishable for color-vision deficiency.
- Responsive down to ~768px.
- A bar in the UI must be **proportional** to its value (a past hand-built version had a CSS flexbox bug where every bar stretched to full width — verify proportionality explicitly).

## 6. The map data
An India states boundary file is required at `/data/india_states.geojson`.
- Must include the current set of states/UTs (Ladakh separate, J&K, and DNH & DD merged).
- The alias map should ensure every name in the CSVs resolves to a feature in the GeoJSON. Print any unmatched names as a build-time warning.

## 7. Deliverables
- Running `npm install && npm run dev` opens the app locally.
- `npm run build` produces an offline `dist/`.
- A `README.md` explaining how to run on Windows, where to drop the GeoJSON, and how to add discipline/level CSVs later.
- Code commented where the tank clip-mask math happens.

## 8. Out of scope (for now)
- No server, auth, or database.
- No live data fetching.
- Discipline and UG/PG actual numbers (awaiting data from user).
