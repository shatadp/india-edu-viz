import { useState, useEffect } from 'react';
import type { DataStore, DatasetConfig } from '../types/data';
import { loadDataset } from '../data/loader';

export function useDataStore(config: DatasetConfig) {
  const [store, setStore] = useState<DataStore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadDataset(config)
      .then((data) => {
        if (!cancelled) setStore(data);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });

    return () => {
      cancelled = true;
    };
  }, [config]);

  return { store, error };
}
