"use client";

import React, { ReactNode, useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { CategoryWithSubCategories } from "@/interfaces/home.types";
import ListingCard from "@/components/global/listing-card";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AD } from "@/interfaces/ad";

interface CategoryTabbedCarouselProps<
  T extends { id?: string | number } = { id?: string | number },
> {
  categoryData: CategoryWithSubCategories;
  title?: string; // Optional, defaults to "Trending {category}"
  viewAllText?: string;
  onViewAll?: () => void;
  onTabChange?: (id: string) => void;
  className?: string;
  showViewAll?: boolean;
  showNavigation?: boolean;
  isLoading?: boolean;
  // Optional: provide data and renderCard for each subcategory
  getTabData?: (subCategoryId: string) => T[];
  renderCard?: (item: T, index: number) => ReactNode;
}

export default function CategoryTabbedCarousel<
  T extends { id?: string | number } = { id?: string | number },
>({
  categoryData,
  title,
  className = "",
  showViewAll = true,
  showNavigation = true,
  isLoading,
  viewAllText = "View all",
  onViewAll,
  onTabChange,
}: CategoryTabbedCarouselProps<T>) {
  const displayTitle = title || `Trending ${categoryData.category}`;
  const subCategories = useMemo(() => categoryData.subCategory || [], [categoryData.subCategory]);
  
  const firstTabValue = categoryData.subCategory[0]?._id;
  const [activeTab, setActiveTab] = useState(firstTabValue);

  // Get ads directly from the selected subcategory
  const currentAds = useMemo(() => {
    const activeSubCategory = subCategories.find(sub => sub._id === activeTab);
    return activeSubCategory?.ads || [];
  }, [subCategories, activeTab]);

  // Don't render if subCategory is empty
  if (subCategories.length === 0) {
    return null;
  }

  // Framer Motion animation variants - sequential reveal pattern
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 22, delay: 0.2 } },
  };

  const tabsVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 22, delay: 0.5 } },
  };

  const cardsVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 22, delay: 0.8 } },
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Loading skeleton components
  const TitleSkeleton = () => (
    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
  );

  const TabsSkeleton = () => (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
      {showViewAll && <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>}
    </div>
  );

  const CardsSkeleton = () => (
    <div className="relative">
      <CardsCarousel title="" showNavigation={showNavigation}>
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-[0_0_auto] max-w-[190px] w-full bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </CardsCarousel>
    </div>
  );

  // Content render functions
  const renderTitle = () => (
    <motion.div
      variants={titleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center justify-between mb-2"
    >
      <Typography
        variant="lg-black-inter"
        className="text-md sm:text-lg font-medium text-dark-blue"
      >
        {displayTitle}
      </Typography>
    </motion.div>
  );

  const renderTabs = () => (
    <motion.div
      variants={tabsVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mb-4 flex items-center justify-between"
    >
      <div className="flex flex-1 items-center gap-3 overflow-x-auto scrollbar-hide">
        {subCategories.map((subCategory, index) => (
          <motion.button
            key={subCategory._id}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 22, delay: 0.6 + index * 0.08 }}
            onClick={() => handleTabChange(subCategory._id)}
            className={`px-4 py-2 h-8 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ${
              activeTab === subCategory._id
                ? "bg-purple text-white border-purple shadow-sm"
                : "bg-white border-[#F5EBFF] text-[#475467] hover:bg-purple/10"
            }`}
          >
            {subCategory.name}
          </motion.button>
        ))}
      </div>
      {showViewAll && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 22, delay: 0.7 }}
        >
          <Button
            variant="filled"
            onClick={onViewAll}
            className="md:block hidden transition-colors px-5 py-2 h-8 text-xs font-medium"
          >
            {viewAllText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCards = () => {
    if (isLoading) {
      return <CardsSkeleton />;
    }

    if (currentAds.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No ads available for this category.
        </div>
      );
    }

    return (
      <motion.div
        variants={cardsVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
            <CardsCarousel title="" showNavigation={showNavigation}>
              {currentAds
                .filter((item): item is AD => item != null)
                .map((item, index) => {
                  const listingCardProps = transformAdToListingCard(item);
                  return (
                    <motion.div
                      key={item._id || index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ type: "spring" as const, stiffness: 280, damping: 20, delay: 0.9 + index * 0.1 }}
                      className="flex-[0_0_auto] max-w-[190px] w-full"
                    >
                      <ListingCard showSeller={false} {...listingCardProps} />
                    </motion.div>
                  );
                })}
            </CardsCarousel>
      </motion.div>
    );
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`max-w-[1220px] bg-white mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto px-4 xl:px-5">
        {/* Header with Title */}
        {isLoading ? <TitleSkeleton /> : renderTitle()}

        {/* Custom Tab Buttons */}
        {isLoading ? <TabsSkeleton /> : renderTabs()}

        {/* Cards Carousel */}
        {renderCards()}
      </div>
    </motion.section>
  );
}

