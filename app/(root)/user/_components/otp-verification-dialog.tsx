"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OTPVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerify: (otp: string) => void;
  isLoading?: boolean;
}

export default function OTPVerificationDialog({
  isOpen,
  onClose,
  phoneNumber,
  onVerify,
  isLoading = false,
}: OTPVerificationDialogProps) {
  const [otp, setOtp] = useState("");

  // Mask the phone number for display
  const maskedPhoneNumber = phoneNumber.replace(
    /(\d{4})(\d{3})(\d{3})(\d{1})/,
    "$1*****$4"
  );

  const handleSubmit = () => {
    if (otp.length === 4) {
      onVerify(otp);
    }
  };

  // Reset OTP when dialog opens
  useEffect(() => {
    if (isOpen) {
      setOtp("");
    }
  }, [isOpen]);

  const isOtpComplete = otp.length === 4;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[95%] rounded-2xl border-0 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-md text-center font-semibold text-gray-900 mt-4">
            OTP Verification
          </DialogTitle>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Enter OTP</h3>

            <DialogDescription className="text-sm text-gray-600 leading-relaxed">
              4 digit OTP has been sent to your mobile number <br /> starting
              from{" "}
              <span className="font-medium text-gray-900">
                {maskedPhoneNumber}
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* OTP Input Fields */}
        <div className="flex justify-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
          >
            <InputOTPGroup className="flex gap-10">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isOtpComplete || isLoading}
          type="submit"
          variant={"primary"}
          className="w-full hover:bg-gray-500 disabled:bg-gray-300 text-white py-3 text-base font-medium"
        >
          {isLoading ? "Verifying..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
