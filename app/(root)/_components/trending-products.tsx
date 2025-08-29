"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for product items
interface ProductItem {
  id: string;
  image: string;
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

// Sample product data with Unsplash images
const sampleProducts: ProductItem[] = [
  {
    id: "p1",
    title: "Wireless Bluetooth Headphones",
    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1651954376743-c47e75c74186?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1560369457-fb1181a7ac4c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1555864326-5cf22ef123cf?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    image:
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      data: products.slice(0, 6),
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
