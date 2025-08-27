"use client";

import { ReactNode, useCallback, useState } from "react";
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
  sponsoredBanner,
}: TabbedCarouselProps<T>) {
  const firstTab = defaultTab || tabs[0]?.value;
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState(firstTab);

  // Intersection Observer for animation - same pattern as recent-views.tsx
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
          }
        },
        {
          threshold: 0.01,
          rootMargin: "0px",
        }
      );
      observer.observe(node);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    onTabChange?.(tabValue);
  };

  const currentTab = tabs.find((tab) => tab.value === activeTab);
  const currentData = currentTab?.data || [];

  return (
    <motion.section
      ref={setRef}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      className={`max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto px-4 xl:px-5">
        {/* Header with Title and View All Button */}
        <motion.div
          variants={itemVariants}
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

        {/* Custom Tab Buttons */}
        <motion.div
          variants={itemVariants}
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-4 py-2 h-8 text-xs font-medium rounded-lg border transition-colors flex-shrink-0 ${
                  activeTab === tab.value
                    ? "bg-purple text-white border-purple shadow-sm"
                    : "bg-white border-[#F5EBFF] text-[#475467] hover:bg-purple/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* View All Button */}
          {showViewAll && (
            <motion.div variants={itemVariants}>
              <Button
                variant="filled"
                onClick={onViewAll}
                className="transition-colors px-5 py-2 h-8 text-xs font-medium"
              >
                {viewAllText}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Cards Carousel - Same pattern as recent-views.tsx */}
        <motion.div variants={itemVariants}>
          <CardsCarousel title="" showNavigation={showNavigation}>
            {currentData.map((item, index) => (
              <div
                key={item.id || index}
                className="flex-[0_0_auto] max-w-[190px] w-full"
              >
                {currentTab?.renderCard(item, index)}
              </div>
            ))}
          </CardsCarousel>
        </motion.div>
      </div>
    </motion.section>
  );
}
