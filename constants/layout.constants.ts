/**
 * Layout configuration constants
 * Define pages/routes where specific layout components should be visible
 * All other pages will have these components hidden by default
 */

/**
 * Pages where Navbar and CategoryNav should be visible
 * All other pages will have the navbar hidden by default
 * Supports exact paths and path patterns (paths that start with the specified string)
 *
 * Pages in this list will show navbar on all screen sizes.
 * To hide navbar on mobile only for specific pages, add them to PAGES_WITHOUT_NAV_MOBILE
 */
export const PAGES_WITH_NAV: string[] = [
  // Add page paths here where navbar and category nav should be visible
  // Examples:
  // "/",
  // "/categories",
  // "/jobs", // all paths starting with /jobs
  "/",
  "/ad",
];

/**
 * Pages where Navbar and CategoryNav should be hidden on mobile only
 * These pages must also be in PAGES_WITH_NAV
 * Components will be visible on desktop (sm and above) but hidden on mobile
 * Supports exact paths and path patterns (paths that start with the specified string)
 */
export const PAGES_WITH_NAV_MOBILE: string[] = [
  // Add page paths here where navbar and category nav should be hidden on mobile
  // Note: These pages should also be included in PAGES_WITH_NAV
  // Examples:
  // "/checkout",
  // "/payment",
  "/",
];

/**
 * Check if a path matches any of the configured paths
 * @param pathname - The current pathname
 * @param visiblePaths - Array of paths to check against
 * @returns true if the pathname matches any configured path
 */
export function shouldShowComponent(
  pathname: string,
  visiblePaths: string[]
): boolean {
  if (!pathname) return false;

  // If no visible paths configured, show by default (backward compatibility)
  if (visiblePaths.length === 0) return true;

  // Remove locale prefix if present (e.g., "/en-US/login" -> "/login")
  const pathWithoutLocale = pathname.replace(/^\/[^/]+/, "") || "/";

  return visiblePaths.some((visiblePath) => {
    // Exact match
    if (pathWithoutLocale === visiblePath) return true;
    // Path starts with pattern (for nested routes)
    if (pathWithoutLocale.startsWith(visiblePath + "/")) return true;
    return false;
  });
}
