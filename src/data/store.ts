import type { DataStore, GenderBreakdown } from '../types/data';

type GenderKey = keyof GenderBreakdown;

/**
 * Get a value from a DataStore for a specific state, category, and gender key.
 */
export function getValue(
  store: DataStore,
  stateName: string,
  categorySlug: string,
  gender: GenderKey = 'total',
): number | null {
  const record = store.get(stateName);
  if (!record) return null;
  const breakdown = record[categorySlug];
  if (!breakdown) return null;
  return breakdown[gender];
}
