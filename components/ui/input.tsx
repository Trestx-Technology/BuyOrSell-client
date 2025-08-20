import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 text-sm transition-all duration-200 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-grey-blue/30 text-dark-blue placeholder:text-grey-blue focus:border-purple focus:ring-2 focus:ring-purple/20",
        success:
          "border-success-100/30 text-dark-blue placeholder:text-grey-blue focus:border-success-100 focus:ring-2 focus:ring-success-100/20",
        warning:
          "border-warning-100/30 text-dark-blue placeholder:text-grey-blue focus:border-warning-100 focus:ring-2 focus:ring-warning-100/20",
        error:
          "border-error-100/30 text-dark-blue placeholder:text-grey-blue focus:border-error-100 focus:ring-2 focus:ring-error-100/20",
        filled:
          "border-purple/30 bg-purple/5 text-dark-blue placeholder:text-grey-blue focus:border-purple focus:ring-2 focus:ring-purple/20",
      },
      inputSize: {
        sm: "h-8 px-2 py-1 text-xs",
        default: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
      state: {
        default: "",
        success: "border-success-100 bg-success-10/30",
        warning: "border-warning-100 bg-warning-10/30",
        error: "border-error-100 bg-error-10/30",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isRequired?: boolean;
  inputSize?: "sm" | "default" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      state,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      isRequired,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const hasError = !!error;
    const finalState = hasError ? "error" : state;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-dark-blue flex items-center gap-1"
          >
            {label}
            {isRequired && <span className="text-error-100">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-blue pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            data-slot="input"
            className={cn(
              inputVariants({ variant, inputSize, state: finalState }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              hasError &&
                "border-error-100 focus:border-error-100 focus:ring-error-100/20",
              className
            )}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-blue pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {(helperText || error) && (
          <div className="flex items-start gap-2">
            {error && (
              <div className="flex items-center gap-1 text-xs text-error-100">
                <AlertCircle className="w-4 h-4 fill-error-100 text-white" />
                <span id={`${inputId}-error`}>{error}</span>
              </div>
            )}

            {helperText && !error && (
              <span id={`${inputId}-helper`} className="text-xs text-grey-blue">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
