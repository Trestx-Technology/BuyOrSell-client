/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import { firebase } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useSocialLogin } from "@/hooks/useAuth";
import { loginResponse } from "@/interfaces/auth.types";
import { FaTwitter } from "react-icons/fa";

interface RenderPropParams {
      onClick: () => void;
      disabled: boolean;
      isLoading: boolean;
}

interface FirebaseTwitterLoginButtonProps {
      onSuccess: (data: loginResponse) => void | Promise<void>;
      onError?: (error: string) => void;
      onLoadingStart?: () => void;
      render?: (params: RenderPropParams) => React.ReactNode;
      className?: string;
      disabled?: boolean;
      children?: React.ReactNode;
}

export function FirebaseTwitterLoginButton({
      onSuccess,
      onError,
      onLoadingStart,
      render,
      className,
      disabled = false,
      children,
}: FirebaseTwitterLoginButtonProps) {
      const [isLoading, setIsLoading] = useState(false);
      const socialLoginMutation = useSocialLogin();

      const handleTwitterSignIn = async () => {
            try {
                  setIsLoading(true);
                  onLoadingStart?.();

                  const auth = firebase.getAuth();
                  const provider = new TwitterAuthProvider();

                  const result = await signInWithPopup(auth, provider);
                  const credential = TwitterAuthProvider.credentialFromResult(result);

                  if (!credential?.accessToken || !credential?.secret) {
                        throw new Error("Failed to get tokens from Twitter");
                  }

                  const nameParts = result.user.displayName?.split(" ") || ["", ""];
                  const firstName = nameParts[0] || "User";
                  const lastName = nameParts.slice(1).join(" ") || firstName;

                  const response = await socialLoginMutation.mutateAsync({
                        socialType: "twitter",
                        firstName,
                        lastName,
                        email: result.user.email || "",
                        verifyEmail: result.user.emailVerified,
                        image: result.user.photoURL || undefined,
                        countryCode: "+971",
                        deviceKey: await firebase.getFCMToken() || "web"
                  });

                  await onSuccess(response);
            } catch (error: any) {
                  console.error("Firebase Twitter Login Error:", error);

                  let errorMessage = "Twitter authentication failed";

                  if (error.code === "auth/popup-closed-by-user") {
                        errorMessage = "Sign-in popup was closed";
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
                              onClick: handleTwitterSignIn,
                              disabled: disabled || isLoading || socialLoginMutation.isPending,
                              isLoading: isLoading || socialLoginMutation.isPending,
                        })}
                  </div>
            );
      }

      return (
            <Button
                  onClick={handleTwitterSignIn}
                  disabled={disabled || isLoading || socialLoginMutation.isPending}
                  variant="outline"
                  className={cn(
                        "w-full h-12 flex items-center border-gray-200 justify-center gap-3 bg-white hover:bg-slate-100 text-slate-700",
                        className
                  )}
                  icon={<FaTwitter className="text-blue-500" />}
                  iconPosition="center"
                  isLoading={isLoading || socialLoginMutation.isPending}
            >

                  {children || "Continue with Twitter"}
            </Button>
      );
}
