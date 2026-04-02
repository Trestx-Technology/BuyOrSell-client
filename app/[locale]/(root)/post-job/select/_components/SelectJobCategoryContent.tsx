"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useJobSubcategories } from "@/hooks/useCategories";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useRouter } from "nextjs-toploader/app";
import { useMyOrganization } from "@/hooks/useOrganizations";
import OrganizationRequiredDialog from "@/app/[locale]/(root)/post-ad/_components/OrganizationRequiredDialog";
import { hasOrganization } from "@/validations/post-ad.validation";
import { useAdSubscription } from "@/hooks/useAdSubscription";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { Container1080 } from "@/components/layouts/container-1080";
import { toast } from "sonner";
import { H2 } from "@/components/typography";
import { NoActivePlansDialog } from "@/components/global/NoActivePlansDialog";
import { InsufficientAdsDialog } from "@/components/global/InsufficientAdsDialog";
import { PageBannerCarousel } from "@/components/global/page-banner-carousel";

export default function SelectJobCategoryContent() {
  const router = useRouter();
  const {
    addToCategoryArray,
    setActiveCategory,
    setStep,
    categoryArray,
    clearCategoryArray,
    currentStep,
  } = useAdPostingStore((state) => state);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  // Unified Subscription Hook
  const {
    checkAvailability,
    resolve,
    dialogProps,
    isLoading: subscriptionsLoading,
  } = useAdSubscription();

  const setSubscriptionId = useAdPostingStore((state) => state.setSubscriptionId);
  const fetchSubscriptions = useSubscriptionStore((state) => state.fetchSubscriptions);
  const [pendingSelection, setPendingSelection] = useState<{
    categoryId: string;
    categoryName: string;
    categoryType: string;
  } | null>(null);

  // Fetch subscriptions on mount to ensure fresh state
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Fetch categories using the hook
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useJobSubcategories();

  // Fetch user organizations
  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    refetch: refetchOrganizations,
  } = useMyOrganization();
  const organizations = organizationsData?.data || [];

  useEffect(() => {
    if (organizations.length === 0 && !organizationsLoading) {
      setShowOrgDialog(true);
    }
  }, [organizations, organizationsLoading]);

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);

    if (selectedCategory) {
      // Ensure user has organization for jobs
      if (!hasOrganization(organizations)) {
        setShowOrgDialog(true);
        return;
      }

      // Check ad availability for "Jobs" plan type and this category
      const typeToPass = selectedCategory.relatedTo || "Jobs";
      if (!checkAvailability({
        action: "post",
        categoryType: typeToPass,
        categoryName: selectedCategory.name,
        categoryId: selectedCategory._id,
      })) {
        return;
      }

      // Auto-resolve best plan using logic: Category-Specific > Default > None
      const resolved = resolve(typeToPass, selectedCategory._id);

      if (resolved.subscription) {
        setSubscriptionId(resolved.subscription._id);
        handleNavigation(selectedCategory._id, selectedCategory.name);
        return;
      }

      handleNavigation(selectedCategory._id, selectedCategory.name);
    }
  };

  const handleNavigation = (categoryId: string, categoryName: string) => {
    addToCategoryArray({
      id: categoryId,
      name: categoryName,
    });

    setActiveCategory(categoryId);
    setStep(2);

    router.push(`/post-job/${categoryId}`);
  };

  // Ensure breadcrumbs and state are clear for a new selection
  useEffect(() => {
    if (categoryArray.length > 0 && currentStep === 1) {
      clearCategoryArray();
    }
  }, [categoryArray, clearCategoryArray, currentStep]);

  return (
    <Container1080>
      <OrganizationRequiredDialog
        isOpen={showOrgDialog}
        onClose={() => {
          setShowOrgDialog(false);
          refetchOrganizations();
        }}
      />

      {/* Availability/Error Dialogs */}
      {dialogProps.mode === "no_plans" && (
        <NoActivePlansDialog {...dialogProps} />
      )}
      {dialogProps.mode === "insufficient" && (
        <InsufficientAdsDialog {...dialogProps} />
      )}

      {/* Manual Selection Dialog - No longer needed as availability auto-selects */}
      <div className=" w-full max-w-[888px] flex-1 mx-auto bg-transparent">
        <div className="w-full mx-auto bg-transparent">
          <div className="pb-8">
            <div className="mb-6">
              <H2 className="font-bold text-[#1D2939] dark:text-white">
                Post a Job
              </H2>
              <p className="text-[#667085] dark:text-gray-400 mt-1">
                Select a job category to get started
              </p>
            </div>

            <div className="mb-8">
              <PageBannerCarousel slug="post-job-page" />
            </div>

            <div className="space-y-[13px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[13px]">
                {categoriesLoading ||
                organizationsLoading ||
                subscriptionsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 animate-pulse"
                    >
                      <div className="w-[70px] h-[70px] bg-gray-300 rounded"></div>
                      <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    </div>
                  ))
                ) : categoriesError ? (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">
                        Failed to load categories
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-purple-600 hover:text-purple-700 text-sm underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategorySelect(category._id)}
                      className="bg-[#F7F8FA] dark:bg-gray-800 rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-purple/10 dark:hover:bg-purple/20 hover:scale-105 cursor-pointer transition-all duration-300"
                    >
                      <div className="w-[70px] h-[70px] relative">
                        <Image
                          src={category.mobileImage || category.icon || ""}
                          alt={category.name}
                          fill
                          unoptimized
                          className="object-cover rounded"
                        />
                      </div>

                      <span className="text-sm font-semibold text-black dark:text-white text-center max-w-[130px] truncate whitespace-nowrap leading-tight">
                        {category.name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No Job categories found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
}
