"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { Heart, MapPin, Zap, Fuel, Gauge, Calendar } from "lucide-react";
import { sampleListings as recentViewsData } from "@/constants/sample-listings";
import { formatRelativeTime } from "@/lib/utils";
import AED from "@/public/icons/AED.svg";
import { Typography } from "@/components/typography";

const RecentViews = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);

  // Use callback ref to ensure proper timing
  const setRef = React.useCallback((node: HTMLElement | null) => {
    if (node) {
      console.log("Element attached, setting up observer");

      const observer = new IntersectionObserver(
        ([entry]) => {
          console.log("IntersectionObserver triggered:", entry.isIntersecting);
          if (entry.isIntersecting) {
            setShouldAnimate(true);
          } else {
            setShouldAnimate(false);
          }
        },
        {
          threshold: 0.01, // Trigger when just 1% is visible
          rootMargin: "0px", // No margin buffer
        }
      );

      observer.observe(node);

      // Store observer for cleanup
      (node as HTMLElement & { _observer?: IntersectionObserver })._observer =
        observer;
    }
  }, []);

  // Simulate API call loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="w-full max-w-[1180px] mx-auto py-12">
      {/* Title skeleton */}
      <div className="h-[22px] w-[144px] bg-gray-200 rounded mb-8" />

      {/* Cards skeleton */}
      <div className="flex gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-[170px] h-[291px] bg-gray-200 rounded-lg animate-pulse"
          >
            <div className="w-full h-[118px] bg-gray-300 rounded-t-lg"></div>
            <div className="p-2.5 space-y-2">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
              <div className="space-y-1">
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <section
      ref={setRef}
      className="w-full px-4 xl:px-0 max-w-[1170px] mx-auto py-12"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
      >
        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="text-lg font-medium text-grey-blue mb-4"
        >
          Recently Viewed
        </motion.h2>

        {/* Cards Grid */}
        <div className="flex gap-3">
          {recentViewsData.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="w-full min-w-[170px] bg-white border border-purple/20 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {/* Image */}
              <div className="relative w-full h-[118px] bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {/* Heart icon */}
                <div className="absolute top-2.5 right-2.5 size-5 rounded-full flex items-center justify-center">
                  <Heart className=" fill-white stroke-0" />
                </div>
              </div>

              {/* Content */}
              <div className="py-2.5 space-y-2">
                {/* Price Section */}
                <div className="flex items-center gap-1 px-2.5">
                  <Image src={AED} alt="star" width={16} height={16} />
                  <Typography
                    variant="xs-black-inter"
                    className="text-purple font-bold"
                  >
                    {item.currentPrice}
                  </Typography>
                  <Typography
                    variant="xs-black-inter"
                    className="text-grey-blue line-through text-sm"
                  >
                    {item.originalPrice}
                  </Typography>
                  <Typography
                    variant="xs-black-inter"
                    className="text-sm font-semibold text-teal"
                  >
                    {item.discount}
                  </Typography>
                </div>

                {/* Title */}
                <h3 className="text-xs font-semibold text-dark-blue leading-tight px-2.5">
                  {item.title}
                </h3>

                {/* Specs row 1 */}
                <div className="flex items-center gap-2 px-2.5">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-grey-500" />
                    <span className="text-xs text-grey-500">
                      {item.transmission}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-grey-500" />
                    <span className="text-xs text-grey-500">
                      {item.fuelType}
                    </span>
                  </div>
                </div>

                {/* Specs row 2 */}
                <div className="space-y-1 px-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-grey-500" />
                      <span className="text-xs text-grey-500">
                        {item.mileage}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-grey-500" />
                      <span className="text-xs text-grey-500">{item.year}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 px-2.5">
                  <MapPin className="w-3 h-3 text-grey-500" />
                  <span className="text-xs text-grey-500 truncate">
                    {item.location}
                  </span>
                </div>

                <Typography
                  variant="xs-black-inter"
                  className="text-grey-blue text-xs font-regular px-2.5 border-t border-grey-blue/20 pt-3"
                >
                  {formatRelativeTime(item.timeAgo)}
                </Typography>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RecentViews;
