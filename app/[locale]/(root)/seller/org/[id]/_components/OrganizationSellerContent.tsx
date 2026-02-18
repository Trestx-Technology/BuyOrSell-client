"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useOrganizationById } from "@/hooks/useOrganizations";
import { Typography } from "@/components/typography";
import { Container1080 } from "@/components/layouts/container-1080";
import SellerHeader from "../../../_components/SellerHeader";
import SellerReviews from "../../../_components/SellerReviews";
import SellerInfo from "../../../_components/SellerInfo";
import SellerListings from "../../../_components/SellerListings";
import SellerListingsMobileHeader from "../../../_components/SellerListingsMobileHeader";

const OrganizationSellerContent: React.FC = () => {
      const { id } = useParams();
      const organizationId = id as string;

      // Fetch organization data
      const {
            data: organizationData,
            isLoading,
            error: orgError,
            isError: isOrgError,
      } = useOrganizationById(organizationId);

      const organization = organizationData?.data;

      // Show loading state
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

      // Show error state if organization not found
      if (!organization) {
            return (
                  <div className="bg-[#F9FAFC] relative">
                        <div className="pb-6 md:py-6">
                              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                    <Typography variant="h2" className="text-dark-blue mb-2">
                                          Organization Not Found
                                    </Typography>
                                    <Typography variant="body" className="text-grey-blue">
                                          The organization profile you're looking for doesn't exist.
                                    </Typography>
                              </div>
                        </div>
                  </div>
            );
      }

      return (
            <Container1080 className="relative">
                  <div className="pb-6 md:py-6">
                        {/* Seller Header */}
                        <div className="hidden sm:block">
                              <SellerHeader
                                    sellerId={organizationId}
                                    organization={organization}
                                    user={undefined}
                              />
                        </div>

                        {/* Seller Header Mobile */}
                        <div className="block sm:hidden">
                              <div className="sticky top-0 h-40 overflow-hidden">
                                    <Image
                                          src={organization?.coverImageUrl || "/seller-banner.png"}
                                          alt="Seller banner"
                                          fill
                                          className="object-cover object-center"
                                    />
                              </div>
                              <SellerListingsMobileHeader
                                    sellerId={organizationId}
                                    organization={organization}
                                    user={undefined}
                              />
                        </div>

                        {/* Seller Information */}
                        <div className="mt-8">
                              <SellerInfo
                                    sellerId={organizationId}
                                    organization={organization}
                                    user={undefined}
                              />
                        </div>

                        {/* Seller Reviews */}
                        <div className="mt-8">
                              <SellerReviews
                                    sellerId={organizationId}
                                    organization={organization}
                              />
                        </div>

                        {/* Seller Listings */}
                        <div className="mt-8">
                              <SellerListings
                                    sellerId={organizationId}
                                    organization={organization}
                                    user={undefined}
                              />
                        </div>
                  </div>
            </Container1080>
      );
};

export default OrganizationSellerContent;
