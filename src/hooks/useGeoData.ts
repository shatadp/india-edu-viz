import { useState, useEffect } from 'react';
import type { FeatureCollection, Polygon, MultiPolygon } from 'geojson';
import type { IndiaFeatureCollection } from '../types/geo';

const STATES_PATH = 'data/india_states.geojson';
const DISTRICTS_PATH = 'data/india_districts.geojson';

/** Generic GeoJSON collection for districts (no typed properties needed) */
export type DistrictFeatureCollection = FeatureCollection<Polygon | MultiPolygon>;

export function useGeoData() {
  const [geoData, setGeoData] = useState<IndiaFeatureCollection | null>(null);
  const [districtData, setDistrictData] = useState<DistrictFeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch(STATES_PATH).then((res) => {
        if (!res.ok) throw new Error(`Failed to load states GeoJSON: ${res.status}`);
        return res.json();
      }),
      fetch(DISTRICTS_PATH).then((res) => {
        if (!res.ok) throw new Error(`Failed to load districts GeoJSON: ${res.status}`);
        return res.json();
      }),
    ])
      .then(([states, districts]: [IndiaFeatureCollection, DistrictFeatureCollection]) => {
        if (!cancelled) {
          console.log(`[geo] Loaded ${states.features.length} state features`);
          console.log(`[geo] Loaded ${districts.features.length} district features`);
          setGeoData(states);
          setDistrictData(districts);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { geoData, districtData, error };
}
