"use client";

import React from "react";
import { useMySavedOrganizations } from "@/hooks/useSavedOrganizations";
import { SavedOrganization } from "@/interfaces/saved-organization.types";
import { Organization } from "@/interfaces/organization.types";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { Building2 } from "lucide-react";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import {
      ORGANIZATION_STATUS_CONFIG,
      OrganizationStatus,
} from "@/constants/enums";
import { Button } from "@/components/ui/button";
import { OrganizationsListSkeleton } from "../_components/OrganizationsListSkeleton";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";

const SavedOrganizationsPage = () => {
      const { data: savedOrganizationsData, isLoading } = useMySavedOrganizations();
      const savedOrganizations = savedOrganizationsData?.data || [];
      const { t, localePath } = useLocale();

      const breadcrumbItems: BreadcrumbItem[] = [
            { id: "organizations", label: "Organizations", href: "/organizations" },
            { id: "saved", label: "Saved Organizations", href: "/organizations/saved", isActive: true },
      ];

      // Get organization type display
      const getOrganizationType = (type: string | undefined): string => {
            if (!type) return "Organization";
            return type.toUpperCase();
      };

      // Format location
      const getLocation = (org: Organization): string => {
            const city = org.city || "";
            const country = org.country || "AE";
            return city ? `${city}, ${country}` : country;
      };

      // Get status badge
      const getStatusBadge = (status?: string) => {
            if (!status) return null;
            const statusLower = status.toLowerCase() as OrganizationStatus;

            const config = ORGANIZATION_STATUS_CONFIG[statusLower];
            if (!config) return null;

            // Basic fallback for translation since I don't have the full translation object structure handy for status
            const statusText = config.text;

            return (
                  <div className={`px-2 py-1 ${config.bgColor} rounded-md`}>
                        <Typography
                              variant="xs-regular-inter"
                              className={`text-xs font-medium ${config.textColor}`}
                        >
                              {statusText}
                        </Typography>
                  </div>
            );
      };

      return (
            <Container1080>
                  <MobileStickyHeader title="Saved Organizations" />
                  <div className="w-full p-4">
                        <Breadcrumbs
                              className="hidden sm:flex"
                              showHomeIcon={true}
                              homeHref="/"
                              homeLabel="Home"
                              items={breadcrumbItems}
                              showSelectCategoryLink={false}
                        />
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                              <div>
                                    <Typography
                                          variant="lg-black-inter"
                                          className="text-lg md:text-2xl font-semibold text-[#1D2939] mb-2"
                                    >
                                          Saved Organizations
                                    </Typography>
                                    <Typography
                                          variant="sm-regular-inter"
                                          className="text-xs md:text-sm text-[#8A8A8A]"
                                    >
                                          View and manage your saved organizations
                                    </Typography>
                              </div>
                        </div>

                        {/* Organizations Grid */}
                        {isLoading ? (
                              <OrganizationsListSkeleton />
                        ) : savedOrganizations.length === 0 ? (
                              <div className="bg-white rounded-lg border border-[#E5E5E5] p-12 text-center">
                                    <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <Typography
                                          variant="md-semibold-inter"
                                          className="text-lg font-semibold text-[#1D2939] mb-2"
                                    >
                                          No saved organizations found
                                    </Typography>
                                    <Typography
                                          variant="sm-regular-inter"
                                          className="text-sm text-[#8A8A8A] mb-6"
                                    >
                                          You haven&apos;t saved any organizations yet. Start exploring to find companies you like.
                                    </Typography>
                                    <Link href={localePath("/organizations")}>
                                          <Button variant="filled">
                                                Explore Organizations
                                          </Button>
                                    </Link>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {savedOrganizations.map((savedOrg) => {
                                          // Ensure organization is populated
                                          const org = savedOrg.organization;

                                          if (!org) return null;

                                          return (
                                                <Link
                                                      href={localePath(`/organizations/${org._id}`)}
                                                      key={savedOrg._id}
                                                      className="bg-white rounded-lg border border-[#E5E5E5] p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                                >
                                                      <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                  {org.logoUrl ? (
                                                                        <Image
                                                                              src={org.logoUrl}
                                                                              alt={org.tradeName || org.legalName}
                                                                              width={48}
                                                                              height={48}
                                                                              className="w-12 h-12 object-cover rounded"
                                                                        />
                                                                  ) : (
                                                                        <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center">
                                                                              <Typography
                                                                                    variant="sm-semibold-inter"
                                                                                    className="text-purple font-semibold"
                                                                              >
                                                                                    {(org.tradeName || org.legalName || "O")
                                                                                          .charAt(0)
                                                                                          .toUpperCase()}
                                                                              </Typography>
                                                                        </div>
                                                                  )}
                                                                  <div className="flex-1 min-w-0">
                                                                        <Typography
                                                                              variant="sm-semibold-inter"
                                                                              className="text-sm font-semibold text-[#1D2939] truncate"
                                                                        >
                                                                              {org.tradeName || org.legalName}
                                                                        </Typography>
                                                                        <Typography
                                                                              variant="xs-regular-inter"
                                                                              className="text-xs text-[#8A8A8A] truncate"
                                                                        >
                                                                              {getOrganizationType(org.type)} • {getLocation(org)}
                                                                        </Typography>
                                                                  </div>
                                                            </div>
                                                            {getStatusBadge(org.status)}
                                                      </div>
                                                      {org.verified && (
                                                            <div className="mt-2">
                                                                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                                                        Verified
                                                                  </span>
                                                            </div>
                                                      )}
                                                </Link>
                                          );
                                    })}
                              </div>
                        )}
                  </div>
            </Container1080>
      );
};

export default SavedOrganizationsPage;
