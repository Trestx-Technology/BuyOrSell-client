"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
}

export const FormField = ({
  children,
  className,
  label,
  fullWidth = false,
  htmlFor,
  required,
  error,
}: FormFieldProps) => {
  return (
    <div
      className={cn(
        "space-y-2",
        fullWidth ? "col-span-full" : "col-span-1",
        className
      )}
    >
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className={cn(error && "space-y-1")}>
        {children}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};
