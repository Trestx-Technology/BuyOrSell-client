import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useValidateCategoryPath } from "@/hooks/useCategories";
import { FilterConfig } from "./filter-control";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";

interface ActiveFiltersProps {
      staticFiltersConfig: FilterConfig[];
      categoryPath: string;
      className?: string;
      onClearAll?: () => void;
}

export const ActiveFilters = ({
      staticFiltersConfig,
      categoryPath,
      className,
      onClearAll,
}: ActiveFiltersProps) => {
      const { query, extraFields } = useUrlFilters();
      const { updateUrlParam } = useUrlParams();
      const { data: categoryData } = useValidateCategoryPath(categoryPath);

      // Helper to remove a filter
      const removeFilter = (filter: any) => {
            const { key, isDynamic, value: itemValue, config } = filter;
            if (isDynamic) {
                  const newExtraFields = { ...extraFields };
                  delete newExtraFields[key];
                  const jsonString = JSON.stringify(newExtraFields);
                  if (Object.keys(newExtraFields).length === 0) {
                        updateUrlParam("extraFields", null);
                  } else {
                        updateUrlParam("extraFields", jsonString);
                  }
            } else if (config?.type === "multiselect" && itemValue && typeof query[key] === "string") {
                  const items = (query[key] as string).split(",").filter((v) => v !== itemValue);
                  updateUrlParam(key, items.length > 0 ? items : null);
            } else {
                  updateUrlParam(key, null);
            }
      };

      const getFilterLabel = (key: string, value: any, config?: FilterConfig) => {
            if (!config) return `${key}: ${value}`;

            // Handle range
            if (config.type === "range") {
                  if (Array.isArray(value)) {
                        return `${config.label}: ${value.join(" - ")}`;
                  }
                  if (typeof value === "string") {
                        if (!value.includes(",")) {
                              // Likely a preset like "under-50k"
                              // Start case the preset for better readability if possible, or just show as is
                              const friendlyValue = value.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
                              return `${config.label}: ${friendlyValue}`;
                        }
                        // Comma separated range "100,200"
                        return `${config.label}: ${value.replace(",", " - ")}`;
                  }
            }

            // Handle boolean/select options
            if (config.options) {
                  const option = config.options.find((opt) => String(opt.value) === String(value));
                  if (option) return `${config.label}: ${option.label}`;
            }

            // Handle date
            if (config.type === "calendar") {
                  // Basic formatting
                  try {
                        return `${config.label}: ${formatDate(value)}`;
                  } catch {
                        return `${config.label}: ${value}`;
                  }
            }

            return `${config.label}: ${value}`;
      };

      // Collect active filters
      const activeFilters: {
            key: string;
            label: string;
            isDynamic: boolean;
            value?: any;
            config?: FilterConfig;
      }[] = [];

      // Static Filters
      staticFiltersConfig.forEach((config) => {
            const value = query[config.key];
            if (value) {
                  if (config.type === "multiselect" && typeof value === "string") {
                        const items = value.split(",");
                        items.forEach(item => {
                              activeFilters.push({
                                    key: config.key,
                                    label: getFilterLabel(config.key, item, config),
                                    isDynamic: false,
                                    value: item,
                                    config
                              });
                        });
                  } else {
                        activeFilters.push({
                              key: config.key,
                              label: getFilterLabel(config.key, value, config),
                              isDynamic: false,
                              config
                        });
                  }
            }
      });

      // Dynamic Filters
      if (extraFields && Object.keys(extraFields).length > 0) {
            const dynamicFields = categoryData?.data?.fields || [];
            Object.entries(extraFields).forEach(([key, value]) => {
                  const fieldConfig = dynamicFields.find((f) => f.name === key);
                  let label = `${key}: ${value}`;
                  if (fieldConfig) {
                        // Attempt to find friendly label/value
                        if (fieldConfig.type === "bool") {
                              const boolLabel = value === true || value === "true" ? "Yes" : "No";
                              label = `${fieldConfig.name}: ${boolLabel}`;
                        } else if (Array.isArray(value)) {
                              label = `${fieldConfig.name}: ${value.join(", ")}`;
                        } else {
                              label = `${fieldConfig.name}: ${value}`;
                        }
                  }
                  activeFilters.push({
                        key,
                        label,
                        isDynamic: true,
                  });
            });
      }

      // Search Query
      const s = query.search || query.query;
      if (s) {
            activeFilters.push({
                  key: query.search ? "search" : "query",
                  label: `Search: ${s}`,
                  isDynamic: false,
            });
      }

      // Location Query
      if (query.location) {
            activeFilters.push({
                  key: "location",
                  label: `Location: ${query.location}`,
                  isDynamic: false,
            });
      }


      if (activeFilters.length === 0) return null;

      return (
            <div className={cn("flex flex-wrap items-center gap-2", className)}>
                  {activeFilters.map((filter) => (
                        <Badge
                              key={`${filter.isDynamic ? "dyn" : "static"}-${filter.key}`}
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple border-purple-100"
                        >
                              {filter.label}
                              <div
                                    role="button"
                                    onClick={() => removeFilter(filter)}
                                    className="cursor-pointer ml-1 hover:text-purple-700"
                              >
                                    <X className="h-3 w-3" />
                              </div>
                        </Badge>
                  ))}

                  {activeFilters.length > 0 && (
                        <Button
                              variant="dangerOutlined"
                              size="sm"
                              onClick={onClearAll}
                              className="text-destructive text-xs h-6 ml-auto sm:ml-0"
                        >
                              Clear All
                        </Button>
                  )}
            </div>
      );
};
