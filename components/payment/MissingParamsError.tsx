import React from "react";
import { Typography } from "@/components/typography";

interface MissingParamsErrorProps {
  missingParams: string[];
}

export function MissingParamsError({ missingParams }: MissingParamsErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
        <Typography variant="xl-semibold" className="text-red-500 mb-2">
          Missing Information
        </Typography>
        <p className="text-gray-600 mb-4">Required parameters are missing:</p>
        <div className="bg-gray-100 p-3 rounded text-left text-sm font-mono text-red-600 mb-4">
          {missingParams.join(", ")}
        </div>
      </div>
    </div>
  );
}
