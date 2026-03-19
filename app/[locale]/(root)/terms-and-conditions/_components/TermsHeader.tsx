import React from "react";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";

export const TermsHeader = () => {
  const { t } = useLocale();

  return (
    <div className="relative bg-purple p-10 md:p-16 text-white text-center rounded-t-[2.5rem] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-400 rounded-full blur-[80px]"></div>  
      </div>

      <div className="relative z-10">
        <Typography variant="h1" className="mb-4 text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
          {t.termsAndConditions.title}
        </Typography>
        <Typography variant="body" className="opacity-80 text-sm md:text-base font-medium max-w-xl mx-auto text-white">
          {t.termsAndConditions.subtitle}
        </Typography>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] md:text-xs backdrop-blur-xl font-inter border border-white/20 shadow-lg">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="font-semibold">{t.termsAndConditions.lastUpdated}</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] md:text-xs backdrop-blur-xl font-inter border border-white/20 shadow-lg">
            <span className="font-semibold">{t.termsAndConditions.region}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
