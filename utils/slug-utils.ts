/**
 * Utility functions for transforming strings to URL-friendly slugs
 * and building slug-based URL paths
 */

/**
 * Transforms a string to a URL-friendly slug
 * Converts to lowercase, replaces spaces and special characters with hyphens,
 * and removes leading/trailing hyphens
 *
 * @param text - The string to convert to a slug
 * @returns A URL-friendly slug
 *
 * @example
 * ```ts
 * toSlug("Software Engineering") // "software-engineering"
 * toSlug("Mobile & Tablets") // "mobile-tablets"
 * toSlug("  Hello   World  ") // "hello-world"
 * ```
 */
export function toSlug(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9\(\)\[\]\{\}\-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Transforms a slug back to a human-readable string
 * Replaces hyphens with spaces
 *
 * @param slug - The slug to convert back
 * @returns A human-readable string
 */
export function unSlugify(slug: string): string {
  if (!slug) return "";
  return slug.replace(/-/g, " ");
}

/**
 * Transforms multiple strings to slugs and joins them with a separator
 * Useful for building nested URL paths
 *
 * @param parts - Array of strings to transform to slugs
 * @param separator - Separator to join slugs (default: "/")
 * @returns A joined slug path
 *
 * @example
 * ```ts
 * toSlugPath(["Software Engineering", "Mobile Development"])
 * // "software-engineering/mobile-development"
 *
 * toSlugPath(["Jobs", "Tech", "Engineering"], "/")
 * // "jobs/tech/engineering"
 * ```
 */
export function toSlugPath(
  parts: (string | null | undefined)[],
  separator: string = "/"
): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .map((part) => toSlug(part))
    .filter((slug) => slug.length > 0)
    .join(separator);
}

/**
 * Transforms multiple string arguments to slugs and joins them
 * Convenience function that accepts variadic arguments
 *
 * @param ...parts - Variable number of strings to transform to slugs
 * @returns A joined slug path
 *
 * @example
 * ```ts
 * slugify("Jobs", "Software Engineering", "Mobile")
 * // "jobs/software-engineering/mobile"
 *
 * slugify("Categories", "Electronics", "Mobile & Tablets")
 * // "categories/electronics/mobile-tablets"
 * ```
 */
export function slugify(...parts: (string | null | undefined)[]): string {
  return toSlugPath(parts);
}
