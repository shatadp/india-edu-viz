import type { DatasetConfig } from '../types/data';

interface MetricToggleProps {
  datasets: DatasetConfig[];
  selectedDatasetId: string;
  onDatasetChange: (id: string) => void;
}

export function MetricToggle({
  datasets,
  selectedDatasetId,
  onDatasetChange,
}: MetricToggleProps) {
  return (
    <div className="metric-toggle">
      <fieldset className="toggle-fieldset">
        <legend className="toggle-legend">Dataset</legend>
        <div className="toggle-group">
          {datasets.map((ds) => (
            <button
              key={ds.id}
              type="button"
              className={`toggle-btn${ds.id === selectedDatasetId ? ' toggle-btn--active' : ''}`}
              onClick={() => onDatasetChange(ds.id)}
              aria-pressed={ds.id === selectedDatasetId}
            >
              {ds.label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
