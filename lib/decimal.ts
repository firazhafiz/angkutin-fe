/**
 * Prisma Decimal Parser
 *
 * Backend (Prisma) serializes Decimal/geography columns as:
 *   { s: -1|1, e: number, d: number[] }
 *
 * Where:
 *   s = sign (-1 = negative, 1 = positive)
 *   e = exponent (number of digits before decimal point minus 1)
 *   d = array of digit groups (each up to 7 digits, base-10_000_000)
 *
 * Example: { s: -1, e: 0, d: [7, 2484614] } → -7.2484614
 */

export interface PrismaDecimal {
  s: number; // sign: 1 or -1
  e: number; // exponent
  d: number[]; // digit groups
}

/**
 * Parse a Prisma Decimal object into a plain JS number.
 * Also handles the case where the value is already a number/string.
 */
export function parseDecimal(value: PrismaDecimal | number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;

  // Already a number
  if (typeof value === "number") return value;

  // String representation
  if (typeof value === "string") {
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  }

  // Prisma Decimal object
  if (typeof value === "object" && "s" in value && "e" in value && "d" in value) {
    try {
      const { s, e, d } = value;
      if (!d || d.length === 0) return null;

      // Reconstruct the number string from digit groups
      // Each element in d[] is a group of up to 7 digits
      const digitStr = d
        .map((group, i) => (i === 0 ? String(group) : String(group).padStart(7, "0")))
        .join("");

      // e is the position of decimal point from the left (0-indexed)
      // e=0 means 1 digit before decimal, e=2 means 3 digits, etc.
      const decimalPos = e + 1;

      let numStr: string;
      if (decimalPos >= digitStr.length) {
        // All digits are before decimal point
        numStr = digitStr + "0".repeat(decimalPos - digitStr.length);
      } else {
        numStr = digitStr.slice(0, decimalPos) + "." + digitStr.slice(decimalPos);
      }

      const result = parseFloat(numStr) * s;
      return isNaN(result) ? null : result;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Parse lat/lng coordinates from a BE response object.
 * Handles both Prisma Decimal format and plain numbers.
 */
export function parseCoordinates(
  lat: PrismaDecimal | number | string | null | undefined,
  lng: PrismaDecimal | number | string | null | undefined,
): { lat: number; lng: number } | null {
  const parsedLat = parseDecimal(lat);
  const parsedLng = parseDecimal(lng);

  if (parsedLat === null || parsedLng === null) return null;

  return { lat: parsedLat, lng: parsedLng };
}
