"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Star, Car, Users, Clock, Shield } from "lucide-react";

interface SellerInfoProps {
  sellerId: string;
}

const SellerInfo: React.FC<SellerInfoProps> = () => {
  // Mock data - replace with actual API call
  const sellerStats = {
    trustScore: 4.8,
    reviewCount: 127,
    responseRate: 98,
    responseTime: "< 2 hours",
    carsSold: 324,
    activeListings: 28,
    happyCustomers: 127,
    responseTimeStat: "< 2 hours",
  };

  const ratingBreakdown = [
    { stars: 5, count: 42, percentage: 84 },
    { stars: 4, count: 12, percentage: 24 },
    { stars: 3, count: 4, percentage: 8 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 1, percentage: 2 },
  ];

  const safetyFeatures = [
    "Verified Business Licence",
    "Identity Verified",
    "Phone Number Verified",
    "Professional Dealer",
  ];

  const languages = ["English", "Arabic", "Hindi", "Urdu"];
  const certifications = [
    "Licensed Dealer",
    "ISO Certified",
    "Customer Excellence",
  ];

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
              Seller Statistics
            </Typography>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Cars Sold */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Car className="h-10 w-10 text-green-600" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.carsSold}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center"
                >
                  Cars Sold
                </Typography>
              </div>

              {/* Active Listings */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Shield className="h-10 w-10 text-purple" />
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
                  Active Listings
                </Typography>
              </div>

              {/* Happy Customers */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Users className="h-10 w-10 text-orange-500" />
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-black"
                >
                  {sellerStats.happyCustomers}
                </Typography>
                <Typography
                  variant="body"
                  className="text-sm text-grey-blue text-center whitespace-nowrap"
                >
                  Happy Customers
                </Typography>
              </div>

              {/* Response Time */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Clock className="h-10 w-10 text-red-500" />
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
                  Response Time
                </Typography>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Typography
              variant="h3"
              className="text-base font-semibold text-dark-blue mb-4"
            >
              Description
            </Typography>

            <Typography
              variant="body"
              className="text-sm text-grey-blue leading-relaxed mb-6"
            >
              Premium Auto Dealer has been serving the Dubai automotive market
              for over 4 years with exceptional service and quality vehicles. We
              specialize in luxury and premium vehicles, offering comprehensive
              warranties and after-sales support. Our team of certified
              professionals ensures every vehicle meets the highest standards
              before delivery to our valued customers.
            </Typography>

            {/* Language Spoken */}
            <div className="mb-6">
              <Typography
                variant="h3"
                className="text-base font-semibold text-dark-blue mb-3"
              >
                Language Spoken
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

            {/* Certifications */}
            <div className="mb-6">
              <Typography
                variant="h3"
                className="text-base font-semibold text-dark-blue mb-3"
              >
                Certifications
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

            {/* Business Hours */}
            <div>
              <Typography
                variant="h3"
                className="text-base font-semibold text-dark-blue mb-3"
              >
                Business Hours
              </Typography>
              <Typography variant="body" className="text-sm text-grey-blue">
                Sunday - Thursday: 9:00 AM - 8:00 PM, Friday - Saturday: 9:00 AM
                - 10:00 PM
              </Typography>
            </div>
          </div>
        </div>

        {/* Right Column - Trust Score & Safety Features */}
        <div className="space-y-6">
          {/* Trust Score */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <Typography
              variant="h3"
              className="text-base font-semibold text-dark-blue mb-6"
            >
              Trust Score
            </Typography>

            {/* Overall Rating */}
            <div className="flex items-center gap-2 mb-4">
              {renderStars(sellerStats.trustScore, "large")}
              <Typography
                variant="h2"
                className="text-xl font-bold text-dark-blue"
              >
                {sellerStats.trustScore}/5.0
              </Typography>
            </div>

            <Typography variant="body" className="text-sm text-grey-blue mb-6">
              Based on {sellerStats.reviewCount} reviews
            </Typography>

            {/* Rating Breakdown */}
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

            {/* Response Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <Typography variant="body" className="text-sm text-grey-blue">
                  Response Rate
                </Typography>
                <Typography
                  variant="body"
                  className="text-base font-bold text-green-600"
                >
                  {sellerStats.responseRate}%
                </Typography>
              </div>

              <div className="flex justify-between items-center">
                <Typography variant="body" className="text-sm text-grey-blue">
                  Avg. Response Time
                </Typography>
                <Typography
                  variant="body"
                  className="text-base font-bold text-dark-blue"
                >
                  {sellerStats.responseTime}
                </Typography>
              </div>
            </div>
          </div>

          {/* Safety Features */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <Typography
              variant="h3"
              className="text-base font-semibold text-dark-blue mb-6"
            >
              Safety Features
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
