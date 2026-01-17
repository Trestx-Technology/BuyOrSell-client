"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Typography } from "@/components/typography";
import { LocalStorageService } from "@/services/local-storage";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import { Loader2 } from "lucide-react";

import { PaymentForm } from "@/components/payment/PaymentForm";
import { StripeErrorBoundary } from "@/components/payment/StripeErrorBoundary";
import { MissingParamsError } from "@/components/payment/MissingParamsError";

// Initialize Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function PayPageContent() {
  const searchParams = useSearchParams();
  const [isAuthSet, setIsAuthSet] = useState(false);

  // 1. Read parameters
  const typeId = searchParams.get("typeId");
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const redirect = searchParams.get("redirect");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const accessToken = searchParams.get("accessToken");
  const amount = searchParams.get("amount");
  const clientSecret = searchParams.get("secret");

  // 2. Validate required params
  const missingParams = [];
  if (!typeId) missingParams.push("typeId");
  if (!userId) missingParams.push("userId");
  if (!type) missingParams.push("type");
  if (!redirect) missingParams.push("redirect");
  if (!paymentIntentId) missingParams.push("paymentIntentId");
  if (!accessToken) missingParams.push("accessToken");
  if (!amount) missingParams.push("amount");
  if (!clientSecret) missingParams.push("secret");

  // 3. Set Auth Token
  useEffect(() => {
    if (accessToken) {
      LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
      setIsAuthSet(true);
    }
  }, [accessToken]);

  if (missingParams.length > 0) {
    return <MissingParamsError missingParams={missingParams} />;
  }

  // Memoize options to prevent re-initialization on every render
  const options = React.useMemo(
    () => ({
      clientSecret: clientSecret!,
      appearance: { theme: "stripe" as const },
    }),
    [clientSecret]
  );

  if (!isAuthSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 text-center">
          <Typography variant="2xl-bold" className="mb-2">
            Complete Payment
          </Typography>
          <p className="text-gray-500">Complete your purchase securely</p>
        </div>

        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            paymentIntentId={paymentIntentId!}
            redirectUrl={redirect!}
            type={type!}
            typeId={typeId!}
            amount={(parseInt(amount!) / 100).toFixed(2)}
            clientSecret={clientSecret!}
            accessToken={accessToken!}
          />
        </Elements>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <StripeErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <PayPageContent />
      </Suspense>
    </StripeErrorBoundary>
  );
}
