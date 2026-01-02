/**
 * Formats a date to a locale-readable string format
 * @param date - Date object to format
 * @returns Formatted string like "January 14, 2024"
 */
export function formatDateLocale(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
