"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/global/footer";
import EmployerHeader from "../../employer/[id]/_components/employer-header";
import EmployerInfo from "../../employer/[id]/_components/employer-info";
import EmployerJobs from "../../employer/[id]/_components/employer-jobs";
import EmployerReviews from "../../employer/[id]/_components/employer-reviews";
import EmployerStats from "../../employer/[id]/_components/employer-stats";
import { useOrganizationById } from "@/hooks/useOrganizations";
import { EmployerReview } from "@/interfaces/job.types";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { useAuthStore } from "@/stores/authStore";
import { useMemo } from "react";

export default function OrganizationDetailPage() {
  const params = useParams();
  const organizationId = params.id as string;
  const { localePath } = useLocale();
  const { session } = useAuthStore((state) => state);
  const currentUserId = session.user?._id;

  const { data: orgData, isLoading } = useOrganizationById(organizationId);
  const organization = orgData?.data;

  // Check if current user is the owner
  const isOwner = useMemo(() => {
    if (!currentUserId || !organization) return false;
    const ownerId = typeof organization.owner === "string" 
      ? organization.owner 
      : organization.owner?._id;
    return currentUserId === ownerId;
  }, [currentUserId, organization]);

  // Mock reviews - replace with actual API call
  const reviews: EmployerReview[] = [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-dark-blue mb-2">
              Organization Not Found
            </h1>
            <p className="text-[#8A8A8A]">
              The organization you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <div className="relative">
        <EmployerHeader 
          employer={organization} 
          onFollow={isOwner ? undefined : undefined}
          isFollowing={false}
        />
        
        {/* Edit Button - Only show if user is the owner */}
        {isOwner && (
          <div className="max-w-[1280px] mx-auto px-4 -mt-16 relative z-20">
            <div className="flex justify-end">
              <Link href={localePath(`/organizations/edit/${organization._id}`)}>
                <Button
                  variant="primary"
                  icon={<Edit className="w-4 h-4" />}
                  iconPosition="left"
                  className="bg-purple text-white hover:bg-purple/90 shadow-lg"
                >
                  Edit Organization
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8 mt-8">
        <div className="space-y-6">
          {/* Stats */}
          <EmployerStats
            totalJobsPosted={organization.totalJobsPosted || 0}
            activeJobs={organization.activeAds || 0}
            totalApplicants={0} // TODO: Calculate from applicants
            totalEmployees={0} // TODO: Get from organization data
          />

          {/* Company Info */}
          <EmployerInfo employer={organization} />

          {/* Active Jobs */}
          <EmployerJobs employerId={organizationId} />

          {/* Reviews */}
          <EmployerReviews
            reviews={reviews}
            averageRating={organization.ratingAvg}
            totalReviews={organization.ratingCount}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}

