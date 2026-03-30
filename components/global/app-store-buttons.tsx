"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AppStoreButtonProps {
  platform: "google-play" | "app-store";
  className?: string;
  theme?: "dark" | "light";
}

export function AppStoreButton({ platform, className, theme = "dark" }: AppStoreButtonProps) {
  const isGooglePlay = platform === "google-play";
  
  const config = {
    "google-play": {
      href: "#",
      icon: "https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup.svg?alt=media&token=08d8b0d5-e352-4d63-9ead-4824478c6065",
      label: "COMING SOON ON",
      storeName: "Google Play",
      disabled: true,
    },
    "app-store": {
      href: "https://apps.apple.com/us/app/buyorsell-anything-in-uae/id6759313741",
      icon: "https://firebasestorage.googleapis.com/v0/b/dealdome-12a90.firebasestorage.app/o/icons%2FGroup%20(1).svg?alt=media&token=697b0ca8-67bf-44d9-bc5d-ee12e36822a7",
      label: "Download on the",
      storeName: "App Store",
      disabled: false,
    },
  }[platform];

  return (
    <Link
      href={config.href}
      target={config.disabled ? undefined : "_blank"}
      onClick={(e) => config.disabled && e.preventDefault()}
      className={cn(
        "flex items-center gap-2 rounded-xl px-4 py-2 transition-all shadow-lg",
        !config.disabled && "hover:scale-105",
        config.disabled && "opacity-50 grayscale cursor-not-allowed",
        theme === "dark" 
          ? "bg-black text-white" + (!config.disabled ? " hover:bg-black/90" : "")
          : "bg-white text-black border border-gray-100" + (!config.disabled ? " hover:bg-gray-50" : ""),
        className
      )}
    >
      <Image
        src={config.icon}
        width={20}
        height={20}
        alt={config.storeName}
        className={cn(theme === "light" && "filter brightness-0 dark:brightness-100")}
      />
      <div className="flex flex-col text-left">
        <span className="text-[8px] uppercase font-bold tracking-tight leading-none mb-0.5 opacity-80">
          {config.label}
        </span>
        <span className="text-[13px] font-bold leading-none">
          {config.storeName}
        </span>
      </div>
    </Link>
  );
}

export function GooglePlayButton({ className, theme = "dark" }: { className?: string, theme?: "dark" | "light" }) {
  return <AppStoreButton platform="google-play" className={className} theme={theme} />;
}

export function AppleAppStoreButton({ className, theme = "dark" }: { className?: string, theme?: "dark" | "light" }) {
  return <AppStoreButton platform="app-store" className={className} theme={theme} />;
}

export function AppStoreButtons({ className, theme = "dark" }: { className?: string, theme?: "dark" | "light" }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <GooglePlayButton theme={theme} />
      <AppleAppStoreButton theme={theme} />
    </div>
  );
}
