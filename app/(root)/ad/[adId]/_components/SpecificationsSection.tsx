"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { AD } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

interface SpecificationsSectionProps {
  ad: AD;
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = ({ ad }) => {
  // Extract specifications from extraFields
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);
  
  // Filter out boolean fields and create specifications object
  const specifications: Record<string, string> = {};
  extraFields.forEach((field) => {
    if (field.type !== "bool" && field.value !== null && field.value !== undefined) {
      const fieldName = field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1");
      if (Array.isArray(field.value)) {
        specifications[fieldName] = field.value.join(", ");
      } else {
        specifications[fieldName] = String(field.value);
      }
    }
  });

  const specEntries = Object.entries(specifications);

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
        {specEntries.map(([key, value], index) => (
          <div
            key={index}
            className="flex justify-between items-center border-gray-100"
          >
            <span className="text-sm text-grey-blue">{key}</span>
            <span className="text-sm font-semibold text-dark-blue">
              {value}
            </span>
          </div>
        ))}
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
