"use client";

import React, { useState } from "react";
import { Organization } from "@/interfaces/organization.types";
import { EmployerProfile } from "@/interfaces/job.types";
import { OrganizationBanner } from "./organization-banner";
import { OrganizationHeader } from "./organization-header";
import { OrganizationTabs } from "./organization-tabs";
import { OrganizationOverview } from "./organization-overview";
import EmployerJobs from "./employer-jobs";
import { MapPin } from "lucide-react";
import { Typography } from "@/components/typography";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Card, CardContent } from "@/components/ui/card";

interface OrganizationProfileProps {
      organization: Organization & Partial<EmployerProfile>;
      isOwner?: boolean;
}

export default function OrganizationProfile({
      organization,
}: OrganizationProfileProps) {
      const [activeTab, setActiveTab] = useState<"home" | "about" | "jobs">("home");

      return (
            <Container1080 className="md:my-12 bg-white dark:bg-slate-950">
                  <MobileStickyHeader title={organization.tradeName} />

                  <Card className="my-4 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                        <CardContent className="sm:rounded-2xl p-0 overflow-hidden" >

                              {/* Header Banner */}
                              <OrganizationBanner organization={organization} />

                              {/* Main Content */}
                              <div className="max-w-5xl mx-auto mt-10">
                                    {/* Header Info */}
                                    <OrganizationHeader organization={organization} />

                                    {/* Navigation Tabs */}
                                    <OrganizationTabs activeTab={activeTab} onTabChange={setActiveTab} />

                                    {/* Tab Content */}
                                    {activeTab === "home" && <OrganizationOverview organization={organization} />}

                                    {activeTab === "about" && (
                                          <div className="py-8 text-slate-700 dark:text-gray-300">
                                                <Typography variant="h2" className="text-xl font-bold text-dark-blue dark:text-gray-100 mb-4">
                                                      About {organization.tradeName}
                                                </Typography>
                                                <div className="space-y-6">
                                                      <div>
                                                            <Typography variant="sm-semibold" className="text-dark-blue dark:text-gray-100 block mb-2">
                                                                  Headquarters
                                                            </Typography>
                                                            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
                                                                  <MapPin className="w-4 h-4" />
                                                                  <Typography variant="body-small" className="dark:text-gray-300">
                                                                        {organization.city}, {organization.emirate}, {organization.country}
                                                                  </Typography>
                                                            </div>
                                                      </div>

                                                      {organization.foundedYear && (
                                                            <div>
                                                                  <Typography variant="sm-semibold" className="text-dark-blue dark:text-gray-100 block mb-1">
                                                                        Founded
                                                                  </Typography>
                                                                  <Typography variant="body-small" className="text-slate-600 dark:text-gray-400">
                                                                        {organization.foundedYear}
                                                                  </Typography>
                                                            </div>
                                                      )}
                                                </div>
                                          </div>
                                    )}

                                    {/* {activeTab === "jobs" && (
                                          <div className="px-6 py-8">
                                                <EmployerJobs employerId={organization._id} />
                                          </div>
                                    )} */}
                              </div>

                        </CardContent>

                  </Card>

                  <div className="px-6 py-8">
                        <EmployerJobs organization={organization} employerId={organization._id} />
                  </div>

            </Container1080>
      );
}
