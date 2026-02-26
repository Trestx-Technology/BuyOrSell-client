import { AdLocation } from "@/interfaces/ad";

/**
 * Resolves a human-readable location string from an AdLocation object or plain string.
 *
 * Priority order for English:
 *   1. `address` (full address string)
 *   2. `city, state` (if both differ)
 *   3. `city` or `state` individually
 *
 * Priority order for Arabic (`locale === "ar"`):
 *   1. `addressAr`
 *   2. `cityAr, stateAr`
 *   3. `cityAr` or `stateAr`
 *   4. Falls back to English `address`, `city`, `state`
 *
 * @param location - An AdLocation object or a plain location string.
 * @param locale   - The current locale (e.g. "en" | "ar"). Defaults to "en".
 * @param fallback - Text to show when no location data is found. Defaults to "Location not specified".
 * @returns A display-ready location string.
 */
export function getLocationDisplay(
  location: AdLocation | string | null | undefined,
  locale: string = "en",
  fallback: string = "Location not specified"
): string {
  if (!location) return fallback;

  // Plain string — return as-is
  if (typeof location === "string") {
    return location.trim() || fallback;
  }

  const loc = location as AdLocation;
  const isArabic = locale === "ar";

  if (isArabic) {
    if (loc.addressAr) return loc.addressAr;

    const city = loc.cityAr;
    const state = loc.stateAr;

    if (city && state && city !== state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;

    // Fallback to English fields when Arabic fields are absent
    if (loc.address) return loc.address;
    if (loc.city && loc.state && loc.city !== loc.state) return `${loc.city}, ${loc.state}`;
    return loc.city || loc.state || fallback;
  }

  // English
  if (loc.address) return loc.address;

  const city = loc.city;
  const state = loc.state;

  if (city && state && city !== state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;

  // Last-resort: look at area/street
  if (loc.area) return loc.area;
  if (loc.street) return loc.street;
  if (loc.country) return loc.country;

  return fallback;
}
