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
    <Container1080 className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800 text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-4">
          <Typography variant="h2" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Account Halted
          </Typography>
          <Typography variant="body-large" className="text-gray-600 dark:text-gray-400">
            Your actions have been halted by the admin due to recent reports from other users.
          </Typography>
        </div>

        <div className="pt-4 space-y-4">
          <Typography variant="md-medium" className="text-gray-500 font-medium italic">
            Need assistance? Contact our support team:
          </Typography>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-12 gap-2"
                onClick={() => window.location.href = "mailto:buyrorsell@gmail.com"}
             >
               <Mail className="w-4 h-4" />
               buyrorsell@gmail.com
             </Button>
             <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-12 gap-2"
                onClick={() => window.location.href = "tel:+9712662262622"}
             >
               <Phone className="w-4 h-4" />
               +971 2662262622
             </Button>
          </div>
          
          <Button 
            variant="primary" 
            className="w-full rounded-xl h-12 font-bold"
            onClick={() => router.push(localePath("/contact-us"))}
          >
            Go to Contact Page
          </Button>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
           <Button 
              variant="ghost" 
              className="text-gray-500 hover:text-purple"
              onClick={() => router.push(localePath("/"))}
           >
              Return to Home
           </Button>
        </div>
      </div>
    </Container1080>
  );
}
