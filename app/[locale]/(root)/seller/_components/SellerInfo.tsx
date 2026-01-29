"use client";

import React from "react";
import { Typography } from "@/components/typography";
import {
  Star,
  FileText,
  CheckCircle,
  Users,
  Clock,
  Shield,
  MapPin,
  Globe,
  Tag,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

import { Organization } from "@/interfaces/organization.types";
import { User } from "@/interfaces/user.types";

interface SellerInfoProps {
  sellerId: string;
  organization?: Organization;
  user?: User;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ organization, user }) => {
  const { t } = useLocale();

  const isOrganization = !!organization;
  const trustScore = organization?.ratingAvg || 0;
  const reviewCount = organization?.ratingCount || 0;

  // Get stats from organization or user data
  const sellerStats = {
    trustScore,
    reviewCount,
    // TODO: Get responseRate from API
    // responseRate: 98,
    // TODO: Get responseTime from API
    // responseTime: "< 2 hours",
    totalAds: organization?.totalAds || 0,
    activeListings: organization?.activeAds || 0,
    totalReviews: reviewCount,
    // TODO: Get responseTimeStat from API
    // responseTimeStat: "< 2 hours",
  };

  // TODO: Get actual rating breakdown from API
  // const ratingBreakdown = [
  //   { stars: 5, count: Math.floor(reviewCount * 0.7), percentage: 70 },
  //   { stars: 4, count: Math.floor(reviewCount * 0.2), percentage: 20 },
  //   { stars: 3, count: Math.floor(reviewCount * 0.05), percentage: 5 },
  //   { stars: 2, count: Math.floor(reviewCount * 0.03), percentage: 3 },
  //   { stars: 1, count: Math.floor(reviewCount * 0.02), percentage: 2 },
  // ];
  const ratingBreakdown: Array<{
    stars: number;
    count: number;
    percentage: number;
  }> = [];

  const safetyFeatures = [];
  if (organization?.verified) {
    safetyFeatures.push(t.seller.info.verifiedBusinessLicense);
  }
  if (organization || user?.isVerified) {
    safetyFeatures.push(t.seller.info.identityVerified);
  }
  if (user?.phoneVerified) {
    safetyFeatures.push(t.seller.info.phoneNumberVerified);
  }
  if (isOrganization) {
    safetyFeatures.push(t.seller.info.professionalDealer);
  }

  const languages = organization?.languages || [];
  const certifications =
    organization?.certificates?.map((cert) => cert.name) || [];
  const businessHours = organization?.businessHours || [];
  const website = organization?.website;
  const locations = organization?.locations || [];
  const tags = organization?.tags || [];
  const brands = organization?.brands || [];
  const address = organization
    ? [
        organization.addressLine1,
        organization.addressLine2,
        organization.city,
        organization.emirate,
        organization.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;
  const contactInfo = organization
    ? {
        name: organization.contactName,
        email: organization.contactEmail,
        phone: organization.contactPhone,
      }
    : null;
  const reraNumber = organization?.reraNumber;
  const tradeLicenseNumber = organization?.tradeLicenseNumber;

  // Format business hours for display
  const formatBusinessHours = () => {
    if (!businessHours || businessHours.length === 0) return null;

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const formatTime = (time: string) => {
      // Convert 24h format (HH:mm) to 12h format
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      if (isNaN(hour)) return time;
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return businessHours
      .map((bh) => {
        const dayIndex =
          typeof bh.day === "number"
            ? bh.day - 1
            : parseInt(String(bh.day), 10) - 1;
        const dayName = dayNames[dayIndex] || `Day ${bh.day}`;
        if (bh.close || (bh as any).closed) {
          return `${dayName}: Closed`;
        }
        if (bh.allDay) {
          return `${dayName}: Open 24 hours`;
        }
        if (bh.open && bh.close) {
          return `${dayName}: ${formatTime(bh.open)} - ${formatTime(bh.close)}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const formattedBusinessHours = formatBusinessHours();

  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const starSize = size === "large" ? "h-6 w-6" : "h-4 w-4";
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seller Statistics */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Typography
              variant="h3"
              className="text-base font-semibold text-dark-blue mb-6"
            >
              {t.seller.info.sellerStatistics}
            </Typography>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Ads */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <FileText className="h-10 w-10 text-blue-600" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.totalAds}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center"
                >
                  {t.seller.info.totalAds}
                </Typography>
              </div>

              {/* Active Listings */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.activeListings}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center"
                >
                  {t.seller.info.activeListings}
                </Typography>
              </div>

              {/* Total Reviews */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Star className="h-10 w-10 text-yellow-500 fill-current" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.totalReviews}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center"
                >
                  {t.seller.info.totalReviews}
                </Typography>
              </div>

              {/* Response Time */}
              {/* TODO: Get responseTimeStat from API - currently commented out */}
              {/* <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Clock className="h-10 w-10 text-purple" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.responseTimeStat}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center"
                >
                  {t.seller.info.responseTime}
                </Typography>
              </div> */}
            </div>
          </div>

          {/* Description & Details */}
          {(languages.length > 0 ||
            certifications.length > 0 ||
            formattedBusinessHours ||
            website ||
            address ||
            contactInfo ||
            locations.length > 0 ||
            tags.length > 0 ||
            brands.length > 0 ||
            reraNumber ||
            tradeLicenseNumber) && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              {/* Contact Information */}
              {contactInfo && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.contactInfo || "Contact Information"}
                  </Typography>
                  <div className="space-y-2">
                    {contactInfo.name && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-sm text-grey-blue"
                        >
                          {contactInfo.name}
                        </Typography>
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-sm text-grey-blue"
                        >
                          {contactInfo.phone}
                        </Typography>
                      </div>
                    )}
                    {contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-sm text-grey-blue"
                        >
                          {contactInfo.email}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address */}
              {address && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.address || "Address"}
                  </Typography>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-grey-blue mt-0.5" />
                    <Typography
                      variant="body"
                      className="text-sm text-grey-blue"
                    >
                      {address}
                    </Typography>
                  </div>
                </div>
              )}

              {/* Website */}
              {website && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.website || "Website"}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-grey-blue" />
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}

              {/* Locations */}
              {locations.length > 0 && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.locations || "Locations"}
                  </Typography>
                  <div className="space-y-2">
                    {locations.map((location, index) => (
                      <div
                        key={location._id || index}
                        className="flex items-start gap-2"
                      >
                        <MapPin className="h-4 w-4 text-grey-blue mt-0.5" />
                        <div>
                          {location.name && (
                            <Typography
                              variant="body"
                              className="text-sm font-medium text-dark-blue"
                            >
                              {location.name}
                            </Typography>
                          )}
                          <Typography
                            variant="body"
                            className="text-sm text-grey-blue"
                          >
                            {[location.address, location.city, location.emirate]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Language Spoken */}
              {languages.length > 0 && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.languageSpoken}
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((language) => (
                      <div
                        key={language}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <Typography
                          variant="body"
                          className="text-sm font-medium text-dark-blue"
                        >
                          {language}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.certifications}
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {certifications.map((cert) => (
                      <div
                        key={cert}
                        className="flex items-center gap-2 px-3 py-2 bg-purple/10 rounded-lg"
                      >
                        <Shield className="h-4 w-4 text-purple" />
                        <Typography
                          variant="body"
                          className="text-xs font-medium text-purple"
                        >
                          {cert}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.tags || "Tags"}
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg"
                      >
                        <Tag className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-xs font-medium text-dark-blue"
                        >
                          {tag}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {brands.length > 0 && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.brands || "Brands"}
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                      >
                        <Typography
                          variant="body"
                          className="text-sm font-medium text-dark-blue"
                        >
                          {brand}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {formattedBusinessHours && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.businessHours}
                  </Typography>
                  <Typography variant="body" className="text-sm text-grey-blue">
                    {formattedBusinessHours}
                  </Typography>
                </div>
              )}

              {/* License Information */}
              {(reraNumber || tradeLicenseNumber) && (
                <div>
                  <Typography
                    variant="h3"
                    className="text-base font-semibold text-dark-blue mb-3"
                  >
                    {t.seller.info.licenseInfo || "License Information"}
                  </Typography>
                  <div className="space-y-2">
                    {tradeLicenseNumber && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-sm text-grey-blue"
                        >
                          <span className="font-medium">Trade License:</span>{" "}
                          {tradeLicenseNumber}
                        </Typography>
                      </div>
                    )}
                    {reraNumber && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-grey-blue" />
                        <Typography
                          variant="body"
                          className="text-sm text-grey-blue"
                        >
                          <span className="font-medium">RERA Number:</span>{" "}
                          {reraNumber}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Trust Score & Safety Features */}
        <div className="space-y-6">
          {/* Trust Score */}
          {sellerStats.trustScore > 0 && sellerStats.reviewCount > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <Typography
                variant="h3"
                className="text-base font-semibold text-dark-blue mb-6"
              >
                {t.seller.info.trustScore}
              </Typography>

              {/* Overall Rating */}
              <div className="flex items-center gap-2 mb-4">
                {renderStars(sellerStats.trustScore, "large")}
                <Typography
                  variant="h2"
                  className="text-xl font-bold text-dark-blue"
                >
                  {sellerStats.trustScore.toFixed(1)}/5.0
                </Typography>
              </div>

              <Typography
                variant="body"
                className="text-sm text-grey-blue mb-6"
              >
                {t.seller.info.basedOnReviews.replace(
                  "{count}",
                  sellerStats.reviewCount.toString()
                )}
              </Typography>

              {/* Rating Breakdown */}
              {/* TODO: Get actual rating breakdown from API - currently using empty array */}
              {ratingBreakdown.length > 0 && (
                <div className="space-y-3">
                  {ratingBreakdown.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-8">
                        <Typography
                          variant="body"
                          className="text-sm text-dark-blue"
                        >
                          {rating.stars}
                        </Typography>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>

                      <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                        <div
                          className="bg-dark-blue rounded-full h-3 absolute left-0"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>

                      <Typography
                        variant="body"
                        className="text-sm text-dark-blue w-8 text-right"
                      >
                        {rating.count}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}

              {/* Response Stats */}
              {/* TODO: Get responseRate from API - currently commented out */}
              {/* <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <Typography variant="body" className="text-sm text-grey-blue">
                    {t.seller.info.responseRate}
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-base font-bold text-green-600"
                  >
                    {sellerStats.responseRate}%
                  </Typography>
                </div>
              </div> */}

              {/* TODO: Get avgResponseTime from API - currently commented out */}
              {/* <div className="flex justify-between items-center">
                <Typography variant="body" className="text-sm text-grey-blue">
                  {t.seller.info.avgResponseTime}
                </Typography>
                <Typography
                  variant="body"
                  className="text-base font-bold text-dark-blue"
                >
                  {sellerStats.responseTime}
                </Typography>
              </div> */}
            </div>
          )}

          {/* Safety Features */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <Typography
              variant="h3"
              className="text-base font-semibold text-dark-blue mb-6"
            >
              {t.seller.info.safetyFeatures}
            </Typography>

            <div className="space-y-4">
              {safetyFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-between"
                >
                  <Typography variant="body" className="text-sm text-dark-blue">
                    {feature}
                  </Typography>
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#17813A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
