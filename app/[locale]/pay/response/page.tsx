"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Typography } from "@/components/typography";
import { Check, X, Loader2, ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useCompleteCheckoutSession } from "@/hooks/usePayments";
import { useAITokenBalance } from "@/hooks/useAITokens";

function ResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const locale = pathname.split("/")[1] || "en";

  const isAITokens = type === "ai-tokens" || type === "AI_TOKENS";

  const { data, isLoading, error } = useCompleteCheckoutSession(sessionId || "");
  const { data: balanceData } = useAITokenBalance();

  useEffect(() => {
    if (data?.data?.status) {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get("status") !== data.data.status) {
        params.set("status", data.data.status);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }

    if (data?.data?.status === "succeeded") {
      const timer = setTimeout(() => {
        if (isAITokens) {
          router.push(`/${locale}/ai-tokens?status=success`);
        } else {
          router.push(`/${locale}/my-subscriptions`);
        }
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [data, router, pathname, searchParams, isAITokens, locale]);

  const wrapperVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const iconVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 15, delay: 0.2 } },
  };

  // 1. Loading State (Verifying)
  if (sessionId && isLoading) {
    return (
      <motion.div
        key="loading"
        variants={wrapperVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="bg-primary/10 p-5 rounded-full relative">
            <Loader2 className="w-14 h-14 animate-spin text-primary" />
          </div>
        </div>
        <Typography variant="h2" className="mb-3 font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          Verifying Payment
        </Typography>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm">
          Please wait a moment while we securely confirm your transaction...
        </p>
      </motion.div>
    );
  }

  // 2. Success State (Verified via API)
  if (sessionId && data?.data && data.data.status === "succeeded") {
    return (
      <motion.div
        key="success"
        variants={wrapperVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <motion.div variants={iconVariants} className="relative mb-8">
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
          <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full relative shadow-sm border border-green-200 dark:border-green-800">
            <Check className="w-14 h-14 text-green-600 dark:text-green-400" strokeWidth={3} />
          </div>
        </motion.div>

        <Typography variant="h2" className="mb-3 font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          Payment Successful!
        </Typography>

        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-sm leading-relaxed">
          {data.message || "Your payment has been successfully processed."}
        </p>

        {isAITokens && balanceData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Coins className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Available Tokens</p>
                <Typography variant="h3" className="font-bold text-gray-900 dark:text-gray-100">
                  {balanceData?.data?.tokensRemaining ?? 0}
                </Typography>
              </div>
            </div>

            <div className="text-right flex flex-col items-end justify-center">
              <span className="text-xs font-semibold px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-lg">
                Ready to use
              </span>
            </div>
          </motion.div>
        )}

        <div className="w-full space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isAITokens
              ? "Redirecting to your AI Tokens..."
              : "Redirecting to your Subscriptions..."}
          </div>

          <Button
            onClick={() =>
              router.push(
                isAITokens
                  ? `/${locale}/ai-tokens`
                  : `/${locale}/my-subscriptions`
              )
            }
            className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
            size="lg"
          >
            {isAITokens ? "View AI Tokens" : "View My Subscriptions"}
          </Button>
        </div>
      </motion.div>
    );
  }

  // 3. Failure State (API Error or URL param error)
  if (sessionId && (error || (data && data.data?.status !== "succeeded"))) {
    const apiErrorMessage = (error as any)?.response?.data?.message || (error as any)?.message;
    const errorMessage = apiErrorMessage || (data ? "Payment verification failed." : "An unexpected error occurred with your payment.");

    return (
      <motion.div
        key="error"
        variants={wrapperVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <motion.div variants={iconVariants} className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full" />
          <div className="bg-red-100 dark:bg-red-900/30 p-5 rounded-full relative shadow-sm border border-red-200 dark:border-red-800">
            <X className="w-14 h-14 text-red-600 dark:text-red-400" strokeWidth={3} />
          </div>
        </motion.div>

        <Typography variant="h2" className="mb-3 font-bold text-gray-900 dark:text-gray-50 tracking-tight">
          Payment Failed
        </Typography>

        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-sm leading-relaxed">
          {errorMessage}
        </p>

        <Button
          onClick={() =>
            router.push(
              isAITokens ? `/${locale}/ai-tokens` : `/${locale}/plans`
            )
          }
          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02]"
          variant="filled"
          size="lg"
        >
          Try Again
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  // Fallback / Initial State (if no session_id and no status param)
  return (
    <motion.div
      key="initial"
      variants={wrapperVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-6" />
      <Typography variant="h3" className="font-semibold text-gray-700 dark:text-gray-300 tracking-tight">
        Initializing...
      </Typography>
    </motion.div>
  );
}

export default function PaymentResponsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-[2rem] shadow-2xl overflow-hidden p-8 sm:p-12">
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div className="flex justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            }
          >
            <ResponseContent />
          </Suspense>
        </AnimatePresence>
      </div>
    </div>
  );
}
