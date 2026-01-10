"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { AD } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isColor } from "@/utils/utils";

interface SpecificationsSectionProps {
  ad: AD;
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({
  ad,
}) => {
  // Extract specifications from extraFields
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);

  // Filter out boolean fields and create specifications object
  const specifications: Record<string, string> = {};
  extraFields.forEach((field) => {
    if (
      field.type !== "bool" &&
      field.value !== null &&
      field.value !== undefined
    ) {
      const fieldName =
        field.name.charAt(0).toUpperCase() +
        field.name.slice(1).replace(/([A-Z])/g, " $1");
      if (Array.isArray(field.value)) {
        specifications[fieldName] = field.value.join(", ");
      } else {
        specifications[fieldName] = String(field.value);
      }
    }
  });

  const specEntries = Object.entries(specifications);

  // Check if value should be truncated and shown in popover
  const shouldTruncate = (value: string) => {
    return (
      value.length > 50 ||
      (value.includes(", ") && value.split(", ").length > 3)
    );
  };

  const truncateValue = (value: string, maxLength: number = 50) => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + "...";
  };

  const renderSpecItem = (key: string, value: string, index: number) => {
    const needsPopover = shouldTruncate(value);
    const displayValue = needsPopover ? truncateValue(value) : value;
    const isColorValue = isColor(displayValue);

    if (needsPopover) {
      return (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <div className="flex justify-between items-start group border-gray-100 w-full p-2 rounded cursor-pointer hover:text-purple hover:bg-purple/10 transition-colors">
              <span className="text-sm text-grey-blue">{key}</span>
              <span className="text-sm font-semibold text-dark-blue max-w-1/2 text-right group-hover:text-purple">
                {isColor(displayValue) ? (
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: displayValue }}
                  />
                ) : (
                  displayValue
                )}
              </span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="end">
            <div className="space-y-2">
              <Typography
                variant="h3"
                className="text-sm font-semibold text-dark-blue mb-2"
              >
                {key}
              </Typography>
              <Typography
                variant="body-small"
                className="text-grey-blue whitespace-pre-wrap break-words"
              >
                {value}
              </Typography>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <div
        key={index}
        className="flex justify-between items-start border-gray-100 w-full p-2 rounded"
      >
        <span className="text-sm text-grey-blue">{key}</span>
        <span className="text-sm font-semibold text-dark-blue max-w-1/2 text-right">
          {isColorValue ? (
            <div
              className="size-6 border border-slate-200 rounded-full"
              style={{ backgroundColor: value }}
            />
          ) : (
            value
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-6"
      >
        Specifications
      </Typography>

      {specEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {specEntries.map(([key, value], index) =>
            renderSpecItem(key, value, index)
          )}
        </div>
      ) : (
        <Typography variant="body-small" className="text-grey-blue">
          No specifications available.
        </Typography>
      )}
    </div>
  );
};

export default SpecificationsSection;
