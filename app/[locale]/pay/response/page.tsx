"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Typography } from "@/components/typography";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function ResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const error = searchParams.get("error");
  const type = searchParams.get("type"); // e.g. PLAN or ADS
  
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Payment Successful!
        </Typography>
        <p className="text-gray-500 mb-6">
          Your payment has been processed successfully.
        </p>
        <div className="animate-pulse text-sm text-purple-600 font-medium mb-6">
           You will be redirected automatically...
        </div>
        <Button 
            onClick={() => {
                // Try to close webview or redirect to app scheme if needed
                // For now just redirect to home
                router.push("/");
            }} 
            className="w-full"
        >
            Return to Home
        </Button>
      </div>
    );
  }

  if (status === "failed") {
     return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <Typography variant="h3" className="mb-2 font-bold text-gray-900">
          Payment Failed
        </Typography>
        <p className="text-gray-500 mb-6 max-w-xs mx-auto">
          {error || "Something went wrong with your payment request. Please try again."}
        </p>
                 <Button onClick={() => router.back()} variant="filled" icon={
                       <ArrowLeft className="w-4 h-4" />

                 } iconPosition="center" className="w-full">
            Try Again
        </Button>
      </div>
    );
  }

  // Default / Loading State
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="text-gray-500 mt-4">Verifying payment status...</p>
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
