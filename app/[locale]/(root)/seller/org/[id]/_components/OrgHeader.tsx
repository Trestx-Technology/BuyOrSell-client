"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone, BookmarkCheck, Globe, Users } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import { ICONS } from "@/constants/icons";
import { Organization } from "@/interfaces/organization.types";
import { formatDate } from "@/utils/format-date";
import { ProfilePlaceholder } from "@/components/global/profile-placeholder";
import { ChatInit } from "@/components/global/chat-init";

interface OrgHeaderProps {
  organizationId: string;
  organization: Organization;
}

const OrgHeader: React.FC<OrgHeaderProps> = ({
  organizationId,
  organization,
}) => {
  const { t } = useLocale();

  const sellerName = organization.tradeName || organization.legalName;
  const avatar = organization.logoUrl;
  const rating = organization.ratingAvg || 0;
  const reviewCount = organization.ratingCount || 0;
  const location = [
    organization.city,
    organization.emirate,
    organization.country,
  ]
    .filter(Boolean)
    .join(", ");
  const isVerified = organization.verified || false;
  const isTopRated = rating >= 4.5 && reviewCount >= 10;
  const bannerImage =
    organization.coverImageUrl ||
    "https://dev-buyorsell.s3.me-central-1.amazonaws.com/banners/seller-banner.png";

  const hasPhone = !!organization.contactPhone;
  const hasEmail = !!organization.contactEmail;

  const handleCall = () => {
    if (hasPhone) {
      window.location.href = `tel:${organization.contactPhone}`;
    }
  };

  const handleWhatsApp = () => {
    if (hasPhone) {
      const phone = organization.contactPhone!;
      const cleanPhone = phone.startsWith("+")
        ? phone.replace(/\D/g, "")
        : phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 0L12.5 6.5L20 7.5L15 12.5L16.5 20L10 16.5L3.5 20L5 12.5L0 7.5L7.5 6.5L10 0Z"
            fill="#FFC107"
          />
        </svg>,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="18" height="18" viewBox="0 0 20 20" fill="none">
          <defs>
            <linearGradient id="halfStarOrg">
              <stop offset="50%" stopColor="#FFC107" />
              <stop offset="50%" stopColor="rgba(255,193,7,0.25)" />
            </linearGradient>
          </defs>
          <path
            d="M10 0L12.5 6.5L20 7.5L15 12.5L16.5 20L10 16.5L3.5 20L5 12.5L0 7.5L7.5 6.5L10 0Z"
            fill="url(#halfStarOrg)"
            stroke="#FFC107"
          />
        </svg>,
      );
    }
    return stars;
  };

  const orgTypeLabel =
    organization.type === "AGENCY"
      ? "Real Estate Agency"
      : organization.type === "DEALER"
        ? "Car Dealer"
        : organization.type || "Business";

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative rounded-t-3xl h-48 overflow-hidden group">
        <Image
          src={bannerImage}
          alt="Organization banner"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {/* Org type badge on banner */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
            {orgTypeLabel}
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-8 rounded-b-3xl -mt-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-8">
          {/* Left: Logo + Details */}
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-purple/20 blur-2xl rounded-full" />
              <div className="relative w-28 h-28 rounded-2xl ring-4 ring-white shadow-xl bg-gray-100 overflow-hidden transition-transform hover:scale-105">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={sellerName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ProfilePlaceholder size={70} />
                )}
              </div>
            </div>

            {/* Org Details */}
            <div className="flex-1 min-w-0">
              {/* Name + Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Typography
                  variant="h2"
                  className="text-xl font-bold text-dark-blue"
                >
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
                {isTopRated && (
                  <div className="flex items-center gap-1 h-7 px-3 text-purple bg-purple/10 rounded-lg text-xs font-semibold">
                    <BookmarkCheck size={14} />
                    {t.seller.header.topRated}
                  </div>
                )}
              </div>

              {/* Legal name if different */}
              {organization.legalName &&
                organization.legalName !== sellerName && (
                  <Typography
                    variant="body"
                    className="text-xs text-grey-blue mb-2"
                  >
                    {organization.legalName}
                  </Typography>
                )}

              {/* Meta row */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2">
                {/* Rating */}
                {rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {renderStars(rating)}
                    </div>
                    <Typography
                      variant="body"
                      className="text-sm text-dark-blue font-medium"
                    >
                      {rating.toFixed(1)}{" "}
                      <span className="text-grey-blue font-normal">
                        ({reviewCount} {t.seller.header.reviews})
                      </span>
                    </Typography>
                  </div>
                )}

                {/* Location */}
                {location && (
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-grey-blue" />
                    <Typography
                      variant="body"
                      className="text-sm text-dark-blue"
                    >
                      {location}
                    </Typography>
                  </div>
                )}

                {/* Member since */}
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="w-3.5 h-3.5 text-grey-blue" />
                  <Typography variant="body" className="text-sm text-dark-blue">
                    {t.seller.header.memberSince}{" "}
                    {formatDate(organization.createdAt)}
                  </Typography>
                </div>

                {/* Followers */}
                {(organization.followersCount ?? 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-grey-blue" />
                    <Typography
                      variant="body"
                      className="text-sm text-dark-blue"
                    >
                      {organization.followersCount} followers
                    </Typography>
                  </div>
                )}

                {/* Website */}
                {organization.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-grey-blue" />
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {organization.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
            {/* Chat - always available */}
            <ChatInit
              type="organisation"
              sellerId={organizationId}
              organisationId={organizationId}
              sellerName={sellerName}
              sellerImage={avatar}
              variant="primary"
              showLabel
              label={"Chat with us"}
              className="w-full bg-purple hover:opacity-90 text-white h-12 rounded-xl font-bold text-base shadow-lg hover:shadow-purple/30 transition-all"
            />

            {/* Call + WhatsApp row */}
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
                  className={`w-full border-gray-200 h-11 font-semibold rounded-xl transition-all ${
                    hasPhone
                      ? "bg-white/50 backdrop-blur hover:bg-gray-50 text-dark-blue"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
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
                  className={`w-full border-gray-200 h-11 font-semibold rounded-xl transition-all ${
                    hasPhone
                      ? "bg-white/50 backdrop-blur hover:bg-green-50 text-dark-blue"
                      : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"
                  }`}
                >
                  {t.seller.header.whatsapp}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgHeader;
