/**
 * Canonical state/UT names that match the GeoJSON `st_nm` property.
 * All 36 states & UTs as of 2024.
 */
export const canonicalNames: readonly string[] = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const;

/**
 * Maps known alternate spellings → canonical name.
 * Lookup is case-insensitive (keys stored lowercase).
 */
const aliasEntries: [string, string][] = [
  // Common alternate spellings
  ['tamilnadu', 'Tamil Nadu'],
  ['tamil-nadu', 'Tamil Nadu'],
  ['orissa', 'Odisha'],
  ['pondicherry', 'Puducherry'],
  ['uttaranchal', 'Uttarakhand'],
  ['nct of delhi', 'Delhi'],
  ['nct delhi', 'Delhi'],
  ['delhi nct', 'Delhi'],
  ['national capital territory of delhi', 'Delhi'],
  ['a & n islands', 'Andaman and Nicobar Islands'],
  ['a&n islands', 'Andaman and Nicobar Islands'],
  ['andaman & nicobar islands', 'Andaman and Nicobar Islands'],
  ['andaman & nicobar', 'Andaman and Nicobar Islands'],
  ['d&n haveli and daman & diu', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['dadra & nagar haveli and daman & diu', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['dnh and dd', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['dnh & dd', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['dadra and nagar haveli', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['daman and diu', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['jammu & kashmir', 'Jammu and Kashmir'],
  ['j&k', 'Jammu and Kashmir'],
  ['j & k', 'Jammu and Kashmir'],
  ['chattisgarh', 'Chhattisgarh'],
  ['chhatisgarh', 'Chhattisgarh'],
];

const aliasMap = new Map<string, string>();

// Add canonical names (lowercase) → themselves
for (const name of canonicalNames) {
  aliasMap.set(name.toLowerCase(), name);
}

// Add aliases
for (const [alias, canonical] of aliasEntries) {
  aliasMap.set(alias.toLowerCase(), canonical);
}

/**
 * Resolve a state name to its canonical form.
 * Returns the canonical name or `null` if no match found.
 */
export function resolveStateName(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return aliasMap.get(trimmed.toLowerCase()) ?? null;
}

/**
 * Find names from a list that don't resolve to any canonical name.
 */
export function findUnmatchedNames(names: string[]): string[] {
  return names.filter((n) => resolveStateName(n) === null);
}
