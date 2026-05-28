import type { DataStore, GenderBreakdown, DatasetConfig } from '../types/data';

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

/**
 * Compute the "Other / General" category as:
 *   All categories − sum(subtractCategories)
 * Clamps at 0 for rounding artifacts.
 * Returns null if "All categories" total is null.
 */
export function computeOtherCategory(
  store: DataStore,
  config: DatasetConfig,
  stateName: string,
  gender: GenderKey = 'total',
): number | null {
  const allVal = getValue(store, stateName, 'cat_all', gender);
  if (allVal === null) return null;

  let subtracted = 0;
  for (const slug of config.subtractForOther) {
    const v = getValue(store, stateName, slug, gender);
    if (v !== null) subtracted += v;
  }

  return Math.max(0, allVal - subtracted);
}
