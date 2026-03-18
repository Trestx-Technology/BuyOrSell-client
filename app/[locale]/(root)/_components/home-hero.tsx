"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ExploreDealsBanner } from "./explore-deals-banner";
import { AppStoreButtons } from "@/components/global/app-store-buttons";
import { Container1280 } from "@/components/layouts/container-1280";
import { Container1080 } from "@/components/layouts/container-1080";

const BANNERS = [
  {
    id: "figma-slide",
    type: "custom",
  },
  {
    id: "banner-1",
    type: "image",
    desktop: "/assets/banners/desktop-banner-1.png",
    mobile: "/assets/banners/mobile-banner-1.png",
  },
  {
    id: "banner-2",
    type: "image",
    desktop: "/assets/banners/desktop-banner-2.png",
    mobile: "/assets/banners/mobile-banner-2.png",
  },
  {
    id: "banner-3",
    type: "image",
    desktop: "/assets/banners/desktop-banner-3.png",
    mobile: "/assets/banners/mobile-banner-3.png",
  },
];

export function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="max-w-[1200px] w-full mx-auto flex justify-between gap-4 p-4 mb-8 mt-4">
      {/* Main Banner Carousel */}
      <div className="relative  w-full  shadow-sm rounded-3xl overflow-hidden h-[200px] sm:h-[380px] flex items-center ">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-[200px] sm:h-full flex items-center"
          >
            {BANNERS[currentSlide].type === "custom" ? (
              <div className="relative bg-pink-300/10 w-full h-full flex items-center p-4 md:p-10">
                <div className="z-10 w-full max-w-1/2 space-y-5">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#1D2939] dark:text-white leading-[1.25] tracking-tight">
                    The Smarter Way to{" "}
                    <span className="text-[#8B31E1]">Buy</span>{" "}
                    <span className="text-[#00DDAA]">or</span>{" "}
                    <span className="text-[#8B31E1]">Sell</span> in the UAE
                  </h1>
                  <p className="text-[#667085] dark:text-gray-400 text-sm md:text-base leading-relaxed font-medium max-w-[400px]">
                    Connect with trusted buyers and sellers in your local
                    community. Discover real opportunities and close deals with
                    confidence.
                  </p>
                  <AppStoreButtons />
                </div>

                {/* Decorative Floating Circles */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block select-none pointer-events-none">
                  {/* Villa - Large Top Left */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[12%] left-[10%] z-20"
                  >
                    <div className="relative w-[115px] h-[115px] rounded-full border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden">
                      <Image
                        src="/images/hero/villa.png"
                        fill
                        className="object-cover"
                        alt="Villa"
                      />
                    </div>
                  </motion.div>

                  {/* Document - Small Top Center */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[5%] left-[46%] z-30"
                  >
                    <div className="p-1 rounded-full border border-dashed border-[#1D2939]/10">
                      <div className="relative w-[65px] h-[65px] rounded-full border-[4px] border-white shadow-lg overflow-hidden flex items-center justify-center bg-[#2D2926]">
                        <Image
                          src="/images/hero/document.png"
                          fill
                          className="object-cover p-3 opacity-90"
                          alt="Document"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Car - Medium/Large Right */}
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-[15%] right-[2%] z-10"
                  >
                    <div className="p-1.5 rounded-full border border-dashed border-[#00DDAA]/20">
                      <div className="relative w-[115px] h-[115px] rounded-full border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] overflow-hidden">
                        <Image
                          src="/images/hero/car.png"
                          fill
                          className="object-cover"
                          alt="Car"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Living Room - Medium Bottom Left */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[18%] left-[10%] z-20"
                  >
                    <div className="p-1.5 rounded-full border border-dashed border-[#8B31E1]/15">
                      <div className="relative w-[115px] h-[115px] rounded-full border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden">
                        <Image
                          src="/images/hero/livingroom.png"
                          fill
                          className="object-cover"
                          alt="Living Room"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Kitchen - Small Center */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 9,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[35%] left-[42%] z-10"
                  >
                    <div className="p-1 rounded-full border border-dashed border-[#1D2939]/10">
                      <div className="relative w-[95px] h-[95px] rounded-full border-[6px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.08)] overflow-hidden">
                        <Image
                          src="/images/hero/kitchen.png"
                          fill
                          className="object-cover"
                          alt="Kitchen"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Phone - Medium/Large Bottom Right */}
                  <motion.div
                    animate={{ rotate: [0, 3, 0] }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-[8%] right-[10%] z-30"
                  >
                    <div className="p-1.5 rounded-full border border-dashed border-[#00DDAA]/20">
                      <div className="relative w-[115px] h-[115px] rounded-full border-[6px] border-white shadow-[0_20px_45px_rgba(0,0,0,0.15)] overflow-hidden bg-black">
                        <Image
                          src="/images/hero/phone.png"
                          fill
                          className="object-cover"
                          alt="Phone"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[200px] sm:h-full">
                {/* Desktop Banner */}
                <div className="hidden sm:block absolute inset-0">
                  <Image
                    src={BANNERS[currentSlide].desktop!}
                    fill
                    className="object-cover"
                    alt={`Banner ${currentSlide}`}
                    priority
                  />
                </div>
                {/* Mobile Banner */}
                <div className="sm:hidden absolute inset-0">
                  <Image
                    src={BANNERS[currentSlide].mobile!}
                    fill
                    className="object-cover"
                    alt={`Banner ${currentSlide}`}
                    priority
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="size-8 sm:size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-400 hover:text-[#8B31E1] transition-all hover:scale-110"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="size-8 sm:size-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] text-gray-400 hover:text-[#8B31E1] transition-all hover:scale-110"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-[#8B31E1] w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Banner - Dynamic Explore Deals Carousel */}
      <div className="hidden min-[900px]:block max-w-[338px] w-full min-h-[380px]">
        <ExploreDealsBanner />
      </div>
    </div>
  );
}
