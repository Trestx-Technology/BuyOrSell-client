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

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "range" | "multiselect" | "search" | "calendar";
  options?: FilterOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  isStatic?: boolean;
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
  } = filterConfig;
  const value = currentValues[key];
  const isValueSelected = Array.isArray(value) ? value.length > 0 : !!value;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(key, type === "multiselect" ? [] : null);
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
        <FormField
          className="text-sm w-full"
          label={labelWithClear}
          required={false}
        >
          <Select
            value={value || ""}
            onValueChange={(newValue) => onChange(key, newValue)}
          >
            <SelectTrigger
              className={cn(
                "w-full border-none font-semibold cursor-pointer",
                variant === "dark"
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      );

    case "range":
      return (
        <FormField
          label={labelWithClear}
          required={false}
          className="-space-y-2"
        >
          <div className="w-40">
            <div
              className={cn(
                "py-2 rounded-md",
                variant === "dark" ? "bg-transparent" : "bg-white"
              )}
            >
              <div
                className={cn(
                  "text-xs mb-2",
                  variant === "dark" ? "text-white/60" : "text-gray-600"
                )}
              >
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
          <div className="w-full">
            <Select
              value=""
              onValueChange={(newValue) => {
                const currentValuesList = Array.isArray(value) ? value : [];
                if (!currentValuesList.includes(newValue)) {
                  onChange(key, [...currentValuesList, newValue]);
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-full border-none font-semibold cursor-pointer",
                  variant === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              variant === "dark"
                ? "bg-white/10 text-white placeholder:text-white/40"
                : "bg-gray-100"
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

    default:
      return null;
  }
};
