"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes, getCountryValidation } from "@/schemas/signup.schema";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps {
  value?: string;
  countryCode?: string;
  onPhoneChange: (phoneNumber: string, countryCode: string) => void;
  onVerify?: () => Promise<void>;
  disabled?: boolean;
  error?: string;
  className?: string;
  showVerifyButton?: boolean;
  isVerified?: boolean;
  verifiedPhoneNumber?: string;
  verifiedCountryCode?: string;
}

export default function PhoneNumberInput({
  value = "",
  countryCode = "+971",
  onPhoneChange,
  onVerify,
  disabled = false,
  error,
  className,
  showVerifyButton = true,
  isVerified = false,
  verifiedPhoneNumber,
  verifiedCountryCode,
}: PhoneNumberInputProps) {
  const [localPhoneNumber, setLocalPhoneNumber] = useState(value);
  const [localCountryCode, setLocalCountryCode] = useState(countryCode);

  const handleCountryCodeChange = useCallback(
    (newCountryCode: string) => {
      setLocalCountryCode(newCountryCode);
      onPhoneChange(localPhoneNumber, newCountryCode);
    },
    [localPhoneNumber, onPhoneChange]
  );

  const handlePhoneNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Only allow digits
      const numericValue = inputValue.replace(/\D/g, "");
      setLocalPhoneNumber(numericValue);
      onPhoneChange(numericValue, localCountryCode);
    },
    [localCountryCode, onPhoneChange]
  );

  // Use verified values if verified, otherwise use local state
  const displayPhoneNumber =
    isVerified && verifiedPhoneNumber ? verifiedPhoneNumber : localPhoneNumber;
  const displayCountryCode =
    isVerified && verifiedCountryCode ? verifiedCountryCode : localCountryCode;

  const validation = getCountryValidation(displayCountryCode);
  const numericPhone = displayPhoneNumber.replace(/\D/g, "");
  const isValidLength =
    numericPhone.length >= validation.minLength &&
    numericPhone.length <= validation.maxLength;

  return (
    <div>
      <div className={cn("flex gap-3", className)}>
        <Select
          value={displayCountryCode}
          onValueChange={handleCountryCodeChange}
          disabled={disabled || isVerified}
        >
          <SelectTrigger className="min-w-fit border-grey-blue/30 hover:border-purple/50 bg-white text-dark-blue text-sm font-medium py-5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.code} ({country.country})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2">
          <Input
            value={displayPhoneNumber}
            onChange={handlePhoneNumberChange}
            disabled={disabled || isVerified}
            type="tel"
            inputMode="numeric"
            placeholder="Enter phone number"
            className={cn(
              "flex-1",
              error && "border-destructive",
              isVerified && "bg-muted"
            )}
            maxLength={validation.maxLength}
          />
          {showVerifyButton && !isVerified && onVerify && (
            <Button
              type="button"
              onClick={onVerify}
              disabled={!isValidLength || disabled}
              variant="outline"
            >
              Verify
            </Button>
          )}
        </div>
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}
