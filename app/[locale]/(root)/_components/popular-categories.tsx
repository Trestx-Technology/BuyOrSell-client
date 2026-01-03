"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PopularCategory } from "@/interfaces/home.types";
import { useLocale } from "@/hooks/useLocale";

interface CategoryCard {
  id: number;
  name: string;
  icon: string | null;
  description: string;
  activeAds: string;
  href: string;
}

interface PopularCategoriesProps {
  popularCategories?: PopularCategory[];
  isLoading?: boolean;
}

// Framer Motion animation variants - using improved patterns from AI search bar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

// Skeleton component for loading state
const CategorySkeleton = () => (
  <div className="bg-white w-full border border-[#F5EBFF] rounded-lg overflow-hidden">
    <div className="px-5 py-3">
      {/* Icon and Name Section */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-[50px] h-[50px] bg-gray-200 rounded-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    </div>

    {/* Bottom Section */}
    <div className="h-[56px] bg-gray-200 border-t"></div>
  </div>
);

const PopularCategories = ({
  popularCategories = [],
  isLoading = false,
}: PopularCategoriesProps) => {
  const { t, locale } = useLocale();
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Mobile breakpoint at 500px
  const isMobile = useMediaQuery("(max-width: 500px)");

  // Transform API data to match CategoryCard interface
  const categoryData: CategoryCard[] =
    popularCategories?.map(
      (popularCategory: PopularCategory, index: number) => {
        const { category, activeAdsCount } = popularCategory;

        // Use Arabic values if locale is Arabic, otherwise use default
        const isArabic = locale === "ar";
        const name = isArabic
          ? category.nameAr || category.name
          : category.name;
        const description = isArabic
          ? category.descAr || category.desc || `${name} category`
          : category.desc || `${category.name} category`;

        return {
          id: index + 1,
          name,
          icon: category.icon,
          description,
          activeAds: `${activeAdsCount.toLocaleString()} ${
            t.home.popularCategories.activeAds
          }`,
          href: `/categories/${category.name}`,
        };
      }
    ) || [];

  // Get categories to display based on mobile state and toggle
  const getDisplayCategories = () => {
    if (!isMobile || showAllCategories) {
      return categoryData;
    }
    return categoryData.slice(0, 9);
  };

  // Handle toggle button click
  const handleToggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const displayCategories = getDisplayCategories();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="w-full max-w-[1180px] px-4 xl:px-0 mx-auto mt-8 sm:mt-5"
    >
      {/* Section Title */}
      <motion.h2
        variants={itemVariants}
        className="text-[18px] font-medium text-[#1D2939] mb-3 font-poppins"
      >
        {t.home.popularCategories.title}
      </motion.h2>

      {/* Categories Grid */}
      <div
        className={cn(
          "grid grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-2",
          showAllCategories && "overflow-y-auto"
        )}
      >
        {isLoading || !popularCategories || popularCategories.length === 0
          ? // Show skeleton loading state
            Array.from({ length: 10 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          : // Show actual data with Framer Motion animations
            displayCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 22,
                  delay: 0.3 + index * 0.06, // Staggered delay for each category
                }}
                className="transition-all duration-300 ease-out"
                style={{
                  willChange: "transform, opacity",
                  contain: "layout style paint",
                }}
              >
                <Link
                  href={category.href}
                  className="bg-white w-full md:border border-[#F5EBFF] rounded-md shadow-purple/20 hover:shadow-purple/30 block relative hover:bg-purple/10 transition-all duration-300 group"
                >
                  {/* Category Content */}
                  <div className="px-2 py-1 min-h-[130px]">
                    {/* Icon and Name Section */}
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="size-[60px] bg-[#FAFAFC] rounded-full flex items-center justify-center mb-1">
                        {category.icon ? (
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={40}
                            height={40}
                            unoptimized
                            className="size-12 object-contain"
                            priority={index < 5}
                            loading={index < 5 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="size-12 bg-gray-200 rounded-full" />
                        )}
                      </div>
                      <h3 className="text-xs font-medium text-black font-inter leading-tight">
                        {category.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#667085] text-center font-inter leading-tight line-clamp-2 md:block hidden truncate">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom Section with Active Ads and Arrow */}
                  <div className="flex items-center justify-center">
                    <Typography
                      variant="xs-black-inter"
                      className="hidden items-center text-xs justify-center gap-1 text-purple text-center hover:underline p-2.5 w-full border-t group-hover:border-purple/20 font-medium md:flex"
                    >
                      {category.activeAds}
                      <ArrowRight className="w-4 h-4" />
                    </Typography>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Toggle Button - Only show on mobile or when there are more categories to show */}
      {/* {(isMobile || categoryData.length > 9) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring" as const,
            stiffness: 300,
            damping: 22,
            delay: 0.8, // Delay after categories animate
          }}
        >
          <Button
            icon={
              showAllCategories ? (
                <ChevronDown className="w-4 h-4 rotate-180" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            }
            iconPosition="right"
            size={"lg"}
            variant="filled"
            className="flex sm:hidden w-full text-sm mt-2"
            onClick={handleToggleCategories}
          >
            {showAllCategories
              ? t.home.popularCategories.showLess
              : t.home.popularCategories.viewAll}
          </Button>
        </motion.div>
      )} */}
    </motion.section>
  );
};

export default PopularCategories;
