"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ICONS } from "@/constants/icons";

export default function ComingSoonPage() {
  return (
        <div
              className="relative min-h-screen w-full flex flex-col font-sans bg-cover bg-center bg-no-repeat overflow-hidden bg-gray-50"
              style={{ backgroundImage: `url('/assets/coming-soon.svg')` }}
        >
              {/* Left Gradient Glow */}
              <div
                    className="absolute pointer-events-none"
                    style={{
                          width: "668px",
                          height: "860px",
                          left: "-107px",
                          top: "7px",
                          background: "rgba(139, 49, 225, 0.1)",
                          opacity: 0.99,
                          filter: "blur(120px)",
                          borderRadius: "16777200px"
                    }}
              />
              {/* Right Gradient Glow */}
              <div
                    className="absolute pointer-events-none"
                    style={{
                          width: "1054px",
                          height: "1028px",
                          left: "471px",
                          top: "-186px",
                          background: "rgba(55, 233, 185, 0.1)",
                          filter: "blur(100px)",
                          borderRadius: "16777200px"
                    }}
              />
              {/* Top Bar with Logo */}
              <div className="absolute top-0 left-0 w-full p-6 md:p-10 flex items-center justify-between z-20">
                    <Link href="/">
                          <Image
                                src={ICONS.logo.main}
                                alt="BuyOrSell Logo"
                                width={180}
                                height={60}
                                className="w-[140px] md:w-[180px] object-contain"
                          />
                    </Link>
              </div>

              {/* Main Content Centered */}
              <main className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-8 max-w-4xl mx-auto z-10 w-full mt-10 md:mt-0">
                    {/* Badge */}
                    <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/40 border border-white/60 backdrop-blur-md shadow-sm">
                          <Sparkles className="w-4 h-4 text-purple mr-2" />
                          <span className="text-purple text-xs md:text-sm font-bold tracking-widest uppercase">
                                BUY. SELL. BETTER. — UAE MARKETPLACE REIMAGINED
                          </span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-[3rem] leading-[1.1] md:text-6xl font-bold tracking-tight text-purple">
                          A Smarter Way to Buy Or Sell
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-3xl mx-auto text-black text-lg font-medium leading-relaxed opacity-90">
                          Join the most anticipated marketplace in the Emirates. Connect, trade, and grow within your local community.
                    </p>

                    {/* Launching Soon */}
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-purple">
                          Launching Soon...
                    </h2>
              </main>
    </div>
  );
}
