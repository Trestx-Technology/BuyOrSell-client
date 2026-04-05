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

    // Standard GET API parameters
    const standardKeys = [
      "search", "query", "location", "emirate", "page", "limit", 
      "category", "status", "userId", "organizationName", "sort", 
      "deal", "topChoice", "isFeatured", "hasVideo", "upForExchange", 
      "isExchangable", "adType", "currentDate", "fromDate", "toDate",
      "jobId", "adId" // standard identifiers
    ];

    const hasTopLevelDynamicFilters = Object.keys(filters).some(
      key => !standardKeys.includes(key) && filters[key] !== ""
    );

    const hasDynamicFilters = Object.keys(extraFields).length > 0 || hasTopLevelDynamicFilters;

    return {
      query: filters,
      extraFields,
      search: searchParams.get("search") || searchParams.get("query") || "",
      location: searchParams.get("location") || searchParams.get("emirate") || "",
      hasDynamicFilters,
      updateUrlParam,
      updateUrlParams,
      clearUrlQueries,
    };
  }, [searchParams, updateUrlParam, updateUrlParams, clearUrlQueries]);
};
