"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Star, Zap, Award } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { PlanCard } from "./_components/PlanCard";
import { useGetPlans } from "@/hooks/usePlans";
import { IPlan } from "@/interfaces/plan.types";

export default function PlansPage() {
  const { t, locale } = useLocale();
  const [isYearly, setIsYearly] = useState(false);
  const { data: plansData, isLoading, error } = useGetPlans();

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
    // The API might return features as a single CSV string in an array or a real array
    // Based on example: ["Feature 1,Feature 2"]
    if (!plan.features || plan.features.length === 0) return [];

    let featuresList = plan.features;
    if (plan.features.length === 1 && plan.features[0].includes(",")) {
      featuresList = plan.features[0].split(",");
    }
    return featuresList.map((f) => f.trim());
  };

  const displayPlans = plansData?.data || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
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

        {/* Loading/Error States */}
        {isLoading && (
          <div className="text-center py-20">
            <Typography variant="xl-medium">Loading plans...</Typography>
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
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPlans.map((plan) => {
              const features = getFeatures(plan);
              const planName = locale === "ar" && plan.planAr ? plan.planAr : plan.plan;

              // Since API provides one price, we use it directly.
              // If isYearly is true, we might hypothetically show a yearly calculation or filter if API supported it.
              // For now, we display the price from API. 
              // Example API has monthly validation.
              const price = plan.price.toString();
              const originalPrice = (
                plan.price + (plan.discount ? (plan.price * plan.discount) / 100 : 0) // rough reverse calc or just show regular
              ).toFixed(0);
              // Or better, if discount is applied, price is discountedPrice? 
              // JSON: "price": 49, "discount": 20, "discountedPrice": 39.2
              // So 'price' is original, 'discountedPrice' is actual?
              // The UI usually shows "Current Price" and "crossed out Original Price".
              const displayPrice = plan.discountedPrice
                ? plan.discountedPrice.toFixed(0).toString()
                : plan.price.toFixed(0).toString();
              const displayOriginalPrice = plan.discountedPrice
                ? plan.price.toFixed(0).toString()
                : "";

              // Map properties to PlanCard props
              const cardProps = {
                id: plan._id,
                validation: plan.validation,
                validationPeriod: plan.validationPeriod,
                name: planName,
                icon: getPlanIcon(plan.plan),
                price: displayPrice,
                originalPrice: displayOriginalPrice,
                description: "", // API doesn't have description, maybe use features summary or empty
                features: features,
                buttonText: "Subscribe", // Could use translation t.plans.subscribe
                isPopular: plan.isPopular, // API has isPopular
                isPremium: plan.plan.toLowerCase() === "platinum", // or based on logic
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

