/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { NaturalLanguageCalendar } from "@/components/ui/natural-language-calendar";
import { SelectableTabsInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectableTabsInput";
import { CheckboxInput } from "@/app/[locale]/(root)/post-ad/details/_components/CheckboxInput";
import { BooleanInput } from "@/app/[locale]/(root)/post-ad/details/_components/BooleanInput";
import { SearchableDropdownInput } from "@/app/[locale]/(root)/post-ad/details/_components/SearchableDropdownInput";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "range" | "multiselect" | "search" | "calendar" | "checkboxes" | "bool" | "selectableTabs";
  options?: FilterOption[];
  optionalMapOfArray?: Record<string, string[]>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  isStatic?: boolean;
  dependsOn?: string;
}

interface FilterControlProps {
  filterConfig: FilterConfig;
  currentValues: Record<string, any>;
  onChange: (key: string, value: any) => void;
  variant?: "light" | "dark";
}

export const FilterControl = ({
  filterConfig,
  currentValues,
  onChange,
  variant = "light",
}: FilterControlProps) => {
  const {
    key,
    type,
    options = [],
    placeholder,
    min = 0,
    max = 100,
    step = 1,
    dependsOn,
    optionalMapOfArray,
  } = filterConfig;
  const value = currentValues[key];
  const isValueSelected = Array.isArray(value) ? value.length > 0 : !!value;

  // Check dependency
  const parentValue = dependsOn ? currentValues[dependsOn] : null;
  const isDependencyMet = !dependsOn || (parentValue !== undefined && parentValue !== null && parentValue !== "");

  // Dynamically calculate options if optionalMapOfArray is present
  const dynamicOptions = React.useMemo(() => {
    if (optionalMapOfArray && dependsOn && parentValue) {
      const mappedOptions = optionalMapOfArray[parentValue] || [];
      return mappedOptions.map((opt) => ({
        value: opt,
        label: opt,
      }));
    }
    return options;
  }, [options, optionalMapOfArray, dependsOn, parentValue]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(key, (type === "multiselect" || type === "checkboxes") ? [] : null);
  };

  const labelWithClear = (
    <div className="flex justify-between items-center w-full">
      <span className={cn(variant === "dark" && "text-white/70")}>
        {filterConfig.label}
      </span>
      {isValueSelected && (
        <button
          onClick={handleClear}
          className={cn(
            "text-[10px] font-medium transition-colors",
            variant === "dark"
              ? "text-white hover:text-white/80"
              : "text-purple hover:text-purple-700"
          )}
        >
          Clear
        </button>
      )}
    </div>
  );

  switch (type) {
    case "select":
      return (
        <FormField label={labelWithClear} required={false}>
          {!isDependencyMet ? (
            <div className="text-[10px] text-muted-foreground bg-accent/30 p-3 rounded-lg border border-dashed border-border/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse shrink-0" />
              <p>Please select <span className="font-bold text-foreground uppercase tracking-tight">{dependsOn}</span> to view available options</p>
            </div>
          ) : (
            <SearchableDropdownInput
              value={(value as string) || ""}
              onChange={(newValue) => onChange(key, newValue)}
              options={dynamicOptions}
              placeholder={placeholder || `Select ${filterConfig.label}`}
            />
          )}
        </FormField>
      );

    case "range":
      return (
        <FormField
          label={labelWithClear}
          required={false}
          className="space-y-1.5"
        >
          <div className="w-full">
            <div
              className={cn(
                "p-3 rounded-xl border transition-all duration-200",
                "bg-muted/30 border-muted/20 shadow-none",
                variant === "dark" && "bg-background/40"
              )}
            >
              <div
                className={cn(
                  "text-[11px] font-bold mb-3 flex items-center gap-1.5",
                  "text-foreground/90"
                )}
              >
                <span className="w-1 h-1 rounded-full bg-purple" />
                {value && Array.isArray(value) && value.length === 2
                  ? `${value[0].toLocaleString()} - ${value[1].toLocaleString()}`
                  : `${min.toLocaleString()} - ${max.toLocaleString()}`}
              </div>
              <Slider
                value={value || [min, max]}
                onValueChange={(newValue) => onChange(key, newValue)}
                min={min}
                max={max}
                step={step}
                className="w-full"
              />
            </div>
          </div>
        </FormField>
      );

    case "multiselect":
      return (
        <FormField label={labelWithClear} required={false}>
          {!isDependencyMet ? (
            <div className="text-[10px] text-muted-foreground bg-accent/30 p-3 rounded-lg border border-dashed border-border/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse shrink-0" />
              <p>Please select <span className="font-bold text-foreground uppercase tracking-tight">{dependsOn}</span> to view available options</p>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <SearchableDropdownInput
                value={Array.isArray(value) ? value : ((value as string) || "")}
                isMulti={true}
                onChange={(newValue) => {
                  onChange(key, newValue);
                }}
                  options={dynamicOptions}
                  placeholder={placeholder || `Select ${filterConfig.label}`}
                />

                {/* Show selected badges if it's an array */}
                {Array.isArray(value) && value.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {value.map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="text-[10px] py-0 h-6 transition-colors"
                      >
                        {v}
                        <button
                          onClick={() =>
                            onChange(
                              key,
                              value.filter((item: string) => item !== v)
                            )
                          }
                          className="ml-1.5 hover:text-destructive transition-colors text-xs"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
              )}
            </div>
          )}
        </FormField>
      );

    case "search":
      return (
        <FormField label={labelWithClear} required={false}>
          <Input
            placeholder={placeholder}
            value={value || ""}
            onChange={(e) => onChange(key, e.target.value)}
            className={cn(
              "w-40 border-none",
              "bg-muted text-foreground placeholder:text-muted-foreground"
            )}
          />
        </FormField>
      );

    case "calendar":
      return (
        <FormField label={labelWithClear} required={false}>
          <div className="min-w-40">
            <NaturalLanguageCalendar
              value={value || ""}
              onChange={(newValue) => onChange(key, newValue)}
              placeholder={placeholder || "Tomorrow"}
              className={cn(
                variant === "dark" &&
                "bg-white/10 text-white border-none hover:bg-white/20"
              )}
            />
          </div>
        </FormField>
      );

    case "checkboxes":
      return (
        <FormField label={labelWithClear} required={false}>
          {!isDependencyMet ? (
            <div className="text-[10px] text-muted-foreground bg-accent/30 p-3 rounded-lg border border-dashed border-border/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse shrink-0" />
              <p>Please select <span className="font-bold text-foreground uppercase tracking-tight">{dependsOn}</span> first</p>
            </div>
          ) : (
            <CheckboxInput
              options={dynamicOptions}
              value={Array.isArray(value) ? value : []}
              onChange={(newValue) => onChange(key, newValue)}
            />
          )}
        </FormField>
      );

    case "bool":
      return (
        <FormField label={labelWithClear} required={false}>
          {!isDependencyMet ? (
            <div className="text-[10px] text-muted-foreground bg-accent/30 p-3 rounded-lg border border-dashed border-border/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse shrink-0" />
              <p>Please select <span className="font-bold text-foreground uppercase tracking-tight">{dependsOn}</span> first</p>
            </div>
          ) : (
            <BooleanInput
              value={value === "true"}
              onChange={(newValue) => onChange(key, String(newValue))}
              trueLabel="Yes"
              falseLabel="No"
            />
          )}
        </FormField>
      );

    case "selectableTabs":
      return (
        <FormField label={labelWithClear} required={false}>
          {!isDependencyMet ? (
            <div className="text-[10px] text-muted-foreground bg-accent/30 p-3 rounded-lg border border-dashed border-border/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse shrink-0" />
              <p>Please select <span className="font-bold text-foreground uppercase tracking-tight">{dependsOn}</span> first</p>
            </div>
          ) : (
            <SelectableTabsInput
              options={dynamicOptions}
              value={value || ""}
              onChange={(newValue) => onChange(key, newValue === value ? null : newValue)}
            />
          )}
        </FormField>
      );

    default:
      return null;
  }
};
