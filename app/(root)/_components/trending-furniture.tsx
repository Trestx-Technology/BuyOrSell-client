"use client";

import { useState } from "react";
import { Typography } from "@/components/typography";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import furniture1 from "@/public/furniture/furniture1.jpg";
import furniture2 from "@/public/furniture/furniture2.jpg";
import furniture3 from "@/public/furniture/furniture3.jpg";
import furniture4 from "@/public/furniture/furniture4.jpg";
import furniture5 from "@/public/furniture/furniture5.jpg";
import furniture6 from "@/public/furniture/furniture6.jpg";

// Types for furniture items
interface FurnitureItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  material: string;
  condition: string;
  style: string;
  dimensions: string;
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

interface TrendingFurnitureProps {
  className?: string;
}

// Sample furniture data
const sampleFurniture: FurnitureItem[] = [
  {
    id: "f1",
    title: "Modern Leather Sofa Set",
    image: furniture1,
    location: "Downtown",
    currentPrice: "1,200",
    originalPrice: "1,800",
    discount: "33%",
    material: "Genuine Leather",
    condition: "Like New",
    style: "Modern",
    dimensions: "240x90x85cm",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "33% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "f2",
    title: "Vintage Dining Table",
    image: furniture2,
    location: "Midtown",
    currentPrice: "450",
    originalPrice: "650",
    discount: "31%",
    material: "Solid Wood",
    condition: "Good",
    style: "Vintage",
    dimensions: "180x90x75cm",
    year: "2022",
    timeAgo: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "31% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "f3",
    title: "Ergonomic Office Chair",
    image: furniture3,
    location: "Business District",
    currentPrice: "280",
    originalPrice: "400",
    discount: "30%",
    material: "Mesh & Steel",
    condition: "Excellent",
    style: "Contemporary",
    dimensions: "65x65x120cm",
    year: "2023",
    timeAgo: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "30% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "f4",
    title: "Queen Size Bed Frame",
    image: furniture4,
    location: "Residential Area",
    currentPrice: "320",
    originalPrice: "480",
    discount: "33%",
    material: "Metal & Fabric",
    condition: "Like New",
    style: "Minimalist",
    dimensions: "160x200x120cm",
    year: "2023",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "33% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "f5",
    title: "Bookshelf Unit",
    image: furniture5,
    location: "University Area",
    currentPrice: "180",
    originalPrice: "250",
    discount: "28%",
    material: "Engineered Wood",
    condition: "Good",
    style: "Traditional",
    dimensions: "120x30x180cm",
    year: "2022",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "28% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "f6",
    title: "Coffee Table Set",
    image: furniture6,
    location: "Suburban",
    currentPrice: "220",
    originalPrice: "320",
    discount: "31%",
    material: "Glass & Metal",
    condition: "Excellent",
    style: "Contemporary",
    dimensions: "120x60x45cm",
    year: "2023",
    timeAgo: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "31% OFF",
    discountBadgeBg: "bg-red-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
];

export default function TrendingFurniture({
  className = "",
}: TrendingFurnitureProps) {
  const [furniture, setFurniture] = useState<FurnitureItem[]>(sampleFurniture);

  const handleFavoriteToggle = (id: string | number) => {
    setFurniture((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all trending furniture clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<FurnitureItem>[] = [
    {
      value: "living-room",
      label: "Living Room",
      data: furniture.slice(0, 4),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            material: property.material,
            condition: property.condition,
            style: property.style,
            dimensions: property.dimensions,
          }}
          category="furniture"
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
      value: "bedroom",
      label: "Bedroom",
      data: furniture.slice(2, 6),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            material: property.material,
            condition: property.condition,
            style: property.style,
            dimensions: property.dimensions,
          }}
          category="furniture"
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
      value: "office",
      label: "Office",
      data: furniture.slice(0, 3),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            material: property.material,
            condition: property.condition,
            style: property.style,
            dimensions: property.dimensions,
          }}
          category="furniture"
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
      title="Trending Furniture"
      tabs={tabs}
      defaultTab="living-room"
      viewAllText="View all furniture"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
