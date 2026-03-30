"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Container1080 } from "@/components/layouts/container-1080";
import { Smartphone, QrCode, Star, ShieldCheck, Zap } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";
import { AppStoreButtons } from "@/components/global/app-store-buttons";
import { useSearchParams, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";

export function DownloadContent() {
  const { locale, t } = useLocale();
  const isArabic = locale === "ar";
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const isComingSoon = status === "coming-soon";

  const features = [
    {
      icon: <Zap className="size-5 text-purple" />,
      title: t.download.fastPerformance,
      desc: t.download.fastPerformanceDesc,
    },
    {
      icon: <ShieldCheck className="size-5 text-purple" />,
      title: t.download.secureExperience,
      desc: t.download.secureExperienceDesc,
    },
    {
      icon: <Star className="size-5 text-purple" />,
      title: t.download.exclusiveDeals,
      desc: t.download.exclusiveDealsDesc,
    },
  ];

  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    // Determine the full redirect URL only on the client
    setQrValue(`${window.location.origin}/download/redirect`);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden text-gray-900 dark:text-gray-100">
      {/* Coming Soon Dialog for Android */}
      <Dialog open={isComingSoon} onOpenChange={() => window.history.replaceState({}, '', '/download')}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-purple/10">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Google Play Store</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
             <div className="size-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-2">
                <Smartphone className="size-10 text-gray-400 animate-pulse" />
             </div>
             <Typography variant="h3" className="text-center">Coming Soon!</Typography>
             <p className="text-center text-sm text-gray-500 dark:text-gray-400">
               Our Android app is currently in development and will be available on the Google Play Store very shortly. Stay tuned!
             </p>
             <Button 
               className="bg-purple text-white w-full rounded-xl"
               onClick={() => window.history.replaceState({}, '', '/download')}
             >
               Got it
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 pt-32 pb-48 relative px-4 lg:px-0">
        <Container1080>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Smartphone className="size-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {t.download.officialAppAvailable}
                </span>
              </div>

              <h1
                className={
                  isArabic
                    ? "text-5xl lg:text-7xl font-bold leading-tight font-arabic"
                    : "text-5xl lg:text-7xl font-bold leading-tight"
                }
              >
                {t.download.tradeSmarter}
              </h1>

              <p className="text-lg text-purple-100 max-w-lg leading-relaxed">
                {t.download.experienceMarketplace}
              </p>

              <AppStoreButtons />
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
              {/* Decorative Circles */}
              <div className="absolute -top-20 -right-20 size-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 size-[300px] bg-purple-500/20 rounded-full blur-2xl" />

              {/* Stylized Phone Frame */}
              <div className="relative z-10 mx-auto w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-[0_0_80px_rgba(0,0,0,0.4)] p-3 overflow-hidden">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden relative">
                   {/* Carousel Wrapper */}
                   <AppMockupCarousel />
                </div>
              </div>
            </div>
          </div>
        </Container1080>
      </div>

      {/* Benefits Content */}
      <Container1080 className="-mt-20 relative z-20">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl dark:shadow-none p-8 lg:p-16 border border-transparent dark:border-gray-800">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="space-y-4 text-center md:text-left">
                <div className="size-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-16 border-gray-100 dark:border-gray-800" />

          {/* QR Code Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center lg:text-left space-y-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t.download.scanToDownload}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {t.download.scanDesc}
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="p-8 bg-gray-100 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center gap-4 group hover:border-purple/30 transition-colors">
                <div className="p-6 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                   <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
                     <QRCode
                        value={qrValue || "https://buyorsell-uae.com/download/redirect"}
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                        level="H"
                      />
                   </div>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold tracking-widest uppercase text-center">
                  Scan for Android or iOS
                </p>
              </div>
              <AppStoreButtons theme="light" className="dark:hidden" />
              <AppStoreButtons theme="dark" className="hidden dark:flex" />
            </div>
          </div>
        </div>
      </Container1080>

      <div className="py-20 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 BuyOrSell UAE. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function AppMockupCarousel() {
  const [current, setCurrent] = useState(0);
  const screenshots = [
    "/assets/mobile-screens/WhatsApp%20Image%202026-03-30%20at%201.57.36%20PM.jpeg",
    "/assets/mobile-screens/WhatsApp%20Image%202026-03-30%20at%201.57.37%20PM%20(1).jpeg",
    "/assets/mobile-screens/WhatsApp%20Image%202026-03-30%20at%201.57.37%20PM%20(2).jpeg",
    "/assets/mobile-screens/WhatsApp%20Image%202026-03-30%20at%201.57.37%20PM.jpeg",
    "/assets/mobile-screens/WhatsApp%20Image%202026-03-30%20at%201.57.38%20PM.jpeg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % screenshots.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
           key={current}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.5 }}
           className="absolute inset-0"
        >
          <Image
            src={screenshots[current]}
            alt={`Feature ${current + 1}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
