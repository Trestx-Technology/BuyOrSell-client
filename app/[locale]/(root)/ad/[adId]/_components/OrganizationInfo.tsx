"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Building2, FileText, Hash, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AD } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";

interface OrganizationInfoProps {
  ad: AD;
}

export const OrganizationInfo: React.FC<OrganizationInfoProps> = ({ ad }) => {
  const { t, localePath } = useLocale();
  const org = ad.organization;

  if (!org) return null;

  const displayName = org.tradeName || org.legalName;
  const avatarUrl = org.logoUrl || null;
  const hasAvatar = !!avatarUrl;

  return (
    <Link
      href={localePath(`/organizations/${org._id}`)}
      className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm relative block w-full hover:border-purple/50 transition-colors group"
    >
      <div className="flex items-center justify-between mb-4">
        <Typography
          variant="h3"
          className="text-lg font-semibold text-dark-blue dark:text-gray-100"
        >
          {t.organizations.list.organization}
        </Typography>
        <ExternalLink size={16} className="text-purple opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Organization Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          {hasAvatar ? (
            <Image
              src={avatarUrl!}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <Building2 size={24} className="text-purple" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Typography
            variant="sm-medium"
            className="font-bold text-dark-blue dark:text-gray-100 line-clamp-2"
          >
            {displayName}
          </Typography>
          <Typography variant="xs-regular" className="text-grey-blue dark:text-gray-400 capitalize">
            {org.type}
          </Typography>
        </div>
      </div>

      {/* Organization Details */}
      <div className="space-y-3">
        {org.tradeLicenseNumber && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-grey-blue dark:text-gray-400">
              <FileText size={16} />
              <Typography variant="xs-regular">
                {t.organizations.form.tradeLicenseNumber}
              </Typography>
            </div>
            <Typography variant="xs-medium" className="text-dark-blue dark:text-gray-100">
              {org.tradeLicenseNumber}
            </Typography>
          </div>
        )}

        {org.trn && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-grey-blue dark:text-gray-400">
              <Hash size={16} />
              <Typography variant="xs-regular">
                {t.organizations.form.trn}
              </Typography>
            </div>
            <Typography variant="xs-medium" className="text-dark-blue dark:text-gray-100">
              {org.trn}
            </Typography>
          </div>
        )}
      </div>
    </Link>
  );
};

export default OrganizationInfo;
