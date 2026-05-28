/**
 * Format a number using the Indian numbering system (lakh/crore).
 *
 * Examples:
 *   formatIndianComma(6973424)  → "69,73,424"
 *   formatIndianShort(6973424) → "69.73 L"
 *   formatIndianShort(152452016) → "15.25 Cr"
 */

/**
 * Full Indian comma-separated format: 1,23,45,678
 */
export function formatIndianComma(n: number): string {
  if (n < 0) return '-' + formatIndianComma(-n);
  const str = Math.round(n).toString();
  if (str.length <= 3) return str;

  // Last 3 digits separated, then groups of 2
  const last3 = str.slice(-3);
  let rest = str.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return groups.join(',') + ',' + last3;
}

/**
 * Short Indian format: "69.73 L" or "15.25 Cr"
 */
export function formatIndianShort(n: number): string {
  if (n < 0) return '-' + formatIndianShort(-n);
  if (n >= 1_00_00_000) {
    // Crore
    const cr = n / 1_00_00_000;
    return cr.toFixed(2) + ' Cr';
  }
  if (n >= 1_00_000) {
    // Lakh
    const lakh = n / 1_00_000;
    return lakh.toFixed(2) + ' L';
  }
  if (n >= 1_000) {
    // Thousand
    const k = n / 1_000;
    return k.toFixed(1) + ' K';
  }
  return Math.round(n).toString();
}
