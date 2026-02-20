"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { AD } from "@/interfaces/ad";

interface DescriptionSectionProps {
  ad: AD;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ ad }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use real ad description
  const description = ad.description || "";

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Hide component if no description available
  if (!description || description.trim().length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
      {/* Description Content */}
      <div className="space-y-2">
        {/* Title */}
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue dark:text-gray-100"
        >
          Description
        </Typography>

        {/* Description Text */}
        {/* Description Text */}
        <Typography
          variant="body-small"
          className={`text-dark-blue dark:text-gray-300 leading-relaxed whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3 max-h-[4.5rem] overflow-hidden"
          }`}
        >
          {description}
        </Typography>

        {/* Only show Read More/Less if description is long enough */}
        {(description.length > 300 || (description.match(/\n/g) || []).length > 3) && (
          <div className="flex justify-end mt-1">
            <button
              onClick={toggleExpanded}
              className="text-purple hover:underline text-xs font-medium transition-colors cursor-pointer"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionSection;

