"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PhoneNumberInput from "./phone-number-input";
import OTPVerificationModal from "./otp-verification-modal";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { countryCodes } from "@/schemas/signup.schema";
import { Badge } from "../ui/badge";

interface PhoneNumberWithVerificationProps {
  value?: string;
  countryCode?: string;
  onPhoneVerified: (phoneNumber: string) => void;
  onSendOTP?: (phoneNumber: string) => Promise<void>;
  onVerifyOTP?: (phoneNumber: string, otp: string) => Promise<boolean>;
  disabled?: boolean;
  error?: string;
  className?: string;
  label?: string;
  description?: string;
  required?: boolean;
  showEditButton?: boolean;
}

// Helper to parse phone number with country code
const parsePhoneNumber = (fullPhone: string, defaultCountryCode: string) => {
  if (!fullPhone) return { countryCode: defaultCountryCode, phoneNumber: "" };

  // Try to find matching country code (sort by length desc to match longer codes first)
  const codes = countryCodes
    .map((c) => c.code)
    .sort((a, b) => b.length - a.length);
  for (const code of codes) {
    if (fullPhone.startsWith(code)) {
      return {
        countryCode: code,
        phoneNumber: fullPhone.slice(code.length),
      };
    }
  }

  // If no country code found, assume default
  return {
    countryCode: defaultCountryCode,
    phoneNumber: fullPhone.startsWith("+") ? fullPhone.slice(1) : fullPhone,
  };
};

export default function PhoneNumberWithVerification({
  value = "",
  countryCode = "+971",
  onPhoneVerified,
  onSendOTP,
  onVerifyOTP,
  disabled = false,
  error,
  className,
  label = "Phone Number",
  description,
  required = false,
  showEditButton = true,
}: PhoneNumberWithVerificationProps) {
  const parsed = parsePhoneNumber(value, countryCode);
  const [isEditing, setIsEditing] = useState(!value);
  const [phoneNumber, setPhoneNumber] = useState(parsed.phoneNumber);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    parsed.countryCode
  );
  const [isVerified, setIsVerified] = useState(!!value);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");
  const [pendingCountryCode, setPendingCountryCode] = useState("");

  // Sync state with value prop when it changes
  useEffect(() => {
    const newParsed = parsePhoneNumber(value, countryCode);
    setPhoneNumber(newParsed.phoneNumber);
    setSelectedCountryCode(newParsed.countryCode);
    setIsVerified(!!value);
    if (value) {
      setIsEditing(false);
    }
  }, [value, countryCode]);

  const handlePhoneChange = useCallback(
    (newPhoneNumber: string, newCountryCode: string) => {
      setPhoneNumber(newPhoneNumber);
      setSelectedCountryCode(newCountryCode);
    },
    []
  );

  const handleVerifyClick = useCallback(async () => {
    if (!phoneNumber || !onSendOTP) return;

    const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;
    setPendingPhoneNumber(phoneNumber);
    setPendingCountryCode(selectedCountryCode);

    try {
      // Combine country code and phone number for API
      await onSendOTP(fullPhoneNumber);
      setShowOTPModal(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  }, [phoneNumber, selectedCountryCode, onSendOTP]);

  const handleOTPVerify = useCallback(
    async (otp: string): Promise<boolean> => {
      if (!onVerifyOTP || !pendingPhoneNumber || !pendingCountryCode) {
        return false;
      }

      try {
        const fullPhoneNumber = `${pendingCountryCode}${pendingPhoneNumber}`;
        const isValid = await onVerifyOTP(fullPhoneNumber, otp);
        if (isValid) {
          setIsVerified(true);
          setIsEditing(false);
          onPhoneVerified(fullPhoneNumber);
        }
        return isValid;
      } catch (error) {
        console.error("Error verifying OTP:", error);
        return false;
      }
    },
    [onVerifyOTP, pendingPhoneNumber, pendingCountryCode, onPhoneVerified]
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsVerified(false);
  }, []);

  const fullPhoneNumber = `${selectedCountryCode}${phoneNumber}`;

  if (!isEditing && isVerified) {
    return (
      <FormField
        label={label}
        htmlFor="contactPhone"
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
            {fullPhoneNumber}
          </Typography>
          {showEditButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              icon={<Edit className="w-4 h-4" />}
              iconPosition="left"
              onClick={handleEdit}
              className="text-purple hover:text-purple p-1"
            ></Button>
          )}

          <Badge variant="outline" className="border-0 text-green-500">
            Verified
          </Badge>
        </div>
        <OTPVerificationModal
          open={showOTPModal}
          onOpenChange={setShowOTPModal}
          onVerify={handleOTPVerify}
          phoneNumber={fullPhoneNumber}
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={label}
      htmlFor="contactPhone"
      required={required}
      className={className}
    >
      {description && (
        <Typography variant="caption" className="text-grey-blue mb-2 block">
          {description}
        </Typography>
      )}
      <PhoneNumberInput
        value={phoneNumber}
        countryCode={selectedCountryCode}
        onPhoneChange={handlePhoneChange}
        onVerify={onSendOTP ? handleVerifyClick : undefined}
        disabled={disabled}
        error={error}
        showVerifyButton={!!onSendOTP}
        isVerified={isVerified}
      />
      <OTPVerificationModal
        open={showOTPModal}
        onOpenChange={setShowOTPModal}
        onVerify={handleOTPVerify}
        phoneNumber={fullPhoneNumber}
      />
    </FormField>
  );
}
