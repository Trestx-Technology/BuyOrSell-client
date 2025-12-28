"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Check, Star, X, Award } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

export default function PlansPage() {
  const { t } = useLocale();
  const [isYearly, setIsYearly] = useState(false);

  const plans = useMemo(
    () => [
      {
        name: t.plans.plans.basic.name,
        icon: Star,
        price: isYearly ? "Đ19" : "Đ19",
        originalPrice: "Đ29",
        description: t.plans.plans.basic.description,
        features: t.plans.plans.basic.features,
        buttonText: t.plans.plans.basic.buttonText,
        isPopular: false,
        isPremium: false,
      },
      {
        name: t.plans.plans.advanced.name,
        icon: X,
        price: isYearly ? "Đ299" : "Đ299",
        originalPrice: "Đ399",
        description: t.plans.plans.advanced.description,
        features: t.plans.plans.advanced.features,
        buttonText: t.plans.plans.advanced.buttonText,
        isPopular: false,
        isPremium: false,
      },
      {
        name: t.plans.plans.premium.name,
        icon: Award,
        price: isYearly ? "Đ2,299" : "Đ2,299",
        originalPrice: "Đ129",
        description: t.plans.plans.premium.description,
        features: t.plans.plans.premium.features,
        buttonText: t.plans.plans.premium.buttonText,
        isPopular: true,
        isPremium: true,
      },
    ],
    [t, isYearly]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Plans and pricing badge */}
          <div className="inline-block bg-black text-white px-3 py-1 rounded-lg text-sm font-medium mb-6">
            {t.plans.badge}
          </div>

          <Typography variant="5xl-bold" className="text-black mb-4">
            {t.plans.title}
          </Typography>
          <Typography
            variant="lg-regular"
            className="text-gray-600 max-w-2xl mx-auto mb-8"
          >
            {t.plans.subtitle}
          </Typography>

          {/* Monthly/Yearly Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  !isYearly
                    ? "bg-white text-black border border-gray-200"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {t.plans.monthly}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  isYearly
                    ? "bg-white text-black border border-gray-200"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {t.plans.yearly}
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 transition-all duration-300 ${
                  plan.isPremium
                    ? "bg-purple-600 text-white"
                    : "bg-white border border-gray-200 hover:shadow-lg"
                }`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      plan.isPremium ? "bg-white" : "bg-purple-600"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${
                        plan.isPremium ? "text-purple-600" : "text-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Plan Name */}
                <Typography
                  variant="xl-semibold"
                  className={`text-center mb-2 ${
                    plan.isPremium ? "text-white" : "text-black"
                  }`}
                >
                  {plan.name}
                </Typography>

                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Typography
                      variant="4xl-bold"
                      className={plan.isPremium ? "text-white" : "text-black"}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="sm-regular"
                      className={
                        plan.isPremium ? "text-purple-200" : "text-gray-500"
                      }
                    >
                      {t.plans.perMonth}
                    </Typography>
                  </div>
                  <Typography
                    variant="sm-regular"
                    className={`line-through ${
                      plan.isPremium ? "text-purple-200" : "text-gray-400"
                    }`}
                  >
                    {plan.originalPrice}
                  </Typography>
                </div>

                {/* Description */}
                <Typography
                  variant="sm-regular"
                  className={`text-center mb-6 ${
                    plan.isPremium ? "text-purple-200" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </Typography>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.isPremium ? "text-white" : "text-purple-600"
                        }`}
                      />
                      <Typography
                        variant="sm-regular"
                        className={
                          plan.isPremium ? "text-white" : "text-gray-600"
                        }
                      >
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full rounded-lg font-medium ${
                    plan.isPremium
                      ? "bg-white text-purple-600 hover:bg-gray-100"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
