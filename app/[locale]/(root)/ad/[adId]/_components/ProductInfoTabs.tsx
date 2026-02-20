"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";

export type TabType =
  | "description"
  | "specifications"
  | "location"
  | "reviews"
  | "similar-cars";

interface ProductInfoTabsProps {
  onTabChange?: (activeTab: TabType) => void;
  initialTab?: TabType;
  className?: string;
}

const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({
  onTabChange,
  initialTab = "description",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const { t } = useLocale();

  const tabs = [
    { id: "description" as TabType, label: t.ad.tabs.description },
    { id: "specifications" as TabType, label: t.ad.tabs.specifications },
    { id: "location" as TabType, label: t.ad.tabs.location },
    { id: "reviews" as TabType, label: t.ad.tabs.reviews },
    // { id: "similar-cars" as TabType, label: t.ad.tabs.similarCars },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      className={`w-full px-4 bg-white dark:bg-slate-900 rounded-l-xl md:rounded-r-xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center overflow-x-auto gap-4 justify-between scrollbar-hide ${className}`}
    >
      {/* Tab Navigation */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
              py-2 rounded-none h-12 cursor-pointer transition-all duration-200 flex items-center justify-center whitespace-nowrap flex-shrink-0
              ${
                activeTab === tab.id
                  ? "text-purple border-b-2 border-purple"
                  : ""
              }
            `}
        >
          <Typography
            variant="body-small"
            className={`
                text-xs font-medium uppercase hover:text-purple
                ${
                  activeTab === tab.id
                    ? "text-purple font-semibold"
              : "text-dark-blue dark:text-gray-400"
                }
              `}
          >
            {tab.label}
          </Typography>
        </button>
      ))}
      {/* Active Tab Indicator */}
      {/* <div className="relative">
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-purple transition-all duration-300"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex((tab) => tab.id === activeTab) * 100}%)`,
          }}
        />
      </div> */}
    </div>
  );
};

export default ProductInfoTabs;
