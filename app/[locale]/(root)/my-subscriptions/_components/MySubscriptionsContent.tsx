"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useGetMySubscription } from "@/hooks/useSubscriptions";
import { PlanSkeleton } from "@/app/[locale]/(root)/plans/_components/plancard-skeleton";
import { SubscriptionCard } from "./SubscriptionCard";
import { SubscriptionHero } from "./SubscriptionHero";
import { SubscriptionFeaturesStrip } from "./SubscriptionFeaturesStrip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, CreditCard, Sparkles, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

export const MySubscriptionsContent = () => {
  const { locale, t, localePath } = useLocale();
  const isArabic = locale === "ar";
  const router = useRouter();
  const { data: mySubscriptionData, isLoading, error } = useGetMySubscription();
  const [categoryTab, setCategoryTab] = useState("All");
  const [statusTab, setStatusTab] = useState<"active" | "inactive">("active");

  const subscriptions = useMemo(() => {
    const list = Array.isArray(mySubscriptionData?.data)
      ? mySubscriptionData.data
      : [];
    return list.filter((sub) => sub && sub.plan);
  }, [mySubscriptionData]);

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => sub.isActive);
  }, [subscriptions]);

  const inactiveSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => !sub.isActive);
  }, [subscriptions]);

  const stats = useMemo(() => {
    return activeSubscriptions.reduce(
      (acc, sub) => {
        acc.totalAdsRemaining += (sub.addsAvailable || 0) - (sub.adsUsed || 0);
        acc.totalFeaturedAdsRemaining +=
          (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0);
        return acc;
      },
      { totalAdsRemaining: 0, totalFeaturedAdsRemaining: 0 },
    );
  }, [activeSubscriptions]);

  const categories = useMemo(() => {
    const currentList =
      statusTab === "active" ? activeSubscriptions : inactiveSubscriptions;
    const types = new Set(
      currentList.map((sub) => sub.plan?.type).filter(Boolean),
    );
    return ["All", ...Array.from(types).sort()];
  }, [activeSubscriptions, inactiveSubscriptions, statusTab]);

  const filteredSubscriptions = useMemo(() => {
    let list =
      statusTab === "active" ? activeSubscriptions : inactiveSubscriptions;
    if (categoryTab !== "All") {
      list = list.filter((sub) => sub.plan?.type === categoryTab);
    }
    return list;
  }, [activeSubscriptions, inactiveSubscriptions, statusTab, categoryTab]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <MobileStickyHeader title={t.mySubscriptions.mySubscriptions} />

      <div className="container-1080 mx-auto px-4 py-8 space-y-10">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className={cn(
            "flex items-center gap-2 text-sm text-gray-400 hover:text-purple transition-colors group w-fit",
            isArabic && "flex-row-reverse",
          )}
        >
          <ArrowLeft
            className={cn(
              "size-4 transition-transform",
              isArabic
                ? "group-hover:translate-x-1 rotate-180"
                : "group-hover:-translate-x-1",
            )}
          />
          <span>{t.mySubscriptions.back}</span>
        </button>

        {/* Hero Section */}
        <SubscriptionHero
          totalAdsRemaining={stats.totalAdsRemaining}
          totalFeaturedAdsRemaining={stats.totalFeaturedAdsRemaining}
          activeSubscriptionsCount={activeSubscriptions.length}
          isLoading={isLoading}
        />

        {/* Features strip */}
        <SubscriptionFeaturesStrip />

        {/* Content Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-end justify-between gap-6",
            isArabic && "md:flex-row-reverse",
          )}
        >
          <div className={cn("space-y-2", isArabic && "text-right")}>
            <div
              className={cn(
                "flex items-center gap-2 text-purple font-bold text-xs uppercase tracking-[0.2em]",
                isArabic && "flex-row-reverse",
              )}
            >
              <div className="h-1 w-6 bg-purple rounded-full" />
              {t.mySubscriptions.yourPlans}
            </div>
            <Typography
              variant="h2"
              className="text-3xl font-black text-gray-900 dark:text-white tracking-tight"
            >
              {statusTab === "active"
                ? isArabic
                  ? "اشتراكاتي النشطة"
                  : "My Active Subscriptions"
                : isArabic
                  ? "الاشتراكات غير النشطة"
                  : "Inactive Subscriptions"}
            </Typography>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg">
              {isArabic
                ? "عرض وإدارة جميع خططك الخاصة بالفئات ورصيد الإعلانات النشطة في مكان واحد."
                : "View and manage all your active category-specific plans and ad credits in one place."}
            </p>
          </div>

          {/* New Plan CTA */}
          <Link href="/plans">
            <Button
              className="h-12 px-8 rounded-2xl bg-white dark:bg-purple border-2 border-purple text-purple dark:text-white hover:bg-purple hover:text-white transition-all font-bold shadow-xl"
              icon={<Sparkles className={cn("size-4")} />}
              iconPosition={isArabic ? "right" : "left"}
              onClick={() => router.push(localePath("/plans"))}
            >
              {t.mySubscriptions.getNewPlan}
            </Button>
          </Link>
        </div>

        {/* Status Tabs */}
        {!isLoading && !error && (
          <div className="flex flex-col gap-6">
            <div
              className={cn(
                "flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit",
                isArabic && "flex-row-reverse",
              )}
            >
              <button
                onClick={() => {
                  setStatusTab("active");
                  setCategoryTab("All");
                }}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-sm font-black transition-all",
                  statusTab === "active"
                    ? "bg-white dark:bg-gray-700 text-purple shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {t.mySubscriptions.active} ({activeSubscriptions.length})
              </button>
              <button
                onClick={() => {
                  setStatusTab("inactive");
                  setCategoryTab("All");
                }}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-sm font-black transition-all",
                  statusTab === "inactive"
                    ? "bg-white dark:bg-gray-700 text-purple shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {t.mySubscriptions.inactive} (
                {inactiveSubscriptions.length})
              </button>
            </div>

            {/* Category Filters */}
            {categories.length > 2 && (
              <div
                className={cn(
                  "flex flex-col sm:flex-row items-center gap-4 py-2 border-t border-gray-100 dark:border-gray-800 pt-6",
                  isArabic && "sm:flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 text-gray-400 mr-2",
                    isArabic && "ml-2 mr-0 flex-row-reverse",
                  )}
                >
                  <Filter className="size-4" />
                  <span className="text-sm font-semibold">
                    {t.mySubscriptions.filterByCategory}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-full flex justify-start overflow-x-auto no-scrollbar",
                    isArabic && "justify-end",
                  )}
                >
                  <div
                    className={cn(
                      "flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 items-center",
                      isArabic && "flex-row-reverse",
                    )}
                  >
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setCategoryTab(category)}
                        className={cn(
                          "px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                          categoryTab === category
                            ? "bg-purple text-white shadow-lg shadow-purple/20"
                            : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200",
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <PlanSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <CreditCard className="size-16 mx-auto text-red-100 mb-4" />
              <Typography variant="xl-medium" className="text-red-500 mb-2">
                {isArabic
                  ? "فشل في تحميل الاشتراكات"
                  : "Failed to load subscriptions"}
              </Typography>
              <Typography variant="sm-regular" className="text-gray-400">
                {isArabic
                  ? "يرجى التحقق من اتصالك والمحاولة مرة أخرى."
                  : "Please check your connection and try again."}
              </Typography>
              <Button
                variant="outline"
                className="mt-6 rounded-xl"
                onClick={() => window.location.reload()}
              >
                {t.mySubscriptions.retryNow}
              </Button>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="size-24 rounded-full bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="size-10 text-gray-300 dark:text-gray-600" />
              </div>
              <Typography
                variant="h3"
                className="text-gray-900 dark:text-white font-bold mb-2"
              >
                {statusTab === "active"
                  ? isArabic
                    ? "لا توجد اشتراكات نشطة"
                    : "No active subscriptions"
                  : isArabic
                    ? "لا توجد اشتراكات غير نشطة"
                    : "No inactive subscriptions"}
              </Typography>
              <Typography
                variant="md-regular"
                className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10"
              >
                {statusTab === "active"
                  ? isArabic
                    ? "لم تشترك في أي خطط بعد. ابدأ باستكشاف خططنا المتاحة!"
                    : "You haven't subscribed to any plans yet. Get started by exploring our available plans!"
                  : isArabic
                    ? "جميع اشتراكاتك حالياً نشطة."
                    : "All your subscriptions are currently active."}
              </Typography>
              {statusTab === "active" && (
                <Link href="/plans">
                  <Button
                    size="lg"
                    className="h-14 px-10 rounded-2xl bg-purple text-white font-black text-lg shadow-xl shadow-purple/20"
                  >
                    {t.mySubscriptions.browsePlans}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubscriptions.map((sub) => (
                <SubscriptionCard
                  key={sub._id}
                  subscription={sub}
                  perMonthText={t.plans.perMonth}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Info Card */}
        {!isLoading && subscriptions.length > 0 && (
          <div
            className={cn(
              "p-8 rounded-[2rem] bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 border border-purple-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8 shadow-sm",
              isArabic && "md:flex-row-reverse",
            )}
          >
            <div className="size-20 rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-xl shadow-purple/10 border border-transparent dark:border-gray-700">
              <Sparkles className="size-10 text-purple" />
            </div>
            <div
              className={cn(
                "flex-1 space-y-2 text-center md:text-left",
                isArabic && "md:text-right",
              )}
            >
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                {isArabic
                  ? "هل تحتاج إلى المزيد من رصيد الإعلانات؟"
                  : "Need more ad credits?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl">
                {isArabic
                  ? "قم بترقية خطتك الحالية أو شراء حزمة جديدة لفئة مختلفة لمواصلة إدراج عناصرك. يحصل الأعضاء المميزون على دعم ذو أولوية وتحليلات متقدمة."
                  : "Upgrade your current plan or buy a new package for a different category to continue listing your items. Premium members get priority support and advanced analytics."}
              </p>
            </div>
            <Link href="/plans">
              <Button className="h-14 px-10 rounded-2xl bg-purple text-white hover:bg-purple-600 transition-all font-black text-lg shadow-xl shadow-purple/20">
                {t.mySubscriptions.upgradeNow}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
