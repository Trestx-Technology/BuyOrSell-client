"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { Typography } from "@/components/typography";
import {
  Star,
  Zap,
  Award,
  Building2,
  CheckCircle2,
  Gem,
  Crown,
  Rocket,
  Sparkles,
  Diamond,
  ShieldCheck,
  Medal,
  Car,
  Home,
  Briefcase,
  Laptop,
  Armchair,
  Tags,
  Users,
  Factory,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { PlanCard } from "./PlanCard";
import { useGetPlans, useGetDefaultPlans } from "@/hooks/usePlans";
import { IPlan } from "@/interfaces/plan.types";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useGetMySubscription } from "@/hooks/useSubscriptions";
import { PlanSkeleton } from "./plancard-skeleton";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

function PlansContent() {
  const { t, locale, localePath } = useLocale();
  const searchParams = useSearchParams();
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const urlType = searchParams.get("type");
  const [selectedType, setSelectedType] = useState<string>(urlType || "");
  const {
    data: plansData,
    isLoading: isPlansLoading,
    error: plansError,
  } = useGetPlans();
  const { data: defaultPlans, isLoading: isDefaultLoading } =
    useGetDefaultPlans();
  const { data: mySubscription } = useGetMySubscription();

  const isLoading = isPlansLoading || isDefaultLoading;
  const error = plansError;
  const router = useRouter();
  const user = useAuthStore((state) => state.session.user);
  const isVerifiedEmarati = user?.emaratiStatus === "VERIFIED";

  const getPlanIcon = (planName: string, index: number) => {
    const normalizeName = planName.toLowerCase();
    if (normalizeName.includes("silver") || normalizeName.includes("basic"))
      return Star;
    if (normalizeName.includes("gold") || normalizeName.includes("advanced"))
      return Zap;
    if (normalizeName.includes("platinum") || normalizeName.includes("premium"))
      return Award;
    if (normalizeName.includes("diamond")) return Diamond;
    if (normalizeName.includes("pro") || normalizeName.includes("professional"))
      return Crown;
    if (normalizeName.includes("starter")) return Rocket;

    const fallbackIcons = [
      Star,
      Zap,
      Award,
      Gem,
      Crown,
      Rocket,
      Sparkles,
      Diamond,
      ShieldCheck,
      Medal,
    ];

    return fallbackIcons[index % fallbackIcons.length];
  };

  const getCategoryIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("motor") || t.includes("car")) return Car;
    if (
      t.includes("property") ||
      t.includes("real estate") ||
      t.includes("home")
    )
      return Home;
    if (t.includes("job")) return Briefcase;
    if (t.includes("electronic") || t.includes("phone")) return Laptop;
    if (t.includes("furniture")) return Armchair;
    if (t.includes("classified")) return Tags;
    if (t.includes("community")) return Users;
    if (t.includes("business") || t.includes("industrial")) return Factory;
    if (t.includes("basic") || t.includes("free")) return Zap;
    return Package;
  };

  const getFeatures = (plan: IPlan) => {
    if (!plan.features || plan.features.length === 0) return [];
    let featuresList = plan.features;
    if (plan.features.length === 1 && plan.features[0].includes(",")) {
      featuresList = plan.features[0].split(",");
    }
    return featuresList.map((f) => f.trim());
  };

  const allPlans = useMemo(() => {
    const plans = plansData?.data || [];
    // Ensure default plans are included if they have data
    if (defaultPlans?.data) {
      const defaultPlansData = Array.isArray(defaultPlans.data)
        ? defaultPlans.data
        : [defaultPlans.data];
      return [...defaultPlansData, ...plans];
    }
    return plans;
  }, [plansData, defaultPlans]);

  // Extract unique plan types
  const planTypes = useMemo(() => {
    if (!allPlans) return [];
    const types = new Set(allPlans.map((plan) => plan.type));
    return Array.from(types)
      .filter((type): type is string => !!type)
      .sort();
  }, [allPlans]);

  // Sync state from URL and handle initial default
  useEffect(() => {
    if (planTypes.length === 0) return;

    const queryType = searchParams.get("type");

    // 1. If there's a type in the URL, try to match it
    if (queryType) {
      const matched = planTypes.find(
        (t) => t.toLowerCase() === queryType.toLowerCase(),
      );
      if (matched) {
        if (matched !== selectedType) {
          setSelectedType(matched);
        }
        return; // Prevent falling through to default logic
      }
    }

    // 2. If no valid URL type, ensure we have a valid selectedType or default to first
    if (!selectedType || !planTypes.includes(selectedType)) {
      setSelectedType(planTypes[0]);
    }
  }, [planTypes, searchParams]); // Removed selectedType from dependencies to prevent ping-pong

  // Sync URL from state (only when state changes manually)
  useEffect(() => {
    if (!selectedType || planTypes.length === 0) return;

    const currentUrlType = searchParams.get("type");
    if (currentUrlType?.toLowerCase() !== selectedType.toLowerCase()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", selectedType);
      router.replace(`/${locale}/plans?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [selectedType, locale, router]); // Only watch selectedType for manual changes

  // Scroll logic
  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [planTypes]);

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 300;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const displayPlans = allPlans.filter((plan) => {
    return plan.type === selectedType;
  });

  const subscribedPlanIds = useMemo(() => {
    return Array.isArray(mySubscription?.data)
      ? mySubscription.data
          .filter(
            (sub) =>
              sub.isActive ||
              sub.status === "active" ||
              sub.status === "confirmed" ||
              sub.status === "created",
          )
          .map((sub) => sub.plan?._id)
          .filter(Boolean)
      : [];
  }, [mySubscription]);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <MobileStickyHeader title={"Our Plans"} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
            {t.plans.badge}
          </div>

          <Typography
            variant="5xl-semibold"
            className="text-black dark:text-white mb-4"
          >
            {t.plans.title}
          </Typography>
          <Typography
            variant="md-regular"
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {t.plans.subtitle}
          </Typography>

          {/* Emirati Discount Info */}
          <div className="mb-8 flex justify-center">
            {isVerifiedEmarati ? (
              <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-100/50">
                <div className="bg-emerald-500 rounded-full p-1">
                  <CheckCircle2 className="size-4 text-white" />
                </div>
                Emiratisation discount of 10% has been applied to all plans!
              </div>
            ) : (
              <div className="bg-purple-50 text-purple-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 border border-purple-100 shadow-sm transition-all hover:bg-purple-100/50">
                <div className="bg-purple-500 rounded-full p-1">
                  <ShieldCheck className="size-4 text-white" />
                </div>
                <span>
                  Become an Emirati for an additional 10% discount!{" "}
                  <button
                    onClick={() => router.push(localePath("/user/emarati-status"))}
                    className="underline font-bold ml-1 hover:text-purple-900 decoration-2 underline-offset-2"
                  >
                    Verify Now
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Plan Types Tabs */}
          {!isLoading && planTypes.length > 0 && (
            <div className="w-full relative flex items-center justify-center group max-w-4xl mx-auto mb-12">
              <AnimatePresence>
                {canScrollLeft && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => scroll("left")}
                    className="absolute left-0 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-purple transition-all hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="size-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              <div
                ref={tabsRef}
                onScroll={checkScroll}
                className={cn(
                  "relative flex items-center bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-gray-200/50 dark:border-gray-800 shadow-xl w-fit mx-auto overflow-x-auto scrollbar-hide scroll-smooth mx-4 md:mx-0",
                )}
              >
                <div className="flex items-center gap-1.5">
                  {planTypes.map((type) => {
                    const Icon = getCategoryIcon(type);
                    const isActive = selectedType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          "relative px-6 py-3 capitalize rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2.5 z-10",
                          isActive
                            ? "text-purple"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200",
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activePlanTab"
                            className="absolute inset-0 bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-600/20 rounded-full -z-10 shadow-lg shadow-purple/10"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <Icon
                          className={cn(
                            "size-4.5 transition-transform duration-300",
                            isActive
                              ? "text-purple scale-110"
                              : "text-gray-400 group-hover:scale-110",
                          )}
                        />
                        <span>{type}</span>
                        {type.toLowerCase() === "basic" && (
                          <span className="text-[10px] bg-purple/10 text-purple px-2 py-0.5 rounded-lg font-black uppercase tracking-tight border border-purple/20">
                            Free
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence>
                {canScrollRight && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => scroll("right")}
                    className="absolute right-0 z-20 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 text-purple transition-all hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="size-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
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
          <div className="flex flex-wrap justify-center gap-8 mx-auto">
            {displayPlans.map((plan, index) => {
              const features = getFeatures(plan);
              const planName =
                locale === "ar" && plan.planAr ? plan.planAr : plan.plan;

              const displayPrice = plan.discountedPrice
                ? plan.discountedPrice.toFixed(0).toString()
                : plan.price.toFixed(0).toString();
              const displayOriginalPrice = plan.discountedPrice
                ? plan.price.toFixed(0).toString()
                : "";

              const isCurrentPlan = subscribedPlanIds.includes(plan._id);
              const description =
                locale === "ar" && plan.descriptionAr
                  ? plan.descriptionAr
                  : plan.description || "";

              const cardProps = {
                id: plan._id,
                validation: plan.validation,
                validationPeriod: plan.validationPeriod,
                name: planName,
                icon: getPlanIcon(plan.plan, index),
                price: displayPrice,
                originalPrice: displayOriginalPrice,
                description: description,
                features: features,
                buttonText: isCurrentPlan
                  ? "Current Plan"
                  : plan.isDefault
                    ? "Start Free Plan"
                    : "Subscribe",
                isPopular: plan.isPopular || plan.isDefault,
                isPremium:
                  plan.plan.toLowerCase() === "platinum" ||
                  plan.plan.toLowerCase() === "premium",
                isCurrent: isCurrentPlan,
                isDefault: plan.isDefault,
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
            <div className="w-full sm:max-w-xs rounded-2xl flex flex-col p-8 transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:shadow-purple/5">
              <div className="flex justify-start mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple dark:bg-purple/90">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>

              <Typography
                variant="xl-semibold"
                className="text-left mb-2 text-black dark:text-white"
              >
                Enterprise
              </Typography>

              <div className="text-left mb-4">
                <Typography
                  variant="2xl-bold"
                  className="text-black dark:text-white"
                >
                  Custom Pricing
                </Typography>
              </div>

              <Typography
                variant="sm-regular"
                className="text-left mb-6 text-gray-600 dark:text-gray-400"
              >
                Custom solutions for large organizations requiring tailored
                features and priority support.
              </Typography>

              <div className="space-y-3 flex-1 mb-8">
                {[
                  "Unlimited Listings",
                  "Dedicated Account Manager",
                  "Custom Integration",
                  "Priority Support",
                  "Advanced Analytics",
                  "SLA Agreement",
                ].map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 mt-0.5 flex-shrink-0 text-purple fill-white dark:fill-gray-900" />
                    <Typography
                      variant="sm-regular"
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {feature}
                    </Typography>
                  </div>
                ))}
              </div>

              <Button
                onClick={() =>
                  router.push(`/${locale}/help-centre/new?type=custom_planning`)
                }
                className="w-full rounded-lg font-medium bg-purple text-white hover:bg-purple/90 dark:bg-purple/80"
              >
                Contact Us
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PlansMain() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <PlansContent />
    </Suspense>
  );
}
