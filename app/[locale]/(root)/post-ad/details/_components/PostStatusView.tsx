"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

export type PostStatus = "idle" | "loading" | "success" | "error";

interface PostStatusViewProps {
  status: PostStatus;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onSuccessAcknowledge?: () => void;
}

const statusConfig = {
  loading: {
    icon: Loader2,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    defaultTitle: "Your post is being submitted...",
    defaultMessage:
      "Please wait while we process your request. Do not close this page.",
    buttonText: null,
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-success-100",
    iconColor: "text-success-500",
    defaultTitle: "Post successfully created!",
    defaultMessage: "Your post is now live and visible to others.",
    buttonText: "Go to Home",
  },
  error: {
    icon: XCircle,
    iconBg: "bg-error-100",
    iconColor: "text-error-500",
    defaultTitle: "Post creation failed",
    defaultMessage:
      "We encountered an issue while submitting your post. Please check your network connection and try again.",
    buttonText: "Try Again",
  },
};

export default function PostStatusView({
  status,
  title,
  message,
  onRetry,
  onSuccessAcknowledge,
}: PostStatusViewProps) {
  const router = useRouter();
  const { localePath } = useLocale();

  // If idle, don't render anything (this shouldn't happen if properly hooked up)
  if (status === "idle") return null;

  const config = statusConfig[status];
  const Icon = config.icon;

  const handleAction = () => {
    if (status === "error" && onRetry) {
      onRetry();
    } else if (status === "success") {
      if (onSuccessAcknowledge) {
        onSuccessAcknowledge();
      } else {
        router.push(localePath("/")); // Default success action
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-6 max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center">
        {/* Icon Circle */}
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-2",
            config.iconBg,
          )}
        >
          <Icon
            className={cn(
              "w-10 h-10",
              config.iconColor,
              status === "loading" && "animate-spin",
            )}
            strokeWidth={2.5}
          />
        </div>

        {/* Title */}
        <Typography
          variant="h2"
          className="text-gray-900 dark:text-white font-semibold text-xl"
        >
          {title || config.defaultTitle}
        </Typography>

        {/* Message */}
        {(message || config.defaultMessage) && (
          <Typography
            variant="body-small"
            className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed"
          >
            {message || config.defaultMessage}
          </Typography>
        )}

        {/* Action Button */}
        {config.buttonText && (
          <div className="w-full pt-4">
            <Button
              variant={status === "error" ? "outline" : "primary"}
              className="w-full h-12 font-semibold text-sm"
              onClick={handleAction}
            >
              {config.buttonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
