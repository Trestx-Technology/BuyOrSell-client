"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { StaticImageData } from "next/image";
import property1 from "@/public/real-estate/property1.jpg";
import property2 from "@/public/real-estate/property2.jpg";
import property3 from "@/public/real-estate/property3.jpg";
import property4 from "@/public/real-estate/property4.jpg";
import property5 from "@/public/real-estate/property5.jpg";
import property6 from "@/public/real-estate/property6.jpg";

// Types for the property listings
interface PropertyItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
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

interface TrendingPropertiesProps {
  className?: string;
}

// Sample property data
const sampleProperties: PropertyItem[] = [
  {
    id: "0",
    title: "Modern Villa in Palm Jumeirah",
    image: property1,
    location: "Palm Jumeirah, Dubai",
    currentPrice: "2,450,000",
    originalPrice: "2,800,000",
    discount: "12%",
    bedrooms: "4",
    bathrooms: "5",
    area: "3,200 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "1",
    title: "Luxury Apartment Downtown",
    image: property2,
    location: "Downtown Dubai",
    currentPrice: "1,850,000",
    originalPrice: "2,100,000",
    discount: "12%",
    bedrooms: "3",
    bathrooms: "3",
    area: "2,100 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "2",
    title: "Beachfront Penthouse",
    image: property3,
    location: "JBR, Dubai",
    currentPrice: "3,200,000",
    originalPrice: "3,600,000",
    discount: "11%",
    bedrooms: "4",
    bathrooms: "4",
    area: "3,800 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 5 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "11% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "3",
    title: "Garden Villa Emirates Hills",
    image: property4,
    location: "Emirates Hills, Dubai",
    currentPrice: "4,100,000",
    originalPrice: "4,500,000",
    discount: "9%",
    bedrooms: "5",
    bathrooms: "6",
    area: "4,500 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 6 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "9% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "4",
    title: "Modern Townhouse",
    image: property5,
    location: "Dubai Hills Estate",
    currentPrice: "1,950,000",
    originalPrice: "2,200,000",
    discount: "11%",
    bedrooms: "4",
    bathrooms: "4",
    area: "2,800 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 7 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "11% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "5",
    title: "Luxury Apartment Marina",
    image: property6,
    location: "Dubai Marina",
    currentPrice: "2,300,000",
    originalPrice: "2,600,000",
    discount: "12%",
    bedrooms: "3",
    bathrooms: "3",
    area: "2,400 sq ft",
    year: "2023",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
];

export default function TrendingProperties({
  className = "",
}: TrendingPropertiesProps) {
  const [properties, setProperties] =
    useState<PropertyItem[]>(sampleProperties);

  const handleFavoriteToggle = (id: string | number) => {
    setProperties((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    // Handle view all action
    console.log("View all trending properties clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
    // You can handle additional logic here when tabs change
  };

  // Define tabs with data and render functions
  const tabs: TabItem<PropertyItem>[] = [
    {
      value: "villas",
      label: "Villas",
      data: properties,
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            bedrooms: property.bedrooms + " BR",
            bathrooms: property.bathrooms + " BA",
            area: property.area,
            year: property.year,
          }}
          category="property"
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
      value: "apartments",
      label: "Apartments",
      data: properties.slice(0, 4),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            bedrooms: property.bedrooms + " BR",
            bathrooms: property.bathrooms + " BA",
            area: property.area,
            year: property.year,
          }}
          category="property"
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
      value: "townhouses",
      label: "Townhouses",
      data: properties.slice(0, 5),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            bedrooms: property.bedrooms + " BR",
            bathrooms: property.bathrooms + " BA",
            area: property.area,
            year: property.year,
          }}
          category="property"
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
      value: "penthouses",
      label: "Penthouses",
      data: properties.slice(0, 3),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            bedrooms: property.bedrooms + " BR",
            bathrooms: property.bathrooms + " BA",
            area: property.area,
            year: property.year,
          }}
          category="property"
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
      title="Trending Properties"
      tabs={tabs}
      defaultTab="villas"
      viewAllText="View all"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
