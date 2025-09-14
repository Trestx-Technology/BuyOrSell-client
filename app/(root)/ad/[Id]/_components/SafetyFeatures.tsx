"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Check } from "lucide-react";

interface SafetyFeaturesProps {
  adId: string;
}

const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({ adId }) => {
  // Mock data - replace with actual API call
  const safetyFeatures = [
    "ABS Brakes",
    "Airbags",
    "Stability Control",
    "Backup Camera",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-4"
      >
        Safety Features
      </Typography>

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
    </div>
  );
};

export default SafetyFeatures;
