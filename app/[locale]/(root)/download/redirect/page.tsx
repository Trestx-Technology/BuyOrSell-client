"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DownloadRedirect() {
  const router = useRouter();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    // Check for iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      window.location.href = "https://apps.apple.com/us/app/buyorsell-anything-in-uae/id6759313741";
    } 
    // Check for Android
    else if (/android/i.test(userAgent)) {
      // User said: "As the Play Store is not available, it should say 'Coming soon'."
      // We'll redirect them back to the download page with a status flag to show the dialog
      router.push("/download?status=coming-soon");
    } 
    // Fallback for Desktop or other devices
    else {
      router.push("/download");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
       <div className="size-16 border-4 border-purple-200 border-t-purple animate-spin rounded-full mb-6"></div>
       <h1 className="text-2xl font-bold mb-2">Identifying your device...</h1>
       <p className="text-gray-500">Redirecting you to the appropriate App Store.</p>
    </div>
  );
}
