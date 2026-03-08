"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Container1080 } from "@/components/layouts/container-1080";
import { Smartphone, QrCode, Star, ShieldCheck, Zap } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import Image from "next/image";

export function DownloadContent() {
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  const features = [
    {
      icon: <Zap className="size-5 text-purple" />,
      title: isArabic ? "أداء أسرع" : "Faster Performance",
      desc: isArabic
        ? "تصفح أسرع بمقدار 2x مقارنة بمتصفح الهاتف"
        : "Browse 2x faster than mobile web browsers",
    },
    {
      icon: <ShieldCheck className="size-5 text-purple" />,
      title: isArabic ? "أمان عالي" : "Secure Experience",
      desc: isArabic
        ? "مدفوعات آمنة وحماية متقدمة للبيانات"
        : "Verified payments and advanced data protection",
    },
    {
      icon: <Star className="size-5 text-purple" />,
      title: isArabic ? "عروض حصرية" : "Exclusive Deals",
      desc: isArabic
        ? "خصومات خاصة فقط لمستخدمي التطبيق"
        : "App-only discounts and early access to deals",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 pt-20 pb-40 relative">
        <Container1080>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Smartphone className="size-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {isArabic ? "تطبيق متاح الآن" : "Official App Available"}
                </span>
              </div>

              <h1
                className={
                  isArabic
                    ? "text-5xl lg:text-7xl font-bold leading-tight font-arabic"
                    : "text-5xl lg:text-7xl font-bold leading-tight"
                }
              >
                {isArabic
                  ? "تداول بذكاء مع تطبيق BuyOrSell"
                  : "Trade Smarter with BuyOrSell App"}
              </h1>

              <p className="text-lg text-purple-100 max-w-lg leading-relaxed">
                {isArabic
                  ? "احصل على أفضل تجربة تسوق وبيع في الإمارات العربية المتحدة. حمل التطبيق الآن واستلم إشعارات فورية."
                  : "Experience the #1 marketplace in UAE with our native mobile app. Get real-time notifications, secure messaging, and faster browsing."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  icon={
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup%20(1).svg?alt=media&token=697b0ca8-67bf-44d9-bc5d-ee12e36822a7"
                      alt="app store"
                      width={25}
                      height={25}
                      className="size-[25px]"
                    />
                  }
                  iconPosition="left"
                  onClick={() =>
                    window.open(
                      `https://apps.apple.com/app/idXXXXXXXXX`,
                      "_blank",
                    )
                  }
                  className="bg-black px-6 font-medium text-white hover:bg-black/90 h-14 rounded-xl text-left capitalize transition-all hover:scale-105 shadow-xl"
                >
                  <span className="flex flex-col gap-0 justify-start relative px-2 text-md">
                    <span className="text-[10px] tracking-wider absolute top-[-10px] font-inter">
                      Available on the
                    </span>
                    App Store
                  </span>
                </Button>

                <Button
                  icon={
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup.svg?alt=media&token=08d8b0d5-e352-4d63-9ead-4824478c6065"
                      alt="google play"
                      width={25}
                      height={25}
                      className="size-[25px]"
                    />
                  }
                  iconPosition="left"
                  onClick={() =>
                    window.open(
                      "https://play.google.com/store/apps/details?id=com.yourpackage",
                      "_blank",
                    )
                  }
                  className="bg-black px-6 font-medium text-white hover:bg-black/90 h-14 rounded-xl text-left capitalize transition-all hover:scale-105 shadow-xl"
                >
                  <span className="flex flex-col gap-0 justify-start relative pt-2 text-md">
                    <span className="text-[10px] tracking-wider absolute top-[-5px] font-inter">
                      GET IT ON
                    </span>
                    Google play
                  </span>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
              {/* Decorative Circles */}
              <div className="absolute -top-20 -right-20 size-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -left-20 size-[300px] bg-purple-500/20 rounded-full blur-2xl" />

              {/* Stylized Phone Frame */}
              <div className="relative z-10 mx-auto w-[320px] h-[640px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-[0_0_80px_rgba(0,0,0,0.4)] p-3 overflow-hidden">
                <div className="w-full h-full bg-purple-50 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="size-20 bg-purple rounded-3xl flex items-center justify-center shadow-lg transform -rotate-12">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="invert"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">BuyOrSell UAE</h4>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="size-3 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-32 bg-white rounded-xl shadow-sm border border-gray-100" />
                  <div className="w-full h-8 bg-purple/10 rounded-full" />
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="h-16 bg-white rounded-lg border border-gray-100" />
                    <div className="h-16 bg-white rounded-lg border border-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container1080>
      </div>

      {/* Benefits Content */}
      <Container1080 className="-mt-20 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-16">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="space-y-4 text-center md:text-left">
                <div className="size-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <hr className="my-16 border-gray-100" />

          {/* QR Code Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center lg:text-left space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                {isArabic ? "امسح الرمز للتحميل" : "Scan to download"}
              </h2>
              <p className="text-gray-500">
                {isArabic
                  ? "وجه كاميرا هاتفك نحو رمز الاستجابة السريعة وسيتم توجيهك مباشرة لصفحة التحميل."
                  : "Point your phone camera toward the QR code and you'll be redirected to your app store instantly."}
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4">
              <div className="size-48 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <QrCode className="size-32 text-gray-200" strokeWidth={1} />
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                Play Store & App Store
              </p>
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
