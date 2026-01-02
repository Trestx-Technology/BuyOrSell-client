"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<boolean>;
  title?: string;
  description?: string;
  otpLength?: number;
  phoneNumber?: string;
}

type VerificationState = "idle" | "verifying" | "success" | "error";

const OTPVerificationModal = ({
  open,
  onOpenChange,
  onVerify,
  title = "Verify Your Number",
  description = "Enter the 6-digit code sent to your phone",
  otpLength = 6,
  phoneNumber,
}: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState("");
  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) {
      setOtp("");
      setVerificationState("idle");
    }
  }, [open]);

  const handleVerify = async () => {
    if (otp.length !== otpLength) return;

    setVerificationState("verifying");

    try {
      const isValid = await onVerify(otp);
      setVerificationState(isValid ? "success" : "error");

      if (isValid) {
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }
    } catch {
      setVerificationState("error");
    }
  };

  const handleRetry = () => {
    setOtp("");
    setVerificationState("idle");
  };

  const displayDescription = phoneNumber
    ? `${description}: ${phoneNumber}`
    : description;

  const Content = (
    <div className="flex flex-col items-center gap-6 py-4">
      {verificationState === "success" ? (
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <p className="text-lg font-medium text-success">
            Verified Successfully!
          </p>
        </div>
      ) : verificationState === "error" ? (
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-lg font-medium text-destructive">
            Verification Failed
          </p>
          <Button onClick={handleRetry} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <InputOTP
            maxLength={otpLength}
            value={otp}
            onChange={setOtp}
            disabled={verificationState === "verifying"}
          >
            <InputOTPGroup>
              {Array.from({ length: Math.floor(otpLength / 2) }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="otp-slot" />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {Array.from({ length: Math.ceil(otpLength / 2) }).map((_, i) => (
                <InputOTPSlot
                  key={i + Math.floor(otpLength / 2)}
                  index={i + Math.floor(otpLength / 2)}
                  className="otp-slot"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={handleVerify}
            isLoading={verificationState === "verifying"}
            disabled={
              otp.length !== otpLength || verificationState === "verifying"
            }
            className={cn(
              "w-full max-w-xs transition-all duration-200",
              otp.length === otpLength && "shadow-glow"
            )}
          >
            {verificationState === "verifying" ? <>Verifying...</> : "Verify"}
          </Button>

          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button className="text-primary hover:underline font-medium">
              Resend
            </button>
          </p>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{displayDescription}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-8">{Content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationModal;
