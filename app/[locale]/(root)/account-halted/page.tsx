"use client";

import React from "react";
import { Container1080 } from "@/components/layouts/container-1080";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Mail, Phone, AlertCircle } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "nextjs-toploader/app";

export default function AccountHaltedPage() {
  const { localePath } = useLocale();
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 text-center space-y-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple/5 rounded-full -ml-16 -mb-16 blur-3xl" />

        <div className="relative mx-auto w-28 h-28 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center ring-8 ring-red-50/50 dark:ring-red-900/5 shadow-inner">
          <AlertCircle className="w-14 h-14 text-red-500" />
        </div>

        <div className="space-y-4 relative">
          <Typography
            variant="h2"
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          >
            Account Halted
          </Typography>
          <Typography
            variant="body-large"
            className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed"
          >
            Your account has been temporarily halted by administration for review following reports from the community.
          </Typography>
        </div>

        <div className="pt-4 space-y-6 relative">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
            <Typography
              variant="md-medium"
              className="text-gray-500 dark:text-gray-400 font-medium mb-4 block"
            >
              Need assistance? Contact our support team:
            </Typography>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl h-14 gap-3 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                onClick={() =>
                  (window.location.href = "mailto:buyrorsell@gmail.com")
                }
              >
                <Mail className="w-5 h-5 text-purple" />
                <span className="text-sm font-semibold">Email Support</span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-2xl h-14 gap-3 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                onClick={() => (window.location.href = "tel:+9712662262622")}
              >
                <Phone className="w-5 h-5 text-purple" />
                <span className="text-sm font-semibold">Call Us</span>
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full rounded-2xl h-14 font-extrabold text-base shadow-lg shadow-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => router.push(localePath("/contact-us"))}
            >
              Raise a Dispute
            </Button>

            <Button
              variant="ghost"
              className="w-full rounded-2xl h-12 text-gray-400 hover:text-purple hover:bg-purple/5 font-medium"
              onClick={() => router.push(localePath("/"))}
            >
              Return to Website
            </Button>
          </div>
        </div>

        <div className="pt-6 relative">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] font-bold">
            Safety First Environment
          </p>
        </div>
      </div>
    </div>
  );
}
