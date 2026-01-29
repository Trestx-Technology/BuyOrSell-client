import { useState, useEffect, useRef } from "react";

/**
 * Custom hook for debouncing a value with a callback
 * 
 * @param value - The external value to sync with
 * @param onChange - Callback function to call after debounce delay
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns A tuple of [localValue, setLocalValue] for controlled input
 * 
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState("");
 * const [localSearch, setLocalSearch] = useDebouncedValue(
 *   searchQuery,
 *   (value) => setSearchQuery(value),
 *   500
 * );
 * 
 * <Input
 *   value={localSearch}
 *   onChange={(e) => setLocalSearch(e.target.value)}
 * />
 * ```
 */
export function useDebouncedValue<T>(
  value: T,
  onChange: (value: T) => void,
  delay: number = 500
): [T, (value: T) => void] {
  const [localValue, setLocalValue] = useState<T>(value);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep onChangeRef up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync local state with external value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    // Only debounce if the local value differs from the external value (user is typing)
    if (localValue === value) {
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onChangeRef.current(localValue);
    }, delay);

    // Cleanup on unmount or when localValue changes
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localValue, value, delay]);

  return [localValue, setLocalValue];
}

