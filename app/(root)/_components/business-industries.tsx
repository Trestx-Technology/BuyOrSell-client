"use client";

import { useState } from "react";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import ListingCard from "@/components/global/listing-card";

// Types for business items - matching ListingCardProps
interface BusinessItem {
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

interface BusinessIndustriesProps {
  className?: string;
}

// Sample business data with Unsplash images - updated to match ListingCardProps
const sampleBusinesses: BusinessItem[] = [
  {
    id: "b1",
    title: "Tech Startup Investment",
    price: 500000,
    originalPrice: 1000000,
    discount: 50,
    location: "Dubai Internet City",
    images: [
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Technology",
      fuelType: "Startup",
      mileage: "$100K-500K",
      year: 2024,
    },
    postedTime: "2 hours ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "b2",
    title: "Manufacturing Plant",
    price: 2500000,
    originalPrice: 4000000,
    discount: 38,
    location: "Dubai Industrial City",
    images: [
      "https://plus.unsplash.com/premium_photo-1682144832625-6a9d99ec0244?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Manufacturing",
      fuelType: "Established",
      mileage: "$2M-5M",
      year: 2024,
    },
    postedTime: "4 hours ago",
    views: 67,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "b3",
    title: "Retail Franchise Opportunity",
    price: 750000,
    originalPrice: 1200000,
    discount: 38,
    location: "Dubai Mall District",
    images: [
      "https://images.unsplash.com/photo-1575516478880-7dfb1a114073?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Retail",
      fuelType: "Franchise",
      mileage: "$500K-1M",
      year: 2024,
    },
    postedTime: "6 hours ago",
    views: 34,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "b4",
    title: "Logistics Company",
    price: 1800000,
    originalPrice: 2800000,
    discount: 36,
    location: "Dubai Logistics District",
    images: [
      "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Logistics",
      fuelType: "Established",
      mileage: "$1M-3M",
      year: 2024,
    },
    postedTime: "8 hours ago",
    views: 89,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "b5",
    title: "Consulting Firm",
    price: 300000,
    originalPrice: 500000,
    discount: 40,
    location: "Dubai Business Bay",
    images: [
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Consulting",
      fuelType: "Professional Services",
      mileage: "$200K-800K",
      year: 2024,
    },
    postedTime: "10 hours ago",
    views: 56,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "b6",
    title: "Healthcare Facility",
    price: 800000,
    originalPrice: 1500000,
    discount: 47,
    location: "Dubai Healthcare District",
    images: [
      "https://images.unsplash.com/photo-1574757974346-45bae947d89a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Healthcare",
      fuelType: "Medical Facility",
      mileage: "$800K-2M",
      year: 2024,
    },
    postedTime: "12 hours ago",
    views: 78,
    isPremium: true,
    isFavorite: false,
  },
];

export default function BusinessIndustries({
  className = "",
}: BusinessIndustriesProps) {
  const [businesses, setBusinesses] =
    useState<BusinessItem[]>(sampleBusinesses);

  const handleFavoriteToggle = (id: string | number) => {
    setBusinesses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all business opportunities clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<BusinessItem>[] = [
    {
      value: "technology",
      label: "Technology",
      data: businesses.slice(0, 6),
      renderCard: (business) => (
        <ListingCard
          {...business}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "manufacturing",
      label: "Manufacturing",
      data: businesses.slice(1, 5),
      renderCard: (business) => (
        <ListingCard
          {...business}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "services",
      label: "Services",
      data: businesses.slice(2, 6),
      renderCard: (business) => (
        <ListingCard
          {...business}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
  ];

  return (
    <TabbedCarousel
      title="Business & Industries"
      tabs={tabs}
      defaultTab="technology"
      viewAllText="View all opportunities"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
