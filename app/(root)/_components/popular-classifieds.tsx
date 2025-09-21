"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for classified items - matching ListingCardProps
interface ClassifiedItem {
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

interface PopularClassifiedsProps {
  className?: string;
}

// Sample classified data with Unsplash images - updated to match ListingCardProps
const sampleClassifieds: ClassifiedItem[] = [
  {
    id: "c1",
    title: "Vintage Collectible Watches",
    price: 2500,
    originalPrice: 4200,
    discount: 40,
    location: "Dubai Gold Souk",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Luxury Timepieces",
      fuelType: "Collectible",
      mileage: "Mint Condition",
      year: 2024,
    },
    postedTime: "1 hour ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "c2",
    title: "Rare First Edition Books",
    price: 1800,
    originalPrice: 3000,
    discount: 40,
    location: "Dubai Knowledge Park",
    images: [
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=763&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Classic Publishers",
      fuelType: "Literature",
      mileage: "Excellent Condition",
      year: 2024,
    },
    postedTime: "3 hours ago",
    views: 67,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "c3",
    title: "Retro Gaming Console",
    price: 450,
    originalPrice: 750,
    discount: 40,
    location: "Dubai Gaming Zone",
    images: [
      "https://images.unsplash.com/photo-1651160670627-2896ddf7822f?q=80&w=768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Retro Gaming",
      fuelType: "Console",
      mileage: "Good Condition",
      year: 2024,
    },
    postedTime: "5 hours ago",
    views: 34,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "c4",
    title: "Antique Furniture Set",
    price: 3200,
    originalPrice: 5300,
    discount: 40,
    location: "Dubai Heritage District",
    images: [
      "https://images.unsplash.com/photo-1605939471344-2edc2900ab9f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Heritage Collection",
      fuelType: "Furniture",
      mileage: "Excellent Condition",
      year: 2024,
    },
    postedTime: "7 hours ago",
    views: 89,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "c5",
    title: "Vintage Camera Collection",
    price: 1500,
    originalPrice: 2500,
    discount: 40,
    location: "Dubai Media City",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Vintage Optics",
      fuelType: "Photography",
      mileage: "Good Condition",
      year: 2024,
    },
    postedTime: "9 hours ago",
    views: 56,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "c6",
    title: "Collectible Art Prints",
    price: 800,
    originalPrice: 1300,
    discount: 38,
    location: "Dubai Art District",
    images: [
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=669&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Art Gallery",
      fuelType: "Artwork",
      mileage: "Mint Condition",
      year: 2024,
    },
    postedTime: "11 hours ago",
    views: 78,
    isPremium: true,
    isFavorite: false,
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
      renderCard: (classified) => (
        <ListingCard
          {...classified}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "antiques",
      label: "Antiques",
      data: classifieds.slice(2, 6),
      renderCard: (classified) => (
        <ListingCard
          {...classified}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "hobbies",
      label: "Hobbies",
      data: classifieds.slice(0, 3),
      renderCard: (classified) => (
        <ListingCard
          {...classified}
          onFavorite={handleFavoriteToggle}
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
