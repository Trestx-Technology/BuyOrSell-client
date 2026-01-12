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
}

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
    [categoryData.subCategory]
  );

  const firstTabValue = categoryData.subCategory[0]?._id;
  const [activeTab, setActiveTab] = useState(firstTabValue);

  // Get ads directly from the selected subcategory
  const currentAds = useMemo(() => {
    const activeSubCategory = subCategories.find(
      (sub) => sub._id === activeTab
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
          : field.name?.toLowerCase().includes("max"))
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
        f.name?.toLowerCase().includes(fieldName.toLowerCase())
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
      isFavorite: false,
      onFavorite: (id: string) => console.log("Favorited:", id),
      onShare: (id: string) => console.log("Shared:", id),
    };
  };

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
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        delay: 0.2,
      },
    },
  };

  const tabsVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        delay: 0.5,
      },
    },
  };

  const cardsVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        delay: 0.8,
      },
    },
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
  );

  const CardsSkeleton = () => (
    <div className="relative">
      <CardsCarousel title="" showNavigation={showNavigation}>
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-[0_0_auto] max-w-[256px] w-full bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-4 space-y-2">
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
      className="flex items-center justify-between mb-2 pl-5"
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
      className="mb-4 flex items-center justify-between px-5"
    >
      <div className="flex flex-1 items-center gap-3 overflow-x-auto scrollbar-hide">
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
                  : "bg-white border-[#F5EBFF] text-[#475467] hover:bg-purple/10"
              }`}
            >
              {subCategoryName}
            </motion.button>
          );
        })}
      </div>
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
            onClick={() => onViewAll?.(categoryName)}
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
          No jobs available for this category.
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
              const jobCardProps = transformAdToJobCard(item);
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
                  <JobCard {...jobCardProps} />
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
      <div className="w-full mx-auto">
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
