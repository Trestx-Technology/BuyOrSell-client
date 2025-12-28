"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

export default function NoInternetPage() {
  const router = useRouter();
  const { t, localePath } = useLocale();
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Initial check
    checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, []);

  // Auto-redirect when connection is restored
  useEffect(() => {
    if (isOnline) {
      // Wait a moment to ensure connection is stable
      const timer = setTimeout(() => {
        router.back();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, router]);

  const handleRetry = async () => {
    setIsChecking(true);

    try {
      // Try to fetch a small resource from the backend to verify connection
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const response = await fetch(`${backendUrl}/categories`, {
        method: "HEAD",
        cache: "no-cache",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok || response.status === 401) {
        // Connection is working (401 means server is reachable, just not authenticated)
        router.back();
      } else {
        throw new Error("Connection test failed");
      }
    } catch (error) {
      // Still no connection, refresh the page
      window.location.reload();
    } finally {
      setIsChecking(false);
    }
  };

  const handleGoHome = () => {
    router.push(localePath("/"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gray-100 p-6">
            <WifiOff className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t.common.noInternet.title}
        </h1>

        <p className="text-gray-600 mb-8">{t.common.noInternet.description}</p>

        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            disabled={isChecking}
            variant="primary"
            className="w-full"
          >
            {isChecking ? (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t.common.noInternet.checkingConnection}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.common.noInternet.tryAgain}
              </div>
            )}
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            {t.common.noInternet.goToHome}
          </Button>
        </div>

        {isOnline && (
          <p className="mt-4 text-sm text-green-600">
            {t.common.noInternet.connectionRestored}
          </p>
        )}
      </div>
    </div>
  );
}

