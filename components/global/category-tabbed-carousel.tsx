"use client";

import React, { ReactNode, useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { CategoryWithSubCategories } from "@/interfaces/home.types";
import ListingCard from "@/components/features/listing-card/listing-card";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AD } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";
import { CarouselWrapper } from "@/components/global/carousel-wrapper";
import { ListingCardSkeleton } from "@/components/global/listing-card-skeleton";

interface CategoryTabbedCarouselProps<
  T extends { id?: string | number } = { id?: string | number },
> {
  categoryData: CategoryWithSubCategories;
  title?: string; // Optional, defaults to "Trending {category}"
  viewAllText?: string;
  onViewAll?: (categoryName: string) => void;
  onTabChange?: (id: string) => void;
  className?: string;
  showViewAll?: boolean;
  showNavigation?: boolean;
  isLoading?: boolean;
  // Optional: provide data and renderCard for each subcategory
  getTabData?: (subCategoryId: string) => T[];
  renderCard?: (item: T, index: number) => ReactNode;
}

export const CategoryTabbedCarouselSkeleton = ({
  showNavigation = true,
  showViewAll = true,
}: {
  showNavigation?: boolean;
  showViewAll?: boolean;
}) => (
  <section className="max-w-[1220px] mx-auto py-5">
    <div className="w-full mx-auto">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2 ml-5"></div>
      <div className="mb-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        {showViewAll && (
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        )}
      </div>
      <div className="relative">
        <CardsCarousel title="" showNavigation={showNavigation}>
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton
                key={i}
                showImageCounter={true}
                showExtraFields={true}
                showSeller={false}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </CardsCarousel>
      </div>
    </div>
  </section>
);

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
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  // Use Arabic category name if available
  const categoryName = isArabic
    ? categoryData.categoryAr || categoryData.category
    : categoryData.category;
  const displayTitle = title || `Trending ${categoryName}`;

  const subCategories = useMemo(
    () => categoryData.subCategory || [],
    [categoryData.subCategory],
  );

  const firstTabValue = categoryData.subCategory[0]?._id;
  const [activeTab, setActiveTab] = useState(firstTabValue);

  // Get ads directly from the selected subcategory
  const currentAds = useMemo(() => {
    const activeSubCategory = subCategories.find(
      (sub) => sub._id === activeTab,
    );
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
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 22,
        delay: 0.2,
      },
    },
  } as const;

  const tabsVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 22,
        delay: 0.5,
      },
    },
  } as const;

  const cardsVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 22,
        delay: 0.8,
      },
    },
  } as const;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Content render functions
  const renderTitle = () => (
    <motion.div
      variants={titleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center justify-between mb-2 pl-5"
    >
      <Typography
        variant="lg-black-inter"
        className="text-md sm:text-lg font-medium text-dark-blue dark:text-gray-100"
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
      <CarouselWrapper
        className="flex-1"
        containerClassName="px-5 items-center"
        shadowColorClassName="from-[#F9FAFB] dark:from-gray-900"
      >
        {subCategories.map((subCategory, index) => {
          const subCategoryName = isArabic
            ? subCategory.nameAr || subCategory.name
            : subCategory.name;
          return (
            <motion.button
              key={subCategory._id}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 22,
                delay: 0.6 + index * 0.08,
              }}
              onClick={() => handleTabChange(subCategory._id)}
              className={`px-4 py-2 h-8 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ${
                activeTab === subCategory._id
                  ? "bg-purple text-white border-purple shadow-sm"
                  : "bg-white dark:bg-gray-800 border-[#F5EBFF] dark:border-gray-700 text-[#475467] dark:text-gray-300 hover:bg-purple/10 dark:hover:bg-gray-700"
              }`}
            >
              {subCategoryName}
            </motion.button>
          );
        })}
      </CarouselWrapper>
      {showViewAll && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring" as const,
            stiffness: 300,
            damping: 22,
            delay: 0.7,
          }}
        >
          <Button
            variant="filled"
            onClick={() =>
              onViewAll?.(
                subCategories?.find((sub) => sub._id === activeTab)?.name ||
                  categoryName,
              )
            }
            className="md:block hidden transition-colors px-5 py-2 h-8 text-xs font-medium"
          >
            {viewAllText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderCards = () => {
    if (currentAds.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
              const listingCardProps = transformAdToListingCard(item, locale);
              return (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 280,
                    damping: 20,
                    delay: 0.9 + index * 0.1,
                  }}
                  className="flex gap-4"
                >
                  <ListingCard {...listingCardProps} />
                </motion.div>
              );
            })}
        </CardsCarousel>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <CategoryTabbedCarouselSkeleton
        showNavigation={showNavigation}
        showViewAll={showViewAll}
      />
    );
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`max-w-[1220px]  mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto">
        {/* Header with Title */}
        {renderTitle()}

        {/* Custom Tab Buttons */}
        {renderTabs()}

        {/* Cards Carousel */}
        {renderCards()}
      </div>
    </motion.section>
  );
}
