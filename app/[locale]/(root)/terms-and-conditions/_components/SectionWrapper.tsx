import React from "react";
import { Typography } from "@/components/typography";

interface SectionWrapperProps {
      id: string;
      title: string;
      number?: string | number;
      children: React.ReactNode;
      className?: string;
}

export const SectionWrapper = ({ id, title, children, className }: SectionWrapperProps) => {
  return (
    <section id={id} className={`scroll-mt-24 transition-all duration-700 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {title}
        </h2>
        <div className="w-12 h-1 bg-purple/20 rounded-full"></div>
      </div>

      <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed font-inter text-sm md:text-base break-words">
        {children}
      </div>
    </section>
  );
};
