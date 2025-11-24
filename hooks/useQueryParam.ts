import { useEffect } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Hook to initialize and sync state with a URL query parameter
 * 
 * @param searchParams - Current URL search parameters
 * @param paramName - Name of the query parameter to read
 * @param setState - State setter function
 * @param defaultValue - Optional default value if parameter doesn't exist
 * 
 * @example
 * ```tsx
 * const searchParams = useSearchParams();
 * const [searchQuery, setSearchQuery] = useState("");
 * 
 * useQueryParam(searchParams, "search", setSearchQuery);
 * ```
 */
export function useQueryParam<T extends string>(
  searchParams: ReadonlyURLSearchParams,
  paramName: string,
  setState: (value: T) => void,
  defaultValue?: T
): void {
  useEffect(() => {
    const paramValue = searchParams.get(paramName);
    if (paramValue) {
      setState(paramValue as T);
    } else if (defaultValue !== undefined) {
      setState(defaultValue);
    }
  }, [searchParams, paramName, setState, defaultValue]);
}

/**
 * Hook to initialize and sync multiple URL query parameters at once
 * 
 * @param searchParams - Current URL search parameters
 * @param params - Object mapping parameter names to their state setters and optional defaults
 * 
 * @example
 * ```tsx
 * const searchParams = useSearchParams();
 * const [category, setCategory] = useState("All Categories");
 * const [search, setSearch] = useState("");
 * 
 * useQueryParams(searchParams, {
 *   category: { setState: setCategory, defaultValue: "All Categories" },
 *   search: { setState: setSearch }
 * });
 * ```
 */
export function useQueryParams(
  searchParams: ReadonlyURLSearchParams,
  params: Record<
    string,
    {
      setState: (value: string) => void;
      defaultValue?: string;
    }
  >
): void {
  useEffect(() => {
    Object.entries(params).forEach(([paramName, { setState, defaultValue }]) => {
      const paramValue = searchParams.get(paramName);
      if (paramValue) {
        setState(paramValue);
      } else if (defaultValue !== undefined) {
        setState(defaultValue);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}

