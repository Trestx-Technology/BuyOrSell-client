"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuthStore } from "@/stores/authStore";
import { useConfirmPaymentIntent, useGetPaymentIntent } from "@/hooks/usePayments";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocalStorageService } from "@/services/local-storage";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import { Loader2 } from "lucide-react";

// Initialize Stripe outside of component to avoid recreating it
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function PaymentForm({
  paymentIntentId,
  redirectUrl,
  type,
  typeId,
  amount,
  clientSecret,
}: {
  paymentIntentId: string;
  redirectUrl: string;
  type: string;
  typeId: string;
  amount: string;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { mutate: confirmBackend, isPending: isConfirmingBackend } =
    useConfirmPaymentIntent();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: redirectUrl, // Fallback if redirect is required
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
        // Redirect with failure
        const failureUrl = new URL(redirectUrl);
        failureUrl.searchParams.set("status", "failed");
        failureUrl.searchParams.set("error", error.message || "Payment failed");
        window.location.href = failureUrl.toString();
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // 2. Confirm with Backend
        confirmBackend(paymentIntentId, {
          onSuccess: () => {
            // 3. Redirect to App Success
            const successUrl = new URL(redirectUrl);
            successUrl.searchParams.set("status", "success");
            successUrl.searchParams.set("type", type);
            successUrl.searchParams.set("typeId", typeId);
            successUrl.searchParams.set("paymentIntentId", paymentIntentId);
            window.location.href = successUrl.toString();
          },
          onError: (err) => {
            console.error("Backend confirmation failed", err);
            setErrorMessage(
              "Payment succeeded but verification failed. Please contact support."
            );
            setIsProcessing(false);
            // Even if backend fails, payment succeeded on Stripe. 
            // Depending on strictness, might still redirect to success or separate error.
            // Requirement says "Wait for backend confirmation". 
            // We'll redirect with 'pending_verification' or 'success' but maybe log error?
            // User requirement: "On successful backend confirmation: Redirect... On failure... Redirect with status=failed"
            // So we fail.
            const failureUrl = new URL(redirectUrl);
            failureUrl.searchParams.set("status", "failed");
            failureUrl.searchParams.set("error", "Backend verification failed");
            window.location.href = failureUrl.toString();
          },
        });
      } else {
         // Processing or requires action (handled by redirect usually)
         setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing || isConfirmingBackend}
      >
        {(isProcessing || isConfirmingBackend) && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Pay AED {amount}
      </Button>
    </form>
  );
}

function PayPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthSet, setIsAuthSet] = useState(false);

  // 1. Read parameters
  const typeId = searchParams.get("typeId");
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const redirect = searchParams.get("redirect");
  const paymentIntentId = searchParams.get("paymentIntentId");
  const accessToken = searchParams.get("accessToken");
  const amount = searchParams.get("amount");
  // const clientSecretParam = searchParams.get("clientSecret") || searchParams.get("client_secret"); // If passed directly

  // 2. Validate required params
  const missingParams = [];
  if (!typeId) missingParams.push("typeId");
  if (!userId) missingParams.push("userId");
  if (!type) missingParams.push("type");
  if (!redirect) missingParams.push("redirect");
  if (!paymentIntentId) missingParams.push("paymentIntentId");
  if (!accessToken) missingParams.push("accessToken");
  if (!amount) missingParams.push("amount");

  // 3. Set Auth Token
  useEffect(() => {
    if (accessToken) {
      LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
      // Optional: Update Cookie as well if needed by middleware, 
      // but AxiosService relies on LocalStorage usually or we can configure it.
      // Assuming LocalStorageService is primary for axios-api-client.ts in this codebase.
      setIsAuthSet(true);
    }
  }, [accessToken]);

  // 4. Fetch Client Secret if needed (since we have paymentIntentId)
  // We need client secret to render Elements.
  // We use useGetPaymentIntent to fetch it using paymentIntentId
  // This requires Auth to be set first.
  const {
    data: paymentIntentData,
    isLoading: isLoadingIntent,
    error: intentError,
  } = useGetPaymentIntent(paymentIntentId || "");
  
  // Use fetched client secret or one from params if (hypothetically) provided
  const clientSecret = paymentIntentData?.data?.clientSecret; 
  // Note: Adjust 'data.clientSecret' based on actual PaymentResponse structure. 
  // interface PaymentResponse { statusCode: number; data: { clientSecret?: string ... } }

  if (missingParams.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
          <Typography variant="xl-semibold" className="text-red-500 mb-2">
            Missing Information
          </Typography>
          <p className="text-gray-600 mb-4">
            Required parameters are missing:
          </p>
          <div className="bg-gray-100 p-3 rounded text-left text-sm font-mono text-red-600 mb-4">
             {missingParams.join(", ")}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthSet) {
    return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
       </div>
    );
  }

  if (isLoadingIntent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading payment details...</span>
      </div>
    );
  }

  if (intentError || !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-full">
          <Typography variant="xl-semibold" className="text-red-500 mb-2">
            Error
          </Typography>
          <p className="text-gray-600">
            {intentError?.message || "Could not retrieve payment details. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Calculate actual amount display (e.g. 5000 -> 50.00) if needed or trust passed param for display
  // We used 'amount' param for display button "Pay AED {amount}".
  // Ensure amount is safe text.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 text-center">
          <Typography variant="2xl-bold" className="mb-2">
            Complete Payment
          </Typography>
          <p className="text-gray-500">
             Complete your purchase securely
          </p>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <PaymentForm 
            paymentIntentId={paymentIntentId!} 
            redirectUrl={redirect!}
            type={type!}
            typeId={typeId!}
            amount={(parseInt(amount!) / 100).toFixed(2)} // Assuming amount passed is in cents/fils like 5000
            clientSecret={clientSecret}
          />
        </Elements>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <PayPageContent />
    </Suspense>
  );
}
