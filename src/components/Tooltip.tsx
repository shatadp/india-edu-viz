import type { DataStore } from '../types/data';
import { getValue } from '../data/store';
import { formatIndianComma, formatIndianShort } from '../utils/indianFormat';

interface TooltipProps {
  stateName: string;
  x: number;
  y: number;
  populationStore: DataStore | null;
  enrolmentStore: DataStore | null;
}

function formatRow(label: string, store: DataStore | null, stateName: string): string | null {
  if (!store) return null;
  const val = getValue(store, stateName, 'cat_all', 'total');
  if (val === null) return null;
  return `${label}: ${formatIndianShort(val)} (${formatIndianComma(val)})`;
}

export function Tooltip({ stateName, x, y, populationStore, enrolmentStore }: TooltipProps) {
  const popLine = formatRow('Population (18–23)', populationStore, stateName);
  const enrLine = formatRow('Enrolment', enrolmentStore, stateName);

  return (
    <div
      className="tooltip"
      style={{
        left: x + 12,
        top: y - 10,
      }}
      role="tooltip"
    >
      <strong>{stateName}</strong>
      {popLine && <div>{popLine}</div>}
      {enrLine && <div>{enrLine}</div>}
      {!popLine && !enrLine && <div>No data</div>}
    </div>
  );
}
