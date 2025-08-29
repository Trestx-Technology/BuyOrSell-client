"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for business items
interface BusinessItem {
  id: string;
  image: string;
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

// Sample business data with Unsplash images
const sampleBusinesses: BusinessItem[] = [
  {
    id: "b1",
    title: "Tech Startup Investment",
    image:
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Internet City",
    currentPrice: "500,000",
    originalPrice: "1,000,000",
    discount: "50%",
    industry: "Technology",
    type: "Startup",
    revenue: "$100K-500K",
    employees: "5-10",
    year: "2024",
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
    image:
      "https://plus.unsplash.com/premium_photo-1682144832625-6a9d99ec0244?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Industrial City",
    currentPrice: "2,500,000",
    originalPrice: "4,000,000",
    discount: "38%",
    industry: "Manufacturing",
    type: "Established",
    revenue: "$2M-5M",
    employees: "50-100",
    year: "2024",
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
    image:
      "https://images.unsplash.com/photo-1575516478880-7dfb1a114073?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Mall District",
    currentPrice: "750,000",
    originalPrice: "1,200,000",
    discount: "38%",
    industry: "Retail",
    type: "Franchise",
    revenue: "$500K-1M",
    employees: "15-25",
    year: "2024",
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
    image:
      "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Logistics District",
    currentPrice: "1,800,000",
    originalPrice: "2,800,000",
    discount: "36%",
    industry: "Logistics",
    type: "Established",
    revenue: "$1M-3M",
    employees: "30-60",
    year: "2024",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "36% OFF",
    discountBadgeBg: "bg-blue-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "b5",
    title: "Consulting Firm",
    image:
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Business Bay",
    currentPrice: "300,000",
    originalPrice: "500,000",
    discount: "40%",
    industry: "Consulting",
    type: "Professional Services",
    revenue: "$200K-800K",
    employees: "10-20",
    year: "2024",
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
    title: "Healthcare Facility",
    image:
      "https://images.unsplash.com/photo-1574757974346-45bae947d89a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Business Bay",
    currentPrice: "300,000",
    originalPrice: "500,000",
    discount: "40%",
    industry: "Healthcare",
    type: "Professional Services",
    revenue: "$200K-800K",
    employees: "10-20",
    year: "2024",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
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
      data: businesses.slice(0, 6),
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
