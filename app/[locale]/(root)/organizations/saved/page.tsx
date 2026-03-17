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
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const SavedOrganizationsPage = () => {
      const { data: savedOrganizationsData, isLoading } = useMySavedOrganizations();
      const savedOrganizations = savedOrganizationsData?.data || [];
      const { t, localePath } = useLocale();
      const router = useRouter();

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
                  <div className={`px-2 py-1 ${config.bgColor} dark:bg-opacity-20 rounded-md`}>
                        <Typography
                              variant="xs-regular-inter"
                              className={`text-xs font-medium ${config.textColor} dark:text-opacity-90`}
                        >
                              {statusText}
                        </Typography>
                  </div>
            );
      };

      return (
            <Container1080>
                  <MobileStickyHeader title="Saved Organizations" />
                  <div className="w-full px-4 py-8">
                        <div className="mb-6">
                              <Breadcrumbs
                                    className="hidden sm:flex"
                                    showHomeIcon={true}
                                    homeHref="/"
                                    homeLabel="Home"
                                    items={breadcrumbItems}
                                    showSelectCategoryLink={false}
                              />
                        </div>

                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                              <div className="flex items-center gap-4">
                                    <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => router.back()}
                                          className="shrink-0 -ml-2 dark:text-gray-400 dark:hover:text-gray-100"
                                    >
                                          <ArrowLeft className="h-6 w-6" />
                                    </Button>
                                    <div>
                                          <Typography
                                                variant="lg-black-inter"
                                                className="text-2xl md:text-3xl font-bold text-[#1D2939] dark:text-gray-100"
                                          >
                                                Saved Organizations
                                          </Typography>
                                          <Typography
                                                variant="sm-regular-inter"
                                                className="text-sm md:text-base text-[#8A8A8A] dark:text-gray-400 mt-1"
                                          >
                                                View and manage your saved organizations
                                          </Typography>
                                    </div>
                              </div>
                        </div>

                        {/* Organizations Grid */}
                        {isLoading ? (
                               <OrganizationsListSkeleton />
                        ) : savedOrganizations.length === 0 ? (
                              <div className="bg-white dark:bg-gray-900 rounded-xl border border-[#E5E5E5] dark:border-gray-800 p-12 text-center shadow-sm">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                          <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Typography
                                          variant="md-semibold-inter"
                                          className="text-lg font-semibold text-[#1D2939] dark:text-gray-100 mb-2"
                                    >
                                          No saved organizations found
                                    </Typography>
                                    <Typography
                                          variant="sm-regular-inter"
                                          className="text-sm text-[#8A8A8A] dark:text-gray-400 mb-6 max-w-md mx-auto"
                                    >
                                          You haven&apos;t saved any organizations yet. Start exploring to find companies you like.
                                    </Typography>
                                    <Link href={localePath("/organizations")}>
                                          <Button variant="filled" className="bg-purple hover:bg-purple-600">
                                                Explore Organizations
                                          </Button>
                                    </Link>
                              </div>
                        ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedOrganizations.map((savedOrg) => {
                                          const org = savedOrg.organization;
                                          if (!org) return null;

                                          return (
                                                <Link
                                                      href={localePath(`/organizations/${org._id}`)}
                                                      key={savedOrg._id}
                                                      className="group bg-white dark:bg-gray-900 rounded-xl border border-[#E5E5E5] dark:border-gray-800 p-5 hover:shadow-xl hover:border-purple/30 dark:hover:border-purple/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                                >
                                                      <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-4">
                                                                  {org.logoUrl ? (
                                                                        <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                                                              <Image
                                                                                    src={org.logoUrl}
                                                                                    alt={org.tradeName || org.legalName}
                                                                                    fill
                                                                                    className="object-cover"
                                                                              />
                                                                        </div>
                                                                  ) : (
                                                                        <div className="w-14 h-14 bg-purple/10 dark:bg-purple/20 rounded-xl flex items-center justify-center shrink-0 border border-purple/10">
                                                                              <Typography
                                                                                    variant="md-semibold-inter"
                                                                                    className="text-purple dark:text-purple-400 font-bold text-lg"
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
                                                                              className="text-base font-bold text-[#1D2939] dark:text-gray-100 truncate group-hover:text-purple transition-colors"
                                                                        >
                                                                              {org.tradeName || org.legalName}
                                                                        </Typography>
                                                                        <Typography
                                                                              variant="xs-regular-inter"
                                                                              className="text-xs text-[#8A8A8A] dark:text-gray-400 truncate mt-1"
                                                                        >
                                                                              <span className="font-medium text-purple/80 dark:text-purple-400/80">
                                                                                    {getOrganizationType(org.type)}
                                                                              </span>
                                                                              <span className="mx-1.5">•</span>
                                                                              {getLocation(org)}
                                                                        </Typography>
                                                                  </div>
                                                            </div>
                                                            {getStatusBadge(org.status)}
                                                      </div>
                                                      <div className="flex items-center justify-between mt-auto">
                                                            {org.verified ? (
                                                                  <div className="inline-flex items-center px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100 dark:border-green-900/40">
                                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Verified
                                                                  </div>
                                                            ) : (
                                                                  <div />
                                                            )}
                                                            <div className="text-purple dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                                                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                  </svg>
                                                            </div>
                                                      </div>
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
