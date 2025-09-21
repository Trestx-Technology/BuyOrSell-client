"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for furniture items - matching ListingCardProps
interface FurnitureItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: string;
  images: string[];
  specifications: {
    transmission?: string;
    fuelType?: string;
    mileage?: string;
    year?: number;
  };
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
  showSeller?: boolean;
  showSocials?: boolean;
}

interface TrendingFurnitureProps {
  className?: string;
}

// Sample furniture data with Unsplash images
const sampleFurniture: FurnitureItem[] = [
  {
    id: "f1",
    title: "Modern Leather Sofa Set",
    price: 1200,
    originalPrice: 1800,
    discount: 33,
    location: "Downtown",
    images: [
      "https://plus.unsplash.com/premium_photo-1670076513880-f58e3c377903?q=80&w=1018&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Genuine Leather",
      fuelType: "Like New",
      mileage: "240x90x85cm",
      year: 2023,
    },
    postedTime: "2 hours ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "f2",
    title: "Vintage Dining Table",
    price: 450,
    originalPrice: 650,
    discount: 31,
    location: "Midtown",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Solid Wood",
      fuelType: "Good",
      mileage: "180x90x75cm",
      year: 2022,
    },
    postedTime: "4 hours ago",
    views: 67,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "f3",
    title: "Ergonomic Office Chair",
    price: 280,
    originalPrice: 400,
    discount: 30,
    location: "Business District",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Mesh & Steel",
      fuelType: "Excellent",
      mileage: "65x65x120cm",
      year: 2023,
    },
    postedTime: "6 hours ago",
    views: 89,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "f4",
    title: "Queen Size Bed Frame",
    price: 320,
    originalPrice: 480,
    discount: 33,
    location: "Residential Area",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Metal & Fabric",
      fuelType: "Like New",
      mileage: "160x200x120cm",
      year: 2023,
    },
    postedTime: "8 hours ago",
    views: 112,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "f5",
    title: "Bookshelf Unit",
    price: 180,
    originalPrice: 250,
    discount: 28,
    location: "University Area",
    images: [
      "https://plus.unsplash.com/premium_photo-1683121150169-4b0f6c92a3ac?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Engineered Wood",
      fuelType: "Good",
      mileage: "120x30x180cm",
      year: 2022,
    },
    postedTime: "10 hours ago",
    views: 78,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "f6",
    title: "Coffee Table Set",
    price: 220,
    originalPrice: 320,
    discount: 31,
    location: "Suburban",
    images: [
      "https://plus.unsplash.com/premium_photo-1673548917423-073963e7afc9?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Glass & Metal",
      fuelType: "Excellent",
      mileage: "120x60x45cm",
      year: 2023,
    },
    postedTime: "12 hours ago",
    views: 134,
    isPremium: false,
    isFavorite: false,
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
      data: furniture.slice(0, 6),
      renderCard: (furniture) => (
        <ListingCard
          {...furniture}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "bedroom",
      label: "Bedroom",
      data: furniture.slice(2, 6),
      renderCard: (furniture) => (
        <ListingCard
          {...furniture}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "office",
      label: "Office",
      data: furniture.slice(0, 3),
      renderCard: (furniture) => (
        <ListingCard
          {...furniture}
          onFavorite={handleFavoriteToggle}
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
