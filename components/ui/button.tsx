import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed  [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        // Primary variants using our design system colors
        primary: "bg-purple text-white hover:bg-purple/90 active:bg-purple/80",
        outline:
          "bg-white dark:bg-gray-800 hover:bg-purple/10 border border-purple text-purple active:bg-purple/20",
        secondary:
          "bg-purple/10 text-purple border-0 border-purple hover:bg-purple/20 active:bg-purple/20",
        warning:
          "bg-warning-100 text-white hover:bg-warning-60 active:bg-warning-100",
        warningOutlined:
          "bg-warning-10 text-warning-100 border border-warning-100 hover:bg-warning-60 hover:text-white active:bg-warning-100",
        success:
          "bg-success-100 text-white hover:bg-success-60 active:bg-success-100",
        successOutlined:
          "bg-success-10 text-success-100 border border-success-100 hover:bg-success-60 hover:text-white active:bg-success-100",
        danger: "bg-error-100 text-white hover:bg-error-60 active:bg-error-100",
        dangerOutlined:
          "bg-error-10 text-error-100 border border-error-100 hover:bg-error-60 hover:text-white active:bg-error-100",
        ghost:
          "hover:bg-purple/10 hover:text-purple dark:hover:bg-purple/20 dark:hover:text-purple",

        // Design system variants (our custom ones)
        filled: "bg-purple text-white hover:bg-purple/90 active:bg-purple/80",
        outlined:
          "border border-purple bg-white dark:bg-gray-800 text-purple hover:bg-purple/10 active:bg-purple/20",

        // Additional semantic variants
        cancel:
          "bg-cancel-100 text-white hover:bg-cancel-60 active:bg-cancel-100",
        cancelOutlined:
          "bg-cancel-10 text-cancel-100 border border-cancel-100 hover:bg-cancel-60 hover:text-white active:bg-cancel-100",
        active:
          "bg-active-100 text-white hover:bg-active-60 active:bg-active-100",
        activeOutlined:
          "bg-active-10 text-active-100 border border-active-100 hover:bg-active-60 hover:text-white active:bg-active-100",
      },
      size: {
        // Original shadcn sizes
        default: "h-10 px-6 py-2",
        small: "h-8 px-2 py-1",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",

        // Design system icon sizes
        "icon-sm": "h-8 w-8 p-0",
        "icon-lg": "h-12 w-12 p-0",
      },
      width: {
        default: "w-auto",
        full: "w-full",
        long: "min-w-[200px]",
      },
      iconPosition: {
        none: "",
        left: "flex-row",
        right: "flex-row",
        center: "flex-row justify-center", // Changed from flex-col to flex-row
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      width: "default",
      iconPosition: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  label?: string | React.ReactNode;
  icon?: React.ReactNode; // Harsh: Optional icon to display
  isLoading?: boolean; // Harsh: Optional loading state
  loading?: boolean; // Alias for isLoading for compatibility
  width?: "default" | "long" | "full";
  iconPosition?: "none" | "left" | "right" | "center";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      label,
      isLoading = false,
      loading,
      width,
      iconPosition,
      icon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Handle loading state (support both isLoading and loading)
    const isActuallyLoading = isLoading || loading;

    // Handle disabled state
    const isDisabled = isActuallyLoading || disabled;

    // Get base button styles
    const baseStyles = buttonVariants({
      variant,
      size,
      width,
      iconPosition,
    });

    // Handle disabled styles based on variant
    const disabledStyles = isDisabled
      ? cn(
          // Different disabled appearance for each variant
          variant === "filled" &&
            "bg-[#C1C1C1] text-white cursor-not-allowed opacity-60",
          variant === "outlined" &&
        "bg-white dark:bg-gray-800 text-[#C1C1C1] border-[#C1C1C1] border-2 cursor-not-allowed opacity-60",
          variant === "primary" &&
            "bg-grey-blue/20 text-grey-blue cursor-not-allowed opacity-60",
          // Remove hover effects for disabled state
          "hover:bg-purple/90 hover:bg-purple/10 active:bg-purple/80 active:bg-purple/20 hover:bg-primary-300 hover:bg-primary-50"
        )
      : "";

    // Handle icon-only button logic
    const isIconOnly = size && size.startsWith("icon") && !children && !label;

    // Handle long button with icon centering
    const longButtonStyles =
      width === "long" && icon && iconPosition !== "none"
        ? "justify-center"
        : "";

    // Validate required props
    if (!label && !children && !icon) {
      throw new Error("Button must have at least a label, icon, or children.");
    }

    return (
      <Comp
        className={cn(
          baseStyles,
          disabledStyles,
          longButtonStyles,
          // Ensure icon-only buttons are properly sized
          isIconOnly && "flex-shrink-0",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isActuallyLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}

            {(label || children) && iconPosition !== "center" && (
              <span
                className={cn(
                  // For long buttons with icons, ensure proper centering
                  width === "long" &&
                    icon &&
                    iconPosition !== "none" &&
                    "text-center", // Only apply flex-1 when icon is on the left, not on the right
                  icon && iconPosition === "left" && "flex-1",
                  // Remove flex-1 for right-positioned icons to prevent pushing icon to edge
                  icon && iconPosition === "right" && "mr-2",
                  icon && iconPosition === "left" && "ml-2"
                )}
              >
                {label ?? children}
              </span>
            )}

            {icon && iconPosition === "center" && (
              <span className="flex-shrink-0">{icon}</span>
            )}

            {icon && iconPosition === "center" && (label || children) && (
              <span className="ml-2">
                {" "}
                {/* Changed from text-xs and removed mb-1 */}
                {label ?? children}
              </span>
            )}

            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
