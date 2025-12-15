"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Pause, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Typography } from "@/components/typography";

export interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail: string;
  alt: string;
}

interface GalleryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex?: number;
}

export default function GalleryDialog({
  isOpen,
  onClose,
  mediaItems,
  initialIndex = 0,
}: GalleryDialogProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);

  // Update selected index when initialIndex changes
  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    setIsPlaying(false);
  }, [mediaItems.length]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsPlaying(false);
  }, [mediaItems.length]);

  const selectedItem = mediaItems[selectedIndex];

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || mediaItems.length === 0) return null;

  return (
    <ResponsiveDialogDrawer
      open={isOpen}
      onOpenChange={onClose}
      dialogContentClassName=" p-0 bg-black/95 backdrop-blur-sm border-0 rounded-xl min-w-4xl"
      drawerContentClassName="h-fit p-0 backdrop-blur-sm rounded-xl border-0"
      mobileBreakpoint={1000}
    >
      {/* <div className=" flex items-center justify-between p-4 border bg-gradient-to-b from-black/60 to-transparent">
        <Typography variant="md-black-inter" className="text-white">
          {selectedIndex + 1} / {mediaItems.length}
        </Typography>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 text-white hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div> */}
      {/* Negative margins to counteract ResponsiveDialogDrawer's px-4 pb-4 padding on drawer */}
      {/* Header */}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-stretch flex-1 min-h-0">
        {/* Main Media Display Area */}
        <div className="flex-1 flex items-center justify-center md:p-6 min-h-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Navigation Buttons - Hidden on desktop when thumbnails are on the side */}

            {/* Media Display */}
            <div className="relative w-full h-full flex items-center justify-center">
              {mediaItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    className="absolute left-4 z-50 h-12 w-12 rounded-full bg-purple backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="absolute right-4 z-50 h-12 w-12 rounded-full bg-purple backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              {selectedItem.type === "image" ? (
                <Image
                  key={selectedItem.id}
                  src={selectedItem.src || "/placeholder.svg"}
                  alt={selectedItem.alt}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                  unoptimized
                />
              ) : (
                <div className="relative">
                  <Image
                    src={selectedItem.thumbnail || "/placeholder.svg"}
                    alt={selectedItem.alt}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    unoptimized
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/40"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnails - Bottom on mobile, Right side on desktop */}
        {mediaItems.length > 1 && (
          <>
            {/* Mobile: Bottom thumbnails */}
              <div
                className={cn(
                  showThumbnails ? "translate-y-0" : "translate-y-full",
                "relative md:hidden p-4 transition-transform duration-300",
                  "flex items-center justify-center gap-3 overflow-x-auto scrollbar-hide  min-w-full  w-full"
                )}
              >
                {mediaItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedIndex(index);
                      setIsPlaying(false);
                    }}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                      selectedIndex === index
                        ? "border-purple scale-110 shadow-xl"
                        : "border-purple/30 hover:border-purple/60 opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.alt}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              {/* Toggle Thumbnails Button - Mobile only */}
            </div>
              {/* {mediaItems.length > 1 && (
                <Button
                  size={"icon-sm"}
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className="md:hidden absolute -top-4 right-2 w-8 rounded-full text-white/60 hover:text-white z-20"
                >
                  {showThumbnails ? (
                    <ChevronDown className="h-6 w-6" />
                  ) : (
                    <ChevronUp className="h-6 w-6" />
                  )}
                </Button>
              )} */}

            {/* Desktop: Right side thumbnails */}
            <div className=" hidden md:flex flex-col gap-3 p-6 w-32 overflow-y-auto scrollbar-hide max-h-[600px]">
              {mediaItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "relative flex-shrink-0 w-full cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedIndex === index
                      ? "border-purple scale-105 shadow-xl"
                      : "border-purple/30 hover:border-purple/60 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={item.thumbnail || "/placeholder.svg"}
                    alt={item.alt}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </ResponsiveDialogDrawer>
  );
}

