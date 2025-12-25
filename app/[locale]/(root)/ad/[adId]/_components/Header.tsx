"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Heart, ChevronLeft, Share2 } from "lucide-react";
import { AD } from "@/interfaces/ad";
import { useGetCollectionsByAd } from "@/hooks/useCollections";
import { useAuthStore } from "@/stores/authStore";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";
import { CollectionManager } from "@/components/global/collection-manager";
import { ShareDialog } from "@/components/ui/share-dialog";
import { useLocale } from "@/hooks/useLocale";

interface HeaderProps {
  ad: AD;
}

const Header: React.FC<HeaderProps> = ({ ad }) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { t } = useLocale();

  // Check if ad is in any collection using the collection manager
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(ad._id);
  const isAdInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;

  const handleBack = () => {
    router.back();
  };

  // Get current URL for sharing
  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  }, []);

  const shareDescription = ad.description || ad.title;

  const handleSave = () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
    }
  };

  const handleCollectionSuccess = () => {
    // Collection operation completed successfully
    console.log("Collection operation completed");
  };

  return (
    <div className="flex items-center justify-between py-3 sm:mt-4 px-4 xl:px-0 relative">
      {/* Left side - Back button */}
      <button
        onClick={handleBack}
        className="py-0 text-purple hover:font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">{t.ad.header.back}</span>
      </button>

      {/* Right side - Share and Save */}
      <div className="hidden sm:flex items-center gap-2 z-10 sm:gap-4">
        <ShareDialog
          url={shareUrl}
          title={ad.title}
          description={shareDescription}
        >
          <button className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110">
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium sm:block hidden">
              {t.ad.header.share}
            </span>
          </button>
        </ShareDialog>

        {isAuthenticated ? (
          <CollectionManager
            itemId={ad._id}
            itemTitle={ad.title}
            itemImage={ad.images?.[0] || "/car-image.jpg"}
            onSuccess={handleCollectionSuccess}
          >
            <button
              className={`flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent transition-all cursor-pointer hover:scale-110 ${
                isAdInCollection
                  ? "text-purple hover:text-purple"
                  : "text-gray-600 hover:text-purple"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isAdInCollection ? "fill-purple text-purple" : ""
                }`}
              />
              <span className="text-sm font-medium sm:block hidden">
                {t.ad.header.save}
              </span>
            </button>
          </CollectionManager>
        ) : (
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent transition-all cursor-pointer hover:scale-110 ${
              isAdInCollection
                ? "text-purple hover:text-purple"
                : "text-gray-600 hover:text-purple"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isAdInCollection ? "fill-purple text-purple" : ""
              }`}
            />
            <span className="text-sm font-medium sm:block hidden">Save</span>
          </button>
        )}
      </div>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        redirectUrl={pathname}
        message="You need to be logged in to save ads to collections. Would you like to login?"
      />
    </div>
  );
};

export default Header;
