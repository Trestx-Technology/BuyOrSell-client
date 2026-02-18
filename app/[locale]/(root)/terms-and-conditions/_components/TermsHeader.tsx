import React from "react";
import { Typography } from "@/components/typography";

export const TermsHeader = () => (
  <div className="relative bg-purple p-10 md:p-16 text-white text-center rounded-t-[2.5rem] overflow-hidden">
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-400 rounded-full blur-[80px]"></div>
    </div>

    <div className="relative z-10">
      <Typography variant="h1" className="mb-4 text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-lg">
        Terms <span className="opacity-50">&</span> Conditions <span className="text-purple-100">of Use</span>
      </Typography>
      <Typography variant="body" className="opacity-80 text-sm md:text-base font-medium max-w-xl mx-auto text-white">
        Your roadmap to a safe and transparent marketplace experience on BuyOrSell.
      </Typography>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] md:text-xs backdrop-blur-xl font-inter border border-white/20 shadow-lg">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          <span className="opacity-60 font-bold uppercase tracking-widest">Updated:</span>
          <span className="font-semibold">Feb 2025</span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-[10px] md:text-xs backdrop-blur-xl font-inter border border-white/20 shadow-lg">
          <span className="opacity-60 font-bold uppercase tracking-widest">Region:</span>
          <span className="font-semibold">UAE</span>
        </div>
      </div>
    </div>
  </div>
);
