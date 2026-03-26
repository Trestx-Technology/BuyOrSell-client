"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useOrganizationById } from "@/hooks/useOrganizations";
import { Typography } from "@/components/typography";
import { Container1080 } from "@/components/layouts/container-1080";
import OrgHeader from "./OrgHeader";
import OrgMobileHeader from "./OrgMobileHeader";
import OrgInfo from "./OrgInfo";
import OrgReviews from "./OrgReviews";
import OrgListings from "./OrgListings";

const OrganizationSellerContent: React.FC = () => {
  const { id } = useParams();
  const organizationId = id as string;

  const {
    data: organizationData,
    isLoading,
    error: orgError,
    isError: isOrgError,
  } = useOrganizationById(organizationId);

  const organization = organizationData?.data;

  if (isLoading) {
    return (
      <div className="bg-[#F9FAFC] dark:bg-slate-950 relative min-h-screen">
        <div className="pb-6 md:py-6">
          <Container1080>
            <div className="animate-pulse space-y-8">
              <div className="bg-gray-200 dark:bg-slate-800 h-48 rounded-3xl" />
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md h-64 rounded-3xl border border-white/20 dark:border-slate-800" />
              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md h-48 rounded-3xl border border-white/20 dark:border-slate-800" />
            </div>
          </Container1080>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="bg-[#F9FAFC] dark:bg-slate-950 relative min-h-screen">
        <div className="pb-6 md:py-6">
          <Container1080>
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-12 text-center shadow-xl">
              <Typography variant="h2" className="text-dark-blue dark:text-white mb-2">
                Organization Not Found
              </Typography>
              <Typography variant="body" className="text-grey-blue dark:text-slate-400">
                The organization profile you&apos;re looking for doesn&apos;t exist.
              </Typography>
            </div>
          </Container1080>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFC] dark:bg-slate-950 min-h-screen">
      <Container1080 className="relative pb-12">
      <div className="pb-6 md:py-6">
        {/* Desktop Header */}
        <div className="hidden sm:block">
          <OrgHeader organizationId={organizationId} organization={organization} />
        </div>

        {/* Mobile Header */}
        <div className="block sm:hidden">
          <div className="sticky top-0 h-40 overflow-hidden relative">
            <Image
              src={organization.coverImageUrl || "/seller-banner.png"}
              alt="Organization banner"
              fill
              className="object-cover object-center"
            />
          </div>
          <OrgMobileHeader organizationId={organizationId} organization={organization} />
        </div>

        {/* Organization Info — all data fields */}
        <div className="mt-8">
          <OrgInfo organization={organization} />
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <OrgReviews organizationId={organizationId} organization={organization} />
        </div>

        {/* Listings */}
        <div className="mt-8">
          <OrgListings
            organizationId={organizationId}
            organization={organization}
          />
        </div>
      </div>
    </Container1080>
  </div>
);
};

export default OrganizationSellerContent;
