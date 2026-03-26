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
      <div className="bg-[#F9FAFC] relative">
        <div className="pb-6 md:py-6">
          <div className="animate-pulse space-y-8">
            <div className="bg-gray-200 h-40 rounded-2xl" />
            <div className="bg-gray-200 h-64 rounded-xl" />
            <div className="bg-gray-200 h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="bg-[#F9FAFC] relative">
        <div className="pb-6 md:py-6">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Typography variant="h2" className="text-dark-blue mb-2">
              Organization Not Found
            </Typography>
            <Typography variant="body" className="text-grey-blue">
              The organization profile you&apos;re looking for doesn&apos;t exist.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container1080 className="relative">
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
  );
};

export default OrganizationSellerContent;
