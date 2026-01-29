"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface OrganizationTabsProps {
  activeTab: string;
  onTabChange: (tab: "home" | "about" | "jobs") => void;
}

export const OrganizationTabs = ({ activeTab, onTabChange }: OrganizationTabsProps) => {
  const tabs = ["home", "about", "jobs"] as const;

  return (
    <div className="px-6 flex items-center gap-8 border-b border-slate-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "py-4 px-1 font-semibold text-sm uppercase tracking-wide transition-colors",
            activeTab === tab
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-slate-600 hover:text-slate-900"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
