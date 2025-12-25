import { useCallback } from "react";
import { useLocale } from "./useLocale";

interface ShareData {
  title: string;
  url: string;
  text?: string;
}

interface UseShareReturn {
  share: (adId: string, title: string) => Promise<void>;
  canShare: boolean;
  isSupported: boolean;
}

/**
 * Hook for sharing content using the browser's native share API
 * Falls back to clipboard copy if native sharing is not available
 */
export const useShare = (): UseShareReturn => {
  const { locale } = useLocale();

  // Check if Web Share API is supported
  const isSupported = typeof navigator !== "undefined" && "share" in navigator;

  // Check if we can share (has required data)
  const canShare = isSupported;

  const share = useCallback(
    async (adId: string, title: string): Promise<void> => {
      try {
        // Construct the ad URL
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const adUrl = `${baseUrl}/${locale}/ad/${adId}`;

        const shareData: ShareData = {
          title: `Check out this ad: ${title}`,
          url: adUrl,
          text: `Found this interesting ad on BuyOrSell: ${title}`,
        };

        if (isSupported) {
          // Use native share API
          await navigator.share({
            title: shareData.title,
            url: shareData.url,
            text: shareData.text,
          });
          // Native share completed successfully
          console.log("Ad shared successfully");
        } else {
          // Fallback: Copy to clipboard
          const shareText = `${shareData.title}\n${shareData.url}`;

          if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            await navigator.clipboard.writeText(shareText);
            // Show success feedback (you can integrate with your toast system here)
            if (typeof window !== "undefined") {
              // Simple alert for now - replace with your toast system
              alert("Link copied to clipboard!");
            }
          } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = shareText;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
              document.execCommand("copy");
              if (typeof window !== "undefined") {
                alert("Link copied to clipboard!");
              }
            } catch (err) {
              console.error("Failed to copy link:", err);
              if (typeof window !== "undefined") {
                alert("Failed to copy link. Please try again.");
              }
            } finally {
              document.body.removeChild(textArea);
            }
          }
        }
      } catch (error) {
        // User cancelled share or error occurred
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    },
    [isSupported, locale]
  );

  return {
    share,
    canShare,
    isSupported,
  };
};
