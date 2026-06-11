import { formatIndianShort, formatIndianComma } from '../utils/indianFormat';
import { tankFillColor } from '../config/categoryColors';

interface TankLegendProps {
  totalValue: number | null;
  totalLabel: string;
}

export function TankLegend({ totalValue, totalLabel }: TankLegendProps) {
  if (totalValue === null) return null;

  return (
    <div className="tank-legend">
      <div className="tank-legend-row">
        <span
          className="tank-legend-swatch"
          style={{ backgroundColor: tankFillColor }}
        />
        <span className="tank-legend-label">{totalLabel}</span>
        <span className="tank-legend-value" title={formatIndianComma(totalValue)}>
          {formatIndianShort(totalValue)}
        </span>
      </div>
    </div>
  );
}
