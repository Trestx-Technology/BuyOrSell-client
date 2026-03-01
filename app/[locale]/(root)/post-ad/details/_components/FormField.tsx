"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  label: string | ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  labelClassName?: string;
  description?: React.ReactNode;
}

export const FormField = ({
  children,
  className,
  label,
  fullWidth = false,
  htmlFor,
  required,
  error,
  labelClassName,
  description,
}: FormFieldProps) => {
  return (
    <div
      className={cn(
        "space-y-2",
        fullWidth ? "col-span-full" : "col-span-1",
        className,
      )}
    >
      {label && (
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={htmlFor}
            className={cn(
              "text-sm font-medium text-foreground",
              labelClassName,
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      )}
      <div className={cn(error && "space-y-1")}>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
