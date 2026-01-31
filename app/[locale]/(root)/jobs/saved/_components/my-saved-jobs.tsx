"use client";

import { useGetMySavedJobs } from "@/hooks/useSavedJobs";
import JobCard from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import { transformJobDataToJobCard } from "@/utils/transform-job-data-to-job-card";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Container1080 } from "@/components/layouts/container-1080";
import { Typography } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NoDataCard } from "@/components/global/fallback-cards";
import { JobData } from "@/interfaces/job.types";

export default function MySavedJobs() {
      const { data, isLoading } = useGetMySavedJobs();

      const savedJobs = data?.data || [];
      return (
            <Container1080>
                  <MobileStickyHeader title="My Saved Jobs" />
                  <div className="px-6 space-y-6 my-6">
                        <Breadcrumbs
                              items={[
                                    { id: "2", label: "Jobs", href: "/jobs" },
                                    { id: "3", label: "My Saved Jobs", href: "/jobs/saved" },
                              ]}
                        />

                        <div className="lg:block hidden">
                              <Typography variant="h2" className="text-dark-blue font-bold mb-2">
                                    My Saved Jobs
                              </Typography>
                              <Typography variant="body-small" className="text-grey-blue">
                                    You have saved {savedJobs.length} jobs.
                              </Typography>
                        </div>

                        {isLoading ? (
                              <div className="flex flex-wrap gap-6">
                                    {[...Array(8)].map((_, i) => (
                                          <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
                                    ))}
                              </div>
                        ) : savedJobs.length > 0 ? (
                              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                                    {savedJobs.map((job) => {
                                          const organization = job.job?.organization;
                                          const address = job.job?.address;
                                          const owner = job.job?.owner;
                                          const isSaved = job.job?.isSaved;
                                          const title = job.job?.title;
                                          const location = address?.city || address?.state || address?.country;
                                          const createdAt = job.job?.createdAt;
                                          return (
                                                <JobCard
                                                      job={{
                                                            organization,
                                                            address,
                                                            owner,
                                                            isSaved: true,
                                                            title,
                                                            location,
                                                            createdAt

                                                      }}
                                                      key={job._id}
                                                />
                                          )
                                    })}
                              </div>
                        ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <NoDataCard
                                          title="No Saved Jobs"
                                          description="You haven't saved any jobs yet."
                                    />
                              </div>
                        )}
                  </div>
            </Container1080>
      );
}

