import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useEmirateStore } from "@/stores/emirateStore";

/**
 * Hook that invalidates all queries when the selected emirate changes.
 * This ensures that data filtered by emirate (which is added globally by axios)
 * is re-fetched when the user changes their location.
 */
export const useEmirateInvalidation = () => {
  const queryClient = useQueryClient();
  const { selectedEmirate } = useEmirateStore();

  // Initialize with null to detect the first render and skip initial invalidation
  // This prevents double calls on page load when the store hydrates.
  const prevEmirateRef = useRef<string | null>(null);

  useEffect(() => {
    // Only invalidate if this is a subsequent change (not the initial mount)
    if (
      prevEmirateRef.current !== null &&
      prevEmirateRef.current !== selectedEmirate
    ) {
      console.log(
        `[Emirate Invalidation] Emirate changed from "${prevEmirateRef.current}" to "${selectedEmirate}". Invalidating restricted queries...`,
      );

      // Only invalidate 'home' and 'ad' related listings
      const keysToInvalidate = ["home", "ads", "ad"];

      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
          exact: false,
        });
      });
    }

    // Always sync the ref with the latest state
    prevEmirateRef.current = selectedEmirate;
  }, [selectedEmirate, queryClient]);
};
