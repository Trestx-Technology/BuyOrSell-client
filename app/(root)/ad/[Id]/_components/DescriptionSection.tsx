"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";

interface DescriptionSectionProps {
  adId: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data - replace with actual API call
  const description = `This stunning BMW 5 Series 530i M Sport is in excellent condition with full service history. Features include leather interior, navigation system, premium sound system, and much more. The car has been well maintained and is ready for its new owner. Perfect for both city driving and long journeys  premium sound system, and much more. The car has been well maintained and is ready for its new owner. Perfect for both city driving and long journeys.`;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Description Content */}
      <div className="space-y-2">
        {/* Title */}
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue"
        >
          Description
        </Typography>

        {/* Description Text */}
        <Typography
          variant="body-small"
          className={`text-dark-blue leading-relaxed ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </Typography>

        {/* Read More/Less Button */}
        <div className="flex justify-end">
          <button
            onClick={toggleExpanded}
            className="text-purple hover:underline text-xs font-medium transition-colors cursor-pointer"
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionSection;
