"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/90 text-sm font-medium">
          {selectedIndex + 1} / {mediaItems.length}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-4 pb-32 pt-20">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          {/* Navigation Buttons */}
          {mediaItems.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Media Display */}
          <div className="relative w-full h-full flex items-center justify-center">
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
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails Bar */}
      {mediaItems.length > 1 && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-transform duration-300",
            showThumbnails ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
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
                    ? "border-white scale-110 shadow-xl"
                    : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100",
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
          </div>
        </div>
      )}

      {/* Toggle Thumbnails Button */}
      {mediaItems.length > 1 && (
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 hover:text-white text-xs"
        >
          {showThumbnails ? "▼" : "▲"}
        </button>
      )}
    </div>
  );
}

