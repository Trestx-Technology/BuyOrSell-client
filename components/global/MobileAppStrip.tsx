"use client";

import React, { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { Smartphone, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileAppStrip = () => {
  const { locale, localePath } = useLocale();
  const router = useRouter();
  const isArabic = locale === "ar";
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleRedirect = () => {
    router.push(localePath("/download"));
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  return (
    <div
      onClick={handleRedirect}
      className="w-full bg-purple text-white py-2 px-4 sticky top-0 z-[60] flex items-center justify-center gap-3 select-none overflow-hidden group transition-all hover:bg-purple-700 cursor-pointer"
    >
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-700">
        <div className="bg-white/20 p-1 rounded-md">
          <Smartphone className="size-3.5" />
        </div>
        <span
          className={cn(
            "text-[11px] sm:text-xs font-bold tracking-wide uppercase",
            isArabic && "font-arabic",
          )}
        >
          {isArabic
            ? "قم بتحميل تطبيقنا للهاتف المحمول"
            : "Download our mobile app"}
        </span>
        <ChevronRight
          className={cn(
            "size-3.5 opacity-50 group-hover:translate-x-1 transition-transform",
            isArabic && "rotate-180 group-hover:-translate-x-1",
          )}
        />
      </div>

      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-20"
        aria-label="Close"
      >
        <X className="size-4" />
      </button>

      {/* Subtle shine effect */}
      <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
    </div>
  );
};
