"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Check } from "lucide-react";
import { AD } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

interface SafetyFeaturesProps {
  ad: AD;
}

const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({ ad }) => {
  // Extract safety features from extraFields (boolean fields that are true)
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);
  const safetyFeatures = extraFields
    .filter((field) => field.type === "bool" && field.value === true)
    .map((field) => {
      // Format field name nicely
      return field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1");
    });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-4"
      >
        Safety Features
      </Typography>

      {safetyFeatures.length > 0 ? (
      <div className="space-y-3">
        {safetyFeatures.map((feature, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-grey-blue">{feature}</span>
            <div className="flex items-center justify-center w-6 h-6 bg-success-10 rounded">
              <Check className="h-4 w-4 text-success-100" />
            </div>
          </div>
        ))}
      </div>
      ) : (
        <Typography variant="body-small" className="text-grey-blue">
          No safety features listed.
        </Typography>
      )}
    </div>
  );
};

export default SafetyFeatures;
