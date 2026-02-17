"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Zap, Award, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
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

  return (
    <div
      className={`w-full sm:max-w-xs rounded-2xl flex flex-col p-8 transition-all duration-300 ${isPremium
        ? "bg-purple-600 text-white"
        : "bg-white border border-gray-200 hover:shadow-lg"
        }`}
    >
      {/* Icon */}
      <div className="flex justify-start mb-6">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isPremium ? "bg-white" : "bg-purple-600"
            }`}
        >
          <IconComponent
            className={`w-6 h-6 ${isPremium ? "text-purple-600" : "text-white"
              }`}
          />
        </div>
      </div>

      {/* Plan Name */}
      <Typography
        variant="xl-semibold"
        className={`text-left mb-2 ${isPremium ? "text-white" : "text-black"
          }`}
      >
        {planName}
      </Typography>

      {/* Pricing */}
      <div className="text-left mb-4">
        <div className="flex items-center justify-start gap-2">
          <Typography
            variant="4xl-bold"
            className={cn(
              "flex items-center",
              isPremium ? "text-white" : "text-black"
            )}
          >
            <Image
              src={
                isPremium
                  ? ICONS.currency.aedWhite
                  : ICONS.currency.aedBlack
              }
              alt={planName}
              width={40}
              height={40}
            />{" "}
            {displayPrice}
          </Typography>
          <div>
            <Typography
              variant="sm-regular"
              className={`line-through ${isPremium ? "text-purple-200" : "text-gray-400"
                }`}
            >
              {displayOriginalPrice}
            </Typography>
            <Typography
              variant="sm-regular"
              className={
                isPremium ? "text-purple-200" : "text-gray-500"
              }
            >
              {perMonthText}
            </Typography>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${subscription.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {subscription.isActive ? "Active" : "Inactive"}
        </span>
        {subscription.cancelAtPeriodEnd && (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            Auto-renewal Off
          </span>
        )}
      </div>

      {/* AI Credits */}
      <div className={cn(
        "mb-4 p-3 rounded-lg flex items-center gap-3",
        isPremium ? "bg-white/10" : "bg-purple-50"
      )}>
        <BrainCircuit className={cn("size-5", isPremium ? "text-white" : "text-purple-600")} />
        <div>
          <Typography variant="xs-regular" className={isPremium ? "text-purple-100" : "text-gray-500 uppercase font-bold"}>
            AI Tokens
          </Typography>
          <Typography variant="sm-semibold" className={isPremium ? "text-white" : "text-black"}>
            {subscription.numberOfAiUsed || 0} / {subscription.aiAvailable || 0}
          </Typography>
        </div>
      </div>

      {/* Plan Category */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        <span
          className={cn(
            "px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight border",
            isPremium
              ? "bg-white/20 border-white/10 text-white"
              : "bg-purple-50 border-purple/10 text-purple"
          )}
        >
          {plan.type || "General Ads"}
        </span>
      </div>

      {/* Features List */}
      <div className="space-y-3 flex-1 mb-8">
        {features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-start gap-3">
            <CheckCircle2
              className={`size-6 mt-0.5 flex-shrink-0 ${isPremium ? "fill-white text-purple" : "text-white fill-purple"
                }`}
            />
            <Typography
              variant="sm-regular"
              className={isPremium ? "text-white" : "text-gray-600"}
            >
              {feature}
            </Typography>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      {subscription.isActive && !subscription.cancelAtPeriodEnd && (
        <ResponsiveDialogDrawer
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Stop Auto-Renewal?"
          description="Your subscription will remain active until the end of your current billing period, but it will not renew automatically. Are you sure?"
          trigger={
            <Button
              className={`w-full rounded-lg font-medium ${isPremium
                ? "bg-white text-red-600 hover:bg-gray-100"
                : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
            >
              Stop Recurring
            </Button>
          }
        >
          <div className="p-4 pt-0 flex flex-col gap-3">
            <Button
              variant="danger"
              onClick={handleCancelSubscription}
              disabled={isPending}
            >
              {isPending ? "Stopping..." : "Confirm Stop Auto-Renewal"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Go Back
            </Button>
          </div>
        </ResponsiveDialogDrawer>
      )}
    </div>
  );
};
