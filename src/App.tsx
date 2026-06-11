import { useState, useCallback, useMemo } from 'react';
import { useGeoData } from './hooks/useGeoData';
import { useDataStore } from './hooks/useDataStore';
import { populationConfig, enrolmentConfig, allDatasets } from './config/datasets';
import type { StateFeature } from './types/geo';
import { IndiaMap } from './components/IndiaMap';
import { StateDetailPanel } from './components/StateDetailPanel';
import './App.css';

export function App() {
  const { geoData, districtData, error: geoError } = useGeoData();
  const { store: populationStore, error: popError } = useDataStore(populationConfig);
  const { store: enrolmentStore, error: enrError } = useDataStore(enrolmentConfig);

  // Phase 2 state
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('population');

  // Map click handler
  const handleStateClick = useCallback((stateName: string) => {
    setSelectedState(stateName);
  }, []);

  // Close panel handler — returns focus to the map
  const handleClosePanel = useCallback(() => {
    setSelectedState(null);
  }, []);

  // Derive the selected feature from geoData
  const selectedFeature: StateFeature | null = useMemo(() => {
    if (!geoData || !selectedState) return null;
    return (
      geoData.features.find((f) => f.properties.st_nm === selectedState) ?? null
    );
  }, [geoData, selectedState]);

  // Derive the active store and config based on dataset selection
  const activeStore = selectedDatasetId === 'enrolment' ? enrolmentStore : populationStore;
  const activeConfig = allDatasets.find((d) => d.id === selectedDatasetId) ?? populationConfig;

  const error = geoError || popError || enrError;
  if (error) {
    return <div className="error">Error loading data: {error}</div>;
  }

  if (!geoData) {
    return <div className="loading">Loading map data…</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>India Education &amp; Population</h1>
        <p className="subtitle">Population (18–23 years) &amp; Higher Education Enrolment by State</p>
      </header>
      <main className="app-main">
        <IndiaMap
          geoData={geoData}
          districtData={districtData}
          populationStore={populationStore}
          enrolmentStore={enrolmentStore}
          onStateClick={handleStateClick}
        />
      </main>

      {selectedFeature && activeStore && (
        <StateDetailPanel
          feature={selectedFeature}
          store={activeStore}
          config={activeConfig}
          selectedDatasetId={selectedDatasetId}
          onDatasetChange={setSelectedDatasetId}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
