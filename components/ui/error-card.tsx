"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const errorCardVariants = cva(
  "relative rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2",
  {
    variants: {
      variant: {
        error: "bg-destructive/5 border-destructive/20 text-destructive",
        warning: "bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-500",
        info: "bg-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-400",
        critical: "bg-red-600/10 border-red-600/30 text-red-700 dark:text-red-400",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "error",
      size: "md",
    },
  },
)

const iconMap = {
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  critical: AlertCircle,
}

export interface ErrorCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof errorCardVariants> {
  title?: string
  description?: string
  onDismiss?: () => void
  dismissible?: boolean
  action?: React.ReactNode
  icon?: React.ReactNode
}

const ErrorCard = React.forwardRef<HTMLDivElement, ErrorCardProps>(
  (
    {
      className,
      variant = "error",
      size = "md",
      title,
      description,
      onDismiss,
      dismissible = false,
      action,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Icon = variant ? iconMap[variant] : XCircle

    return (
      <div ref={ref} role="alert" className={cn(errorCardVariants({ variant, size }), className)} {...props}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">{icon || <Icon className="h-5 w-5" />}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && <h3 className="font-semibold text-base mb-1 text-balance">{title}</h3>}
            {description && <p className="text-sm opacity-90 text-pretty leading-relaxed">{description}</p>}
            {children && <div className="mt-3">{children}</div>}
            {action && <div className="mt-4 flex flex-wrap gap-2">{action}</div>}
          </div>

          {/* Dismiss Button */}
          {dismissible && onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDismiss}
              className="flex-shrink-0 h-6 w-6 rounded-md hover:bg-black/5 dark:hover:bg-white/5 -mt-1 -mr-1"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          )}
        </div>
      </div>
    )
  },
)

ErrorCard.displayName = "ErrorCard"

export { ErrorCard, errorCardVariants }

