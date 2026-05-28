import { useState, useEffect } from 'react';
import type { IndiaFeatureCollection } from '../types/geo';

const GEO_PATH = 'data/india_states.geojson';

export function useGeoData() {
  const [geoData, setGeoData] = useState<IndiaFeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(GEO_PATH)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load GeoJSON: ${res.status}`);
        return res.json();
      })
      .then((data: IndiaFeatureCollection) => {
        if (!cancelled) {
          console.log(`[geo] Loaded ${data.features.length} state features`);
          setGeoData(data);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { geoData, error };
}
