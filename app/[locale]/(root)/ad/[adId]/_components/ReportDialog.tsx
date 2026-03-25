"use client";

import React, { useState } from "react";
import { Flag, Send, AlertTriangle } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
  ResponsiveModalDescription,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/hooks/useLocale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useCreateReportUser } from "@/hooks/useReportUser";

import { ReportedType } from "@/interfaces/report-user.types";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedId: string;
  reportedType: ReportedType;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  reportedId,
  reportedType,
}) => {
  const { t } = useLocale();
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const { session } = useAuthStore((state) => state);
  const { mutateAsync: createReportUser, isPending } = useCreateReportUser();

  const handleSubmit = async () => {
    if (!reason) {
      toast.error(t.ad.report.reasonLabel || "Please select a reason");
      return;
    }

    if (!session?.user) {
      toast.error("You must be logged in to submit a report.");
      return;
    }

    try {
      await createReportUser({
        reported: reportedId,
        reportedType,
        reportedBy: session.user._id,
        reportReason: details ? `${reason}: ${details}` : reason,
      });
      
      toast.success(t.ad.report.successMessage || "Report submitted successfully");
      handleClose();
    } catch (error) {
      toast.error(t.ad.report.errorMessage || "Failed to submit report");
    }
  };

  const handleClose = () => {
    setReason("");
    setDetails("");
    onOpenChange(false);
  };

  const reportReasons = [
    { id: "spam", label: t.ad.report.reasons.spam },
    { id: "inappropriate", label: t.ad.report.reasons.inappropriate },
    { id: "scam", label: t.ad.report.reasons.scam },
    { id: "incorrectInfo", label: t.ad.report.reasons.incorrectInfo },
    { id: "other", label: t.ad.report.reasons.other },
  ];

  const getTitle = () => {
    switch (reportedType) {
      case "user": return "Report User";
      case "company": return "Report Company";
      case "organization": return "Report Organization";
      default: return t.ad.report.title || "Report this ad";
    }
  };

  const getReasonLabel = () => {
    switch (reportedType) {
      case "user": return "Why are you reporting this user?";
      case "company": return "Why are you reporting this company?";
      case "organization": return "Why are you reporting this organization?";
      default: return t.ad.report.reasonLabel || "Why are you reporting this ad?";
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={handleClose}>
      <ResponsiveModalContent className="max-w-md w-[95%] sm:max-w-lg border-none bg-white dark:bg-gray-950 p-0 overflow-hidden shadow-2xl">
        <div className="bg-purple/5 dark:bg-purple/10 p-6 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <div className="h-12 w-12 rounded-full bg-purple/10 dark:bg-purple/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-purple" />
          </div>
          <div>
            <ResponsiveModalTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {getTitle()}
            </ResponsiveModalTitle>
            <ResponsiveModalDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Help us keep our community safe and high-quality.
            </ResponsiveModalDescription>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Reasons */}
          <div className="space-y-3">
            <Typography variant="sm-medium" className="text-gray-900 dark:text-gray-200">
              {getReasonLabel()}
            </Typography>
            <RadioGroup
              value={reason}
              onValueChange={setReason}
              className="grid grid-cols-1 gap-2"
            >
              {reportReasons.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center space-x-3 space-y-0 rounded-lg border border-gray-100 dark:border-gray-800 p-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer",
                    reason === item.id && "border-purple bg-purple/[0.02] dark:bg-purple/[0.05]"
                  )}
                  onClick={() => setReason(item.id)}
                >
                  <RadioGroupItem value={item.id} id={item.id} className="text-purple border-gray-300 dark:border-gray-700" />
                  <Label
                    htmlFor={item.id}
                    className="flex-1 text-sm font-medium leading-none cursor-pointer text-gray-700 dark:text-gray-300"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <Typography variant="sm-medium" className="text-gray-900 dark:text-gray-200">
              {t.ad.report.detailsLabel}
            </Typography>
            <Textarea
              placeholder={t.ad.report.detailsPlaceholder}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:ring-purple/20 focus:border-purple rounded-xl"
              disabled={isPending}
            />
          </div>
        </div>

        <ResponsiveModalFooter className="p-6 pt-0 flex gap-3 sm:gap-4 items-center">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 dark:text-gray-400 dark:hover:bg-gray-900 font-medium"
          >
            {t.ad.report.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !reason}
            className="flex-[2] bg-purple hover:bg-purple/90 text-white font-bold h-11 rounded-xl shadow-lg shadow-purple/20"
            isLoading={isPending}
          >
            {t.ad.report.submit}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default ReportDialog;
