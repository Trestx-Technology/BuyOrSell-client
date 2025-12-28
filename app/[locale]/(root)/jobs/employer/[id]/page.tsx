"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Footer } from "@/components/global/footer";
import EmployerHeader from "./_components/employer-header";
import EmployerInfo from "./_components/employer-info";
import EmployerJobs from "./_components/employer-jobs";
import EmployerReviews from "./_components/employer-reviews";
import EmployerStats from "./_components/employer-stats";
import { useOrganizationById } from "@/hooks/useOrganizations";
import { EmployerReview } from "@/interfaces/job.types";

export default function EmployerProfilePage() {
  const params = useParams();
  const employerId = params.id as string;
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: orgData, isLoading } = useOrganizationById(employerId);
  const employer = orgData?.data;

  // Mock reviews - replace with actual API call
  const reviews: EmployerReview[] = [];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement API call to follow/unfollow employer
  };

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

  if (!employer) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
     
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-dark-blue mb-2">
              Employer Not Found
            </h1>
            <p className="text-[#8A8A8A]">
              The employer profile you&apos;re looking for doesn&apos;t exist.
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
      <EmployerHeader
        employer={employer}
        onFollow={handleFollow}
        isFollowing={isFollowing}
      />

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8 mt-8">
        <div className="space-y-6">
          {/* Stats */}
          <EmployerStats
            totalJobsPosted={0} // TODO: Calculate from jobs
            activeJobs={0} // TODO: Calculate from jobs
            totalApplicants={0} // TODO: Calculate from applicants
            totalEmployees={0} // TODO: Get from employer data
          />

          {/* Company Info */}
          <EmployerInfo employer={employer} />

          {/* Active Jobs */}
          <EmployerJobs employerId={employerId} />

          {/* Reviews */}
          <EmployerReviews
            reviews={reviews}
            averageRating={employer.ratingAvg}
            totalReviews={employer.ratingCount}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}

