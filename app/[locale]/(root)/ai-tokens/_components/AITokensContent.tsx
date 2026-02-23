"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/hooks/useAITokens";
import { useCreateAITokenCheckout } from "@/hooks/usePayments";
import { useLocale } from "@/hooks/useLocale";
import { TokenPackage } from "@/interfaces/ai-tokens.types";
import { toast } from "sonner";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";

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
  const { locale } = useLocale();
  const isArabic = locale === "ar";
  const tier = getTier(pkg);
  const TierIcon = tier.icon;
  const pricePerToken = (pkg.price / pkg.tokens).toFixed(3);

  const displayName = isArabic ? pkg.nameAr || pkg.name : pkg.name;
  const displayDescription = isArabic
    ? pkg.descriptionAr || pkg.description
    : pkg.description;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border transition-all duration-500",
        isPopular
          ? "border-purple shadow-2xl shadow-purple/10 scale-[1.02] z-10 bg-white dark:bg-gray-950"
          : "border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-purple/30 hover:bg-white dark:hover:bg-gray-900",
        tier.glow
      )}
    >
      {/* Premium Gradient Background */}
      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-tr from-purple/5 via-transparent to-purple/5 rounded-3xl pointer-events-none" />
      )}

      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple to-[#7c3aed] text-white text-[10px] font-black py-1 px-4 rounded-full uppercase tracking-widest shadow-lg shadow-purple/30 flex items-center gap-1.5 whitespace-nowrap">
            <Star className="size-3 fill-white" />
            Most Popular
          </div>
        </div>
      )}

      <div className="relative flex flex-col flex-1 p-6 sm:p-7">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 size-12 rounded-2xl bg-purple/10 dark:bg-purple/20 flex items-center justify-center border border-purple/10 group-hover:scale-110 transition-transform duration-500">
              <TierIcon className="size-6 text-purple" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {displayName}
                </h3>
              </div>
              {displayDescription && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-normal max-w-[180px]">
                  {displayDescription}
                </p>
              )}
            </div>
          </div>
          <Badge
            className={cn(
              "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider h-fit",
              isPopular
                ? "bg-purple text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            )}
          >
            {pkg.price >= 100 ? "Pro" : pkg.price >= 30 ? "Plus" : "Basic"}
          </Badge>
        </div>

        {/* Pricing Section */}
        <div className="space-y-1 mb-6 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-100/50 dark:border-gray-700/30">
          <div className="flex items-baseline gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-purple/70 uppercase">
                {(pkg.currency || "AED").toUpperCase()}
              </span>
              <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {pkg.discount
                  ? (pkg.price * (1 - pkg.discount / 100)).toFixed(2)
                  : pkg.price}
              </span>
            </div>
            {pkg.discount && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {pkg.price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700/50" />
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
              {pkg.tokens.toLocaleString()} Tokens • {pricePerToken}/token
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700/50" />
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col gap-3.5 mb-8 flex-1">
          <FeatureItem label={`${pkg.tokens.toLocaleString()} AI tokens`} />
          <FeatureItem label="No tokens expiry" />
          <FeatureItem label="All AI smart features" />
          {pkg.price >= 30 && <FeatureItem label="Priority processing speed" />}
          {pkg.price >= 100 && <FeatureItem label="24/7 Dedicated Support" />}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onSelect(pkg)}
          className={cn(
            "w-full h-12 rounded-2xl font-bold transition-all duration-300 active:scale-95 group/btn overflow-hidden relative",
            isPopular
              ? "bg-purple hover:bg-purple/90 text-white shadow-xl shadow-purple/20"
              : "bg-white dark:bg-gray-900 border-2 border-purple/20 text-indigo-600 dark:text-purple hover:border-purple/40 hover:bg-purple/5"
          )}
        >
          {isPopular && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
          )}
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={cn("size-4", isPopular ? "text-yellow-300" : "text-purple")} />
            <span>Select This Package</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

const FeatureItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 group/item">
    <div className="flex-shrink-0 size-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors duration-300">
      <Check className="size-3 text-emerald-500 group-hover/item:text-white transition-colors" />
    </div>
    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium tracking-tight">
      {label}
    </span>
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("inline-flex items-center", className)}>
    {children}
  </div>
);

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
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  if (!pkg) return null;

  const displayName = isArabic ? pkg.nameAr || pkg.name : pkg.name;
  const currentPrice = pkg.discount
    ? (pkg.price * (1 - pkg.discount / 100)).toFixed(2)
    : pkg.price;

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white dark:bg-gray-950">
        <ResponsiveModalHeader className="p-6 pb-0">
          <ResponsiveModalTitle className="flex items-center gap-3 text-xl font-black text-gray-900 dark:text-white">
            <div className="size-10 rounded-2xl bg-purple/10 flex items-center justify-center">
              <Sparkles className="size-5 text-purple" />
            </div>
            {isArabic ? "تأكيد الشراء" : "Confirm Purchase"}
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="p-6 space-y-6">
          {/* Package Summary Card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-purple/5 to-purple/10 border border-purple/10 p-5 overflow-hidden">
            <div className="absolute -right-8 -top-8 size-32 bg-purple/5 rounded-full blur-2xl" />

            <div className="relative flex justify-between items-start mb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple/60">
                  {isArabic ? "الحزمة المختارة" : "Selected Package"}
                </span>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">
                  {displayName}
                </h4>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1 text-purple">
                  <span className="text-sm font-bold uppercase">
                    {(pkg.currency || "AED").toUpperCase()}
                  </span>
                  <span className="text-2xl font-black tracking-tight">
                    {currentPrice}
                  </span>
                </div>
                {pkg.discount && (
                  <p className="text-xs text-gray-400 line-through font-medium leading-none">
                    {(pkg.currency || "AED").toUpperCase()} {pkg.price}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-white dark:border-gray-800">
              <Coins className="size-5 text-purple" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {pkg.tokens.toLocaleString()} {isArabic ? "رمز ذكاء اصطناعي" : "AI Tokens"}
              </span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="space-y-3.5 px-1">
            <div className="flex items-center gap-3 group">
              <div className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                <ShieldCheck className="size-4 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {isArabic ? "معالجة دفع آمنة" : "Secure Payment"}
                </span>
                <span className="text-[11px] text-gray-500">
                  {isArabic ? "بياناتك مشفرة ومحمية بالكامل" : "Your data is encrypted and fully protected"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Zap className="size-4 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {isArabic ? "تفعيل فوري" : "Instant Activation"}
                </span>
                <span className="text-[11px] text-gray-500">
                  {isArabic ? "ستضاف الرموز تلقائياً إلى حسابك" : "Tokens will be added automatically to your account"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ResponsiveModalFooter className="p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-[2] h-12 rounded-2xl font-bold bg-purple hover:bg-purple/90 text-white shadow-xl shadow-purple/20 transition-all active:scale-95 group/confirm relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>{isArabic ? "جاري المعالجة..." : "Processing..."}</span>
              </div>
            ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="size-4 text-yellow-300 group-hover/confirm:scale-110 transition-transform" />
                  <span>{isArabic ? "تأكيد الدفع" : "Confirm & Pay"}</span>
                </div>
            )}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
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
  const { locale } = useLocale();
  const isArabic = locale === "ar";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const {
    data: balanceData,
    isLoading: balanceLoading,
  } = useAITokenBalance();
  const { data: packages, isLoading: packagesLoading } =
    useAITokenPackages(true);
  const searchParams = useSearchParams();
  const createCheckoutMutation = useCreateAITokenCheckout();
  const user = useAuthStore((state) => state.session.user);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "success") {
      toast.success(
        isArabic
          ? "تمت عملية الشراء بنجاح! الرصيد سيحدث قريباً."
          : "Purchase successful! Your balance will update shortly."
      );
      router.replace(`/${locale}/ai-tokens`);
    } else if (status === "cancel") {
      toast.error(
        isArabic ? "تم إلغاء عملية الشراء." : "Purchase was cancelled."
      );
      router.replace(`/${locale}/ai-tokens`);
    }
  }, [searchParams, isArabic, locale, router]);

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
    if (!selectedPackage || !user) return;
    try {
      const baseUrl = window.location.origin;
      const response = await createCheckoutMutation.mutateAsync({
        lineItems: [
          {
            name: selectedPackage.name,
            amount: Math.round(
              (selectedPackage.discount
                ? selectedPackage.price * (1 - selectedPackage.discount / 100)
                : selectedPackage.price) * 100
            ),
            currency: selectedPackage.currency || "AED",
            quantity: 1,
          },
        ],
        successUrl: `${baseUrl}/${locale}/pay/response?session_id={CHECKOUT_SESSION_ID}&type=AI_TOKENS`,
        cancelUrl: `${baseUrl}/${locale}/ai-tokens?status=cancel`,
        type: "AI_TOKENS",
        typeId: selectedPackage._id,
        userId: user._id,
        customerEmail: user.email,
        mode: "payment",
      });

      const purchaseData = response.data;
      if (purchaseData?.checkoutUrl) {
        window.location.href = purchaseData.checkoutUrl;
      }

      toast.success(isArabic ? "جاري تحويلك للدفع..." : "Redirecting to payment...");
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        (isArabic
          ? "فشل في بدء عملية الشراء. يرجى المحاولة مرة أخرى."
          : "Failed to initiate purchase. Please try again.")
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
          balance={balanceData?.data.tokensRemaining || 0}
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
        isLoading={createCheckoutMutation.isPending}
      />
    </div>
  );
};
