"use client";

import React from "react";
import { Check } from "lucide-react";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";

export interface BlockedUserItemProps {
  id: string;
  name: string;
  email: string;
  company?: string;
  reason: string;
  blockedDate: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUnblock: (id: string) => void;
}

export function BlockedUserItem({
  id,
  name,
  email,
  company,
  reason,
  blockedDate,
  isSelected,
  onSelect,
  onUnblock,
}: BlockedUserItemProps) {
  const { t } = useLocale();

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onSelect(id)}
          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 mt-1 ${
            isSelected
              ? "bg-purple-600 border-purple-600"
              : "border-gray-300 hover:border-purple-400"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Typography
              variant="body-small"
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              {name}
            </Typography>
            <button
              onClick={() => onUnblock(id)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {t.user.blockedUsers.unblock}
            </button>
          </div>

          <Typography
            variant="body-small"
            className="text-sm text-gray-700 dark:text-gray-300 mb-1"
          >
            {email}
          </Typography>
          {company && (
            <Typography
              variant="body-small"
              className="text-xs text-gray-500 dark:text-gray-400 mb-2"
            >
              {company}
            </Typography>
          )}

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {reason}
            </span>
            <Typography variant="body-small" className="text-xs text-gray-500 dark:text-gray-400">
              {t.user.blockedUsers.blockedOn} {blockedDate}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
