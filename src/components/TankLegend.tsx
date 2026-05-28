import type { CategoryBand } from '../utils/tankGeometry';
import { formatIndianShort, formatIndianComma } from '../utils/indianFormat';

interface TankLegendProps {
  bands: CategoryBand[];
  totalValue: number | null;
  totalLabel: string;
}

export function TankLegend({ bands, totalValue, totalLabel }: TankLegendProps) {
  // Display bands in reverse order (top band first in the legend)
  const displayBands = [...bands].reverse();

  return (
    <div className="tank-legend">
      {displayBands.map((band) => (
        <div key={band.slug} className="tank-legend-row">
          <span
            className="tank-legend-swatch"
            style={{ backgroundColor: band.color }}
          />
          <span className="tank-legend-label">{band.label}</span>
          <span className="tank-legend-value" title={formatIndianComma(band.value)}>
            {formatIndianShort(band.value)}
          </span>
        </div>
      ))}
      {totalValue !== null && (
        <div className="tank-legend-row tank-legend-total">
          <span className="tank-legend-swatch" style={{ backgroundColor: 'transparent' }} />
          <span className="tank-legend-label">{totalLabel}</span>
          <span className="tank-legend-value" title={formatIndianComma(totalValue)}>
            {formatIndianShort(totalValue)}
          </span>
        </div>
      )}
    </div>
  );
}
