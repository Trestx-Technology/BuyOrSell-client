"use client";

import React from "react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { cn } from "@/lib/utils";

interface ProfilePlaceholderProps {
  className?: string;
  size?: number;
}

export const ProfilePlaceholder = ({ className, size = 40 }: ProfilePlaceholderProps) => {
  return (
    <div 
      className={cn(
        "w-full h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center grayscale opacity-30 select-none",
        className
      )}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <Image 
          src={ICONS.logo.full} 
          alt="Logo Placeholder" 
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};
