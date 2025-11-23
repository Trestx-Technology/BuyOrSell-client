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
import { useGetMainCategories } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";

interface CategoryCard {
  id: number;
  name: string;
  icon: string;
  description: string;
  activeAds: string;
  href: string;
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


const PopularCategories = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Mobile breakpoint at 500px
  const isMobile = useMediaQuery("(max-width: 500px)");

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Transform API data to match CategoryCard interface
  const categoryData: CategoryCard[] = categoriesData?.map((category: SubCategory, index: number) => {
    // Generate random active ads count for demo purposes
    const getRandomActiveAds = () => {
      const min = 5000;
      const max = 30000;
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNum.toLocaleString() + " Active Ads";
    };

    // Generate href based on category name
    const generateHref = () => {
      // Convert category name to URL-friendly format
      const urlName = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `/categories/${urlName}`;
    };

    // Get description or use default
    const getDescription = (name: string) => {
      const descriptions: Record<string, string> = {
        motors: "Cars, Rental Cars, New Cars, Export Cars",
        property: "Residential, Commercial, New Projects",
        electronics: "Mobile Phone & Tablet Accessories",
        furniture: "Furniture, Home Accessories, Garden",
        jobs: "Accounting, Finance, Engineering, Sales",
        community: "Freelancers, Home Maintenance",
        business: "Businesses for Sale, Construction",
        appliances: "Large Appliances, Kitchen Appliances",
        classifieds: "Electronics, Computer & Networking",
      };

      const normalizedName = name.toLowerCase();
      for (const [key, desc] of Object.entries(descriptions)) {
        if (normalizedName.includes(key)) {
          return desc;
        }
      }

      return `${name} category`;
    };

    // Get icon with fallback
    const getIcon = (name: string, existingIcon?: string) => {
      if (existingIcon) return existingIcon;

      const iconMap: Record<string, string> = {
        motors: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/motors.svg",
        property: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/sale.svg",
        electronics: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/electronics.svg",
        furniture: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/furniture.svg",
        jobs: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/jobs.svg",
        community: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/community.svg",
        business: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/business.svg",
        appliances: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/appliances.svg",
        classifieds: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/classifieds.svg",
      };

      const normalizedName = name.toLowerCase();
      for (const [key, icon] of Object.entries(iconMap)) {
        if (normalizedName.includes(key)) {
          return icon;
        }
      }

      // Default fallback icon
      return "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/classifieds.svg";
    };

    return {
      id: index + 1,
      name: category.name,
      icon: getIcon(category.name, category.icon),
      description: getDescription(category.name),
      activeAds: getRandomActiveAds(),
      href: generateHref(),
    };
  }) || [];

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
      viewport={{ once: true, margin: "-100px" }}
      className="w-full max-w-[1180px] mx-auto px-4 xl:px-0 mt-16 sm:mt-0 sm:pt-11"
    >
      {/* Section Title */}
      <motion.h2
        variants={itemVariants}
        className="text-[18px] font-medium text-[#1D2939] mb-3 font-poppins"
      >
        Popular Categories
      </motion.h2>

      {/* Categories Grid */}
      <div
        className={cn(
          "grid grid-cols-3 md:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4",
          showAllCategories && "overflow-y-auto"
        )}
      >
        {categoriesLoading
          ? // Show skeleton loading state
            Array.from({ length: 10 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          : categoriesError
          ? // Show error state
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Failed to load categories</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-purple-600 hover:text-purple-700 text-sm underline"
                >
                  Try again
                </button>
              </div>
            </div>
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
                whileHover={{
                  scale: 1.05,
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="transform-gpu transition-all duration-300 ease-out"
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
                  <div className="px-5 py-3 h-[160px]">
                    {/* Icon and Name Section */}
                    <div className="flex flex-col items-center text-center mb-5">
                      <div className="size-[60px] bg-[#FAFAFC] rounded-full flex items-center justify-center mb-1">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="size-12 object-contain"
                          priority={index < 5}
                          loading={index < 5 ? "eager" : "lazy"}
                          // style={{ imageRendering: "crisp-edges" }}
                        />
                      </div>
                      <h3 className="text-xs font-medium text-black font-inter leading-tight">
                        {category.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#667085] text-center font-inter leading-tight line-clamp-2 md:block hidden">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom Section with Active Ads and Arrow */}
                  <Typography
                    variant="xs-black-inter"
                    className="hidden items-center text-xs justify-center gap-1 text-purple text-center hover:underline px-2.5 w-full border-t group-hover:border-purple/20 h-[56px] font-medium md:flex"
                  >
                    {category.activeAds}
                    <ArrowRight className="w-4 h-4" />
                  </Typography>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Toggle Button - Only show on mobile or when there are more categories to show */}
      {(isMobile || categoryData.length > 9) && (
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
            {showAllCategories ? "Show Less" : "View All"}
          </Button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default PopularCategories;
