"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Star, Zap, Award } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { PlanCard, } from "./_components/PlanCard";
import { useGetPlans } from "@/hooks/usePlans";
import { IPlan } from "@/interfaces/plan.types";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

import { useGetMySubscription } from "@/hooks/useSubscriptions";
import { PlanSkeleton } from "./_components/plancard-skeleton";

export default function PlansPage() {
  const { t, locale } = useLocale();
  const [isYearly, setIsYearly] = useState(false);
  const { data: plansData, isLoading, error } = useGetPlans();
  const { data: mySubscription } = useGetMySubscription();

  const getPlanIcon = (planName: string) => {
    // ... (same as before)
    const normalizeName = planName.toLowerCase();
    if (normalizeName.includes("silver") || normalizeName.includes("basic"))
      return Star;
    if (normalizeName.includes("gold") || normalizeName.includes("advanced"))
      return Zap;
    if (normalizeName.includes("platinum") || normalizeName.includes("premium"))
      return Award;
    return Star;
  };

  const getFeatures = (plan: IPlan) => {
    // ... (same as before)
    if (!plan.features || plan.features.length === 0) return [];
    let featuresList = plan.features;
    if (plan.features.length === 1 && plan.features[0].includes(",")) {
      featuresList = plan.features[0].split(",");
    }
    return featuresList.map((f) => f.trim());
  };

  const displayPlans = (plansData?.data || []).filter((plan) => {
    // Case insensitive comparison for planType
    const type = plan.planType?.toUpperCase() || "MONTHLY";
    // If isYearly is true, show YEARLY, else MONTHLY
    return isYearly ? type === "YEARLY" : type === "MONTHLY";
  });

  // Helper to check if plan is current
  // subscription response is a list: { data: ISubscription[] }
  // We need to find if there is an active subscription for any plan
  const activeSubscription = Array.isArray(mySubscription?.data)
    ? mySubscription?.data.find((sub) => sub.isActive)
    : undefined;

  // If mySubscription.data is not array (older api structure), fallback (though we updated service)
  // But let's stick to array logic as per latest service change.

  const currentPlanId = activeSubscription?.plan?._id; 

  return (
    <div className="min-h-screen bg-white">
      <MobileStickyHeader title={"Our Plans"} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Plans and pricing badge */}
          <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
            {t.plans.badge}
          </div>

          <Typography variant="5xl-semibold" className="text-black mb-4">
            {t.plans.title}
          </Typography>
          <Typography
            variant="md-regular"
            className="text-gray-600 max-w-2xl mx-auto mb-8"
          >
            {t.plans.subtitle}
          </Typography>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-black gap-2 rounded-full p-1 flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 cursor-pointer py-2 rounded-full text-sm font-medium transition-all ${!isYearly
                  ? "bg-white rounded-full text-black border border-gray-200"
                  : "text-gray-300"
                  }`}
              >
                {t.plans.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 cursor-pointer py-2 rounded-full text-sm font-regular transition-all ${isYearly
                  ? "bg-white rounded-full text-black border border-gray-200"
                  : "text-gray-300"
                  }`}
              >
                {t.plans.yearly}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 mx-auto">
            {[1, 2, 3].map((i) => (
              <PlanSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">
            <Typography variant="xl-medium">
              Failed to load plans. Please try again later.
            </Typography>
          </div>
        )}

        {/* Plans Grid */}
        {!isLoading && !error && (
          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 mx-auto">
            {displayPlans.map((plan) => {
              const features = getFeatures(plan);
              const planName = locale === "ar" && plan.planAr ? plan.planAr : plan.plan;

              const displayPrice = plan.discountedPrice
                ? plan.discountedPrice.toFixed(0).toString()
                : plan.price.toFixed(0).toString();
              const displayOriginalPrice = plan.discountedPrice
                ? plan.price.toFixed(0).toString()
                : "";

              const isCurrentPlan = currentPlanId === plan._id;

              // Map properties to PlanCard props
              const cardProps = {
                id: plan._id,
                validation: plan.validation,
                validationPeriod: plan.validationPeriod,
                name: planName,
                icon: getPlanIcon(plan.plan),
                price: displayPrice,
                originalPrice: displayOriginalPrice,
                description: "", 
                features: features,
                buttonText: isCurrentPlan ? "Current Plan" : "Subscribe",
                isPopular: plan.isPopular,
                isPremium: plan.plan.toLowerCase() === "platinum",
                isCurrent: isCurrentPlan // Add this property to PlanCardProps interface
              };

              return (
                <PlanCard
                  key={plan._id}
                  plan={cardProps}
                  perMonthText={t.plans.perMonth}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
