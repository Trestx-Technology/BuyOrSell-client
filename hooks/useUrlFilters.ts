import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useUrlParams } from "./useUrlParams";

export const useUrlFilters = () => {
  const searchParams = useSearchParams();
  const { updateUrlParam, updateUrlParams, clearUrlQueries } = useUrlParams();

  return useMemo(() => {
    const filters: Record<string, string | string[]> = {};
    let extraFields: Record<string, any> = {};

    // Parse all params
    searchParams.forEach((value, key) => {
      // Skip extraFields as we handle it separately
      if (key === "extraFields") return;
      filters[key] = value;
    });

    // Parse extraFields
    const extraFieldsParam = searchParams.get("extraFields");
    if (extraFieldsParam) {
      try {
        extraFields = JSON.parse(extraFieldsParam);
      } catch (e) {
        console.error("Failed to parse extraFields:", e);
      }
    }

    const hasDynamicFilters = Object.keys(extraFields).length > 0;

    return {
      query: filters,
      extraFields,
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      hasDynamicFilters,
      updateUrlParam,
      updateUrlParams,
      clearUrlQueries,
    };
  }, [searchParams, updateUrlParam, updateUrlParams, clearUrlQueries]);
};
