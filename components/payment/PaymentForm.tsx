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

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push(`/pay/response?status=success&type=${type}&typeId=${typeId}&paymentIntentId=${paymentIntentId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, type, typeId, paymentIntentId]);

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
        router.push(failureUrl.toString());
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
            },
            onError: (err) => {
              console.error("Backend confirmation failed", err);
              setErrorMessage(
                "Payment succeeded but verification failed. Please contact support."
              );
              setIsProcessing(false);
              const failureUrl = new URL(redirectUrl);
              failureUrl.searchParams.set("status", "failed");
              failureUrl.searchParams.set(
                "error",
                "Backend verification failed"
              );
              window.location.href = failureUrl.toString();
            },
          }
        );
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
        Pay AED {amount}
      </Button>
    </form>
  );
}
