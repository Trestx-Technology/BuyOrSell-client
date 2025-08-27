"use client";

import { useState } from "react";
import { Typography } from "@/components/typography";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Factory,
  ShoppingBag,
  Truck,
  Wrench,
  Leaf,
  Building2,
} from "lucide-react";

// Types for business items
interface BusinessItem {
  id: string;
  image: React.ReactNode;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  industry: string;
  type: string;
  revenue: string;
  employees: string;
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

interface BusinessIndustriesProps {
  className?: string;
}

// Sample business data
const sampleBusinesses: BusinessItem[] = [
  {
    id: "b1",
    title: "Tech Startup Investment",
    image: <Building2 className="w-full h-full text-blue-600" />,
    location: "Silicon Valley",
    currentPrice: "50,000",
    originalPrice: "100,000",
    discount: "50%",
    industry: "Technology",
    type: "Startup",
    revenue: "$100K-500K",
    employees: "5-10",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "50% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b2",
    title: "Manufacturing Plant",
    image: <Factory className="w-full h-full text-gray-600" />,
    location: "Industrial Zone",
    currentPrice: "250,000",
    originalPrice: "400,000",
    discount: "38%",
    industry: "Manufacturing",
    type: "Established",
    revenue: "$2M-5M",
    employees: "50-100",
    year: "2023",
    timeAgo: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "38% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b3",
    title: "Retail Franchise Opportunity",
    image: <ShoppingBag className="w-full h-full text-green-600" />,
    location: "Shopping District",
    currentPrice: "75,000",
    originalPrice: "120,000",
    discount: "38%",
    industry: "Retail",
    type: "Franchise",
    revenue: "$500K-1M",
    employees: "15-25",
    year: "2023",
    timeAgo: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "38% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b4",
    title: "Logistics Company",
    image: <Truck className="w-full h-full text-orange-600" />,
    location: "Transport Hub",
    currentPrice: "150,000",
    originalPrice: "250,000",
    discount: "40%",
    industry: "Logistics",
    type: "Established",
    revenue: "$1M-2M",
    employees: "30-50",
    year: "2023",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b5",
    title: "Service Business",
    image: <Wrench className="w-full h-full text-purple-600" />,
    location: "Business Park",
    currentPrice: "45,000",
    originalPrice: "75,000",
    discount: "40%",
    industry: "Services",
    type: "Startup",
    revenue: "$200K-500K",
    employees: "10-20",
    year: "2023",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b6",
    title: "Green Energy Project",
    image: <Leaf className="w-full h-full text-emerald-600" />,
    location: "Renewable Zone",
    currentPrice: "300,000",
    originalPrice: "500,000",
    discount: "40%",
    industry: "Energy",
    type: "Established",
    revenue: "$3M-7M",
    employees: "75-150",
    year: "2023",
    timeAgo: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "40% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
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
      data: businesses.slice(0, 4),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            industry: property.industry,
            type: property.type,
            revenue: property.revenue,
            employees: property.employees,
          }}
          category="business"
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
      value: "manufacturing",
      label: "Manufacturing",
      data: businesses.slice(1, 5),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            industry: property.industry,
            type: property.type,
            revenue: property.revenue,
            employees: property.employees,
          }}
          category="business"
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
      value: "services",
      label: "Services",
      data: businesses.slice(2, 6),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            industry: property.industry,
            type: property.type,
            revenue: property.revenue,
            employees: property.employees,
          }}
          category="business"
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
