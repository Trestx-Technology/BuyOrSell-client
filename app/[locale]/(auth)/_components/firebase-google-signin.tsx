/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebase } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useSocialLogin } from "@/hooks/useAuth";
import { loginResponse } from "@/interfaces/auth.types";
import { FcGoogle } from "react-icons/fc";

interface RenderPropParams {
      onClick: () => void;
      disabled: boolean;
      isLoading: boolean;
}

interface FirebaseGoogleLoginButtonProps {
      onSuccess: (data: loginResponse) => void | Promise<void>;
      onError?: (error: string) => void;
      onLoadingStart?: () => void;
      render?: (params: RenderPropParams) => React.ReactNode;
      className?: string;
      disabled?: boolean;
      children?: React.ReactNode;
}

export function FirebaseGoogleLoginButton({
      onSuccess,
      onError,
      onLoadingStart,
      render,
      className,
      disabled = false,
      children,
}: FirebaseGoogleLoginButtonProps) {
      const [isLoading, setIsLoading] = useState(false);
      const socialLoginMutation = useSocialLogin();

      const handleGoogleSignIn = async () => {
            try {
                  setIsLoading(true);
                  onLoadingStart?.();

                  const auth = firebase.getAuth();
                  const provider = new GoogleAuthProvider();
                  provider.addScope("email");
                  provider.addScope("profile");
                  provider.setCustomParameters({
                        prompt: "consent",
                  });

                  const result = await signInWithPopup(auth, provider);
                  const credential = GoogleAuthProvider.credentialFromResult(result);

                  if (!credential?.accessToken || !credential?.idToken) {
                        throw new Error("Failed to get tokens from Google");
                  }

                  const nameParts = result.user.displayName?.split(" ") || ["", ""];
                  const firstName = nameParts[0] || "User";
                  const lastName = nameParts.slice(1).join(" ") || firstName;

                  const response = await socialLoginMutation.mutateAsync({
                        socialType: "google",
                        firstName,
                        lastName,
                        email: result.user.email || "",
                        verifyEmail: result.user.emailVerified,
                        image: result.user.photoURL || undefined,
                        countryCode: "+971", // Default country code or detect if possible
                        deviceKey: await firebase.getFCMToken() || "web"
                  });

                  await onSuccess(response);
            } catch (error: any) {
                  console.error("Firebase Google Login Error:", error);

                  let errorMessage = "Google authentication failed";

                  if (error.code === "auth/popup-closed-by-user") {
                        errorMessage = "Sign-in popup was closed";
                  } else if (error.code === "auth/cancelled-popup-request") {
                        errorMessage = "Sign-in was cancelled";
                  } else if (error.code === "auth/popup-blocked") {
                        errorMessage = "Sign-in popup was blocked by browser";
                  } else if (error.message) {
                        errorMessage = error.message;
                  }

                  onError?.(errorMessage);
            } finally {
                  setIsLoading(false);
            }
      };

      if (render) {
            return (
                  <div className={cn(className, "w-full")}>
                        {render({
                              onClick: handleGoogleSignIn,
                              disabled: disabled || isLoading || socialLoginMutation.isPending,
                              isLoading: isLoading || socialLoginMutation.isPending,
                        })}
                  </div>
            );
      }

      return (
            <Button
                  onClick={handleGoogleSignIn}
                  disabled={disabled || isLoading || socialLoginMutation.isPending}
                  variant="outline"
                  className={cn(
                        "w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-700 border-gray-200",
                        className
                  )}
                  icon={<FcGoogle />}
                  iconPosition="center"
                  isLoading={isLoading || socialLoginMutation.isPending}
            >

                  {children || "Continue with Google"}
            </Button>
      );
}
