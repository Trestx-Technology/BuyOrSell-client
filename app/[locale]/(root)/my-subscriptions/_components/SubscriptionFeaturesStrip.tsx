"use client";

import React from "react";
import { Zap, ShieldCheck, TrendingUp, Star, Layout, Users, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

const subscriptionFeatures = [
  {
    icon: Layout,
    titleEn: "Premium Placement",
    titleAr: "تمييز الإعلانات",
    descEn: "Get your ads listed at the top positions",
    descAr: "احصل على إعلاناتك في المواقع الأولى",
  },
  {
    icon: Globe,
    titleEn: "Smart Translation",
    titleAr: "ترجمة ذكية",
    descEn: "Reach more buyers with auto-translations",
    descAr: "صل إلى المزيد من المشترين بالترجمة التلقائية",
  },
  {
    icon: TrendingUp,
    titleEn: "Ad Analytics",
    titleAr: "تحليلات الإعلانات",
    descEn: "Track views and engagement for your ads",
    descAr: "تتبع المشاهدات والتفاعل لإعلاناتك",
  },
  {
    icon: Clock,
    titleEn: "Unlimited Duration",
    titleAr: "مدة غير محدودة",
    descEn: "Keep your ads active as long as you need",
    descAr: "حافظ على نشاط إعلاناتك لأطول فترة ممكنة",
  },
];

export const SubscriptionFeaturesStrip = () => {
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {subscriptionFeatures.map((f) => (
        <div
          key={f.titleEn}
          className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple/10 group-hover:bg-purple-100 dark:group-hover:bg-purple/20 transition-colors">
            <f.icon className="size-6 text-purple" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 text-center">
            {isArabic ? f.titleAr : f.titleEn}
          </span>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            {isArabic ? f.descAr : f.descEn}
          </span>
        </div>
      ))}
    </div>
  );
};
