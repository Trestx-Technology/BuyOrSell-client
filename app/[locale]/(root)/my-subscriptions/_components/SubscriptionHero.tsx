"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, CreditCard, Layout, Zap, Star, ShieldCheck } from "lucide-react";
import { Typography } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

interface SubscriptionHeroProps {
      totalAdsRemaining: number;
      totalFeaturedAdsRemaining: number;
      activeSubscriptionsCount: number;
      isLoading: boolean;
}

export const SubscriptionHero = ({
      totalAdsRemaining,
      totalFeaturedAdsRemaining,
      activeSubscriptionsCount,
      isLoading,
}: SubscriptionHeroProps) => {
      const { locale } = useLocale();
      const isArabic = locale === "ar";

      return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] p-6 sm:p-10 text-white shadow-2xl">
                  {/* Background decoration */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple/10 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl opacity-30" />
                        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
                  </div>

                  <div className={cn("relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10", isArabic && "lg:flex-row-reverse")}>
                        <div className={cn("flex flex-col items-center lg:items-start gap-6 w-full lg:w-auto", isArabic && "lg:items-end")}>
                              <div className={cn("flex items-center gap-3", isArabic && "flex-row-reverse")}>
                                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                          <CreditCard className="size-6 text-purple-400" />
                                    </div>
                                    <div className={cn("space-y-0.5", isArabic && "text-right")}>
                                          <Typography variant="h3" className="text-white font-bold text-xl tracking-tight">
                                                {isArabic ? "نظرة عامة على الاشتراكات" : "Subscription Overview"}
                                          </Typography>
                                          <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
                                                {isArabic ? `${activeSubscriptionsCount} خطط نشطة` : `${activeSubscriptionsCount} Active ${activeSubscriptionsCount === 1 ? 'Plan' : 'Plans'}`}
                                          </p>
                                    </div>
                              </div>

                              <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto", isArabic && "sm:grid-cols-[200px_200px]")}>
                                    {isLoading ? (
                                          <>
                                                <Skeleton className="h-24 w-48 bg-white/10 rounded-2xl" />
                                                <Skeleton className="h-24 w-48 bg-white/10 rounded-2xl" />
                                          </>
                                    ) : (
                                          <>
                                                <div className={cn("flex flex-col p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[200px] hover:bg-white/10 transition-colors duration-300", isArabic && "text-right")}>
                                                      <span className="text-white/50 text-sm font-medium mb-1">{isArabic ? "إعلانات عادية" : "Regular Ads"}</span>
                                                      <div className={cn("flex items-baseline gap-2", isArabic && "flex-row-reverse")}>
                                                            <span className="text-4xl font-black tracking-tighter text-white">
                                                                  {totalAdsRemaining}
                                                            </span>
                                                            <span className="text-sm font-medium text-white/40 uppercase tracking-tighter">{isArabic ? "متبقية" : "Remaining"}</span>
                                                      </div>
                                                </div>

                                                <div className={cn("flex flex-col p-5 bg-purple/10 rounded-2xl border border-purple/20 backdrop-blur-sm min-w-[200px] hover:bg-purple/20 transition-colors duration-300", isArabic && "text-right")}>
                                                      <span className={cn("text-purple-300/70 text-sm font-medium mb-1 flex items-center gap-1.5", isArabic && "flex-row-reverse")}>
                                                            <Star className="size-3 fill-purple-300/70" />
                                                            {isArabic ? "إعلانات مميزة" : "Featured Ads"}
                                                      </span>
                                                      <div className={cn("flex items-baseline gap-2", isArabic && "flex-row-reverse")}>
                                                            <span className="text-4xl font-black tracking-tighter text-purple-300">
                                                                  {totalFeaturedAdsRemaining}
                                                            </span>
                                                            <span className="text-sm font-medium text-purple-300/40 uppercase tracking-tighter">{isArabic ? "متبقية" : "Remaining"}</span>
                                                      </div>
                                                </div>
                                          </>
                                    )}
                              </div>

                              <p className={cn("text-sm text-white/40 max-w-md text-center lg:text-left leading-relaxed", isArabic && "lg:text-right")}>
                                    {isArabic
                                          ? "قم بزيادة وصولك باستخدام رصيدك المتبقي. تساعد الإعلانات النشطة في تواصلك مع المشترين المحتملين بشكل أسرع."
                                          : "Maximize your reach by using your remaining credits. Active ads help you connect with potential buyers faster."
                                    }
                              </p>
                        </div>

                        <div className="hidden lg:flex items-center justify-center relative">
                              <div className="w-48 h-48 rounded-3xl bg-gradient-to-tr from-purple/20 to-transparent border border-white/10 transform rotate-12 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                                    <Zap className="size-20 text-purple-400 animate-pulse" />
                              </div>
                              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-white/5 border border-white/10 transform -rotate-12 flex items-center justify-center backdrop-blur-sm shadow-xl">
                                    <ShieldCheck className="size-10 text-emerald-400" />
                              </div>
                              <div className="absolute -bottom-4 -left-8 w-20 h-20 rounded-2xl bg-white/5 border border-white/10 transform rotate-45 flex items-center justify-center backdrop-blur-sm shadow-xl">
                                    <Sparkles className="size-8 text-yellow-400" />
                              </div>
                        </div>
                  </div>
            </div>
      );
};
