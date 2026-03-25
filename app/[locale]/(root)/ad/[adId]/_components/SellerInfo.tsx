import React, { useState } from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, CircleUser, Building2, Flag } from "lucide-react";
import Link from "next/link";
import { AD } from "@/interfaces/ad";
import { format } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { ICONS } from "@/constants/icons";
import { toast } from "sonner";
import { ProfilePlaceholder } from "@/components/global/profile-placeholder";
import ReportDialog from "./ReportDialog";

interface SellerInfoProps {
  ad: AD;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ ad }) => {
  const { t, localePath } = useLocale();
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // Extract seller data from ad
  const sellerName =
    ad.owner?.firstName || ad.owner?.lastName
      ? `${ad.owner?.firstName || ""} ${ad.owner?.lastName || ""}`.trim()
      : "Seller";

  // If there's a specific verification mark for individual users, insert it here.
  const isVerified = false; 
  const sellerType = t.ad.sellerInfo.privateSeller;

  const avatarUrl = ad.owner?.image || null;
  const hasAvatar = !!avatarUrl;

  const location =
    typeof ad.location === "string"
      ? ad.location
      : ad.location?.city ||
        ad.address?.city ||
        t.ad.sellerInfo.locationNotSpecified;

  const memberSince = ad.owner?.createdAt
    ? format(new Date(ad.owner.createdAt), "yyyy")
    : t.ad.sellerInfo.notAvailable;

  const sellerId = ad.owner?._id || "";

  // Target the individual user seller route regardless of organization
  const sellerRoute = `/seller/user/${sellerId}`;

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsReportDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 group rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm relative block w-full hover:border-purple/50 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <Typography
            variant="h3"
            className="text-lg font-semibold text-dark-blue dark:text-gray-100"
          >
            {t.ad.sellerInfo.title}
          </Typography>
          <button
            onClick={handleReportClick}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 z-10 relative cursor-pointer"
            title="Report Seller"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        <Link href={localePath(sellerRoute)} className="block">
          {/* Seller Profile */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
              {hasAvatar ? (
                <Image
                  src={avatarUrl}
                  alt={sellerName}
                  width={40}
                  height={40}
                  className="rounded-full aspect-square object-cover"
                />
              ) : (
                <ProfilePlaceholder size={24} />
              )}
            </div>
            <div>
              <Typography
                variant="sm-medium"
                className="font-semibold flex items-center gap-2 text-dark-blue dark:text-gray-100"
              >
                {sellerName}
                {isVerified && (
                  <Image
                    src={ICONS.auth.verified}
                    alt="verified"
                    width={21}
                    height={21}
                  />
                )}
              </Typography>
              <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
                {sellerType}
              </Typography>
            </div>
          </div>

          {/* Seller Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
                {t.ad.sellerInfo.location}
              </Typography>
              <Typography variant="sm-medium" className="text-dark-blue dark:text-gray-100">
                {location}
              </Typography>
            </div>

            <div className="flex items-center justify-between">
              <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
                {t.ad.sellerInfo.memberSince}
              </Typography>
              <Typography variant="sm-medium" className="text-dark-blue dark:text-gray-100">
                {memberSince}
              </Typography>
            </div>
          </div>
        </Link>
      </div>

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        reportedId={sellerId}
        reportedType="user"
      />
    </>
  );
};

export default SellerInfo;

