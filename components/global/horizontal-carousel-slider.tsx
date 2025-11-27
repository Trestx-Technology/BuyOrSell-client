"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  formatSpecValue,
  getSpecIcon,
  ListingCardProps,
} from "@/components/global/listing-card";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Typography } from "../typography";
import Image from "next/image";

export interface HorizontalCarouselSliderProps {
  items: ListingCardProps[];
  className?: string;
  showNavigation?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  cardWidth?: number;
  gap?: number;
  showScrollbar?: boolean;
}

export function HorizontalCarouselSlider({
  items,
  className = "",
  showNavigation = true,
  autoScroll = false,
  autoScrollInterval = 5000,
  cardWidth = 280,
  gap = 16,
  showScrollbar = false,
}: HorizontalCarouselSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ListingCardProps | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total width and max scroll
  // const totalWidth = items.length * (cardWidth + gap) - gap;
  // const maxScroll = Math.max(
  //   0,
  //   totalWidth - (scrollContainerRef.current?.clientWidth || 0)
  // );

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || items.length <= 1) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoScrollInterval);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, autoScrollInterval, items.length]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollLeft = currentIndex * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [currentIndex, cardWidth, gap]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle card click
  const handleCardClick = (item: ListingCardProps) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "absolute bottom-5 left-0 right-0 z-40 rounded-lg ",
          className
        )}
      >
        {/* Navigation Dots */}
        {showNavigation && items.length > 1 && (
          <div className="flex justify-center items-center py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <div className="flex space-x-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentIndex
                      ? "bg-purple-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative px-4 py-4">
          {/* Navigation Arrows */}
          {showNavigation && items.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={currentIndex === items.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex gap-4 overflow-x-auto scroll-smooth",
              !showScrollbar && "scrollbar-hide"
            )}
            style={{
              scrollbarWidth: showScrollbar ? "auto" : "none",
              msOverflowStyle: showScrollbar ? "auto" : "none",
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                className="flex-shrink-0"
              >
                <div
                  role="button"
                  className="bg-white rounded-lg overflow-hidden"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="flex items-start gap-2 max-h-[300px] p-2">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={130}
                      height={130}
                      className="rounded-lg size-[130px] object-cover"
                    />
                    <div className="cursor-pointer transform transition-transform duration-200 hover:scale-105 mt-5 space-y-1">
                      <div className=" px-2.5 flex items-center gap-1">
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/AED.svg"
                          }
                          alt="AED"
                          width={16}
                          height={16}
                        />
                        <Typography
                          variant="xs-black-inter"
                          className="text-purple font-bold"
                        >
                          {item.price}
                        </Typography>
                        {item.originalPrice && (
                          <Typography
                            variant="xs-black-inter"
                            className="text-grey-blue line-through text-sm"
                          >
                            {item.originalPrice}
                          </Typography>
                        )}
                        {item.discount && (
                          <Typography
                            variant="xs-black-inter"
                            className="text-grey-blue text-sm text-teal font-medium"
                          >
                            {item.discount}
                          </Typography>
                        )}
                      </div>
                      <h3 className="text-xs font-semibold text-dark-blue leading-tight px-2.5 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 px-2.5">
                        {(() => {
                          // Normalize extraFields: handle both array and object formats
                          let normalizedFields: Record<string, any> = {};
                          if (Array.isArray(item.extraFields)) {
                            item.extraFields.forEach((field: any) => {
                              if (field && typeof field === 'object' && 'name' in field && 'value' in field) {
                                normalizedFields[field.name] = field.value;
                              }
                            });
                          } else if (item.extraFields && typeof item.extraFields === 'object') {
                            normalizedFields = item.extraFields as Record<string, any>;
                          }
                          
                          const entries = Object.entries(normalizedFields);
                          return entries.length > 0 && (
                            <div className="flex items-center gap-2 px-2.5">
                              {entries
                                .slice(0, 2)
                                .map(([key, value]) => {
                                  const Icon = getSpecIcon(key);
                                  return (
                                    <div
                                      key={key}
                                      className="flex items-center gap-1"
                                    >
                                      <Icon className="w-3 h-3 text-grey-500" />
                                      <span className="text-xs text-grey-500 truncate">
                                        {formatSpecValue(key, value)}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1 px-2.5">
                        <MapPin className="w-3 h-3 text-grey-500" />
                        <span className="text-xs text-grey-500 truncate">
                          {item.location}
                        </span>
                      </div>

                      {/* Time ago */}
                      {item.postedTime && (
                        <Typography
                          variant="xs-black-inter"
                          className="text-grey-blue text-xs font-regular px-2.5 border-t border-grey-blue/20 py-2.5"
                        >
                          {formatRelativeTime(new Date(item.postedTime))}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer for Card Details */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh] h-fit bg-white p-4">
          {/* Home Indicator */}

          <div className="flex-1 overflow-y-auto mt-2">
            {selectedItem && (
              <div className="space-y-0">
                {/* Property Image Section */}
                <div className="relative w-full h-56 bg-gray-100">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <Image
                      src={selectedItem.images[0]}
                      alt={selectedItem.title}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {selectedItem.images?.[0] || "No image available"}
                    </div>
                  )}

                  {/* Favorite Button Overlay */}
                  <div className="absolute top-4 right-4">
                    <button className="w-6 h-6 bg-black/50 rounded-lg flex items-center justify-center">
                      <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 13.8L6.85 12.7C3.1 9.2 1 7.1 1 4.5C1 2.3 2.7 0.5 4.9 0.5C6.1 0.5 7.2 1 8 1.8C8.8 1 9.9 0.5 11.1 0.5C13.3 0.5 15 2.3 15 4.5C15 7.1 12.9 9.2 9.15 12.7L8 13.8Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="space-y-4 py-3">
                  {/* Location */}
                  <div className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z"
                        fill="#667085"
                      />
                      <path
                        d="M6 1C7.65685 1 9 2.34315 9 4C9 5.65685 7.65685 7 6 7C4.34315 7 3 5.65685 3 4C3 2.34315 4.34315 1 6 1ZM6 2C4.89543 2 4 2.89543 4 4C4 5.10457 4.89543 6 6 6C7.10457 6 8 5.10457 8 4C8 2.89543 7.10457 2 6 2Z"
                        fill="#667085"
                      />
                    </svg>
                    <span className="text-xs text-gray-600">
                      {selectedItem.location}
                    </span>
                  </div>

                  {/* Property Specs */}
                  <div className="flex items-center gap-8">
                    {/* Bedrooms */}
                    <div className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 4V10H10V4H2ZM1 3H11V11H1V3ZM4 5H8V6H4V5ZM4 7H8V8H4V7Z"
                          fill="#667085"
                        />
                      </svg>
                      <span className="text-xs text-gray-600">
                        {selectedItem.extraFields || "N/A"}{" "}
                        Bedrooms
                      </span>
                    </div>

                    {/* Bathrooms */}
                    <div className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 2C3 1.44772 3.44772 1 4 1H8C8.55228 1 9 1.44772 9 2V3H10C10.5523 3 11 3.44772 11 4V10C11 10.5523 10.5523 11 10 11H2C1.44772 11 1 10.5523 1 10V4C1 3.44772 1.44772 3 2 3H3V2ZM4 3H8V4H4V3ZM3 5H9V9H3V5Z"
                          fill="#667085"
                        />
                      </svg>
                      <span className="text-xs text-gray-600">
                        {selectedItem.extraFields || "N/A"}{" "}
                        Bathrooms
                      </span>
                    </div>

                    {/* Area */}
                    <div className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 2H10V10H2V2ZM1 1V11H11V1H1ZM4 4H8V5H4V4ZM4 6H8V7H4V6ZM4 8H6V9H4V8Z"
                          fill="#667085"
                        />
                      </svg>
                      <span className="text-xs text-gray-600">
                        {selectedItem.specifications?.area || "N/A"} sqft
                      </span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-purple-600">
                        AED {selectedItem.price}
                      </span>
                      {selectedItem.originalPrice && (
                        <span className="text-xs text-gray-600 line-through">
                          AED {selectedItem.originalPrice}
                        </span>
                      )}
                    </div>
                    {selectedItem.discount && (
                      <span className="text-xs font-semibold text-teal-600">
                        {selectedItem.discount}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-xs font-medium text-gray-900">
                    {selectedItem.title}
                  </h2>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-900">
                      Description
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedItem.specifications?.description ||
                        "This is a beautiful property with modern amenities and great location. Perfect for families looking for comfort and convenience in a prime area."}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pb-6 space-y-3">
                  {/* View All Details Button */}
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2">
                    View all details
                  </Button>

                  {/* Secondary Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 py-2"
                      onClick={handleCloseDrawer}
                    >
                      Close
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Share2 />}
                      iconPosition="left"
                      className="flex-1 border-gray-300 text-gray-700 py-2"
                    >
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
