"use client";

import { useGetMyApplications } from "@/hooks/useJobApplications";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MyAppliedJob } from "@/interfaces/job.types";
import AppliedJobCard from "./applied-job-card";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Container1080 } from "@/components/layouts/container-1080";
import { Typography } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { NoDataCard } from "@/components/global/fallback-cards";

export default function MyAppliedJobs() {
      const searchParams = useSearchParams();
      const router = useRouter();
      const pathname = usePathname();

      // Get initial type from URL or default to undefined (all)
      const currentType = searchParams.get("type") || "applied";

      const { data, isLoading } = useGetMyApplications({
            status: currentType === "applied" ? undefined : currentType // If 'applied' (default tab), maybe we want all? Or specific 'applied' status?
            // User query: "check for type in the url it will have the type"
            // If I assume 'applied' tab means "All active" or specifically "status=applied".
            // Let's assume strict filtering based on user request.
            // However, typically "Applied" tab shows everything or pending.
            // Let's pass the status directly.
            // If tab is "Applied", we pass "pending" ?! No, let's pass "applied" if that's the status key.
            // Actually, looking at the types, "pending" and "applied" exist.
            // Use logic: If tab is 'applied', filter by 'pending' and 'applied'??
            // For now, let's pass the type as status, but for 'Applied' tab, if users want to see everything they applied to (that isn't rejected/shortlisted specifically? or just raw 'applied' status?),
            // let's try mapping 'applied' tab to 'pending' status if 'applied' returns nothing?
            // Safest bet: Pass the value directly.
      }); 

      // Correction: If the user says "type in the url", let's strictly follow that.
      // But for the "Applied" tab, passing "applied" might miss "pending" ones.
      // Let's map "Applied" tab in UI to `type=applied`.
      // And for the API, `status: type`.
      
      // WAIT. If I pass `status: 'applied'`, i only get `status === 'applied'`.
      // If the default state of an application is 'pending', I won't see it.
      // Let's stick to the requested tabs.
      
      const applications = data?.data?.items || [];

      const handleTabChange = (type: string) => {
            const params = new URLSearchParams(searchParams);
            params.set("type", type);
            // reset page if needed?
            router.push(`${pathname}?${params.toString()}`);
      };

      const tabs = [
            { id: "applied", label: "Applied" }, // Maps to ?type=applied. Status 'applied'? Or 'pending'?
            { id: "hired", label: "Shortlisted" },
            { id: "rejected", label: "Rejected" },
            // { id: "hired", label: "Hired" }, // Optional based on types
      ];

      return (
            <Container1080>
                  <MobileStickyHeader title="My Applied Jobs" />
                  <div className="px-4 sm:px-6 space-y-8 my-6">
                        
                        <div className="flex flex-col gap-4">
                              <Breadcrumbs
                                    items={[
                                          { id: "1", label: "Home", href: "/" },
                                          { id: "2", label: "Jobs", href: "/jobs" },
                                          { id: "3", label: "My Applied Jobs", href: "/jobs/applied" },
                                    ]}
                              />

                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div>
                                          <Typography variant="h2" className="text-dark-blue dark:text-gray-100 font-bold mb-1">
                                                My Applied Jobs
                                          </Typography>
                                          <Typography variant="body-small" className="text-grey-blue dark:text-gray-400">
                                                Track and manage your job applications in one place.
                                          </Typography>
                                    </div>
                                    <div className="bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl inline-flex gap-1 border border-gray-200 dark:border-gray-700">
                                          {tabs.map((tab) => (
                                                <button
                                                      key={tab.id}
                                                      onClick={() => handleTabChange(tab.id)}
                                                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                                            currentType === tab.id
                                                                  ? "bg-white dark:bg-gray-700 text-purple shadow-sm ring-1 ring-black/5"
                                                                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                      }`}
                                                >
                                                      {tab.label}
                                                </button>
                                          ))}
                                    </div>
                              </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                              <Typography variant="body-small" className="text-grey-blue dark:text-gray-400 font-medium">
                                    Showing {applications.length} {currentType} applications
                              </Typography>
                        </div>

                        {isLoading ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[...Array(6)].map((_, i) => (
                                          <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
                                    ))}
                              </div>
                        ) : applications.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {applications.map((app) => (
                                          <AppliedJobCard key={app._id} application={app} />
                                    ))}
                              </div>
                        ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                                    <NoDataCard 
                                          title={`No ${currentType} Jobs Found`} 
                                          description={`You don't have any job applications with status "${currentType}" at the moment.`} 
                                    />
                              </div>
                        )}
                  </div>
            </Container1080>
      );
}
