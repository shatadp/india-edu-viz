/** Male / Female / Total breakdown — null means "no data" */
export interface GenderBreakdown {
  male: number | null;
  female: number | null;
  total: number | null;
}

/**
 * One row of parsed CSV data for a single state.
 * Keys are category slugs (e.g. "cat_all", "sc", "st", "obc").
 */
export type CategoryRecord = Record<string, GenderBreakdown>;

/**
 * Full parsed dataset: state name → CategoryRecord.
 * The "All India" row is stored under key "All India".
 */
export type DataStore = Map<string, CategoryRecord>;

/** Describes how to parse a CSV into a DataStore. */
export interface CategoryColumnDef {
  /** Internal slug, e.g. "sc" */
  slug: string;
  /** Human-readable label, e.g. "Scheduled Caste" */
  label: string;
  /** CSV column name for male, e.g. "sc_male" */
  maleCol: string;
  /** CSV column name for female */
  femaleCol: string;
  /** CSV column name for total */
  totalCol: string;
}

export interface DatasetConfig {
  /** Unique id, e.g. "population" */
  id: string;
  /** Display name, e.g. "Population (18–23)" */
  label: string;
  /** Path to CSV relative to base URL */
  csvPath: string;
  /** Column that holds the state name */
  stateColumn: string;
  /** Ordered list of categories in this dataset */
  categories: CategoryColumnDef[];
  /**
   * Which category slugs to subtract from "cat_all" to compute the
   * "Other / General" remainder. e.g. ["sc", "st"] for population,
   * ["sc", "st", "obc"] for enrolment.
   */
  subtractForOther: string[];
}
