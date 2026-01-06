"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetJobApplicants } from "@/hooks/useJobApplications";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import ApplicantsPreview from "./applicants-preview";
import JobApplicantCard from "./job-applicant-card";
import { useRouter } from "nextjs-toploader/app";
import { useLocale } from "@/hooks/useLocale";

interface JobApplicantsModalProps {
  jobId: string;
  trigger?: React.ReactNode;
}

export default function JobApplicantsModal({
  jobId,
  trigger,
}: JobApplicantsModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();
  const { data: applicantsData, isLoading } = useGetJobApplicants(
    jobId,
    undefined
  );

  const applicants = applicantsData?.data?.items || [];
  const pagination = applicantsData?.data;

  // Get avatars from applicants - use real profile images if available
  const avatars: string[] = applicants.slice(0, 3).map((applicant) => {
    const profile = applicant.applicantProfileId;
    // Check for photoUrl in the profile (it exists in API response but not in TypeScript interface)
    const photoUrl =
      profile && typeof profile === "object" && "photoUrl" in profile
        ? (profile as { photoUrl?: string }).photoUrl
        : undefined;
    const profileName = profile?.name || "Unknown User";

    // Use real photo if available, otherwise fallback to generated avatar
    if (photoUrl) {
      return photoUrl;
    }

    // Fallback to generated avatar if no photo
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profileName
    )}&background=random`;
  });

  const totalCount = pagination?.total || applicants.length;

  const defaultTrigger = (
    <ApplicantsPreview
      avatars={avatars}
      count={totalCount}
      onViewClick={() => setOpen(true)}
    />
  );

  return (
    <>
      {trigger || defaultTrigger}
      <ResponsiveModal open={open} onOpenChange={setOpen}>
        <ResponsiveModalContent className="w-full sm:max-w-[95vw] lg:max-w-5xl max-h-[90vh] overflow-y-auto">
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Job Applicants</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              View and manage applicants for this job posting
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Typography variant="body" className="text-gray-500">
                  Loading applicants...
                </Typography>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12">
                <Typography variant="body" className="text-gray-500">
                  No applicants yet
                </Typography>
              </div>
            ) : (
              <>
                <div className="space-y-4 w-full">
                  {applicants.slice(0, 5).map((applicant) => (
                    <JobApplicantCard
                      key={applicant._id}
                      applicant={applicant}
                      jobId={jobId}
                      onViewProfile={() => {
                        const params = new URLSearchParams({
                          type: "applicantsList",
                          applicationId: applicant._id,
                          jobId: jobId,
                        });
                        router.push(
                          `/jobs/jobseeker/${
                            applicant.applicantProfileId?._id
                          }?${params.toString()}`
                        );
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-center pt-4 border-t">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      router.push(
                        `/${locale}/jobs/listing/${jobId}/applicants`
                      );
                    }}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    View All Applicants ({totalCount})
                  </Button>
                </div>
              </>
            )}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
}
