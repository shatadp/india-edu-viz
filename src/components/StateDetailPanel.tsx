import { useEffect, useRef, useMemo, useCallback } from 'react';
import type { StateFeature } from '../types/geo';
import type { DataStore, DatasetConfig, GenderBreakdown } from '../types/data';
import { getValue } from '../data/store';
import { allDatasets } from '../config/datasets';
import { formatIndianShort, formatIndianComma } from '../utils/indianFormat';
import {
  projectFeature,
  computeReferenceMax,
  computeFillHeight,
  computeCategoryBands,
} from '../utils/tankGeometry';
import { MetricToggle } from './MetricToggle';
import { TankFillVisual } from './TankFillVisual';
import { TankLegend } from './TankLegend';

type GenderKey = keyof GenderBreakdown;

interface StateDetailPanelProps {
  feature: StateFeature;
  store: DataStore;
  config: DatasetConfig;
  gender: GenderKey;
  selectedDatasetId: string;
  onDatasetChange: (id: string) => void;
  onGenderChange: (g: GenderKey) => void;
  onClose: () => void;
}

const TANK_WIDTH = 360;
const TANK_HEIGHT = 400;
const TANK_PADDING = 20;

export function StateDetailPanel({
  feature,
  store,
  config,
  gender,
  selectedDatasetId,
  onDatasetChange,
  onGenderChange,
  onClose,
}: StateDetailPanelProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const stateName = feature.properties.st_nm;

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, [stateName]);

  // Escape key closes
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  // Project the single state feature
  const projected = useMemo(
    () => projectFeature(feature, TANK_WIDTH, TANK_HEIGHT, TANK_PADDING),
    [feature],
  );

  // Compute reference max (max cat_all across all states, excl. All India)
  const referenceMax = useMemo(
    () => computeReferenceMax(store, gender),
    [store, gender],
  );

  // Compute fill height for this state
  const fillHeight = useMemo(() => {
    if (!projected) return 0;
    return computeFillHeight(
      store,
      stateName,
      gender,
      projected.bounds.height,
      referenceMax,
    );
  }, [store, stateName, gender, projected, referenceMax]);

  // Compute category bands
  const bands = useMemo(() => {
    if (!projected || fillHeight <= 0) return [];
    const shapeBottom = projected.bounds.y + projected.bounds.height;
    return computeCategoryBands(
      store,
      config,
      stateName,
      gender,
      fillHeight,
      shapeBottom,
    );
  }, [store, config, stateName, gender, fillHeight, projected]);

  const totalValue = getValue(store, stateName, 'cat_all', gender);

  // Summary text for the header
  const summaryText = totalValue !== null
    ? `${config.label}: ${formatIndianShort(totalValue)} (${formatIndianComma(totalValue)})`
    : `${config.label}: No data`;

  return (
    <>
      {/* Backdrop */}
      <div className="panel-backdrop" onClick={onClose} />

      {/* Panel */}
      <aside
        className="state-detail-panel"
        role="dialog"
        aria-label={`Details for ${stateName}`}
        onKeyDown={handleKeyDown}
      >
        <div className="panel-header">
          <h2 className="panel-title">{stateName}</h2>
          <button
            ref={closeBtnRef}
            className="panel-close-btn"
            onClick={onClose}
            aria-label="Close panel"
          >
            &times;
          </button>
        </div>

        <p className="panel-summary">{summaryText}</p>

        <MetricToggle
          datasets={allDatasets}
          selectedDatasetId={selectedDatasetId}
          onDatasetChange={onDatasetChange}
          selectedGender={gender}
          onGenderChange={onGenderChange}
        />

        {projected ? (
          <div className="tank-container">
            <TankFillVisual
              projected={projected}
              bands={bands}
              width={TANK_WIDTH}
              height={TANK_HEIGHT}
              stateName={stateName}
            />
          </div>
        ) : (
          <p className="panel-no-data">Unable to render state shape.</p>
        )}

        <TankLegend
          bands={bands}
          totalValue={totalValue}
          totalLabel={config.label}
        />
      </aside>
    </>
  );
}
