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
import { useConfirmPaymentIntentWithToken } from "@/hooks/usePayments";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocalStorageService } from "@/services/local-storage";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import { Loader2, CheckCircle2 } from "lucide-react";

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
  accessToken,
}: {
  paymentIntentId: string;
  redirectUrl: string;
  type: string;
  typeId: string;
  amount: string;
  clientSecret: string;
    accessToken: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { mutate: confirmBackend, isPending: isConfirmingBackend } =
    useConfirmPaymentIntentWithToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        const successUrl = new URL(redirectUrl);
        successUrl.searchParams.set("status", "success");
        successUrl.searchParams.set("type", type);
        successUrl.searchParams.set("typeId", typeId);
        successUrl.searchParams.set("paymentIntentId", paymentIntentId);
        window.location.href = successUrl.toString();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, redirectUrl, type, typeId, paymentIntentId]);

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
        confirmBackend({ paymentIntentId, accessToken }, {
          onSuccess: () => {
            try {
              // Notify React Native WebView
              if ((window as any).ReactNativeWebView) {
                (window as any).ReactNativeWebView.postMessage(
                  JSON.stringify({
                    status: "success",
                    paymentIntentId,
                    type,
                    typeId,
                  })
                );
              }
            } catch (e) {
              console.error("Failed to post message to WebView", e);
            }
            setIsSuccess(true);
          },
          onError: (err) => {
            console.error("Backend confirmation failed", err);
            setErrorMessage(
              "Payment succeeded but verification failed. Please contact support."
            );
            setIsProcessing(false);
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Payment Successful!
        </Typography>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Redirecting you back to the app...
        </p>
        <div className="animate-pulse text-sm text-purple-600 font-medium">
          Do not close this window
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <PaymentElement onReady={() => setIsReady(true)} />
      {errorMessage && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !isReady || isProcessing || isConfirmingBackend}
        icon={isProcessing || isConfirmingBackend ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : undefined}
        iconPosition="left"
      >
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
  if (!clientSecret) missingParams.push("clientSecret");

  // 3. Set Auth Token
  useEffect(() => {
    if (accessToken) {
      LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
      setIsAuthSet(true);
    }
  }, [accessToken]);

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

  // Memoize options to prevent re-initialization on every render
  const options = React.useMemo(() => ({
    clientSecret: clientSecret!,
    appearance: { theme: "stripe" as const },
  }), [clientSecret]);

  if (!isAuthSet) {
    return (
       <div className="min-h-screen flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
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
          options={options}
        >
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

// Simple Error Boundary for Stripe Elements
class StripeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Stripe Elements Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="mb-4 text-green-600 flex justify-center">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <Typography variant="h4" className="mb-2 font-bold text-gray-900">
              Payment Completed
            </Typography>
            <p className="text-gray-500 mb-8">
              This payment session has already been completed or is no longer valid.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
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
