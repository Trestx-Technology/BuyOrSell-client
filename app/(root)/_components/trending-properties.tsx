"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for the property listings - matching ListingCardProps
interface PropertyItem {
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

interface TrendingPropertiesProps {
  className?: string;
}

// Sample property data with Unsplash images
const sampleProperties: PropertyItem[] = [
  {
    id: "0",
    title: "Modern Villa in Palm Jumeirah",
    price: 2450000,
    originalPrice: 2800000,
    discount: 12,
    location: "Palm Jumeirah, Dubai",
    images: [
      "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "4 Bedrooms",
      fuelType: "5 Bathrooms",
      mileage: "3,200 sq ft",
      year: 2023,
    },
    postedTime: "3 hours ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "1",
    title: "Luxury Apartment Downtown",
    price: 1850000,
    originalPrice: 2100000,
    discount: 12,
    location: "Downtown Dubai",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "3 Bedrooms",
      fuelType: "3 Bathrooms",
      mileage: "2,100 sq ft",
      year: 2023,
    },
    postedTime: "4 hours ago",
    views: 67,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "2",
    title: "Beachfront Penthouse",
    price: 3200000,
    originalPrice: 3600000,
    discount: 11,
    location: "JBR, Dubai",
    images: [
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "4 Bedrooms",
      fuelType: "4 Bathrooms",
      mileage: "3,800 sq ft",
      year: 2023,
    },
    postedTime: "5 hours ago",
    views: 89,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "3",
    title: "Garden Villa Emirates Hills",
    price: 4100000,
    originalPrice: 4500000,
    discount: 9,
    location: "Emirates Hills, Dubai",
    images: [
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "5 Bedrooms",
      fuelType: "6 Bathrooms",
      mileage: "4,500 sq ft",
      year: 2023,
    },
    postedTime: "6 hours ago",
    views: 112,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "4",
    title: "Modern Townhouse",
    price: 1950000,
    originalPrice: 2200000,
    discount: 11,
    location: "Dubai Hills Estate",
    images: [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "4 Bedrooms",
      fuelType: "4 Bathrooms",
      mileage: "2,800 sq ft",
      year: 2023,
    },
    postedTime: "7 hours ago",
    views: 78,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "5",
    title: "Luxury Apartment Marina",
    price: 2300000,
    originalPrice: 2600000,
    discount: 12,
    location: "Dubai Marina",
    images: [
      "https://images.unsplash.com/photo-1565953522043-baea26b83b7e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "3 Bedrooms",
      fuelType: "3 Bathrooms",
      mileage: "2,400 sq ft",
      year: 2023,
    },
    postedTime: "8 hours ago",
    views: 134,
    isPremium: true,
    isFavorite: false,
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
          onFavorite={handleFavoriteToggle}
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
          onFavorite={handleFavoriteToggle}
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
          onFavorite={handleFavoriteToggle}
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
          onFavorite={handleFavoriteToggle}
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
