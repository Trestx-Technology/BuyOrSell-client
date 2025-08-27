"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { StaticImageData } from "next/image";
import product1 from "@/public/product/product1.jpg";
import product2 from "@/public/product/product2.jpg";
import product3 from "@/public/product/product3.jpg";
import product4 from "@/public/product/product4.jpg";
import product5 from "@/public/product/product5.jpg";
import product6 from "@/public/product/product6.jpg";

// Types for product items
interface ProductItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  brand: string;
  condition: string;
  warranty: string;
  features: string;
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

interface TrendingProductsProps {
  className?: string;
}

// Sample product data
const sampleProducts: ProductItem[] = [
  {
    id: "p1",
    title: "Wireless Bluetooth Headphones",
    image: product1,
    location: "Tech District",
    currentPrice: "89",
    originalPrice: "129",
    discount: "31%",
    brand: "Premium Audio",
    condition: "New",
    warranty: "2 Years",
    features: "Noise Cancelling",
    year: "2023",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "31% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "p2",
    title: "Smart Fitness Watch",
    image: product2,
    location: "Fitness Center",
    currentPrice: "199",
    originalPrice: "299",
    discount: "33%",
    brand: "FitTech",
    condition: "Like New",
    warranty: "1 Year",
    features: "Heart Rate Monitor",
    year: "2023",
    timeAgo: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "33% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "p3",
    title: "Portable Power Bank",
    image: product3,
    location: "Mall Area",
    currentPrice: "45",
    originalPrice: "65",
    discount: "31%",
    brand: "PowerMax",
    condition: "Excellent",
    warranty: "6 Months",
    features: "20,000mAh",
    year: "2023",
    timeAgo: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "31% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "p4",
    title: "Gaming Mouse",
    image: product4,
    location: "Gaming Zone",
    currentPrice: "75",
    originalPrice: "99",
    discount: "24%",
    brand: "GameMaster",
    condition: "Good",
    warranty: "1 Year",
    features: "RGB Lighting",
    year: "2022",
    timeAgo: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "24% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "p5",
    title: "USB-C Hub",
    image: product5,
    location: "Office Complex",
    currentPrice: "35",
    originalPrice: "55",
    discount: "36%",
    brand: "ConnectPro",
    condition: "New",
    warranty: "1 Year",
    features: "7 Ports",
    year: "2023",
    timeAgo: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "36% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "p6",
    title: "Wireless Charger",
    image: product6,
    location: "Electronics Store",
    currentPrice: "28",
    originalPrice: "42",
    discount: "33%",
    brand: "ChargeTech",
    condition: "Excellent",
    warranty: "6 Months",
    features: "Fast Charging",
    year: "2023",
    timeAgo: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "33% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
];

export default function TrendingProducts({
  className = "",
}: TrendingProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(sampleProducts);

  const handleFavoriteToggle = (id: string | number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all trending products clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<ProductItem>[] = [
    {
      value: "electronics",
      label: "Electronics",
      data: products.slice(0, 4),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            brand: property.brand,
            condition: property.condition,
            warranty: property.warranty,
            features: property.features,
          }}
          category="electronics"
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
      value: "gadgets",
      label: "Gadgets",
      data: products.slice(2, 6),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            brand: property.brand,
            condition: property.condition,
            warranty: property.warranty,
            features: property.features,
          }}
          category="electronics"
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
      value: "accessories",
      label: "Accessories",
      data: products.slice(0, 3),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            brand: property.brand,
            condition: property.condition,
            warranty: property.warranty,
            features: property.features,
          }}
          category="electronics"
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
      title="Trending Products"
      tabs={tabs}
      defaultTab="electronics"
      viewAllText="View all products"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
