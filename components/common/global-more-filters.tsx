/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useValidateCategoryPath } from "@/hooks/useCategories";

import { useUrlParams } from "@/hooks/useUrlParams";
import { Field } from "@/interfaces/categories.types";
import { FilterControl, FilterConfig, FilterOption } from "./filter-control";

interface GlobalMoreFiltersProps {
      className?: string;
      dontValidate?: boolean;
}

export const GlobalMoreFilters = ({
      className,
      dontValidate,
}: GlobalMoreFiltersProps) => {
      const { updateUrlParam, searchParams } = useUrlParams();
      const params = useParams();

      // Derive category path from slug param
      // params.slug can be string, array of strings (for catch-all), or undefined
      const categoryPath = Array.isArray(params.slug)
            ? params.slug.join("/")
            : (params.slug as string);

      const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
      const [dynamicFilters, setDynamicFilters] = useState<FilterConfig[]>([]);
      const [pendingExtraFields, setPendingExtraFields] = useState<
            Record<string, any>
      >({});

      const { data: categoryData, isLoading } = dontValidate ? { data: null, isLoading: false } : useValidateCategoryPath(categoryPath);

      // Update dynamic filters when category data changes
      useEffect(() => {
            if (categoryData && categoryData.data && categoryData.data.fields) {
                  const mappedFilters = mapFieldsToFilterConfig(categoryData.data.fields);
                  setDynamicFilters(mappedFilters);
            }
      }, [categoryData]);

      // Load initial state from URL 'extraFields' param
      useEffect(() => {
            if (isAdvancedOpen) {
                  const extraFieldsParam = searchParams.get("extraFields");
                  if (extraFieldsParam) {
                        try {
                              const parsed = JSON.parse(extraFieldsParam);
                              setPendingExtraFields(parsed);
                        } catch (e) {
                              console.error("Failed to parse extraFields:", e);
                              setPendingExtraFields({});
                        }
                  } else {
                        setPendingExtraFields({});
                  }
            }
      }, [isAdvancedOpen, searchParams]);

      const mapFieldsToFilterConfig = (fields: Field[]): FilterConfig[] => {
            return fields
                  .filter((f) => !f.hidden) // Filter out hidden fields if needed
                  .map((field) => {
                        let type: FilterConfig["type"] = "select";
                        let options: FilterOption[] = [];

                        if (field.type === "dropdown" || field.type === "radio" || field.type === "searchableDropdown") {
                              type = "select";
                              if (field.optionalArray) {
                                    options = field.optionalArray.map((opt) => ({
                                          value: opt,
                                          label: opt,
                                    }));
                              }
                        } else if (
                              field.type === "checkboxes" ||
                              field.type === "selectableTabs" ||
                              field.type === "selection"
                        ) {
                              type = "multiselect";
                              if (field.optionalArray) {
                                    options = field.optionalArray.map((opt) => ({
                                          value: opt,
                                          label: opt,
                                    }));
                              }
                        } else if (
                              field.type === "number" ||
                              field.type === "int"
                        ) {
                              // If min/max are present, use range, else maybe simple input?
                              // Using range slider for now if min/max exists
                              if (field.min !== undefined && field.max !== undefined) {
                                    type = "range";
                              } else {
                                    // Fallback to select if no range or maybe search (text input)?
                                    // Let's use search type (text input) for arbitrary numbers if no range
                                    // But type 'search' in render is text input.
                                    type = "search";
                              }
                        } else if (field.type === "bool") {
                              type = "select";
                              options = [
                                    { value: "true", label: "Yes" },
                                    { value: "false", label: "No" },
                              ];
                        } else if (field.type === "date" || field.type === "datetime") {
                              type = "calendar";
                        }

                        return {
                              key: field.name,
                              label: field.name, // Or use a label field if available
                              type,
                              options,
                              placeholder: `Select ${field.name}`,
                              min: field.min,
                              max: field.max,
                        };
                  });
      };

      const handlePendingChange = (key: string, value: any) => {
            setPendingExtraFields((prev) => ({
                  ...prev,
                  [key]: value,
            }));
      };

      const handleApply = () => {
            // Filter out empty values
            const cleanExtraFields: Record<string, any> = {};
            Object.entries(pendingExtraFields).forEach(([key, value]) => {
                  if (
                        value !== undefined &&
                        value !== "" &&
                        value !== null &&
                        (!Array.isArray(value) || value.length > 0)
                  ) {
                        cleanExtraFields[key] = value;
                  }
            });

            const jsonString = JSON.stringify(cleanExtraFields);
            // If empty object, remove param
            if (Object.keys(cleanExtraFields).length === 0) {
                  updateUrlParam("extraFields", null);
            } else {
                  updateUrlParam("extraFields", jsonString);
            }
            setIsAdvancedOpen(false);
      };

      if (isLoading || dynamicFilters.length === 0) {
            return null;
      }

      return (
            <ResponsiveDialogDrawer
                  open={isAdvancedOpen}
                  onOpenChange={setIsAdvancedOpen}
                  title="Advanced Filters"
                  trigger={
                        <Button
                              icon={<SlidersHorizontal className="h-4 w-4 -mr-3 sm:-mr-2" />}
                              iconPosition="left"
                              className={`w-fit border-purple-200 sticky top-0 right-0 ${className}`}
                        >
                              <span className="sm:block hidden">More Filters</span>
                        </Button>
                  }
            >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 w-full max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                              <div className="col-span-2 text-center py-4">Loading filters...</div>
                        ) : dynamicFilters.length > 0 ? (
                              dynamicFilters.map((filterConfig) => (
                                    <div key={filterConfig.key} className="space-y-2 w-full">
                                          <FilterControl
                                                filterConfig={filterConfig}
                                                currentValues={pendingExtraFields}
                                                onChange={handlePendingChange}
                                          />
                                    </div>
                              ))
                        ) : (
                              <div className="text-center text-gray-500 py-8">
                                    No additional filters available
                              </div>
                        )}
                  </div>
                  <div className="flex justify-end gap-2 bg-white p-4 shadow rounded-b-lg border-t bottom-0">
                        <Button
                              variant="outline"
                              onClick={() => setPendingExtraFields({})}
                        >
                              Clear Filters
                        </Button>
                        <Button onClick={handleApply}>Apply Filters</Button>
                  </div>
            </ResponsiveDialogDrawer>
      );
};
