import type { DatasetConfig, GenderBreakdown } from '../types/data';

type GenderKey = keyof GenderBreakdown;

interface MetricToggleProps {
  datasets: DatasetConfig[];
  selectedDatasetId: string;
  onDatasetChange: (id: string) => void;
  selectedGender: GenderKey;
  onGenderChange: (g: GenderKey) => void;
}

const genderOptions: { key: GenderKey; label: string }[] = [
  { key: 'total', label: 'Total' },
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
];

export function MetricToggle({
  datasets,
  selectedDatasetId,
  onDatasetChange,
  selectedGender,
  onGenderChange,
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
      <fieldset className="toggle-fieldset">
        <legend className="toggle-legend">Gender</legend>
        <div className="toggle-group">
          {genderOptions.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`toggle-btn${key === selectedGender ? ' toggle-btn--active' : ''}`}
              onClick={() => onGenderChange(key)}
              aria-pressed={key === selectedGender}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
