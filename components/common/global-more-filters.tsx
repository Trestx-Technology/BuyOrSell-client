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
import { unSlugify } from "@/utils/slug-utils";

interface GlobalMoreFiltersProps {
      className?: string;
      dontValidate?: boolean;
      excludeKeys?: string[];
}

export const mapFieldsToFilterConfig = (fields: Field[], excludeKeys?: string[]): FilterConfig[] => {
      return fields
            .filter((f) => !f.hidden && !(excludeKeys && excludeKeys.includes(f.name))) // Filter out hidden fields and excluded keys
            .map((field) => {
                  let type: FilterConfig["type"] = "select";
                  let options: FilterOption[] = [];

                  if (field.type === "date" || field.type === "datetime") {
                        type = "calendar";
                  } else if (
                        (field.type === "number" || field.type === "int") &&
                        field.min !== undefined &&
                        field.max !== undefined
                  ) {
                        type = "range";
                  } else if (field.type === "checkboxes") {
                        type = "multiselect";
                  } else {
                        type = "select";
                  }

                  if (field.optionalArray) {
                        options = field.optionalArray.map((opt) => ({
                              value: opt,
                              label: opt,
                        }));
                  } else if (field.type === "bool") {
                        options = [
                              { value: "true", label: "Yes" },
                              { value: "false", label: "No" },
                        ];
                  }

                  return {
                        key: field.name,
                        label: field.name,
                        type,
                        options,
                        placeholder: `Select ${field.name}`,
                        min: field.min,
                        max: field.max,
                        dependsOn: field.dependsOn,
                        optionalMapOfArray: field.optionalMapOfArray,
                  };
            })
            .sort((a, b) => {
                  // Sort by sequence if available
                  const fieldA = fields.find(f => f.name === a.key);
                  const fieldB = fields.find(f => f.name === b.key);
                  return (fieldA?.sequence || 0) - (fieldB?.sequence || 0);
            });
};

export const GlobalMoreFilters = ({
      className,
      excludeKeys = [],
}: GlobalMoreFiltersProps) => {
      const { updateUrlParam, searchParams } = useUrlParams();
      const params = useParams();

      // Derive category path from slug param
      // params.slug can be string, array of strings (for catch-all), or undefined
      const categoryPath = Array.isArray(params.slug)
            ? params.slug.map((s) => unSlugify(s)).join("/")
            : unSlugify(params.slug as string);

      const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
      const [dynamicFilters, setDynamicFilters] = useState<FilterConfig[]>([]);
      const [pendingExtraFields, setPendingExtraFields] = useState<
            Record<string, any>
      >({});

      const { data: categoryData, isLoading } = useValidateCategoryPath(categoryPath);

      // Update dynamic filters when category data changes
      useEffect(() => {
            if (categoryData && categoryData.data && categoryData.data.fields) {
                  const mappedFilters = mapFieldsToFilterConfig(categoryData.data.fields, excludeKeys);
                  setDynamicFilters(mappedFilters);
            }
      }, [categoryData, excludeKeys]);

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

      const handlePendingChange = (key: string, value: any) => {
            setPendingExtraFields((prev) => {
                  const newState = {
                        ...prev,
                        [key]: value,
                  };

                  // Clear dependent fields if parent changes
                  dynamicFilters.forEach((filter) => {
                        if (filter.dependsOn === key) {
                              newState[filter.key] = undefined;
                        }
                  });

                  return newState;
            });
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
                  dialogContentClassName="max-w-4xl"
                  drawerContentClassName="p-0"
                  trigger={
                        <Button
                              icon={<SlidersHorizontal className="h-4 w-4 -mr-3 sm:-mr-2" />}
                              iconPosition="left"
                              className={`w-fit border-purple/20 sticky top-0 right-0 hover:bg-purple/10 transition-colors ${className}`}
                        >
                              <span className="sm:block hidden">More Filters</span>
                        </Button>
                  }
            >
                  <div className="flex flex-col h-[80vh] md:max-h-[80vh] overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                                    {isLoading ? (
                                          <div className="col-span-2 text-center py-10">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto"></div>
                                                <p className="mt-2 text-muted-foreground">Loading filters...</p>
                                          </div>
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
                                          <div className="col-span-2 text-center text-muted-foreground py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                                                No additional filters available for this category
                                          </div>
                                    )}
                              </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-4 md:p-6 bg-card border-t border-border mt-auto sticky bottom-0 z-50 shadow-[0_-8px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.4)]">
                        <Button
                              variant="outline"
                              onClick={() => setPendingExtraFields({})}
                                    className="px-6 h-11 text-sm font-semibold rounded-xl border-border hover:bg-muted transition-colors"
                        >
                              Clear Filters
                        </Button>
                              <Button
                                    onClick={handleApply}
                                    className="px-8 h-11 text-sm font-bold rounded-xl bg-purple hover:bg-purple-700 text-white shadow-lg shadow-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                              >
                                    Apply Filters
                              </Button>
                        </div>
                  </div>
            </ResponsiveDialogDrawer>
      );
};
