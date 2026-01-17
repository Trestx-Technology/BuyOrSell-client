import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useConfirmPaymentIntentWithToken } from "@/hooks/usePayments";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaymentSuccess } from "./PaymentSuccess";
import { useRouter } from "nextjs-toploader/app";

interface PaymentFormProps {
  paymentIntentId: string;
  redirectUrl: string;
  type: string;
  typeId: string;
  amount: string;
  clientSecret: string;
  accessToken: string;
}

export function PaymentForm({
  paymentIntentId,
  redirectUrl,
  type,
  typeId,
  amount,
  accessToken,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { mutate: confirmBackend, isPending: isConfirmingBackend } =
    useConfirmPaymentIntentWithToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Centralized redirect handler
  const handleRedirect = (status: "success" | "failed", errorMsg?: string) => {
    const url = new URL(redirectUrl, window.location.origin); // Ensure base if relative
    url.searchParams.set("status", status);

    if (status === "success") {
      url.searchParams.set("type", type);
      url.searchParams.set("typeId", typeId);
      url.searchParams.set("paymentIntentId", paymentIntentId);
    } else if (errorMsg) {
      url.searchParams.set("error", errorMsg);
    }

    router.replace(url.toString());
  };


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
          return_url: redirectUrl, // Only used if redirect is strictly required by payment method
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed");
        setIsProcessing(false);
        handleRedirect("failed", error.message || "Payment failed");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // 2. Confirm with Backend
        confirmBackend(
          { paymentIntentId, accessToken },
          {
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
              // Delay slightly to show success state before redirecting, or redirect immediately based on UX preference
              // User requested: "Ensure redirect happens only after backend confirmation."
              handleRedirect("success"); 
            },
            onError: (err) => {
              console.error("Backend confirmation failed", err);
              setErrorMessage(
                "Payment succeeded but verification failed. Please contact support."
              );
              setIsProcessing(false);
              handleRedirect("failed", "Backend verification failed");
            },
          }
        );
      } else {
        // Processing or requires action (handled by redirect usually, but if here, status might be processing)
        // If status is 'processing', likely async payment method.
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred.");
      setIsProcessing(false);
      handleRedirect("failed", "An unexpected error occurred.");
    }
  };

  if (isSuccess) {
    return <PaymentSuccess />;
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
        icon={
          isProcessing || isConfirmingBackend ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : undefined
        }
        iconPosition="left"
      >
        {isProcessing || isConfirmingBackend ? "Processing..." : `Pay AED ${amount}`}
      </Button>
    </form>
  );
}
