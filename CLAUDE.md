# CLAUDE.md — Project Context

You are building an offline, browser-based visualization app. The full spec is in
`docs/PRD.md` — read it first, along with the two CSVs in `data/`.

## Quick orientation
- **Data:** `data/population_18_23.csv` and `data/enrolment_social_group.csv` are
  cleaned and ready. Last row of each is `All India` national totals. Blank cells
  mean "no data", not zero.
- **Critical semantics:** SC, ST, OBC are SUBSETS of "All categories". Never sum
  them with All categories. For composition visuals compute the "Other/General"
  remainder = All − (SC + ST + OBC). See PRD §3.
- **Signature visual:** state-shaped "tank fill" — a clip-masked liquid fill whose
  height is proportional to a metric, segmented into category bands. PRD §4 Phase 2.
- **Map file:** `data/india_states.geojson` must be supplied by the user. Do not
  fabricate boundary coordinates. Warn at build time about any state-name mismatches.

## Hard requirements
- Must run fully offline once built (no CDN). Bundle all libraries locally.
- Bars/fills MUST be proportional to value — verify, don't assume (a prior version
  had a flexbox bug where all bars stretched to full width).
- Indian number formatting (lakh/crore; exact value in tooltips).
- Build the category-split engine generically so future discipline/UG-PG CSVs
  plug in via config, no code rewrite (PRD §4 Phase 4).

## Suggested stack
Vite + React + TypeScript + D3. The user is on Windows; ensure npm scripts and
paths work in PowerShell.

## Working style
Proceed in the PRD's phase order. Complete and verify each phase before the next.
