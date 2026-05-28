/** CVD-safe category color palette (Tableau 10 subset) */
export const categoryColors: Record<string, string> = {
  other: '#4E79A7',  // blue
  obc: '#F28E2B',    // orange
  sc: '#59A14F',     // green
  st: '#B07AA1',     // purple
};

/**
 * Band stacking order (bottom → top).
 * "other" is always first; additional categories follow in this order.
 */
export const bandOrder = ['other', 'obc', 'sc', 'st'] as const;

/** Human-readable labels keyed by slug */
export const categoryLabels: Record<string, string> = {
  other: 'Other / General',
  obc: 'Other Backward Class',
  sc: 'Scheduled Caste',
  st: 'Scheduled Tribe',
};
