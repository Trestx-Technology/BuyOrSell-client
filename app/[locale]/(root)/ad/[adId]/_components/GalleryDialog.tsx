"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";

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
    setSelectedIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
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
      dialogContentClassName="p-0 h-[80vh] flex flex-col bg-black/25 backdrop-blur-sm border-0 rounded-xl min-w-2xl lg:min-w-4xl"
      drawerContentClassName="h-fit p-0 backdrop-blur-sm rounded-xl border-0"
      mobileBreakpoint={700}
    >
      <div className="relative w-full h-full flex-1 overflow-hidden flex justify-center">
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-purple backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-purple backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
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
            width={512}
            height={512}
            className="object-contain rounded-2xl animate-in fade-in zoom-in-95 duration-300"
            unoptimized
          />
        ) : (
          <div className="relative w-full h-full">
            {isPlaying ? (
              <video
                key={selectedItem.id}
                src={selectedItem.src}
                controls
                autoPlay
                className="h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              >
                Your browser does not support the video tag.
              </video>
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
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/40"
                >
                  <Play className="h-8 w-8 ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ResponsiveDialogDrawer>
  );
}
