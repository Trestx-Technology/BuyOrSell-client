/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FirebaseGoogleLoginButton } from "./firebase-google-signin";
import { FirebaseAppleLoginButton } from "./firebase-apple-signin";
import { FirebaseTwitterLoginButton } from "./firebase-twitter-signin";
import { loginResponse } from "@/interfaces/auth.types";

interface FirebaseAuthButtonsProps {
  onSuccess: (data: loginResponse, provider: "google" | "apple" | "twitter") => void | Promise<void>;
  onError?: (error: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  className?: string;
  disabled?: boolean;
  btnClassName?: string;
}

export function FirebaseAuthButtons({
  onSuccess,
  onError,
  onLoadingChange,
  className,
  disabled = false,
  btnClassName,
}: FirebaseAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
    onLoadingChange?.(loading);
  };

  const handleSuccess = async (data: loginResponse, provider: "google" | "apple" | "twitter") => {
    try {
      updateLoading(true);
      await onSuccess(data, provider);
      toast.success(`Successfully signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);
    } catch (error) {
      console.error(`Error handling ${provider} success:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to process ${provider} sign-in`;
      onError?.(errorMessage);
    } finally {
      updateLoading(false);
    }
  };

  const handleError = (error: string) => {
    updateLoading(false);
    onError?.(error);
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {/* Firebase Google Sign-In */}
        <FirebaseGoogleLoginButton
          onSuccess={(data) => handleSuccess(data, "google")}
          onError={(error) => handleError(error)}
          onLoadingStart={() => updateLoading(true)}
          disabled={disabled || isLoading}
          className={btnClassName}
        />

        {/* Firebase Apple Sign-In */}
        <FirebaseAppleLoginButton
          onSuccess={(data) => handleSuccess(data, "apple")}
          onError={(error) => handleError(error)}
          onLoadingStart={() => updateLoading(true)}
          disabled={disabled || isLoading}
          className={btnClassName}
        />

        {/* Firebase Twitter Sign-In */}
        <FirebaseTwitterLoginButton
          onSuccess={(data) => handleSuccess(data, "twitter")}
          onError={(error) => handleError(error)}
          onLoadingStart={() => updateLoading(true)}
          disabled={disabled || isLoading}
          className={btnClassName}
        />
      </div>
    </div>
  );
}
