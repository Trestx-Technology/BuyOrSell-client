"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Button } from "@/components/ui/button";

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

  const handleLogin = () => {
    const loginUrl = redirectUrl
      ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
      : "/login";
    router.push(loginUrl);
    onOpenChange(false);
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
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
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

