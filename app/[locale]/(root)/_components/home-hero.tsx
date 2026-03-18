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
  // {
  //   id: "figma-slide",
  //   type: "custom",
  // },
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
