"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { Gift, BookOpen, Gamepad2, Heart, Camera, Music } from "lucide-react";

// Types for classified items
interface ClassifiedItem {
  id: string;
  image: React.ReactNode;
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

// Sample classified data
const sampleClassifieds: ClassifiedItem[] = [
  {
    id: "c1",
    title: "Vintage Collectible Toys",
    image: <Gift className="w-full h-full text-yellow-600" />,
    location: "Collector's Corner",
    currentPrice: "150",
    originalPrice: "250",
    discount: "40%",
    condition: "Mint",
    brand: "Vintage Toys Co.",
    type: "Collectible",
    details: "Limited Edition",
    year: "2023",
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
    image: <BookOpen className="w-full h-full text-brown-600" />,
    location: "Book Haven",
    currentPrice: "300",
    originalPrice: "500",
    discount: "40%",
    condition: "Excellent",
    brand: "Classic Publishers",
    type: "Literature",
    details: "Signed Copy",
    year: "2023",
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
    image: <Gamepad2 className="w-full h-full text-green-600" />,
    location: "Gaming Zone",
    currentPrice: "120",
    originalPrice: "200",
    discount: "40%",
    condition: "Good",
    brand: "Retro Gaming",
    type: "Console",
    details: "With Games",
    year: "2022",
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
    title: "Antique Jewelry Box",
    image: <Heart className="w-full h-full text-pink-600" />,
    location: "Antique Market",
    currentPrice: "85",
    originalPrice: "150",
    discount: "43%",
    condition: "Very Good",
    brand: "Antique Craft",
    type: "Jewelry",
    details: "Hand Carved",
    year: "2022",
    timeAgo: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "43% OFF",
    discountBadgeBg: "bg-orange-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "c5",
    title: "Professional Camera Lens",
    image: <Camera className="w-full h-full text-blue-600" />,
    location: "Photo Studio",
    currentPrice: "450",
    originalPrice: "750",
    discount: "40%",
    condition: "Excellent",
    brand: "Pro Optics",
    type: "Photography",
    details: "50mm f/1.4",
    year: "2023",
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
    title: "Vinyl Record Collection",
    image: <Music className="w-full h-full text-purple-600" />,
    location: "Music Store",
    currentPrice: "200",
    originalPrice: "350",
    discount: "43%",
    condition: "Good",
    brand: "Classic Records",
    type: "Music",
    details: "50+ Records",
    year: "2023",
    timeAgo: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "43% OFF",
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
      data: classifieds.slice(0, 4),
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
