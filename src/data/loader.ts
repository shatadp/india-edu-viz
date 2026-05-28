import Papa from 'papaparse';
import type { DatasetConfig, DataStore, GenderBreakdown, CategoryRecord } from '../types/data';
import { resolveStateName } from '../utils/stateName';

/** Parse a cell value to number | null. Empty/whitespace → null. */
function parseCell(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Generic CSV loader driven by a DatasetConfig.
 * Returns a DataStore (Map<canonicalStateName, CategoryRecord>).
 */
export async function loadDataset(config: DatasetConfig): Promise<DataStore> {
  const response = await fetch(config.csvPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${config.csvPath}: ${response.status}`);
  }
  const csvText = await response.text();

  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });

  if (parsed.errors.length > 0) {
    console.warn(`[${config.id}] CSV parse warnings:`, parsed.errors);
  }

  const store: DataStore = new Map();
  const unmatched: string[] = [];

  for (const row of parsed.data) {
    const rawName = row[config.stateColumn];
    if (!rawName || !rawName.trim()) continue;

    // "All India" is stored as-is
    const isAllIndia = rawName.trim().toLowerCase() === 'all india';
    const stateName = isAllIndia ? 'All India' : resolveStateName(rawName);

    if (!stateName) {
      unmatched.push(rawName);
      continue;
    }

    const record: CategoryRecord = {};
    for (const cat of config.categories) {
      const breakdown: GenderBreakdown = {
        male: parseCell(row[cat.maleCol]),
        female: parseCell(row[cat.femaleCol]),
        total: parseCell(row[cat.totalCol]),
      };
      record[cat.slug] = breakdown;
    }

    store.set(stateName, record);
  }

  if (unmatched.length > 0) {
    console.warn(`[${config.id}] Unresolved state names:`, unmatched);
  }

  console.log(`[${config.id}] Loaded ${store.size} entries (incl. All India)`);
  return store;
}
