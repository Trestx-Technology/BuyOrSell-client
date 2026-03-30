"use client";

import React, { useRef, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone, BookmarkCheck, Camera, ImageOff, MoreVertical, Flag, UserX, AlertTriangle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import { ICONS } from "@/constants/icons";
import { User } from "@/interfaces/user.types";
import { formatDate } from "@/utils/format-date";
import { ProfilePlaceholder } from "@/components/global/profile-placeholder";
import { ChatInit } from "@/components/global/chat-init";
import { useAuthStore } from "@/stores/authStore";
import { useUploadAdImages } from "@/hooks/useAds";
import { updateUser } from "@/app/api/user/user.services";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportDialog from "../../../../ad/[adId]/_components/ReportDialog";
import { useBlockUser, useIsBlocked, useUnblockUser } from "@/hooks/useUserBlock";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";

interface UserHeaderProps {
  userId: string;
  user: User;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId, user }) => {
  const { t } = useLocale();
  const currentUser = useAuthStore((s) => s.session.user);
  const isOwner = currentUser?._id === userId;
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [localBanner, setLocalBanner] = useState<string | undefined>(undefined);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const uploadImages = useUploadAdImages();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const { data: blockedData } = useIsBlocked(userId, !isOwner);
  const isBlocked = blockedData?.data?.isBlocked ?? false;

  const { mutateAsync: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutateAsync: unblockUser, isPending: isUnblocking } = useUnblockUser();

  const sellerName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.name ||
    "Seller";
  const avatar = user.image;
  const bannerUrl = localBanner ?? (user as any).bannerUrl;
  const isVerified = user.isVerified || false;

  const hasPhone = !!user.phoneNo;

  const handleCall = () => {
    if (hasPhone) window.location.href = `tel:${user.phoneNo}`;
  };

  const handleWhatsApp = () => {
    if (hasPhone) {
      const full = `${user.countryCode || ""}${user.phoneNo}`.replace(/\D/g, "");
      window.open(`https://wa.me/${full}`, "_blank");
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    try {
      setIsUploadingBanner(true);
      const res = await uploadImages.mutateAsync([file]);
      const url = res.data?.urls?.[0];
      if (url) {
        setLocalBanner(url);
        await updateUser(currentUser._id, { bannerUrl: url } as any);
        toast.success("Banner updated!");
      }
    } catch {
      toast.error("Failed to upload banner.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleBlockUser = async () => {
    try {
      if (isBlocked) {
        await unblockUser(userId);
        toast.success(t.seller.actions.unblockSuccess);
      } else {
        await blockUser({ userId, reason: "Blocked from profile" });
        toast.success(t.seller.actions.blockSuccess);
      }
    } catch {
      toast.error(isBlocked ? t.seller.actions.unblockError : t.seller.actions.blockError);
    } finally {
      setIsBlockDialogOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative rounded-t-3xl h-48 overflow-hidden group">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt="Seller banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-8 h-8 text-gray-400 dark:text-slate-600" />
            <Typography variant="body" className="text-sm text-gray-400 dark:text-slate-500">
              No banner uploaded
            </Typography>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Owner upload button */}
        {isOwner && (
          <>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploadingBanner}
              className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-white text-xs font-medium rounded-lg backdrop-blur-md transition-all border border-white/10"
            >
              <Camera className="w-3.5 h-3.5" />
              {isUploadingBanner ? "Uploading…" : "Update Banner"}
            </button>
          </>
        )}

        {/* More button (Report/Block) - top right of banner */}
        {!isOwner && (
          <div className="absolute top-4 right-4 z-10 hidden lg:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 bg-black/20 hover:bg-black/40 text-white border border-white/10 backdrop-blur-md rounded-full transition-all">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-gray-100 dark:border-slate-800 shadow-2xl rounded-2xl p-1.5 animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenuItem 
                  onClick={() => setIsReportDialogOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                >
                  <Flag className="w-4 h-4 text-orange-500" />
                  {t.seller.actions.reportUser}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsBlockDialogOpen(true)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer transition-colors"
                >
                  <UserX className="w-4 h-4" />
                  {isBlocked ? t.seller.actions.unblockUser : t.seller.actions.blockUser}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Glassmorphism card */}
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 rounded-b-3xl -mt-2 transition-all">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple/20 blur-2xl rounded-full" />
              <div className="relative w-32 h-32 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-xl bg-gray-200 dark:bg-slate-800 overflow-hidden transition-transform hover:scale-105">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={sellerName}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ProfilePlaceholder size={80} />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {/* Name + Verified */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Typography variant="h2" className="text-xl font-bold text-dark-blue dark:text-white">
                  {sellerName}
                </Typography>
                {isVerified && (
                  <Image
                    src={ICONS.auth.verified}
                    alt="Verified"
                    width={20}
                    height={20}
                  />
                )}
                {isVerified && (
                  <div className="flex items-center gap-1 h-7 px-3 text-purple dark:text-purple-400 bg-purple/10 dark:bg-purple-900/30 rounded-lg text-xs font-semibold">
                    <BookmarkCheck size={14} />
                    Verified
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-3.5 h-3.5 text-grey-blue dark:text-slate-400" />
                  <Typography variant="body" className="text-sm text-dark-blue dark:text-slate-300">
                    UAE
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="w-3.5 h-3.5 text-grey-blue dark:text-slate-400" />
                  <Typography variant="body" className="text-sm text-dark-blue dark:text-slate-300">
                    {t.seller.header.memberSince} {formatDate(user.createdAt)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
            {/* Chat */}
            <ChatInit
              type="dm"
              sellerId={userId}
              sellerName={sellerName}
              sellerImage={avatar}
              variant="primary"
              showLabel
              label="Chat"
              className="w-full bg-gradient-to-r from-purple to-blue-600 hover:opacity-90 text-white h-12 rounded-xl font-bold text-base shadow-lg hover:shadow-purple/30 transition-all"
            />

            {/* Call + WhatsApp */}
            <div className="flex gap-3 w-full">
              <div className="flex-1 min-w-0">
                <Button
                  onClick={handleCall}
                  variant="outline"
                  disabled={!hasPhone}
                  icon={
                    <Phone
                      className={`h-4 w-4 ${hasPhone ? "text-dark-blue" : "text-gray-300"}`}
                    />
                  }
                  iconPosition="left"
                  className={`w-full border-gray-200 dark:border-slate-800 h-11 font-semibold rounded-xl transition-all ${
                    hasPhone
                      ? "bg-white/50 dark:bg-slate-800/50 backdrop-blur hover:bg-gray-50 dark:hover:bg-slate-700 text-dark-blue dark:text-white"
                      : "bg-gray-50 dark:bg-slate-900 text-gray-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  {t.seller.header.callSeller}
                </Button>
              </div>

              <div className="flex-1 min-w-0">
                <Button
                  onClick={handleWhatsApp}
                  variant="outline"
                  disabled={!hasPhone}
                  icon={
                    <FaWhatsapp
                      className={`h-5 w-5 ${hasPhone ? "text-green-500" : "text-gray-300"}`}
                    />
                  }
                  iconPosition="left"
                  className={`w-full border-gray-200 dark:border-slate-800 h-11 font-semibold rounded-xl transition-all ${
                    hasPhone
                      ? "bg-white/50 dark:bg-slate-800/50 backdrop-blur hover:bg-green-50 dark:hover:bg-green-950/20 text-dark-blue dark:text-white"
                      : "bg-gray-50 dark:bg-slate-900 text-gray-300 dark:text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  {t.seller.header.whatsapp}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        reportedId={userId}
        reportedType="user"
      />

      <WarningConfirmationDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        onConfirm={handleBlockUser}
        title={isBlocked ? t.seller.actions.unblockUser : t.seller.actions.blockUser}
        description={isBlocked ? "Are you sure you want to unblock this user?" : t.seller.actions.confirmBlockDescription}
        confirmText={isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
        isLoading={isBlocking || isUnblocking}
      />
    </div>
  );
};

export default UserHeader;
