import React from "react";
import { Typography } from "@/components/typography";
import { CheckCircle2 } from "lucide-react";

export function PaymentSuccess() {
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
