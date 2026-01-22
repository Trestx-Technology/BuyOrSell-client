"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Typography } from "@/components/typography";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCompleteCheckoutSession } from "@/hooks/usePayments";
import { useEffect } from "react";

function ResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  // Verify session if ID exists
  const { data, isLoading, error } = useCompleteCheckoutSession(sessionId || "");

  // Effect to handle automatic redirect or other side effects if needed
  useEffect(() => {
    console.log("data", data);
    if (data?.data?.status === "succeeded") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [data, router]);

  // 1. Loading State (Verifying)
  if (sessionId && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Verifying Payment...
        </Typography>
        <p className="text-gray-500">
          Please wait while we confirm your transaction.
        </p>
      </div>
    );
  }

  // 2. Success State (Verified via API)
  if (sessionId && data?.data && data.data.status === "succeeded") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Payment Successful!
        </Typography>
        <p className="text-gray-500 mb-6">
          {data.message || "Your payment has been processed successfully."}
        </p>
        <div className="animate-pulse text-sm text-purple-600 font-medium mb-6">
          Redirecting to home in a few seconds...
        </div>
        <Button 
          onClick={() => router.push("/")} 
            className="w-full"
        >
            Return to Home
        </Button>
      </div>
    );
  }

  // 3. Failure State (API Error or URL param error)
  if (sessionId && data && data.data?.status !== "succeeded") {
    const errorMessage = error?.message || (data ? "Payment verification failed." : "Something went wrong with your payment request.");

     return (
       <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Payment Failed
        </Typography>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
           {errorMessage}
        </p>
         <Button onClick={() => router.push("/plans")} variant="filled" icon={
           <ArrowLeft className="w-4 h-4" />
         } iconPosition="center" className="w-full">
            Try Again
        </Button>
      </div>
    );
  }

  // Fallback / Initial State (if no session_id and no status param)
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      <p className="text-gray-500 mt-4">Initializing...</p>
    </div>
  );
}

export default function PaymentResponsePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
             <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600"/></div>}>
                <ResponseContent />
             </Suspense>
        </div>
    </div>
  );
}
