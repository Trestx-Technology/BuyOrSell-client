"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useGetUserById } from "@/hooks/useUsers";
import { Typography } from "@/components/typography";
import { Container1080 } from "@/components/layouts/container-1080";
import { Camera, ImageOff } from "lucide-react";
import UserHeader from "./UserHeader";
import UserMobileHeader from "./UserMobileHeader";
import UserReviews from "./UserReviews";
import UserListings from "./UserListings";
import { useAuthStore } from "@/stores/authStore";
import { useUploadAdImages } from "@/hooks/useAds";
import { updateUser } from "@/app/api/user/user.services";
import { toast } from "sonner";

const UserSellerContent: React.FC = () => {
  const { id } = useParams();
  const userId = id as string;
  const currentUser = useAuthStore((s) => s.session.user);
  const isOwner = currentUser?._id === userId;
  const mobileBannerRef = useRef<HTMLInputElement>(null);
  const [localMobileBanner, setLocalMobileBanner] = useState<string | undefined>(undefined);
  const [isUploadingMobileBanner, setIsUploadingMobileBanner] = useState(false);
  const uploadImages = useUploadAdImages();

  const handleMobileBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    try {
      setIsUploadingMobileBanner(true);
      const res = await uploadImages.mutateAsync([file]);
      const url = res.data?.urls?.[0];
      if (url) {
        setLocalMobileBanner(url);
        await updateUser(currentUser._id, { bannerUrl: url } as any);
        toast.success("Banner updated!");
      }
    } catch {
      toast.error("Failed to upload banner.");
    } finally {
      setIsUploadingMobileBanner(false);
      if (mobileBannerRef.current) mobileBannerRef.current.value = "";
    }
  };

  const { data: userData, isLoading } = useGetUserById(userId);

  if (isLoading) {
    return (
      <Container1080 className="relative dark:bg-slate-950 transition-colors">
        <div className="pb-6 md:py-6">
          <div className="animate-pulse space-y-8">
            <div className="bg-gray-200 dark:bg-slate-800 h-40 rounded-2xl" />
            <div className="bg-gray-200 dark:bg-slate-800 h-64 rounded-xl" />
            <div className="bg-gray-200 dark:bg-slate-800 h-48 rounded-xl" />
          </div>
        </div>
      </Container1080>
    );
  }

  const { user } = userData?.data || {};

  if (!user) {
    return (
      <div className="bg-[#F9FAFC] dark:bg-slate-950 relative min-h-screen transition-colors">
        <div className="pb-6 md:py-6 text-center">
          <div className="max-w-md mx-auto py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Typography variant="h2" className="text-gray-400 dark:text-slate-600">
                ?
              </Typography>
            </div>
            <Typography variant="h2" className="text-dark-blue dark:text-white mb-2">
              User Not Found
            </Typography>
            <Typography variant="body" className="text-grey-blue dark:text-slate-400">
              The user profile you&apos;re looking for doesn&apos;t exist or has been removed.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container1080 className="relative bg-[#FDFDFF] dark:bg-slate-950 transition-colors">
      <div className="pb-6 md:py-6">
        {/* Desktop Header */}
        <div className="hidden sm:block">
          <UserHeader userId={userId} user={user} />
        </div>

        {/* Mobile Header */}
        <div className="block sm:hidden -mx-4">
          <div className="relative h-40 overflow-hidden">
            {localMobileBanner || (userData?.data?.user as any)?.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={localMobileBanner ?? (userData?.data?.user as any)?.bannerUrl}
                alt="Banner"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-2">
                <ImageOff className="w-7 h-7 text-gray-400 dark:text-slate-600" />
                <Typography variant="body" className="text-xs text-gray-400 dark:text-slate-500">
                  No banner uploaded
                </Typography>
              </div>
            )}
            {isOwner && (
              <>
                <input
                  ref={mobileBannerRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMobileBannerUpload}
                />
                <button
                  onClick={() => mobileBannerRef.current?.click()}
                  disabled={isUploadingMobileBanner}
                  className="absolute bottom-2 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-all"
                >
                  <Camera className="w-3 h-3" />
                  {isUploadingMobileBanner ? "Uploading…" : "Update Banner"}
                </button>
              </>
            )}
          </div>
          <UserMobileHeader userId={userId} user={user} />
        </div>

        {/* Content */}
        <div className="mt-8 space-y-8">
          {/* Reviews */}
          <UserReviews userId={userId} user={user} />

          {/* Listings */}
          <UserListings userId={userId} user={user} />
        </div>
      </div>
    </Container1080>
  );
};

export default UserSellerContent;
