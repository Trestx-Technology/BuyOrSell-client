"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/useLocale";

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectUrl?: string;
  message?: string;
}

export function LoginRequiredDialog({
  open,
  onOpenChange,
  redirectUrl,
  message = "You need to be logged in to continue. Would you like to login?",
}: LoginRequiredDialogProps) {
  const router = useRouter();
  const { localePath } = useLocale();

  const handleLogin = () => {
    // Build login URL with locale prefix
    const baseLoginPath = localePath("/login");
    const loginUrl = redirectUrl
      ? `${baseLoginPath}?redirect=${encodeURIComponent(redirectUrl)}`
      : baseLoginPath;
    
    // Close dialog first, then navigate
    onOpenChange(false);
    
    // Use setTimeout to ensure dialog closes before navigation
    setTimeout(() => {
      router.push(loginUrl);
    }, 100);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ResponsiveDialogDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Login Required"
      description={message}
      dialogContentClassName="sm:max-w-[425px]"
    >
      <div className="p-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogin}
          className="w-full sm:w-auto bg-purple hover:bg-purple/90"
        >
          Login
        </Button>
      </div>
    </ResponsiveDialogDrawer>
  );
}

