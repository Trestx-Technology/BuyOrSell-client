"use client";

import React from "react";
import { MapPin, Globe, Phone, Mail, CheckCircle2, Star } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Organization } from "@/interfaces/organization.types";
import Link from "next/link";

interface OrganizationDetailContentProps {
  organization: Organization;
}

export default function OrganizationDetailContent({
  organization,
}: OrganizationDetailContentProps) {
  const displayName = organization.tradeName || organization.legalName;
  const location = `${organization.city || ""}${organization.emirate ? `, ${organization.emirate}` : ""}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E2E2] p-6 space-y-6">
      {/* About Section */}
      <div>
        <Typography variant="h3" className="text-dark-blue font-bold mb-4">
          About {displayName}
        </Typography>
        {organization.tags && organization.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {organization.tags.map((tag, index) => (
              <Badge
                key={index}
                className="bg-[#F5EBFF] text-purple px-3 py-1 rounded-full text-sm font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div>
        <Typography variant="h3" className="text-dark-blue font-bold mb-4">
          Contact Information
        </Typography>
        <div className="space-y-3">
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple" />
              <Typography variant="body-small" className="text-dark-blue text-sm">
                {location}
                {organization.addressLine1 && `, ${organization.addressLine1}`}
              </Typography>
            </div>
          )}
          {organization.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple" />
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple hover:underline text-sm"
              >
                {organization.website}
              </a>
            </div>
          )}
          {organization.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple" />
              <Typography variant="body-small" className="text-dark-blue text-sm">
                {organization.contactPhone}
              </Typography>
            </div>
          )}
          {organization.contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple" />
              <Typography variant="body-small" className="text-dark-blue text-sm">
                {organization.contactEmail}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details */}
      {(organization.tradeLicenseNumber || organization.reraNumber) && (
        <div>
          <Typography variant="h3" className="text-dark-blue font-bold mb-4">
            Business Details
          </Typography>
          <div className="space-y-2">
            {organization.tradeLicenseNumber && (
              <div>
                <Typography variant="body-small" className="text-gray-600 text-sm">
                  Trade License: {organization.tradeLicenseNumber}
                </Typography>
              </div>
            )}
            {organization.reraNumber && (
              <div>
                <Typography variant="body-small" className="text-gray-600 text-sm">
                  RERA Number: {organization.reraNumber}
                </Typography>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        {organization.totalJobsPosted !== undefined && (
          <div>
            <Typography variant="body-large" className="text-dark-blue font-semibold">
              {organization.totalJobsPosted}
            </Typography>
            <Typography variant="body-small" className="text-gray-600 text-sm">
              Jobs Posted
            </Typography>
          </div>
        )}
        {organization.followersCount !== undefined && (
          <div>
            <Typography variant="body-large" className="text-dark-blue font-semibold">
              {organization.followersCount}
            </Typography>
            <Typography variant="body-small" className="text-gray-600 text-sm">
              Followers
            </Typography>
          </div>
        )}
        {organization.ratingAvg && (
          <div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Typography variant="body-large" className="text-dark-blue font-semibold">
                {organization.ratingAvg.toFixed(1)}
              </Typography>
            </div>
            <Typography variant="body-small" className="text-gray-600 text-sm">
              Average Rating
            </Typography>
          </div>
        )}
        {organization.activeAds !== undefined && (
          <div>
            <Typography variant="body-large" className="text-dark-blue font-semibold">
              {organization.activeAds}
            </Typography>
            <Typography variant="body-small" className="text-gray-600 text-sm">
              Active Ads
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
