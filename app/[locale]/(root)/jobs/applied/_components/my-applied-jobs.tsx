"use client";

import { useGetMyApplications } from "@/hooks/useJobApplications";
import { MyAppliedJob } from "@/interfaces/job.types";
import AppliedJobCard from "./applied-job-card";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Container1080 } from "@/components/layouts/container-1080";
import { Typography } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NoDataCard } from "@/components/global/fallback-cards";

export default function MyAppliedJobs() {
      const { data, isLoading } = useGetMyApplications();

      const applications = data?.data?.items || [];
      console.log(applications)
      return (
            <Container1080>
                  <MobileStickyHeader title="My Applied Jobs" />
                  <div className="px-6 space-y-6 my-6">

                        <Breadcrumbs
                              items={[
                                    { id: "2", label: "Jobs", href: "/jobs" },
                                    { id: "3", label: "My Applied Jobs", href: "/jobs/applied" },
                              ]}
                        />

                        <div className="lg:block hidden">
                              <Typography variant="h2" className="text-dark-blue font-bold mb-2">
                                    My Applied Jobs
                              </Typography>
                              <Typography variant="body-small" className="text-grey-blue">
                                    You have applied to {applications.length} jobs.
                              </Typography>
                        </div>

                        {isLoading ? (
                              <div className="flex flex-wrap gap-6">
                                    {[...Array(8)].map((_, i) => (
                                          <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
                                    ))}
                              </div>
                        ) : applications.length > 0 ? (
                              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                                    {applications.map((app) => (
                                          <AppliedJobCard key={app._id} application={app} />
                                    ))}
                              </div>

                        ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <NoDataCard title="No Applied Jobs" description="You haven't applied to any jobs yet." />
                              </div>
                        )}
                  </div>
            </Container1080>
      );
}
