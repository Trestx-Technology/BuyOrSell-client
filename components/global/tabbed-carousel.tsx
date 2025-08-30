"use client";

import React, { ReactNode, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CardsCarousel } from "@/components/global/cards-carousel";

export interface TabItem<
  T extends { id?: string | number } = { id?: string | number },
> {
  value: string;
  label: string;
  data: T[];
  renderCard: (item: T, index: number) => ReactNode;
}

export interface TabbedCarouselProps<
  T extends { id?: string | number } = { id?: string | number },
> {
  title: string;
  tabs: TabItem<T>[];
  defaultTab?: string;
  viewAllText?: string;
  onViewAll?: () => void;
  onTabChange?: (tabValue: string) => void;
  className?: string;
  showViewAll?: boolean;
  showNavigation?: boolean;
  sponsoredBanner?: ReactNode;
}

export default function TabbedCarousel<
  T extends { id?: string | number } = { id?: string | number },
>({
  title,
  tabs,
  defaultTab,
  viewAllText = "View all",
  onViewAll,
  onTabChange,
  className = "",
  showViewAll = true,
  showNavigation = true,
}: TabbedCarouselProps<T>) {
  const firstTab = defaultTab || tabs[0]?.value;
  const [activeTab, setActiveTab] = useState(firstTab);
  const [isLoading, setIsLoading] = useState(true);

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
        delay: 0.2, // First to appear
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
        delay: 0.5, // Second to appear
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
        delay: 0.8, // Third to appear
      },
    },
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    onTabChange?.(tabValue);
  };

  const currentTab = tabs.find((tab) => tab.value === activeTab);
  const currentData = currentTab?.data || [];

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show loader for 1.2s to simulate data loading

    return () => clearTimeout(timer);
  }, []);

  // Skeleton components
  const TitleSkeleton = () => (
    <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
  );

  const TabsSkeleton = () => (
    <div className="flex items-center gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  );

  const ViewAllSkeleton = () => (
    <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
  );

  const CardsSkeleton = () => (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
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
  );

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto px-4 xl:px-5">
        {/* Header with Title and View All Button */}
        {isLoading ? (
          <div className="flex items-center justify-between mb-2">
            <TitleSkeleton />
          </div>
        ) : (
          <motion.div
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between mb-2"
          >
            {/* Section Title */}
            <Typography
              variant="lg-black-inter"
              className="text-lg font-medium text-dark-blue"
            >
              {title}
            </Typography>
          </motion.div>
        )}

        {/* Custom Tab Buttons */}
        {isLoading ? (
          <div className="mb-4 flex items-center justify-between">
            <TabsSkeleton />
            {showViewAll && <ViewAllSkeleton />}
          </div>
        ) : (
          <motion.div
            variants={tabsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-4 flex items-center justify-between"
          >
            <div className="flex flex-1 items-center gap-3 overflow-x-auto overflow-y-visible">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.value}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.6 + index * 0.08, // Staggered delay for each tab after tabs container
                  }}
                  onClick={() => handleTabChange(tab.value)}
                  className={`px-4 py-2 h-8 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ${
                    activeTab === tab.value
                      ? "bg-purple text-white border-purple shadow-sm"
                      : "bg-white border-[#F5EBFF] text-[#475467] hover:bg-purple/10"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
            {/* View All Button */}
            {showViewAll && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  type: "spring" as const,
                  stiffness: 300,
                  damping: 22,
                  delay: 0.7, // Slightly after tabs
                }}
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
        )}

        {/* Cards Carousel - Enhanced with stagger animations */}
        {isLoading ? (
          <div className="relative">
            <CardsCarousel title="" showNavigation={false}>
              <CardsSkeleton />
            </CardsCarousel>
          </div>
        ) : (
          <motion.div
            variants={cardsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <CardsCarousel title="" showNavigation={showNavigation}>
              {currentData.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 280,
                    damping: 20,
                    delay: 0.9 + index * 0.1, // Staggered delay for each card after cards container
                  }}
                  className="flex-[0_0_auto] max-w-[190px] w-full"
                >
                  {currentTab?.renderCard(item, index)}
                </motion.div>
              ))}
            </CardsCarousel>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
