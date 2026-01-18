"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface AuthGuardProps {
      children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
      const router = useRouter();
      const searchParams = useSearchParams();
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

      useEffect(() => {
            // Check if we're on the client side and have restored auth state
            // We use a small timeout to allow Zustand persist to rehydrate if needed
            // though usually it's synchronous after mount for localStorage
            const checkAuth = () => {
                  if (isAuthenticated) {
                        const redirectUrl = searchParams.get("redirect");
                        const targetUrl = redirectUrl ? decodeURIComponent(redirectUrl) : "/";
                        router.push(targetUrl);
                  }
            };

            checkAuth();
      }, [isAuthenticated]);

      // If authenticated, render nothing while redirecting
      if (isAuthenticated) {
            return null;
      }

      // Optional: You could render a loader here if strict non-flashing is required
      // but for "already logged in" checks, usually rendering the form briefly is fine
      // or rendering nothing until we are sure they are NOT logged in.
      // Here we render nothing if we think they might be logged in (optimistic)
      // or just render children if we are sure they are not.

      // To avoid hydration mismatch, strictly we render children, 
      // but the useEffect will redirect if needed.

      return <>{children}</>;
};
