"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Globe, Phone, Mail, CheckCircle2, Star } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Organization } from "@/interfaces/organization.types";

interface EmployerHeaderProps {
  employer: Organization;
  onFollow?: () => void;
  isFollowing?: boolean;
}

export default function EmployerHeader({
  employer,
  onFollow,
  isFollowing = false,
}: EmployerHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="w-full h-64 bg-gradient-to-r from-purple to-purple/80 relative overflow-hidden">
        {employer.coverImageUrl ? (
          <Image
            src={employer.coverImageUrl}
            alt={employer.tradeName || employer.legalName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple to-purple/80" />
        )}
      </div>

      {/* Company Info Card */}
      <div className="max-w-[1280px] mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="size-32 bg-[#FAFAFC] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                {employer.logoUrl ? (
                  <Image
                    src={employer.logoUrl}
                    alt={employer.tradeName || employer.legalName}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-purple font-bold text-4xl">
                    {(employer.tradeName || employer.legalName)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Typography
                      variant="h1"
                      className="text-dark-blue font-bold text-3xl"
                    >
                      {employer.tradeName || employer.legalName}
                    </Typography>
                    {employer.verified && (
                      <CheckCircle2 className="w-6 h-6 text-purple" />
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {employer.type && (
                      <Badge className="bg-[#F5EBFF] text-purple px-3 py-1 rounded-full text-sm font-normal">
                        {employer.type}
                      </Badge>
                    )}
                    {employer.ratingAvg && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <Typography
                          variant="body-large"
                          className="text-dark-blue font-semibold"
                        >
                          {employer.ratingAvg.toFixed(1)}
                        </Typography>
                        {employer.ratingCount && (
                          <Typography
                            variant="body-small"
                            className="text-[#8A8A8A] text-sm"
                          >
                            ({employer.ratingCount} reviews)
                          </Typography>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {employer.city && employer.emirate && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-purple" />
                        <Typography
                          variant="body-small"
                          className="text-dark-blue text-sm"
                        >
                          {employer.city}, {employer.emirate}
                        </Typography>
                      </div>
                    )}
                    {employer.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple" />
                        <a
                          href={employer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple hover:underline text-sm"
                        >
                          {employer.website}
                        </a>
                      </div>
                    )}
                    {employer.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-purple" />
                        <Typography
                          variant="body-small"
                          className="text-dark-blue text-sm"
                        >
                          {employer.contactPhone}
                        </Typography>
                      </div>
                    )}
                    {employer.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple" />
                        <Typography
                          variant="body-small"
                          className="text-dark-blue text-sm"
                        >
                          {employer.contactEmail}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {onFollow && (
                    <Button
                      onClick={onFollow}
                      variant={isFollowing ? "outline" : "primary"}
                      className={
                        isFollowing
                          ? "border-purple text-purple hover:bg-purple/10"
                          : "bg-purple text-white hover:bg-purple/90"
                      }
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-purple text-purple hover:bg-purple/10"
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

