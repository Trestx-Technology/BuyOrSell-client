"use client";

import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ExploreDealsBanner } from "./explore-deals-banner";
import { AppStoreButtons } from "@/components/global/app-store-buttons";
import { Container1080 } from "@/components/layouts/container-1080";
import { Container1280 } from "@/components/layouts/container-1280";

export function HomeHero() {
  // We'll prioritize the Figma design for the first slide
  // If there are other banners, we can still show them in a carousel if needed,
  // but for now let's implement the core Figma layout.

  return (
    <Container1280 className="w-full mx-auto flex justify-between gap-4 p-4 md:p-0 mb-8 mt-4">
      {/* Left Banner - The Smarter Way */}
      <div className="relative bg-[#F3E8FF]/40 w-full dark:bg-gray-900 rounded-3xl overflow-hidden md:min-h-[380px] flex items-center p-4 md:p-10">
        <div className="z-10 w-full space-y-5">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1D2939] dark:text-white leading-[1.15]  tracking-tight">
            The Smarter Way to <span className="text-[#8B31E1]">Buy</span>{" "}
            <span className="text-[#00DDAA]">or</span>{" "}
            <span className="text-[#8B31E1]">Sell</span> in the UAE
          </h1>
          <p className="text-[#667085] dark:text-gray-400 text-sm md:text-base  leading-relaxed font-medium max-w-[400px]">
            Connect with trusted buyers and sellers in your local community.
            Discover real opportunities and close deals with confidence.
          </p>

          <AppStoreButtons />
        </div>

        {/* Decorative Floating Circles */}
        <div className="absolute right-[-10px] top-0 bottom-0 w-[50%] hidden md:block select-none overflow-hidden pointer-events-none">
          {/* Villa - Large Top Left */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] left-[8%] w-[100px] h-[100px] rounded-full border-[3px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden z-20"
          >
            <Image
              src="/images/hero/villa.png"
              fill
              className="object-cover"
              alt="Villa"
            />
          </motion.div>

          {/* Document - Tiny Top Center */}
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[48%] w-[42px] h-[42px] rounded-full border-[2px] border-white shadow-md overflow-hidden z-30 flex items-center justify-center bg-[#2D2D2D]"
          >
            <Image
              src="/images/hero/document.png"
              fill
              className="object-cover opacity-80"
              alt="Document"
            />
          </motion.div>

          {/* Car - Medium Right */}
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[32%] right-[14%] w-[90px] h-[90px] rounded-full border-[3px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden z-10"
          >
            <Image
              src="/images/hero/car.png"
              fill
              className="object-cover"
              alt="Car"
            />
          </motion.div>

          {/* Kitchen - Small Center */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[52%] left-[48%] w-[68px] h-[68px] rounded-full border-[2px] border-white shadow-lg overflow-hidden z-20"
          >
            <Image
              src="/images/hero/kitchen.png"
              fill
              className="object-cover"
              alt="Kitchen"
            />
          </motion.div>

          {/* Living Room - Medium Bottom Left */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[28%] left-[22%] w-[85px] h-[85px] rounded-full border-[3px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden z-20"
          >
            <Image
              src="/images/hero/livingroom.png"
              fill
              className="object-cover"
              alt="Living Room"
            />
          </motion.div>

          {/* Phone - Medium Bottom Right */}
          <motion.div
            animate={{ rotate: [0, 2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[15%] right-[20%] w-[95px] h-[95px] rounded-full border-[3px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden z-20 bg-black"
          >
            <Image
              src="/images/hero/phone.png"
              fill
              className="object-cover"
              alt="Phone"
            />
          </motion.div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-400 hover:text-[#8B31E1] transition-all hover:scale-110">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:block">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-400 hover:text-[#8B31E1] transition-all hover:scale-110">
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Right Banner - Dynamic Explore Deals Carousel */}
      <div className="hidden min-[900px]:block max-w-[338px] w-full h-full">
        <ExploreDealsBanner />
      </div>
    </Container1280>
  );
}
