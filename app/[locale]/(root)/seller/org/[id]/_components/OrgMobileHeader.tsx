"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, MapPin, Calendar, Bookmark, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";
import { Organization } from "@/interfaces/organization.types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChatInit } from "@/components/global/chat-init";
import { ProfilePlaceholder } from "@/components/global/profile-placeholder";

interface OrgMobileHeaderProps {
  organizationId: string;
  organization: Organization;
}

export default function OrgMobileHeader({
  organizationId,
  organization,
}: OrgMobileHeaderProps) {
  const { t } = useLocale();

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
          <div className="w-[74px] h-[74px] rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
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
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-purple rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Typography
                variant="sm-black-inter"
                className="font-semibold text-black dark:text-white truncate"
              >
                {sellerName}
              </Typography>
              {verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded flex-shrink-0">
                  <div className="w-3 h-3 bg-purple rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <Typography variant="xs-black-inter" className="text-dark-blue dark:text-white font-medium">
                  {rating.toFixed(1)}/5
                </Typography>
                <Typography
                  variant="xs-black-inter"
                  className="text-purple dark:text-purple-400 ml-1 font-semibold"
                >
                  ({totalReviews} {t.seller.reviews.title})
                </Typography>
              </div>
            )}

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

        {isTopRated && (
          <div className="flex items-center gap-1 px-2 py-1 bg-purple/10 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
            <Bookmark className="w-3 h-3 text-purple dark:text-purple-400" />
            <Typography
              variant="xs-black-inter"
              className="text-purple dark:text-purple-400 font-semibold text-xs"
            >
              {t.seller.header.topRated}
            </Typography>
          </div>
        )}
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
    </div>
  );
}
