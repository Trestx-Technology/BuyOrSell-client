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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm relative block w-full">
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue dark:text-gray-100 mb-4"
      >
        {t.organizations.list.organization}
      </Typography>

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
            className="font-bold text-dark-blue dark:text-gray-100 truncate"
          >
            {displayName}
          </Typography>
          <Typography variant="xs-regular" className="text-grey-blue dark:text-gray-400 capitalize">
            {org.type}
          </Typography>
        </div>
      </div>

      {/* Organization Details */}
      <div className="space-y-3 mb-6">
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

      {/* Action Button */}
      <Link
        href={localePath(`/organizations/${org._id}`)}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-purple/10 hover:bg-purple/20 text-purple text-sm font-semibold rounded-lg transition-colors group"
      >
        {t.organizations.form.viewAll.replace('({count})', '').trim() || "View Profile"}
        <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default OrganizationInfo;
