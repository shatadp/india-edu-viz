# Map data sources

india_states.geojson
- 36 state/UT polygons, one feature per state. Property key for the name: `st_nm`.
- Derived by dissolving the district-level file (below) into state boundaries,
  then lightly simplified. Reflects post-2019 boundaries: Ladakh separate from
  Jammu and Kashmir; Dadra & Nagar Haveli and Daman & Diu merged.
- State names match the project CSVs exactly (all 36, no aliases needed).

india_districts.geojson
- 759 district polygons (optional, for future district-level drill-downs).
- Same `st_nm` property for the parent state, plus `district`, `dt_code`, `st_code`.

Origin: curated from the public repository udit-001/india-maps-data
(https://github.com/udit-001/india-maps-data). Per that repo, the geospatial data
was itself curated from publicly available sources and is provided without warranty
of accuracy. Verify boundaries before any official or sensitive use.
