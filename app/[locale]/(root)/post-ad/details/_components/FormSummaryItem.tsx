import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormSummaryItemProps {
  label: string;
  value: any;
  type?: "text" | "images" | "price" | "location";
  className?: string;
  error?: boolean;
}

export function FormSummaryItem({
  label,
  value,
  type = "text",
  className,
  error = false,
}: FormSummaryItemProps) {
  const isEmpty =
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) {
    if (error) {
      return (
        <div
          className={cn(
            "flex justify-between border-b border-red-100 dark:border-red-900/30 pb-2 gap-4",
            className,
          )}
        >
          <span className="text-red-500 dark:text-red-400 shrink-0">
            {label}
          </span>
          <span className="font-medium text-red-500 dark:text-red-400 truncate max-w-[150px] text-right">
            Required
          </span>
        </div>
      );
    } else {
      return null;
    }
  }

  const labelClassName = error
    ? "text-red-500 dark:text-red-400 shrink-0 pr-2"
    : "text-gray-500 dark:text-gray-400 shrink-0 pr-2";
  const borderClassName = error
    ? "border-b border-red-100 dark:border-red-900/30 pb-2"
    : "border-b border-gray-100 dark:border-gray-800 pb-2";

  // If boolean
  if (typeof value === "boolean") {
    value = value ? "Yes" : "No";
  }

  // Handle Images
  if (type === "images" && Array.isArray(value)) {
    const firstImgUrl =
      value[0]?.url || value[0]?.file?.preview || value[0]?.file?.name || "";
    return (
      <div
        className={cn(
          `flex justify-between items-center ${borderClassName}`,
          className,
        )}
      >
        <span className={labelClassName}>{label}</span>
        <div className="flex items-center gap-2">
          {firstImgUrl && (
            <div className="w-8 h-8 relative rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
              <img
                src={firstImgUrl}
                alt="Img"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!firstImgUrl && <span className="text-xs text-gray-500">Image</span>}
          {value.length > 1 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-[10px] sm:text-xs font-medium text-purple hover:underline bg-purple/10 px-2 py-1 rounded transition-colors whitespace-nowrap"
                >
                  +{value.length - 1} left
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl z-50">
                <p className="font-semibold text-sm mb-3">
                  All {label} ({value.length})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {value.map((img: any, i: number) => {
                    const url =
                      img?.url || img?.file?.preview || img?.file?.name || "";
                    return (
                      <div
                        key={i}
                        className="w-full aspect-square relative rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800"
                      >
                        {url ? (
                          <img
                            src={url}
                            alt={`Img ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    );
  }

  // Handle Arrays of strings/numbers/objects
  if (Array.isArray(value)) {
    const getLabel = (item: any) =>
      String(
        typeof item === "object" && item !== null
          ? item?.name || item?.label || item?.value || JSON.stringify(item)
          : item,
      );
    const firstItemStr = getLabel(value[0]);

    return (
      <div
        className={cn(
          `flex justify-between items-center ${borderClassName}`,
          className,
        )}
      >
        <span className={labelClassName}>{label}</span>
        <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
          <span
            className="font-medium text-gray-900 dark:text-white truncate text-right text-xs sm:text-sm"
            title={firstItemStr}
          >
            {firstItemStr}
          </span>
          {value.length > 1 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-[10px] sm:text-xs font-medium text-purple hover:underline bg-purple/10 px-1.5 py-0.5 rounded shrink-0 transition-colors whitespace-nowrap"
                >
                  +{value.length - 1} more
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl z-50">
                <p className="font-semibold text-sm mb-2 pb-2 border-b dark:border-gray-800 text-gray-900 dark:text-white">
                  {label} ({value.length})
                </p>
                <ul className="text-xs sm:text-sm space-y-1.5 text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto custom-scrollbar">
                  {value.map((item: any, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple mt-0.5">•</span>
                      <span className="break-words flex-1 leading-snug">
                        {getLabel(item)}
                      </span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    );
  }

  // Handle Single value (objects or primitives)
  let displayValue = "";
  if (type === "price") {
    displayValue = String(value).includes("AED")
      ? String(value)
      : `${value} AED`;
  } else if (
    type === "location" &&
    typeof value === "object" &&
    value !== null
  ) {
    displayValue =
      value.city || value.state || value.address || "Unknown Location";
  } else if (typeof value === "object" && value !== null) {
    displayValue =
      value.name || value.label || value.value || JSON.stringify(value);
  } else {
    displayValue = String(value);
  }

  return (
    <div
      className={cn(`flex justify-between gap-4 ${borderClassName}`, className)}
    >
      <span className={labelClassName.replace(" pr-2", "")}>{label}</span>
      <span
        className="font-medium text-gray-900 dark:text-white truncate max-w-[150px] text-right"
        title={displayValue}
      >
        {displayValue}
      </span>
    </div>
  );
}
