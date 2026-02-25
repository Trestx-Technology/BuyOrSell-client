"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Star, Zap, Award, BrainCircuit, Layout, Sparkles, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { ISubscription } from "@/interfaces/subscription.types";
import { useStopRecurring } from "@/hooks/useSubscriptions";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

interface SubscriptionCardProps {
  subscription: ISubscription;
  perMonthText: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, perMonthText }) => {
  const { plan } = subscription;
  const user = useAuthStore((state) => state.session.user);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en-US";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { fetchSubscriptions } = useSubscriptionStore();

  const { mutate: stopRecurring, isPending } = useStopRecurring();

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

  const IconComponent = getPlanIcon(plan.plan);

  const getFeatures = () => {
    if (!plan.features || plan.features.length === 0) return [];
    let featuresList = plan.features;
    if (plan.features.length === 1 && typeof plan.features[0] === 'string' && plan.features[0].includes(",")) {
      featuresList = plan.features[0].split(",");
    }
    return featuresList.map((f) => f.trim());
  };

  const features = getFeatures();
  const planName = locale === "ar" && plan.planAr ? plan.planAr : plan.plan;
  const isPremium = plan.plan.toLowerCase().includes("platinum") || plan.plan.toLowerCase().includes("premium");

  const displayPrice = plan.discountedPrice
    ? plan.discountedPrice.toFixed(0).toString()
    : plan.price.toFixed(0).toString();
  const displayOriginalPrice = plan.discountedPrice
    ? plan.price.toFixed(0).toString()
    : "";

  const handleCancelSubscription = () => {
    stopRecurring(subscription._id, {
      onSuccess: () => {
        toast.success("Auto-renewal stopped successfully");
        setIsDialogOpen(false);
        fetchSubscriptions();
        router.refresh();
      },
      onError: (error: any) => {
        console.error("Failed to stop recurring subscription", error);
        toast.error(error.message || "Failed to stop auto-renewal");
      },
    });
  };

  const adsRemaining = (subscription.addsAvailable || 0) - (subscription.adsUsed || 0);
  const adsProgress = subscription.addsAvailable ? (subscription.adsUsed / subscription.addsAvailable) * 100 : 0;

  const featuredAdsRemaining = (subscription.featuredAdsAvailable || 0) - (subscription.featuredAdsUsed || 0);
  const featuredAdsProgress = subscription.featuredAdsAvailable ? ((subscription.featuredAdsUsed || 0) / subscription.featuredAdsAvailable) * 100 : 0;

  const aiRemaining = (subscription.aiAvailable || 0) - (subscription.numberOfAiUsed || 0);
  const aiProgress = subscription.aiAvailable ? (subscription.numberOfAiUsed / subscription.aiAvailable) * 100 : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[2.5rem] p-7 transition-all duration-500 border-2 overflow-hidden w-full sm:max-w-xs",
        isPremium
          ? "bg-gray-950 border-purple-500/20 shadow-2xl shadow-purple-500/10 text-white"
          : "bg-white border-gray-100 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5"
      )}
    >
      {/* Premium Glow */}
      {isPremium && (
        <div className="absolute -top-24 -right-24 size-48 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />
      )}

      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div
          className={cn(
            "size-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg",
            isPremium ? "bg-purple-600 text-white shadow-purple-900/40" : "bg-purple-50 text-purple-600 shadow-purple-100"
          )}
        >
          <IconComponent className="size-7" />
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              subscription.isActive
                ? (isPremium ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-600")
                : (isPremium ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-red-50 border-red-100 text-red-600")
            )}
          >
            {subscription.isActive ? "Active" : "Inactive"}
          </span>
          {subscription.cancelAtPeriodEnd && (
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
              isPremium ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600"
            )}>
              Ending Soon
            </span>
          )}
        </div>
      </div>

      {/* Plan Name & Category */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Typography
            variant="xl-semibold"
            className={cn("text-left font-black tracking-tight", isPremium ? "text-white" : "text-gray-900")}
          >
            {planName}
          </Typography>
          {isPremium && <Sparkles className="size-4 text-yellow-400" />}
        </div>
        <div className="flex items-center gap-1.5">
          <Layout className="size-3 text-purple" />
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter text-left">
            {plan.type || "General Category"}
          </span>
        </div>
      </div>

      {/* Progress Section - Remaining Ads */}
      <div className="space-y-5 mb-8">
        {/* Regular Ads */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className={cn("text-xs font-bold uppercase tracking-tight", isPremium ? "text-gray-400" : "text-gray-500")}>Regular Ads</span>
            <span className={cn("text-sm font-black", isPremium ? "text-white" : "text-gray-900")}>
              {adsRemaining} <span className="text-[10px] opacity-60 font-medium">Left</span>
            </span>
          </div>
          <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-purple transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${Math.max(5, 100 - adsProgress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
            <span>Used: {subscription.adsUsed}</span>
            <span>Total: {subscription.addsAvailable}</span>
          </div>
        </div>

        {/* Featured Ads */}
        {(subscription.featuredAdsAvailable || 0) > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className={cn("text-xs font-bold uppercase tracking-tight text-amber-500")}>Featured Ads</span>
              <span className={cn("text-sm font-black", isPremium ? "text-amber-400" : "text-amber-600")}>
                {featuredAdsRemaining} <span className="text-[10px] opacity-60 font-medium">Left</span>
              </span>
            </div>
            <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.max(5, 100 - featuredAdsProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Tokens */}
        {/* <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1.5">
              <BrainCircuit className="size-3 text-purple" />
              <span className={cn("text-xs font-bold uppercase tracking-tight", isPremium ? "text-gray-400" : "text-gray-500")}>AI Tokens</span>
            </div>
            <span className={cn("text-sm font-black", isPremium ? "text-white" : "text-gray-900")}>
              {aiRemaining} <span className="text-[10px] opacity-60 font-medium tracking-tight">Left</span>
            </span>
          </div>
          <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple to-indigo-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              style={{ width: `${Math.max(5, 100 - aiProgress)}%` }}
            />
          </div>
        </div> */}
      </div>

      {/* Expiry / Renewal Info */}
      <div className={cn(
        "mb-8 p-4 rounded-3xl flex items-center gap-4 border",
        isPremium ? "bg-white/5 border-white/5" : "bg-gray-50 border-gray-100"
      )}>
        <div className={cn("size-10 rounded-2xl flex items-center justify-center", isPremium ? "bg-purple-500/20" : "bg-purple-100")}>
          <Clock className="size-5 text-purple" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {subscription.cancelAtPeriodEnd ? "Expires On" : "Renews On"}
          </span>
          <span className={cn("text-sm font-bold", isPremium ? "text-white" : "text-gray-900")}>
            {new Date(subscription.endDate).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-gray-800">
        {subscription.isActive && !subscription.cancelAtPeriodEnd ? (
          <ResponsiveDialogDrawer
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title="Stop Auto-Renewal?"
            description="Your subscription will remain active until the end of your current billing period, but it will not renew automatically. Are you sure?"
            trigger={
              <Button
                className={cn(
                  "w-full h-12 rounded-2xl font-bold transition-all active:scale-95",
                  isPremium
                    ? "bg-white/10 text-red-400 hover:bg-white/20"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                )}
              >
                Stop Recurring
              </Button>
            }
          >
            <div className="p-4 pt-0 flex flex-col gap-3">
              <Button
                variant="danger"
                className="rounded-2xl h-12 font-bold"
                onClick={handleCancelSubscription}
                disabled={isPending}
              >
                {isPending ? "Stopping..." : "Confirm Stop Auto-Renewal"}
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-12 font-bold"
                onClick={() => setIsDialogOpen(false)}
                disabled={isPending}
              >
                Go Back
              </Button>
            </div>
          </ResponsiveDialogDrawer>
        ) : (
          <Button
            variant="outline"
            className={cn("w-full h-12 rounded-2xl font-bold", isPremium ? "border-white/10 text-white" : "")}
            onClick={() => router.push('/plans')}
          >
            Renew Now
          </Button>
        )}
      </div>
    </div>
  );
};
