"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { useOrganizationById } from "@/hooks/useOrganizations";
import { useAuthStore } from "@/stores/authStore";
import OrganizationProfile from "./organization-profile";
import { Organization } from "@/interfaces/organization.types";
import { EmployerProfile } from "@/interfaces/job.types";

export default function OrganizationDetailContent() {
  const params = useParams();
  const organizationId = params.id as string;
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F7] dark:bg-slate-950">
        <div className="max-w-[1080px] mx-auto px-4 py-8">
          <div className="bg-gray-200 dark:bg-slate-800 rounded-2xl h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="min-h-screen bg-[#F2F4F7] dark:bg-slate-950">
        <div className="max-w-[1080px] mx-auto px-4 py-8">
          <div className="bg-white dark:bg-slate-900 border border-[#E2E2E2] dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-dark-blue dark:text-gray-100 mb-2">
              Organization Not Found
            </h1>
            <p className="text-[#8A8A8A] dark:text-gray-400">
              The organization you&apos;re looking for doesn&apos;t exist.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <OrganizationProfile
      organization={organization as Organization & Partial<EmployerProfile>}
      isOwner={isOwner}
    />
  );
}
