"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, MapPin, Calendar, Bookmark, Phone, MoreHorizontal, Flag, UserX, AlertTriangle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";
import { Organization } from "@/interfaces/organization.types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChatInit } from "@/components/global/chat-init";
import { ProfilePlaceholder } from "@/components/global/profile-placeholder";
import { useAuthStore } from "@/stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportDialog from "../../../../ad/[adId]/_components/ReportDialog";
import { useBlockUser, useIsBlocked, useUnblockUser } from "@/hooks/useUserBlock";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { toast } from "sonner";

interface OrgMobileHeaderProps {
  organizationId: string;
  organization: Organization;
}

export default function OrgMobileHeader({
  organizationId,
  organization,
}: OrgMobileHeaderProps) {
  const { t } = useLocale();
  const currentUser = useAuthStore((s) => s.session.user);
  
  const ownerId = organization.owner?._id || "";
  const isOwner = currentUser?._id === ownerId;

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const { data: blockedData } = useIsBlocked(ownerId, !isOwner && !!ownerId);
  const isBlocked = blockedData?.data?.isBlocked ?? false;

  const { mutateAsync: blockUser, isPending: isBlocking } = useBlockUser();
  const { mutateAsync: unblockUser, isPending: isUnblocking } = useUnblockUser();

  const handleBlockUser = async () => {
    try {
      if (!ownerId) return;
      if (isBlocked) {
        await unblockUser(ownerId);
        toast.success(t.seller.actions.unblockSuccess);
      } else {
        await blockUser({ userId: ownerId, reason: "Blocked from org profile" });
        toast.success(t.seller.actions.blockSuccess);
      }
    } catch {
      toast.error(isBlocked ? t.seller.actions.unblockError : t.seller.actions.blockError);
    } finally {
      setIsBlockDialogOpen(false);
    }
  };

  const sellerName = organization.tradeName || organization.legalName;
  const rating = organization.ratingAvg || 0;
  const totalReviews = organization.ratingCount || 0;
  const location = [organization.city, organization.emirate]
    .filter(Boolean)
    .join(", ");
  const memberSince = format(new Date(organization.createdAt), "yyyy");
  const isTopRated = rating >= 4.5 && totalReviews >= 10;
  const avatar = organization.logoUrl;
  const verified = organization.verified || false;
  const hasPhone = !!organization.contactPhone;

  const handleCall = () => {
    if (hasPhone) window.location.href = `tel:${organization.contactPhone}`;
  };

  const handleWhatsApp = () => {
    if (hasPhone) {
      const phone = organization.contactPhone!;
      const cleanPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-t-xl border border-gray-200 dark:border-slate-800 shadow-sm -mt-5 relative z-20 transition-all">
      <div className="flex items-start p-4 gap-4">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-[74px] h-[74px] rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 ring-2 ring-white dark:ring-slate-900 shadow-sm">
            {avatar ? (
              <Image
                src={avatar}
                alt={sellerName}
                width={74}
                height={74}
                className="w-full h-full object-cover"
              />
            ) : (
              <ProfilePlaceholder size={40} />
            )}
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              <div className="w-4 h-4 bg-purple rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Typography
                variant="sm-black-inter"
                className="font-semibold text-black dark:text-white truncate"
              >
                {sellerName}
              </Typography>

              {!isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-1 text-grey-blue hover:text-dark-blue hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[1001] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-xl p-1.5">
                    <DropdownMenuItem 
                      onClick={() => setIsReportDialogOpen(true)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                    >
                      <Flag className="w-4 h-4 text-orange-500" />
                      {t.seller.actions.reportOrganization}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsBlockDialogOpen(true)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
                    >
                      <UserX className="w-4 h-4" />
                      {isBlocked ? t.seller.actions.unblockUser : t.seller.actions.blockUser}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex items-center gap-3">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <Typography variant="xs-black-inter" className="text-dark-blue dark:text-white font-medium">
                    {rating.toFixed(1)}/5
                  </Typography>
                </div>
              )}
              {isTopRated && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple/10 dark:bg-purple-900/30 rounded-lg">
                  <Bookmark className="w-3 h-3 text-purple dark:text-purple-400" />
                  <Typography
                    variant="xs-black-inter"
                    className="text-purple dark:text-purple-400 font-semibold text-[10px]"
                  >
                    {t.seller.header.topRated}
                  </Typography>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-gray-500 dark:text-slate-400 flex-shrink-0" />
                  <Typography
                    variant="xs-black-inter"
                    className="text-dark-blue dark:text-slate-300 font-medium"
                  >
                    {location}
                  </Typography>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-500 dark:text-slate-400 flex-shrink-0" />
                <Typography variant="xs-black-inter" className="text-dark-blue dark:text-slate-300 font-medium">
                  {t.seller.header.memberSince} {memberSince}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <ChatInit
          type="organisation"
          sellerId={organizationId}
          organisationId={organizationId}
          sellerName={sellerName}
          sellerImage={avatar}
          variant="primary"
          showLabel
          label="Chat with us"
          className="w-full bg-purple text-white h-10 rounded-xl font-semibold text-sm"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleCall}
            variant="outline"
            disabled={!hasPhone}
            icon={
              <Phone
                className={`h-4 w-4 ${hasPhone ? "text-dark-blue dark:text-white" : "text-gray-300 dark:text-slate-600"}`}
              />
            }
            iconPosition="left"
            className={`flex-1 h-9 text-sm rounded-lg ${
              hasPhone
                ? "text-dark-blue dark:text-white border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50"
                : "opacity-40 cursor-not-allowed bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800"
            }`}
          >
            {t.seller.header.callSeller}
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            disabled={!hasPhone}
            icon={
              <FaWhatsapp
                className={`h-4 w-4 ${hasPhone ? "text-green-500" : "text-gray-300 dark:text-slate-600"}`}
              />
            }
            iconPosition="left"
            className={`flex-1 h-9 text-sm rounded-lg ${
              hasPhone
                ? "text-dark-blue dark:text-white border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50"
                : "opacity-40 cursor-not-allowed bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800"
            }`}
          >
            {t.seller.header.whatsapp}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        reportedId={organizationId}
        reportedType="organization"
      />

      <WarningConfirmationDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        onConfirm={handleBlockUser}
        title={isBlocked ? t.seller.actions.unblockUser : t.seller.actions.blockUser}
        description={isBlocked ? "Are you sure you want to unblock this organization?" : t.seller.actions.confirmBlockDescription}
        confirmText={isBlocked ? "Unblock" : "Block"}
        cancelText="Cancel"
        isLoading={isBlocking || isUnblocking}
      />
    </div>
  );
}
