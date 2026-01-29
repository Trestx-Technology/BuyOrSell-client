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
      console.log(applications)

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
                              <div className="flex items-center gap-2 mb-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            currentType === tab.id
                                                ? "bg-purple text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                              </div>
                              <Typography variant="body-small" className="text-grey-blue">
                                    You have {applications.length} {currentType} applications.
                              </Typography>
                        </div>

                        {isLoading ? (
                              <div className="flex flex-wrap gap-6">
                                    {[...Array(8)].map((_, i) => (
                                          <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
                                    ))}
                              </div>
                        ) : applications.length > 0 ? (
                              <div className="flex items-center flex-wrap gap-4">
                                    {applications.map((app) => (
                                          <AppliedJobCard key={app._id} application={app} />
                                    ))}
                              </div>

                        ) : (
                              <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <NoDataCard title={`No ${currentType} Jobs`} description={`You have no ${currentType} job applications.`} />
                              </div>
                        )}
                  </div>
            </Container1080>
      );
}
