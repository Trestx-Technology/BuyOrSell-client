"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Table } from "@/components/table/table";
import { useGetJobApplicants } from "@/hooks/useJobApplications";
import { JobApplicant } from "@/interfaces/job.types";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { createColumns } from "./_components/columns";

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLocale();
  const jobId = params.jobId as string;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: applicantsData, isLoading } = useGetJobApplicants(jobId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const applicants = applicantsData?.data?.items || [];
  const totalCount = applicantsData?.data?.total || 0;

  const { locale: currentLocale } = useLocale();

  const columns = useMemo(
    () => createColumns(jobId, router, currentLocale),
    [jobId, router, currentLocale]
  );

  return (
    <Container1080>
      <MobileStickyHeader title="Job Applicants" />

      <div className="p-6 space-y-6">
        <Breadcrumbs
          items={[
            {
              id: "jobs",
              label: "Jobs",
              href: `/${locale}/jobs`,
            },
            {
              id: "listing",
              label: "Job Listings",
              href: `/${locale}/jobs/listing`,
            },
            {
              id: jobId,
              label: "Job Applicants",
              href: `/${locale}/jobs/listing/${jobId}/applicants`,
            },
          ]}
          showHomeIcon={false}
          showSelectCategoryLink={false}
        />

        <div className="bg-white rounded-2xl">
          <div className="lg:block hidden">
            <Typography variant="h2" className="text-dark-blue font-bold mb-2">
              Job Applicants
            </Typography>
            <Typography variant="body-small" className="text-grey-blue">
              View and manage all applicants for this job posting ({totalCount}{" "}
              {totalCount === 1 ? "applicant" : "applicants"})
            </Typography>
          </div>

          <Table<JobApplicant>
            data={applicants}
            columns={columns}
            loading={isLoading}
            showPagination={true}
            pagination={pagination}
            onPaginationChange={setPagination}
            rowCount={totalCount}
            onRowClick={(row) => {
              const applicant = row.original;
              const profileId = applicant.applicantProfileId?._id;
              if (profileId) {
                const params = new URLSearchParams({
                  type: "applicantsList",
                  applicationId: applicant._id,
                  jobId: jobId,
                });
                router.push(
                  `/${locale}/jobs/jobseeker/${profileId}?${params.toString()}`
                );
              }
            }}
          />
        </div>
      </div>
    </Container1080>
  );
}
