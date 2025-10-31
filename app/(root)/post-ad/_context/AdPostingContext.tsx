"use client";

import Image from "next/image";
import React, { ReactNode } from "react";
import ProgressBar from "../_components/ProgressBar";
import { House } from "lucide-react";
import { useAdPostingStore } from "@/stores/adPostingStore";

// Re-export types from the store
export type { AdFormData, CategoryNameItem } from "@/stores/adPostingStore";

// Context type (now just re-exports from store)
export type AdPostingContextType = ReturnType<typeof useAdPostingStore>;

// ============================================================================
// HOOK (now uses Zustand store)
// ============================================================================
export const useAdPosting = () => {
  return useAdPostingStore();
};

// ============================================================================
// PROVIDER COMPONENT (now just provides UI layout)
// ============================================================================
interface AdPostingProviderProps {
  children: ReactNode;
}

export const AdPostingProvider: React.FC<AdPostingProviderProps> = ({
  children,
}) => {
  return (
    <main className="h-dvh bg-[#F7F8FA] w-full border">
      <section className=" flex h-full overflow-y-auto flex-col max-w-[1080px] mx-auto bg-white px-6">
        <div className="pt-6">
          <Image
            src="/images/category-icons/logo.png"
            alt="BuyOrSell Logo"
            width={155}
            height={49}
            className="mb-8"
          />
        </div>
        <div className="w-full max-w-[888px] mb-4 mx-auto">
          <ProgressBar currentStep={1} totalSteps={4} />
          {/* Title Section */}
          <div className="mt-6">
            <h1 className="text-xl font-semibold text-[#1D2939] mb-2">
              Place Ad Manually
            </h1>
            <p className="text-xs text-[#8A8A8A] mb-4">Choose ad category</p>

            {/* Divider Line */}
            <div className="w-full h-px bg-[#F0F0F1] mb-6"></div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1">
            <House className="w-4 h-4 text-purple" />
            <span className="text-xs font-bold text-purple">Home</span>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
};
