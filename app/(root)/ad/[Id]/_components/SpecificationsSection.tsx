"use client";

import React from "react";
import { Typography } from "@/components/typography";

interface SpecificationsSectionProps {
  adId: string;
}

const SpecificationsSection: React.FC<SpecificationsSectionProps> = () => {
  // Mock data - replace with actual API call
  const specifications = {
    Engine: "2.0L Turbo",
    Power: "252 HP",
    Color: "Blue",
    Interior: "Black Leather",
    "Body Type": "Sedan",
    Doors: "4",
    Seats: "5",
    Drivetrain: "RWD",
  };

  const specEntries = Object.entries(specifications);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-6"
      >
        Specifications
      </Typography>

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
    </div>
  );
};

export default SpecificationsSection;
