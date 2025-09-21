"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const categoryData: CategoryCard[] = [
  {
    id: 1,
    name: "Motors",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/motors.svg",
    description: "Cars, Rental Cars, New Cars, Export Cars",
    activeAds: "15,241 Active Ads",
    href: "/categories/motors",
  },
  {
    id: 2,
    name: "Property for Rent",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/rent.svg",
    description: "Residential, Commercial, Rooms For Rent",
    activeAds: "10,025 Active Ads",
    href: "/categories/property-rent",
  },
  {
    id: 3,
    name: "Property for Sale",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/sale.svg",
    description: "Residential, Commercial, New Projects, Off-Plan",
    activeAds: "13,241 Active Ads",
    href: "/categories/property-sale",
  },
  {
    id: 4,
    name: "Electronics",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/electronics.svg",
    description: "Mobile Phone & Tablet Accessories",
    activeAds: "20,111 Active Ads",
    href: "/categories/electronics",
  },
  {
    id: 5,
    name: "Community",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/community.svg",
    description: "Freelancers, Home Maintenance",
    activeAds: "5,026 Active Ads",
    href: "/categories/community",
  },
  {
    id: 6,
    name: "Business & Industrial",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/business.svg",
    description: "Businesses for Sale, Construction",
    activeAds: "16,056 Active Ads",
    href: "/categories/business",
  },
  {
    id: 7,
    name: "Home Appliances",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/appliances.svg",
    description: "Large Appliances, Kitchen Appliances",
    activeAds: "11,998 Active Ads",
    href: "/categories/appliances",
  },
  {
    id: 8,
    name: "Furniture",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/furniture.svg",
    description: "Furniture, Home Accessories, Garden",
    activeAds: "7,892 Active Ads",
    href: "/categories/furniture",
  },
  {
    id: 9,
    name: "Classifieds",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/classifieds.svg",
    description: "Electronics, Computer & Networking",
    activeAds: "6,480 Active Ads",
    href: "/categories/classifieds",
  },
  {
    id: 10,
    name: "Jobs",
    icon: "https://dev-buyorsell.s3.me-central-1.amazonaws.com/category-icons/jobs.svg",
    description: "Accounting, Finance, Engineering, Sales",
    activeAds: "26,416 Active Ads",
    href: "/categories/jobs",
  },
];

const PopularCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CategoryCard[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Mobile breakpoint at 500px
  const isMobile = useMediaQuery("(max-width: 500px)");

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate API response
      setData(categoryData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Get categories to display based on mobile state and toggle
  const getDisplayCategories = () => {
    if (!isMobile || showAllCategories) {
      return data;
    }
    return data.slice(0, 9);
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
        {isLoading
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
                  <div className="px-5 py-3">
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
      {(isMobile || data.length > 9) && (
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
