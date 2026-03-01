"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdPostStatus = "success" | "error" | "pending";

export interface AdPostStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  status: AdPostStatus;
  title?: string;
  message?: string;
  onConfirm?: () => void;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    iconBg: "bg-success-100",
    borderColor: "border-purple",
    defaultTitle: "Ad Post successfully created!",
    defaultMessage: "",
  },
  error: {
    icon: XCircle,
    iconBg: "bg-error-100",
    borderColor: "border-purple",
    defaultTitle: "Ad Post creation failed",
    defaultMessage:
      "We encountered an issue while creating the User account. Unfortunately, the account creation process has failed.",
  },
  pending: {
    icon: Info,
    iconBg: "bg-warning-100",
    borderColor: "border-blue-200",
    defaultTitle: "The changes have not been saved",
    defaultMessage:
      "If you close the page without applying the changes, your edits will not be saved. Are you sure you want to leave without applying the changes?",
  },
};

export default function AdPostStatusDialog({
  isOpen,
  onClose,
  status,
  title,
  message,
  onConfirm,
}: AdPostStatusDialogProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[608px] p-0 bg-white dark:bg-gray-950 rounded-2xl border-2 dark:border-gray-800",
          config.borderColor,
        )}
        showCloseButton={false}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-5 w-5 text-black dark:text-gray-200" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="p-8 pb-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Icon Circle */}
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                config.iconBg,
              )}
            >
              <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <Typography
              variant="h2"
              className="text-black dark:text-white font-semibold text-xl text-center"
            >
              {title || config.defaultTitle}
            </Typography>

            {/* Message */}
            {message || config.defaultMessage ? (
              <Typography
                variant="body-small"
                className="text-grey-blue text-sm text-center leading-relaxed max-w-md"
              >
                {message || config.defaultMessage}
              </Typography>
            ) : null}
          </div>
        </DialogHeader>

        {/* Footer Button */}
        <div className="px-8 pb-8 pt-2">
          <Button
            variant="primary"
            className="w-full bg-purple text-white hover:bg-purple/90 rounded-lg h-12 font-semibold text-sm"
            onClick={handleConfirm}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
