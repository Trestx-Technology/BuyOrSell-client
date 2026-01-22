"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UI_ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { isColor } from "@/utils/utils";

export interface Specification {
  name: string;
  value: string;
  icon?: string | React.ReactNode; // Support both URL strings and React components
}

interface SpecificationsDisplayProps {
  specifications: Specification[];
  maxVisible?: number;
  showPopover?: boolean;
  className?: string;
  itemClassName?: string;
  popoverTitle?: string;
  truncate?: boolean;
}

/**
 * Reusable component for displaying product specifications
 * Shows a limited number of specifications inline, with optional popover for remaining items
 */
export function SpecificationsDisplay({
  specifications,
  maxVisible = 4,
  showPopover = true,
  className = "",
  itemClassName = "",
  popoverTitle = "All Specifications",
  truncate = false,
}: SpecificationsDisplayProps) {
  if (specifications.length === 0) {
    return null;
  }

  const visibleSpecs = specifications.slice(0, maxVisible);
  const remainingCount = specifications.length - maxVisible;
  const hasMore = remainingCount > 0;

  return (
    <div
      className={cn(
        `flex items-center justify-start gap-2 flex-wrap ${className}`,
        truncate && "max-w-sm"
      )}
    >
      {/* Show visible specifications */}
      {visibleSpecs.map((spec) => (
        <div
          key={spec.name}
          className={cn(
            `flex items-center gap-1 w-fit whitespace-nowrap ${itemClassName}`,
            truncate && "w-full truncate"
          )}
        >
          <div className="flex-shrink-0 flex items-center justify-center w-[22px] h-[22px]">
            {typeof spec.icon === "string" ? (
              isColor(spec.icon) ? (
                <div
                  className="w-full h-full rounded-sm border border-gray-200"
                  style={{ backgroundColor: spec.icon }}
                  title={`${spec.name}: ${spec.icon}`}
                />
              ) : (
                <Image
                  src={spec.icon || UI_ICONS.fallback}
                  alt={spec.name}
                  width={22}
                  height={22}
                  className="object-contain opacity-65"
                />
              )
            ) : spec.icon ? (
              <div className="opacity-65">{spec.icon}</div>
            ) : (
              <Image
                src={UI_ICONS.fallback}
                alt={spec.name}
                width={22}
                height={22}
                className="object-contain opacity-65"
              />
            )}
          </div>
          <Typography
            variant="body-small"
            className={cn(
              "text-black text-xs",
              truncate && "max-w-lg truncate"
            )}
          >
            {isColor(spec.value) ? (
              <div
                className="size-4 rounded-full border border-gray-200"
                style={{ backgroundColor: spec.value }}
                title={spec.value}
              />
            ) : (
              spec.value
            )}
          </Typography>
        </div>
      ))}

      {/* Show popover for remaining specifications if enabled and there are more */}
      {showPopover && hasMore && (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 whitespace-nowrap text-xs text-purple-600 hover:text-purple-700 font-medium">
              +{remainingCount} more
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 max-h-96 overflow-y-auto"
            align="start"
          >
            <div className="space-y-2">
              <Typography
                variant="h3"
                className="text-sm font-semibold text-dark-blue mb-3"
              >
                {popoverTitle}
              </Typography>
              <div className="space-y-3">
                {specifications.map((spec) => (
                  <div key={spec.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                      {typeof spec.icon === "string" ? (
                        isColor(spec.icon) ? (
                          <div
                            className="w-full h-full rounded-sm border border-gray-200"
                            style={{ backgroundColor: spec.icon }}
                            title={`${spec.name}: ${spec.icon}`}
                          />
                        ) : (
                          <Image
                            src={spec.icon || UI_ICONS.fallback}
                            alt={spec.name}
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain"
                          />
                        )
                      ) : spec.icon ? (
                        spec.icon
                      ) : (
                        <Image
                          src={UI_ICONS.fallback}
                          alt={spec.name}
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <Typography
                        variant="body-small"
                        className="text-xs text-grey-blue"
                      >
                        {spec.name}
                      </Typography>
                      <Typography
                        variant="body-small"
                        className="text-sm text-dark-blue font-medium"
                      >
                        {isColor(spec.value) ? (
                          <div
                            className="size-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: spec.value }}
                            title={spec.value}
                          />
                        ) : (
                          spec.value
                        )}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
