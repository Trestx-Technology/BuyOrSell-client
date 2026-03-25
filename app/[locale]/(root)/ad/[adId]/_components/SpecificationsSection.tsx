"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { AD } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { Badge } from "@/components/ui/badge";
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

  // create specifications object including all non-null fields
  const specifications: Record<string, string> = {};
  extraFields.forEach((field) => {
    if (
      field.value !== null &&
      field.value !== undefined &&
      field.value !== ""
    ) {
      // For boolean fields, only include if true
      if (field.type === "bool" && field.value !== true) {
        return;
      }

      const fieldName =
        field.name.charAt(0).toUpperCase() +
        field.name.slice(1).replace(/([A-Z])/g, " $1");

      if (Array.isArray(field.value)) {
        specifications[fieldName] = field.value.join(", ");
      } else if (field.type === "bool") {
        specifications[fieldName] = "Yes";
      } else {
        specifications[fieldName] = String(field.value);
      }
    }
  });

  const specEntries = Object.entries(specifications);

  // Check if value should be truncated and shown in popover (only for long strings, not lists)
  const shouldTruncate = (value: string) => {
    return value.length > 100 && !value.includes(", ");
  };

  const truncateValue = (value: string, maxLength: number = 100) => {
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + "...";
  };

  const renderSpecItem = (key: string, value: string, index: number) => {
    const isList = value.includes(", ");
    const listValues = isList ? value.split(", ") : [value];
    const needsPopover = shouldTruncate(value);
    const displayValue = needsPopover ? truncateValue(value) : value;
    const isColorValue = !isList && isColor(value);

    // List logic for overflow
    const LIST_LIMIT = 3;
    const hasOverflow = isList && listValues.length > LIST_LIMIT;
    const visibleValues = hasOverflow
      ? listValues.slice(0, LIST_LIMIT)
      : listValues;
    const remainingCount = listValues.length - LIST_LIMIT;

    const badgeStyle =
      "text-[10px] px-2 py-0 font-medium bg-gray-100 dark:bg-slate-800 text-dark-blue dark:text-gray-200 border-none hover:bg-purple/10 hover:text-purple transition-colors cursor-default";

    const valueContent = (
      <div className="flex flex-wrap gap-1.5 justify-end md:max-w-[60%] max-w-full min-w-0">
        {isColorValue ? (
          <div
            className="size-5 border border-slate-200 rounded-full"
            style={{ backgroundColor: value }}
          />
        ) : isList ? (
          <>
            {visibleValues.map((v, i) => (
              <Badge key={i} variant="secondary" className={badgeStyle}>
                {v}
              </Badge>
            ))}
            {hasOverflow && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0 font-medium bg-purple/10 text-purple border-none hover:bg-purple/20 transition-colors cursor-pointer"
                  >
                    +{remainingCount}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-3">
                    <Typography
                      variant="h3"
                      className="text-xs font-semibold text-dark-blue dark:text-gray-100"
                    >
                      {key}
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {listValues.map((v, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className={badgeStyle}
                        >
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        ) : (
          <span className="text-sm font-semibold text-dark-blue dark:text-gray-100 text-right">
            {displayValue}
          </span>
        )}
      </div>
    );

    if (needsPopover) {
      return (
        <Popover key={index}>
          <PopoverTrigger asChild>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 group border-gray-100 dark:border-slate-800 w-full p-2 rounded cursor-pointer hover:bg-purple/5 transition-colors">
              <span className="text-sm text-grey-blue dark:text-gray-400 md:break-words md:mr-4 flex-1 min-w-0">
                {key}
              </span>
              {valueContent}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto" align="end">
            <div className="space-y-2">
              <Typography
                variant="h3"
                className="text-sm font-semibold text-dark-blue dark:text-gray-100 mb-2"
              >
                {key}
              </Typography>
              <Typography
                variant="body-small"
                className="text-grey-blue dark:text-gray-400"
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
        className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 border-gray-100 dark:border-slate-800 w-full p-2 rounded"
      >
        <span className="text-sm text-grey-blue dark:text-gray-400 md:break-words md:mr-4 flex-1 min-w-0">
          {key}
        </span>
        {valueContent}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue dark:text-gray-100 mb-6"
      >
        Specifications
      </Typography>

      {specEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {specEntries.map(([key, value], index) =>
            renderSpecItem(key, value, index),
          )}
        </div>
      ) : (
        <Typography
          variant="body-small"
          className="text-grey-blue dark:text-gray-400"
        >
          No specifications available.
        </Typography>
      )}
    </div>
  );
};

export default SpecificationsSection;
