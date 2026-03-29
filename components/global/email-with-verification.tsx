"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import OTPVerificationModal from "./otp-verification-modal";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { Badge } from "../ui/badge";

interface EmailWithVerificationProps {
  value?: string;
  onEmailVerified: (email: string) => void;
  onEmailChange?: (email: string) => void;
  onSendOTP?: (email: string) => Promise<void>;
  onVerifyOTP?: (email: string, otp: string) => Promise<boolean>;
  disabled?: boolean;
  error?: string;
  className?: string;
  label?: string;
  description?: string;
  required?: boolean;
  showEditButton?: boolean;
  initialVerified?: boolean;
}

export default function EmailWithVerification({
  value = "",
  onEmailVerified,
  onEmailChange,
  onSendOTP,
  onVerifyOTP,
  disabled = false,
  error,
  className,
  label = "Email Address",
  description,
  required = false,
  showEditButton = true,
  initialVerified = false,
}: EmailWithVerificationProps) {
  const [isEditing, setIsEditing] = useState(!value);
  const [email, setEmail] = useState(value);
  const [isVerified, setIsVerified] = useState(initialVerified);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const verifiedLocallyRef = React.useRef(false);

  // Sync state with value prop when it changes
  useEffect(() => {
    setEmail(value);
    if (!verifiedLocallyRef.current) {
      setIsVerified(initialVerified);
    }
    if (value) {
      setIsEditing(false);
    }
  }, [value, initialVerified]);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      if (onEmailChange) {
        onEmailChange(newEmail);
      }
    },
    [onEmailChange],
  );

  const handleVerifyClick = useCallback(async () => {
    if (!email || !onSendOTP) return;

    setPendingEmail(email);

    try {
      await onSendOTP(email);
      setShowOTPModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }, [email, onSendOTP]);

  const handleOTPVerify = useCallback(
    async (otp: string): Promise<boolean> => {
      if (!onVerifyOTP || !pendingEmail) {
        return false;
      }

      try {
        const isValid = await onVerifyOTP(pendingEmail, otp);
        if (isValid) {
          verifiedLocallyRef.current = true;
          setIsVerified(true);
          setIsEditing(false);
          onEmailVerified(pendingEmail);
        }
        return isValid;
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return false;
      }
    },
    [onVerifyOTP, pendingEmail, onEmailVerified],
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsVerified(false);
  }, []);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isEditing && isVerified) {
    return (
      <FormField
        label={label}
        htmlFor="contactEmail"
        required={required}
        className={className}
      >
        {description && (
          <Typography variant="caption" className="text-grey-blue mb-2 block">
            {description}
          </Typography>
        )}
        <div className="flex justify-start items-center gap-2">
          <Typography variant="body-small" className="text-purple">
            {email}
          </Typography>
          {showEditButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              icon={<Edit className="w-4 h-4" />}
              iconPosition="center"
              onClick={handleEdit}
              className="text-purple hover:text-purple p-1"
            />
          )}

          <Badge variant="outline" className="border-0 text-green-500">
            Verified
          </Badge>
        </div>
        <OTPVerificationModal
          open={showOTPModal}
          onOpenChange={setShowOTPModal}
          onVerify={handleOTPVerify}
          onResend={onSendOTP ? () => onSendOTP(pendingEmail) : undefined}
          identifier={pendingEmail} // Using the field for email display
          title="Verify Your Email"
          description="Enter the 6-digit code sent to your email"
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={label}
      htmlFor="contactEmail"
      required={required}
      className={className}
    >
      {description && (
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          {description}
        </Typography>
      )}
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={handleEmailChange}
          disabled={disabled || isVerified}
          type="email"
          placeholder="Enter email address"
          className={cn(
            "flex-1 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700",
            error && "border-destructive",
            isVerified && "bg-muted dark:bg-gray-800",
          )}
        />
        {!!onSendOTP && !isVerified && (
          <Button
            type="button"
            onClick={handleVerifyClick}
            disabled={!isValidEmail || disabled}
            variant="outline"
          >
            Verify
          </Button>
        )}
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onVerify={handleOTPVerify}
        onResend={onSendOTP ? () => onSendOTP(pendingEmail) : undefined}
        identifier={pendingEmail}
        title="Verify Your Email"
        description="Enter the 6-digit code sent to your email"
      />
    </FormField>
  );
}
