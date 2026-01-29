/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
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
}

export const FilterControl = ({
  filterConfig,
  currentValues,
  onChange,
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
      <span>{filterConfig.label}</span>
      {isValueSelected && (
        <button
          onClick={handleClear}
          className="text-[10px] text-purple hover:text-purple-700 font-medium"
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
            <SelectTrigger className="w-full bg-gray-100 border-none text-black font-semibold hover:bg-gray-200 cursor-pointer">
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
            <div className="py-2  rounded-md bg-white">
              <div className="text-xs text-gray-600 mb-2">
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
              <SelectTrigger className="w-full">
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
            className="w-40"
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
            />
          </div>
        </FormField>
      );

    default:
      return null;
  }
};
