"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for classified items
interface ClassifiedItem {
  id: string;
  image: string;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  condition: string;
  brand: string;
  type: string;
  details: string;
  year: string;
  timeAgo: Date;
  isFavorite?: boolean;
  endTime: Date;
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  timerBg?: string;
  timerTextColor?: string;
}

interface PopularClassifiedsProps {
  className?: string;
}

// Sample classified data with Unsplash images
const sampleClassifieds: ClassifiedItem[] = [
  {
    id: "c1",
    title: "Vintage Collectible Watches",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Gold Souk",
    currentPrice: "2,500",
    originalPrice: "4,200",
    discount: "40%",
    condition: "Mint",
    brand: "Luxury Timepieces",
    type: "Collectible",
    details: "Limited Edition, Authentic",
    year: "2024",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c2",
    title: "Rare First Edition Books",
    image:
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Knowledge Park",
    currentPrice: "1,800",
    originalPrice: "3,000",
    discount: "40%",
    condition: "Excellent",
    brand: "Classic Publishers",
    type: "Literature",
    details: "Signed Copy, Rare Find",
    year: "2024",
    timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c3",
    title: "Retro Gaming Console",
    image:
      "https://images.unsplash.com/photo-1651160670627-2896ddf7822f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Gaming Zone",
    currentPrice: "450",
    originalPrice: "750",
    discount: "40%",
    condition: "Good",
    brand: "Retro Gaming",
    type: "Console",
    details: "With Games, Working Condition",
    year: "2024",
    timeAgo: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c4",
    title: "Antique Furniture Set",
    image:
      "https://images.unsplash.com/photo-1605939471344-2edc2900ab9f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Heritage District",
    currentPrice: "3,200",
    originalPrice: "5,300",
    discount: "40%",
    condition: "Excellent",
    brand: "Heritage Collection",
    type: "Furniture",
    details: "Handcrafted, Original Finish",
    year: "2024",
    timeAgo: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c5",
    title: "Vintage Camera Collection",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Media City",
    currentPrice: "1,500",
    originalPrice: "2,500",
    discount: "40%",
    condition: "Good",
    brand: "Vintage Optics",
    type: "Photography",
    details: "Film Cameras, Working Order",
    year: "2024",
    timeAgo: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c6",
    title: "Collectible Art Prints",
    image:
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Art District",
    currentPrice: "800",
    originalPrice: "1,300",
    discount: "38%",
    condition: "Mint",
    brand: "Art Gallery",
    type: "Artwork",
    details: "Limited Edition, Framed",
    year: "2024",
    timeAgo: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "38% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
];

export default function PopularClassifieds({
  className = "",
}: PopularClassifiedsProps) {
  const [classifieds, setClassifieds] =
    useState<ClassifiedItem[]>(sampleClassifieds);

  const handleFavoriteToggle = (id: string | number) => {
    setClassifieds((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all popular classifieds clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<ClassifiedItem>[] = [
    {
      value: "collectibles",
      label: "Collectibles",
      data: classifieds.slice(0, 6),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            condition: property.condition,
            brand: property.brand,
            type: property.type,
            details: property.details,
          }}
          category="other"
          showDiscountBadge={false}
          discountBadgeBg={property.discountBadgeBg}
          discountBadgeTextColor={property.discountBadgeTextColor}
          showTimer={false}
          timerBg={property.timerBg}
          timerTextColor={property.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "antiques",
      label: "Antiques",
      data: classifieds.slice(2, 6),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            condition: property.condition,
            brand: property.brand,
            type: property.type,
            details: property.details,
          }}
          category="other"
          showDiscountBadge={false}
          discountBadgeBg={property.discountBadgeBg}
          discountBadgeTextColor={property.discountBadgeTextColor}
          showTimer={false}
          timerBg={property.timerBg}
          timerTextColor={property.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "hobbies",
      label: "Hobbies",
      data: classifieds.slice(0, 3),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            condition: property.condition,
            brand: property.brand,
            type: property.type,
            details: property.details,
          }}
          category="other"
          showDiscountBadge={false}
          discountBadgeBg={property.discountBadgeBg}
          discountBadgeTextColor={property.discountBadgeTextColor}
          showTimer={false}
          timerBg={property.timerBg}
          timerTextColor={property.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
  ];

  return (
    <TabbedCarousel
      title="Popular Ads in Classifieds"
      tabs={tabs}
      defaultTab="collectibles"
      viewAllText="View all classifieds"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
