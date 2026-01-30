"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useGetMySubscription } from "@/hooks/useSubscriptions";
import { PlanSkeleton } from "@/app/[locale]/(root)/plans/_components/plancard-skeleton";
import { SubscriptionCard } from "./_components/SubscriptionCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MySubscriptionsPage() {
  const { t } = useLocale();
  const { data: mySubscriptionData, isLoading, error } = useGetMySubscription();

  const subscriptions = Array.isArray(mySubscriptionData?.data) ? mySubscriptionData?.data : [];

  return (
    <div className="min-h-screen bg-white">
      <MobileStickyHeader title={"My Subscriptions"} />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-sm font-medium mb-6">
            Manage
          </div>

          <Typography variant="5xl-semibold" className="text-black mb-4">
            My Subscriptions
          </Typography>
          <Typography
            variant="md-regular"
            className="text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Manage your active plans and subscriptions.
          </Typography>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 mx-auto">
            {[1, 2].map((i) => (
              <PlanSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">
            <Typography variant="xl-medium">
              Failed to load subscriptions. Please try again later.
            </Typography>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && subscriptions.length === 0 && (
          <div className="text-center py-10">
             <Typography variant="xl-medium" className="text-gray-600 mb-4">
                You don't have any active subscriptions.
             </Typography>
             <Link href="/plans">
                <Button>Browse Plans</Button>
             </Link>
          </div>
        )}

        {/* Subscriptions Grid */}
        {!isLoading && !error && subscriptions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 mx-auto">
            {subscriptions.map((sub) => (
              <SubscriptionCard
                key={sub._id}
                subscription={sub}
                perMonthText={t.plans.perMonth}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
