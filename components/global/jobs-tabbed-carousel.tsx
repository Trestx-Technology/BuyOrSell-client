"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { CategoryWithSubCategories } from "@/interfaces/home.types";
import JobCard from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import { AD } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";
import { formatDistanceToNow } from "date-fns";
import { CarouselWrapper } from "@/components/global/carousel-wrapper";
import { ListingCardSkeleton } from "@/components/global/listing-card-skeleton";
import {
  containerVariants,
  itemVariants,
  tabsVariants,
} from "@/utils/animation-variants";

interface JobsTabbedCarouselProps {
  categoryData: CategoryWithSubCategories;
  title?: string;
  viewAllText?: string;
  onViewAll?: (categoryName: string) => void;
  onTabChange?: (id: string) => void;
  className?: string;
  showViewAll?: boolean;
  showNavigation?: boolean;
  isLoading?: boolean;
  titleClassName?: string;
}

export const JobsTabbedCarouselSkeleton = ({
  showNavigation = true,
  showViewAll = true,
}: {
  showNavigation?: boolean;
  showViewAll?: boolean;
}) => (
  <section className="max-w-[1220px] mx-auto py-5">
    <div className="w-full mx-auto">
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2 pl-5"></div>
      <div className="mb-4 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
        {showViewAll && (
          <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        )}
      </div>
      <div className="relative">
        <CardsCarousel title="" showNavigation={showNavigation}>
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton
                key={i}
                showImageCounter={false}
                showExtraFields={true}
                showSeller={true}
                maxWidth="max-w-[250px]"
                className="flex-shrink-0"
              />
            ))}
          </div>
        </CardsCarousel>
      </div>
    </div>
  </section>
);

export default function JobsTabbedCarousel({
  categoryData,
  title,
  className = "",
  showViewAll = true,
  showNavigation = true,
  isLoading,
  viewAllText = "View all",
  onViewAll,
  onTabChange,
  titleClassName,
}: JobsTabbedCarouselProps) {
  const { locale, localePath } = useLocale();
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

  // Helper function to extract salary from AD extraFields
  const getSalaryFromAd = (ad: AD, type: "min" | "max"): number | null => {
    if (!ad.extraFields) return null;

    const extraFields = Array.isArray(ad.extraFields)
      ? ad.extraFields
      : Object.entries(ad.extraFields).map(([name, value]) => ({
          name,
          value,
        }));

    const salaryField = extraFields.find(
      (field) =>
        field.name?.toLowerCase().includes("salary") &&
        (type === "min"
          ? field.name?.toLowerCase().includes("min")
          : field.name?.toLowerCase().includes("max")),
    );

    if (salaryField && typeof salaryField.value === "number") {
      return salaryField.value;
    }

    return null;
  };

  // Transform AD to JobCard props
  const transformAdToJobCard = (ad: AD) => {
    const postedTime = formatDistanceToNow(new Date(ad.createdAt), {
      addSuffix: true,
    });

    // Extract job fields from extraFields
    const extraFields = Array.isArray(ad.extraFields)
      ? ad.extraFields
      : Object.entries(ad.extraFields || {}).map(([name, value]) => ({
          name,
          value,
        }));

    const getFieldValue = (fieldName: string): string => {
      const field = extraFields.find((f) =>
        f.name?.toLowerCase().includes(fieldName.toLowerCase()),
      );
      if (field) {
        if (Array.isArray(field.value)) {
          return field.value.join(", ");
        }
        return String(field.value || "");
      }
      return "";
    };

    const jobType =
      getFieldValue("jobType") || getFieldValue("job type") || "Not specified";
    const experience = getFieldValue("experience") || "Not specified";

    // Extract salary from extraFields or use price
    const salaryMin = getSalaryFromAd(ad, "min") || ad.price || 0;
    const salaryMax = getSalaryFromAd(ad, "max") || ad.price || 0;

    // Get location
    const location =
      typeof ad.location === "string"
        ? ad.location
        : ad.location?.city || ad.address?.city || "Location not specified";

    // Get company name
    const company =
      ad.organization?.tradeName ||
      ad.organization?.legalName ||
      (ad.owner?.firstName && ad.owner?.lastName
        ? `${ad.owner.firstName} ${ad.owner.lastName}`
        : "Company");

    return {
      id: ad._id,
      title: ad.title || "",
      company,
      experience,
      salaryMin,
      salaryMax,
      location,
      jobType,
      postedTime,
      logo: ad.organization?.logoUrl,
      isSaved: false,
      onFavorite: (id: string) => console.log("Favorited:", id),
      onShare: (id: string) => console.log("Shared:", id),
    };
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  // Content render functions
  const renderTitle = () => (
    <motion.div
      variants={tabsVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="flex items-center justify-between mb-2 pl-5"
    >
      <Typography
        variant="lg-black-inter"
        className={`text-md sm:text-lg font-medium text-dark-blue dark:text-white ${titleClassName}`}
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
      className="mb-4 flex items-center justify-between px-5"
    >
      <CarouselWrapper
        className="flex-1"
        containerClassName="items-center"
        shadowColorClassName="from-white dark:from-gray-950"
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
                  : "bg-white dark:bg-gray-800 border-[#F5EBFF] dark:border-gray-700 text-[#475467] dark:text-gray-300 hover:bg-purple/10 dark:hover:bg-purple/20"
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
            className="md:block hidden transition-colors px-5 py-2 h-8 text-xs font-medium dark:bg-purple dark:text-white"
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
        <div className="text-center py-8 text-gray-500">
          No jobs available for this category.
        </div>
      );
    }

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative"
      >
        <CardsCarousel title="" showNavigation={showNavigation}>
          {currentAds
            .filter((item): item is AD => item != null)
            .map((item, index) => {
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
                  className="flex gap-2"
                >
                  <JobCard job={item} />
                </motion.div>
              );
            })}
        </CardsCarousel>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <JobsTabbedCarouselSkeleton
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
