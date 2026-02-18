import React from "react";
import { Typography } from "@/components/typography";

interface SectionWrapperProps {
      id: string;
      title: string;
      number?: string | number;
      children: React.ReactNode;
      className?: string;
}

export const SectionWrapper = ({ id, title, number, children, className }: SectionWrapperProps) => {
      return (
            <section id={id} className={`scroll-mt-32 transition-all duration-700 ${className}`}>
                  <div className="flex items-center gap-4 mb-6 group">
                        {number && (
                              <div className="relative">
                                    <span className="relative z-10 bg-purple text-white w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 shadow-lg shadow-purple/20 group-hover:scale-105 transition-all">
                                          {number}
                                    </span>
                                    <div className="absolute inset-0 bg-purple blur-md opacity-10 group-hover:opacity-20 transition-opacity"></div>
                              </div>
                        )}
                        <Typography variant="h2" className="text-gray-900 text-xl md:text-2xl font-bold tracking-tight flex-1">
                              {title}
                        </Typography>
                  </div>

                  <div className="space-y-4 text-gray-600 leading-relaxed font-inter text-sm md:text-base break-words">
                        {children}
                  </div>
            </section>
      );
};
