"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Typography } from "@/components/typography";
import { Star, Zap, Award, Building2, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { PlanCard } from "./_components/PlanCard";
import { useGetPlans } from "@/hooks/usePlans";
import { IPlan } from "@/interfaces/plan.types";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useGetMySubscription } from "@/hooks/useSubscriptions";
import { PlanSkeleton } from "./_components/plancard-skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlansPage() {
  const { t, locale } = useLocale();
  const [selectedType, setSelectedType] = useState<string>("");
  const { data: plansData, isLoading, error } = useGetPlans();
  const { data: mySubscription } = useGetMySubscription();
  const router = useRouter();

  const getPlanIcon = (planName: string) => {
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
    if (!plan.features || plan.features.length === 0) return [];
    let featuresList = plan.features;
    if (plan.features.length === 1 && plan.features[0].includes(",")) {
      featuresList = plan.features[0].split(",");
    }
    return featuresList.map((f) => f.trim());
  };

  // Extract unique plan types
  const planTypes = useMemo(() => {
    if (!plansData?.data) return [];
    // Get unique types from valid plans
    const types = new Set(plansData.data.map((plan) => plan.type));
    // Filter out undefined/null and sort
    return Array.from(types).filter((type): type is string => !!type).sort();
  }, [plansData]);

  // Set default selected type when data loads
  useEffect(() => {
    if (planTypes.length > 0 && !selectedType) {
      setSelectedType(planTypes[0]);
    }
  }, [planTypes, selectedType]);

  const displayPlans = (plansData?.data || []).filter((plan) => {
    return plan.type === selectedType;
  });

  const activeSubscription = Array.isArray(mySubscription?.data)
    ? mySubscription?.data.find((sub) => sub.isActive)
    : undefined;

  const currentPlanId = activeSubscription?.plan?._id;

  return (
    <div className="min-h-screen bg-white">
      <MobileStickyHeader title={"Our Plans"} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-10">
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

          {/* Plan Types Tabs */}
          {!isLoading && planTypes.length > 0 && (
            <div className="w-full flex justify-center mb-8">
              {/* Mobile View: Dropdown */}
              <div className="md:hidden w-full max-w-xs relative">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full bg-gray-100 text-black border-none rounded-xl font-medium focus:ring-2 focus:ring-black/5">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {planTypes.map((type) => (
                      <SelectItem key={type} value={type} className="cursor-pointer">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop View: Tabs */}
              <div className="hidden md:flex bg-gray-100 p-1.5 rounded-full items-center">
                {planTypes.map((type) => (
              <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${selectedType === type
                      ? "bg-white text-black shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                    {type}
              </button>
                ))}
              </div>
            </div>
          )}

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
            <div className="flex flex-wrap justify-center gap-8 mx-auto">
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
                isCurrent: isCurrentPlan
              };

              return (
                <PlanCard
                  key={plan._id}
                  plan={cardProps}
                  perMonthText={t.plans.perMonth}
                />
              );
            })}

              {/* Static Enterprise Card */}
              <div className="w-full sm:max-w-xs rounded-2xl flex flex-col p-8 transition-all duration-300 bg-white border border-gray-200 hover:shadow-lg">
                {/* Icon */}
                <div className="flex justify-start mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Plan Name */}
                <Typography variant="xl-semibold" className="text-left mb-2 text-black">
                  Enterprise
                </Typography>

                {/* Pricing */}
                <div className="text-left mb-4">
                  <Typography variant="2xl-bold" className="text-black">
                    Custom Pricing
                  </Typography>
                </div>

                {/* Description */}
                <Typography variant="sm-regular" className="text-left mb-6 text-gray-600">
                  Custom solutions for large organizations requiring tailored features and priority support.
                </Typography>

                {/* Features List */}
                <div className="space-y-3 flex-1 mb-8">
                  {[
                    "Unlimited Listings",
                    "Dedicated Account Manager",
                    "Custom Integration",
                    "Priority Support",
                    "Advanced Analytics",
                    "SLA Agreement"
                  ].map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="size-6 mt-0.5 flex-shrink-0 text-purple fill-white border-black" />
                      <Typography variant="sm-regular" className="text-gray-600">
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => router.push(`/${locale}/contact-us`)}
                  className="w-full rounded-lg font-medium bg-purple text-white hover:bg-gray-800"
                >
                  Contact Us
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
    </div>

  );
}
