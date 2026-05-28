import * as d3 from 'd3';
import type { StateFeature } from '../types/geo';
import type { DataStore, DatasetConfig, GenderBreakdown } from '../types/data';
import { getValue, computeOtherCategory } from '../data/store';
import { bandOrder, categoryColors, categoryLabels } from '../config/categoryColors';

/** Result of projecting a single state feature for the tank visual */
export interface ProjectedFeature {
  /** SVG path string for the state shape */
  pathD: string;
  /** Bounding box of the projected shape within the SVG */
  bounds: { x: number; y: number; width: number; height: number };
}

/** A single band in the segmented fill */
export interface CategoryBand {
  slug: string;
  label: string;
  color: string;
  value: number;
  /** SVG y coordinate of the band's top edge */
  y: number;
  /** SVG height of the band */
  height: number;
}

type GenderKey = keyof GenderBreakdown;

/**
 * Re-project a single state feature to fill a given SVG area.
 * Uses geoMercator().fitSize() on just the one feature so it fills the panel.
 */
export function projectFeature(
  feature: StateFeature,
  width: number,
  height: number,
  padding: number,
): ProjectedFeature | null {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const projection = d3
    .geoMercator()
    .fitSize([innerW, innerH], feature);

  const pathGen = d3.geoPath().projection(projection);
  const pathD = pathGen(feature);
  if (!pathD) return null;

  const svgBounds = pathGen.bounds(feature);
  // svgBounds: [[x0,y0],[x1,y1]]

  return {
    pathD,
    bounds: {
      x: svgBounds[0][0] + padding,
      y: svgBounds[0][1] + padding,
      width: svgBounds[1][0] - svgBounds[0][0],
      height: svgBounds[1][1] - svgBounds[0][1],
    },
  };
}

/**
 * Compute the reference maximum across all states (excluding "All India")
 * for the "cat_all" category. This is the denominator for proportional fill.
 */
export function computeReferenceMax(
  store: DataStore,
  gender: GenderKey,
): number {
  let max = 0;
  for (const [stateName, record] of store) {
    if (stateName === 'All India') continue;
    const breakdown = record['cat_all'];
    if (!breakdown) continue;
    const val = breakdown[gender];
    if (val !== null && val > max) max = val;
  }
  return max;
}

/**
 * Compute the proportional fill height for a state within the tank shape.
 * Returns a value between 0 and shapeHeight.
 */
export function computeFillHeight(
  store: DataStore,
  stateName: string,
  gender: GenderKey,
  shapeHeight: number,
  referenceMax: number,
): number {
  if (referenceMax <= 0) return 0;
  const val = getValue(store, stateName, 'cat_all', gender);
  if (val === null) return 0;
  return (val / referenceMax) * shapeHeight;
}

/**
 * Build the category bands for the segmented fill.
 * Returns bands ordered bottom-to-top: Other, OBC (if present), SC, ST.
 *
 * @param shapeBottomY - the y coordinate of the bottom of the shape bounds
 * @param fillHeight - total fill height (from computeFillHeight)
 */
export function computeCategoryBands(
  store: DataStore,
  config: DatasetConfig,
  stateName: string,
  gender: GenderKey,
  fillHeight: number,
  shapeBottomY: number,
): CategoryBand[] {
  // Gather raw values for each sub-category
  const rawValues: { slug: string; value: number }[] = [];

  // "other" is always computed
  const otherVal = computeOtherCategory(store, config, stateName, gender);
  if (otherVal !== null && otherVal > 0) {
    rawValues.push({ slug: 'other', value: otherVal });
  }

  // Add sub-categories that exist in this dataset's subtractForOther
  for (const slug of config.subtractForOther) {
    const val = getValue(store, stateName, slug, gender);
    if (val !== null && val > 0) {
      rawValues.push({ slug, value: val });
    }
  }

  // Total of all band values (should equal cat_all, but use actual sum for safety)
  const totalVal = getValue(store, stateName, 'cat_all', gender);
  if (!totalVal || totalVal <= 0 || fillHeight <= 0) return [];

  // Sort by bandOrder
  const ordered = bandOrder
    .filter((slug) => rawValues.some((r) => r.slug === slug))
    .map((slug) => rawValues.find((r) => r.slug === slug)!);

  // Build bands from bottom up
  const bands: CategoryBand[] = [];
  let currentY = shapeBottomY; // start at shape bottom

  for (const { slug, value } of ordered) {
    const bandHeight = (value / totalVal) * fillHeight;
    currentY -= bandHeight; // move up
    bands.push({
      slug,
      label: categoryLabels[slug] ?? slug,
      color: categoryColors[slug] ?? '#999',
      value,
      y: currentY,
      height: bandHeight,
    });
  }

  return bands;
}
