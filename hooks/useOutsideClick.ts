import { useEffect, useRef, type RefObject } from "react";

/**
 * Hook that detects clicks outside of a referenced element
 * 
 * @param ref - React ref object pointing to the element to detect outside clicks for
 * @param handler - Callback function to execute when an outside click is detected
 * @param enabled - Whether the hook is enabled (default: true)
 * 
 * @example
 * ```tsx
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * 
 * useOutsideClick(dropdownRef, () => {
 *   setIsOpen(false);
 * });
 * 
 * return <div ref={dropdownRef}>...</div>;
 * ```
 */
export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler, enabled]);
}
