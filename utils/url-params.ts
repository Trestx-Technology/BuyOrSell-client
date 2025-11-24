import { ReadonlyURLSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Updates a URL query parameter and navigates to the new URL
 * 
 * @param searchParams - Current URL search parameters
 * @param pathname - Current pathname
 * @param router - Next.js router instance
 * @param paramName - Name of the query parameter to update
 * @param value - Value to set (empty string or null/undefined will remove the parameter)
 * @param shouldRemove - Optional function to determine if parameter should be removed (e.g., for special values like "All Categories")
 * 
 * @example
 * ```tsx
 * updateUrlParam(searchParams, pathname, router, "emirate", selectedCity);
 * 
 * // With custom removal condition
 * updateUrlParam(
 *   searchParams, 
 *   pathname, 
 *   router, 
 *   "category", 
 *   category,
 *   (val) => val === "All Categories"
 * );
 * ```
 */
export function updateUrlParam(
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  router: AppRouterInstance,
  paramName: string,
  value: string | null | undefined,
  shouldRemove?: (value: string) => boolean
): void {
  const params = new URLSearchParams(searchParams.toString());
  
  // Determine if we should remove the parameter
  const shouldRemoveParam = 
    !value || 
    (typeof value === "string" && value.trim() === "") || 
    (shouldRemove && value && shouldRemove(value));
  
  if (shouldRemoveParam) {
    params.delete(paramName);
  } else {
    params.set(paramName, value);
  }
  
  // Build the new URL
  const newUrl = params.toString() 
    ? `${pathname}?${params.toString()}` 
    : pathname;
  
  router.replace(newUrl);
}

/**
 * Creates a handler function for updating a URL query parameter
 * Useful for creating onChange handlers that update both state and URL
 * 
 * @param searchParams - Current URL search parameters
 * @param pathname - Current pathname
 * @param router - Next.js router instance
 * @param paramName - Name of the query parameter to update
 * @param setState - Optional state setter function
 * @param shouldRemove - Optional function to determine if parameter should be removed
 * 
 * @returns A function that takes a value and updates both state and URL
 * 
 * @example
 * ```tsx
 * const handleCityChange = createUrlParamHandler(
 *   searchParams,
 *   pathname,
 *   router,
 *   "emirate",
 *   setCity
 * );
 * 
 * // Usage
 * <button onClick={() => handleCityChange("Dubai")}>Dubai</button>
 * ```
 */
export function createUrlParamHandler<T extends string>(
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  router: AppRouterInstance,
  paramName: string,
  setState?: (value: T) => void,
  shouldRemove?: (value: T) => boolean
): (value: T) => void {
  return (value: T) => {
    // Update state if setter is provided
    if (setState) {
      setState(value);
    }
    
    // Update URL
    updateUrlParam(searchParams, pathname, router, paramName, value, shouldRemove);
  };
}

