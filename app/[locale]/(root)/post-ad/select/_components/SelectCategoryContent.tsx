"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useRouter } from "nextjs-toploader/app";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAdAvailability } from "@/hooks/useAdAvailability";
import { InsufficientAdsDialog } from "@/components/global/InsufficientAdsDialog";
import { PageBannerCarousel } from "@/components/global/page-banner-carousel";
import { PlanSelectionDialog } from "@/components/global/PlanSelectionDialog";
import { NoActivePlansDialog } from "@/components/global/NoActivePlansDialog";
import { ISubscription } from "@/interfaces/subscription.types";

export default function SelectCategoryContent() {
  const router = useRouter();
  const {
    addToCategoryArray,
    setActiveCategory,
    setStep,
    categoryArray,
    clearCategoryArray,
  } = useAdPostingStore((state) => state);

  // Availability Hook
  const {
    checkAvailability,
    getCompatibleSubscriptions,
    dialogProps,
    isLoading: subscriptionsLoading,
  } = useAdAvailability();

  const setSubscriptionId = useAdPostingStore((state) => state.setSubscriptionId);
  const [isPlanSelectionDialogOpen, setIsPlanSelectionDialogOpen] = useState(false);
  const [compatibleSubs, setCompatibleSubs] = useState<ISubscription[]>([]);
  const [pendingSelection, setPendingSelection] = useState<{
    categoryId: string;
    categoryName: string;
    categoryType: string;
  } | null>(null);

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Use API data directly
  const categories = categoriesData?.filter((cat) => cat.name !== "Jobs") || [];

  const handleCategorySelect = (categoryId: string) => {
    // Find the selected category to get its name
    const selectedCategory = categories.find((cat) => cat._id === categoryId);

    if (selectedCategory) {
      // Use relatedTo if available, otherwise fallback to name-based detection or "Ads"
      let typeToPass = selectedCategory.relatedTo || "Ads";

      // If it's a generic "Ads" type, still do a quick name check for legacy/fallback
      if (typeToPass === "Ads") {
        const categoryName = selectedCategory.name.toLowerCase();
        if (
          categoryName.includes("property") ||
          categoryName === "properties"
        ) {
          typeToPass = "Properties";
        } else if (
          categoryName.includes("motor") ||
          categoryName === "motors" ||
          categoryName === "cars" ||
          categoryName === "vehicles"
        ) {
          typeToPass = "Motors";
        } else if (categoryName.includes("electronic")) {
          typeToPass = "Electronics";
        }
      }

      // Check ad availability for the determined plan type and this category
      if (!checkAvailability(typeToPass, selectedCategory.name, selectedCategory._id)) {
        return;
      }

      const subs = getCompatibleSubscriptions(typeToPass, selectedCategory._id);
      const paidPlans = subs.filter(sub => !sub.plan?.isDefault && sub.plan?.type?.toLowerCase() !== 'basic');
      const basicPlans = subs.filter(sub => sub.plan?.isDefault || sub.plan?.type?.toLowerCase() === 'basic');

      // Rule 1: Both basic and paid -> Show dialog to give user a choice
      if (paidPlans.length > 0 && basicPlans.length > 0) {
        setCompatibleSubs(subs);
        setPendingSelection({ 
          categoryId: selectedCategory._id, 
          categoryName: selectedCategory.name,
          categoryType: typeToPass
        });
        setIsPlanSelectionDialogOpen(true);
        return;
      }

      // Rule 2: No paid but has basic -> Show dialog (per user request)
      if (paidPlans.length === 0 && basicPlans.length > 0) {
        setCompatibleSubs(subs);
        setPendingSelection({ 
          categoryId: selectedCategory._id, 
          categoryName: selectedCategory.name,
          categoryType: typeToPass
        });
        setIsPlanSelectionDialogOpen(true);
        return;
      }

      // Case 3: Multiple paid plans -> Show Dialog
      if (paidPlans.length > 1) {
        setCompatibleSubs(paidPlans); // Show only paid plans or all? User says "give him the option to select"
        setPendingSelection({ 
          categoryId: selectedCategory._id, 
          categoryName: selectedCategory.name,
          categoryType: typeToPass
        });
        setIsPlanSelectionDialogOpen(true);
        return;
      }

      // Case 4: Only 1 plan total
      if (subs.length === 1) {
        const isBasic = subs[0].plan?.type?.toLowerCase() === 'basic' || subs[0].plan?.isDefault;
        
        if (isBasic) {
          // If only 1 basic plan, still show dialog to "recommend" paid plans (as per PlanSelectionDialog design)
          setCompatibleSubs(subs);
          setPendingSelection({ 
            categoryId: selectedCategory._id, 
            categoryName: selectedCategory.name,
            categoryType: typeToPass
          });
          setIsPlanSelectionDialogOpen(true);
        } else {
          // If only 1 paid plan, auto-select is fine
          setSubscriptionId(subs[0]._id);
          handleNavigation(selectedCategory._id, selectedCategory.name);
        }
        return;
      }

      // Fallback
      handleNavigation(selectedCategory._id, selectedCategory.name);
    }
  };

  const handleNavigation = (categoryId: string, categoryName: string) => {
    // Add to category array for breadcrumbs
    addToCategoryArray({
      id: categoryId,
      name: categoryName,
    });

    // Set as active category
    setActiveCategory(categoryId);

    // Update step to 2
    setStep(2);

    // Navigate to the category ID route
    router.push(`/post-ad/${categoryId}`);
  };

  const onPlanSelect = (subscriptionId: string) => {
    setSubscriptionId(subscriptionId);
    setIsPlanSelectionDialogOpen(false);
    if (pendingSelection) {
      handleNavigation(pendingSelection.categoryId, pendingSelection.categoryName);
    }
  };

  useEffect(() => {
    if (categoryArray.length > 0) {
      clearCategoryArray();
    }
  }, [categoryArray, clearCategoryArray]);

  return (
    <Container1080>
      {/* Availability/Error Dialogs */}
      {dialogProps.mode === "no_plans" && (
        <NoActivePlansDialog {...dialogProps} />
      )}
      {dialogProps.mode === "insufficient" && (
        <InsufficientAdsDialog {...dialogProps} />
      )}

      {/* Manual Selection Dialog */}
      <PlanSelectionDialog
        isOpen={isPlanSelectionDialogOpen}
        onClose={() => setIsPlanSelectionDialogOpen(false)}
        subscriptions={compatibleSubs}
        onSelect={onPlanSelect}
        categoryName={pendingSelection?.categoryName || "Category"}
        categoryType={pendingSelection?.categoryType}
        mode="selection"
      />

      <div className=" w-full max-w-[888px] flex-1 mx-auto bg-transparent">
        {/* Main Container */}
        <div className="w-full mx-auto bg-transparent">
          {/* Main Content */}
          <div className="pb-8 ">
            <div className="mb-8">
              <PageBannerCarousel slug="post-ad-page" />
            </div>

            {/* First Row */}
            <div className="flex flex-wrap justify-center items-center gap-[13px]">
              {categoriesLoading || subscriptionsLoading ? (
                // Loading skeleton
                Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 animate-pulse"
                  >
                    <div className="w-[70px] h-[70px] bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                ))
              ) : categoriesError ? (
                // Error state
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
              ) : (
                // Categories
                categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category._id)}
                    className="bg-[#F7F8FA] dark:bg-gray-800 rounded-lg p-5 w-full sm:w-[150px] min-h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-purple/10 dark:hover:bg-purple/20 hover:scale-105 cursor-pointer transition-all duration-300"
                  >
                    {category.icon && (
                      <div className="w-[70px] h-[70px] relative">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          fill
                          unoptimized
                          className="object-contain rounded"
                        />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-black dark:text-white text-center line-clamp-2 leading-tight">
                      {category.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
}
