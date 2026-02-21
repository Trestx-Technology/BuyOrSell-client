"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Coins,
  Zap,
  ShieldCheck,
  ArrowLeft,
  Check,
  Loader2,
  Crown,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  useAITokenBalance,
  useAITokenPackages,
  useInitiateTokenPurchase,
} from "@/hooks/useAITokens";
import { TokenPackage } from "@/interfaces/ai-tokens.types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ============================================================================
// BALANCE HERO
// ============================================================================
const BalanceHero = ({
  balance,
  isLoading,
}: {
  balance: number;
  isLoading: boolean;
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple via-[#7c3aed] to-[#6d28d9] p-6 sm:p-8 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-300/10 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Image
                src={ICONS.ai.aiBgWhite}
                alt="AI"
                width={28}
                height={28}
              />
            </div>
            <Typography
              variant="h2"
              className="text-white/90 text-lg font-medium"
            >
              Your AI Token Balance
            </Typography>
          </div>

          {isLoading ? (
            <Skeleton className="h-14 w-48 bg-white/20 rounded-xl" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight">
                {balance.toLocaleString()}
              </span>
              <span className="text-xl font-medium text-white/70">tokens</span>
            </div>
          )}

          <p className="text-sm text-white/60 max-w-sm text-center sm:text-left">
            Use AI tokens to generate descriptions, enhance your ads, and unlock
            AI-powered features.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
            <Sparkles className="size-12 sm:size-14 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// FEATURES STRIP
// ============================================================================
const features = [
  {
    icon: Zap,
    title: "AI Descriptions",
    desc: "Auto-generate compelling ad descriptions",
  },
  {
    icon: ShieldCheck,
    title: "Smart Translation",
    desc: "Translate your ads to Arabic instantly",
  },
  {
    icon: TrendingUp,
    title: "Ad Enhancement",
    desc: "Optimize your listings for better reach",
  },
  {
    icon: Star,
    title: "Priority Support",
    desc: "Get priority AI processing speed",
  },
];

const FeaturesStrip = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {features.map((f) => (
      <div
        key={f.title}
        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple/30 hover:shadow-md transition-all duration-300 group"
      >
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple/10 group-hover:bg-purple-100 dark:group-hover:bg-purple/20 transition-colors">
          <f.icon className="size-5 text-purple" />
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center">
          {f.title}
        </span>
        <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-snug">
          {f.desc}
        </span>
      </div>
    ))}
  </div>
);

// ============================================================================
// PACKAGE CARD
// ============================================================================
const tierConfig: Record<
  string,
  { gradient: string; badge: string; icon: React.ElementType; glow: string }
> = {
  starter: {
    gradient: "from-blue-500/10 via-blue-400/5 to-transparent",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    icon: Coins,
    glow: "group-hover:shadow-blue-200/50 dark:group-hover:shadow-blue-800/30",
  },
  standard: {
    gradient: "from-purple-500/10 via-purple-400/5 to-transparent",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    icon: Zap,
    glow: "group-hover:shadow-purple-200/50 dark:group-hover:shadow-purple-800/30",
  },
  premium: {
    gradient: "from-amber-500/10 via-amber-400/5 to-transparent",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    icon: Crown,
    glow: "group-hover:shadow-amber-200/50 dark:group-hover:shadow-amber-800/30",
  },
};

function getTier(pkg: TokenPackage) {
  if (pkg.price >= 100) return tierConfig.premium;
  if (pkg.price >= 30) return tierConfig.standard;
  return tierConfig.starter;
}

const PackageCard = ({
  pkg,
  isPopular,
  onSelect,
}: {
  pkg: TokenPackage;
  isPopular: boolean;
  onSelect: (pkg: TokenPackage) => void;
}) => {
  const tier = getTier(pkg);
  const TierIcon = tier.icon;
  const pricePerToken = (pkg.price / pkg.tokens).toFixed(3);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:shadow-xl",
        isPopular
          ? "border-purple ring-2 ring-purple/20 scale-[1.02]"
          : "border-gray-200 dark:border-gray-800 hover:border-purple/40",
        tier.glow
      )}
    >
      {/* Popular ribbon */}
      {isPopular && (
        <div className="absolute -top-0 left-0 right-0 bg-gradient-to-r from-purple to-[#7c3aed] text-white text-center text-[11px] font-bold py-1.5 uppercase tracking-wider">
          ⭐ Most Popular
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60",
          tier.gradient
        )}
      />

      <div
        className={cn(
          "relative flex flex-col flex-1 p-5 sm:p-6",
          isPopular && "pt-10"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <TierIcon className="size-5 text-purple" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {pkg.name}
              </h3>
              {pkg.description && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {pkg.description}
                </p>
              )}
            </div>
          </div>
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
              tier.badge
            )}
          >
            {pkg.price >= 100 ? "Pro" : pkg.price >= 30 ? "Plus" : "Basic"}
          </span>
        </div>

        {/* Token count */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-3xl font-black text-gray-900 dark:text-white">
            {pkg.tokens.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            tokens
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-col mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple">
              {(pkg.currency || "AED").toUpperCase()}{" "}
              {pkg.discount
                ? (pkg.price * (1 - pkg.discount / 100)).toFixed(2)
                : pkg.price}
            </span>
            {pkg.discount && (
              <span className="text-sm text-gray-400 line-through">
                {(pkg.currency || "AED").toUpperCase()} {pkg.price}
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            ({pricePerToken} / token)
          </span>
        </div>

        {/* Benefits list */}
        <div className="flex flex-col gap-2 mb-6 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <span>{pkg.tokens.toLocaleString()} AI tokens</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <span>No expiry</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Check className="size-4 text-emerald-500 shrink-0" />
            <span>All AI features</span>
          </div>
          {pkg.price >= 30 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Priority processing</span>
            </div>
          )}
          {pkg.price >= 100 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Check className="size-4 text-emerald-500 shrink-0" />
              <span>Dedicated support</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          variant={isPopular ? "filled" : "outline"}
          className={cn(
            "w-full font-semibold h-11 rounded-xl transition-all",
            isPopular
              ? "bg-purple hover:bg-purple/90 text-white shadow-lg shadow-purple/25"
              : "border-purple/30 text-purple hover:bg-purple hover:text-white"
          )}
          onClick={() => onSelect(pkg)}
        >
          <Sparkles className="size-4 mr-2" />
          Get This Package
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// PURCHASE CONFIRMATION DIALOG
// ============================================================================
const PurchaseDialog = ({
  open,
  onOpenChange,
  pkg,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg: TokenPackage | null;
  onConfirm: () => void;
  isLoading: boolean;
}) => {
  if (!pkg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-purple" />
            Confirm Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-xl bg-purple-50 dark:bg-purple/10 border border-purple/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {pkg.name}
              </span>
              <span className="text-lg font-bold text-purple">
                {(pkg.currency || "AED").toUpperCase()}{" "}
                {pkg.discount
                  ? (pkg.price * (1 - pkg.discount / 100)).toFixed(2)
                  : pkg.price}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              You will receive{" "}
              <span className="font-bold text-purple">
                {pkg.tokens.toLocaleString()}
              </span>{" "}
              AI tokens.
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              <span>Secure payment processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" />
              <span>Tokens added instantly to your account</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" />
              <span>No hidden fees or subscriptions</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-purple hover:bg-purple/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="size-4 mr-2" />
                Confirm Purchase
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ============================================================================
// SKELETONS
// ============================================================================
const PackageSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="size-10 rounded-xl" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-8 w-28" />
    <Skeleton className="h-8 w-20" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-11 w-full rounded-xl" />
  </div>
);

// ============================================================================
// MAIN CONTENT
// ============================================================================
export const AITokensContent = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    data: balanceData,
    isLoading: balanceLoading,
  } = useAITokenBalance();
  const { data: packages, isLoading: packagesLoading } =
    useAITokenPackages(true);
  const initiatePurchase = useInitiateTokenPurchase();

  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSelectPackage = (pkg: TokenPackage) => {
    if (!isAuthenticated) {
      router.push("/methods");
      return;
    }
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    try {
      await initiatePurchase.mutateAsync({
        packageId: selectedPackage._id,
        paymentMethod: "online",
      });
      toast.success("Payment initiated! Redirecting...");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to initiate purchase. Please try again."
      );
    }
  };

  // Find the most popular package (middle or second one)
  const popularIndex = packages
    ? Math.min(1, packages.length - 1)
    : -1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container-1080 mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Back navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Hero balance */}
        <BalanceHero
          balance={balanceData?.balance || 0}
          isLoading={balanceLoading}
        />

        {/* Features strip */}
        <FeaturesStrip />

        {/* Section title */}
        <div className="text-center space-y-2">
          <Typography
            variant="h2"
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Choose Your Token Package
          </Typography>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
            Top up your AI tokens and unlock the full power of AI features.
            All packages include instant delivery with no expiry.
          </p>
        </div>

        {/* Package grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {packagesLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <PackageSkeleton key={i} />
              ))
            : packages && packages.length > 0
            ? packages.map((pkg, index) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  isPopular={index === popularIndex}
                  onSelect={handleSelectPackage}
                />
              ))
            : (
              <div className="col-span-full text-center py-12">
                <Coins className="size-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No packages available at the moment. Check back later!
                </p>
              </div>
            )}
        </div>

        {/* FAQ / Info */}
        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <Typography
            variant="h3"
            className="text-lg font-bold text-gray-900 dark:text-white mb-4"
          >
            Frequently Asked Questions
          </Typography>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                What are AI tokens?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                AI tokens are credits used to access AI-powered features like
                auto-generated ad descriptions, smart translations, and ad
                optimization tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                Do tokens expire?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                No! Your tokens never expire. Use them whenever you need to
                enhance your ads with AI features.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                How many tokens does each feature use?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Each AI feature uses a different amount of tokens. Generating an
                ad description typically uses 1–3 tokens, while translations use
                1–2 tokens.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">
                Can I get a refund?
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Unused tokens may be refundable. Please contact our support team
                for assistance with refund requests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase dialog */}
      <PurchaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pkg={selectedPackage}
        onConfirm={handleConfirmPurchase}
        isLoading={initiatePurchase.isPending}
      />
    </div>
  );
};
