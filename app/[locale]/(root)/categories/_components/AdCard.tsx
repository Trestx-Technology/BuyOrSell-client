"use client";

import React from "react";

interface AdCardProps {
  className?: string;
}

const AdCard: React.FC<AdCardProps> = ({ className }) => {
  return (
    <div
      className={`w-full bg-gray-200 rounded-2xl border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors duration-300 ${className}`}
    >
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-600 mb-2">Ad</div>
        <div className="text-sm text-gray-500">Advertisement</div>
      </div>
    </div>
  );
};

export default AdCard;
