"use client";

import React from "react";
import { Organization } from "@/interfaces/organization.types";
import Image from "next/image";

interface OrganizationBannerProps {
  organization: Organization;
}

export const OrganizationBanner = ({ organization }: OrganizationBannerProps) => {
  return (
    <div className="relative h-58 bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900">
      {/* Animated chart visualization on the right */}
      <div className="absolute  right-0 top-0 w-full h-full opacity-40">
        {organization.coverImageUrl && <Image src={organization.coverImageUrl} alt={organization.tradeName || organization.legalName} fill className="object-cover" />}
      </div>

      {/* Logo area */}
      <div className="absolute left-5 w-fit h-25 z-10 -bottom-10 bg-white dark:bg-slate-800 p-4 w-56 flex items-center gap-3 shadow-md dark:shadow-slate-900/50">
        {organization.logoUrl && (
          <Image
            src={organization.logoUrl}
            alt={organization.tradeName || organization.legalName}
            width={80}
            height={80}
            className="rounded-full object-contain"
          />
        )}
      </div>
    </div>
  );
};
