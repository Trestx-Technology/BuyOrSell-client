"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for job items - matching ListingCardProps
interface JobItem {
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

interface PopularJobsProps {
  className?: string;
}

// Sample job data with Unsplash images
const sampleJobs: JobItem[] = [
  {
    id: "j1",
    title: "Senior Software Engineer",
    price: 25000,
    originalPrice: 35000,
    discount: 29,
    location: "Dubai Tech Hub",
    images: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "TechCorp Dubai",
      fuelType: "Full-time",
      mileage: "React, TypeScript, Node.js",
      year: 2024,
    },
    postedTime: "2 hours ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "j2",
    title: "UX/UI Designer",
    price: 18000,
    originalPrice: 25000,
    discount: 28,
    location: "Dubai Design District",
    images: [
      "https://plus.unsplash.com/premium_photo-1673830185552-45cd9d2fba48?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Creative Studio Dubai",
      fuelType: "Full-time",
      mileage: "Figma, Adobe Suite, Prototyping",
      year: 2024,
    },
    postedTime: "4 hours ago",
    views: 67,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "j3",
    title: "Financial Analyst",
    price: 22000,
    originalPrice: 30000,
    discount: 27,
    location: "Dubai Financial District",
    images: [
      "https://images.unsplash.com/photo-1528953030358-b0c7de371f1f?q=80&w=651&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Dubai Finance Corp",
      fuelType: "Full-time",
      mileage: "Excel, SQL, CFA, Financial Modeling",
      year: 2024,
    },
    postedTime: "6 hours ago",
    views: 89,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "j4",
    title: "Marketing Manager",
    price: 20000,
    originalPrice: 28000,
    discount: 29,
    location: "Dubai Media City",
    images: [
      "https://images.unsplash.com/photo-1597058557804-95ac4ee36e66?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Dubai Marketing Solutions",
      fuelType: "Full-time",
      mileage: "Digital Marketing, Analytics, Strategy",
      year: 2024,
    },
    postedTime: "8 hours ago",
    views: 112,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "j5",
    title: "Project Manager",
    price: 28000,
    originalPrice: 38000,
    discount: 26,
    location: "Dubai Business Bay",
    images: [
      "https://plus.unsplash.com/premium_photo-1671808063645-390742d75983?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Dubai Project Solutions",
      fuelType: "Full-time",
      mileage: "PMP, Agile, Stakeholder Management",
      year: 2024,
    },
    postedTime: "10 hours ago",
    views: 78,
    isPremium: true,
    isFavorite: false,
  },
  {
    id: "j6",
    title: "Data Scientist",
    price: 32000,
    originalPrice: 42000,
    discount: 24,
    location: "Dubai Tech Hub",
    images: [
      "https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "DataTech Solutions",
      fuelType: "Full-time",
      mileage: "Python, ML, Statistics, SQL",
      year: 2024,
    },
    postedTime: "12 hours ago",
    views: 134,
    isPremium: true,
    isFavorite: false,
  },
];

export default function PopularJobs({ className = "" }: PopularJobsProps) {
  const [jobs, setJobs] = useState<JobItem[]>(sampleJobs);

  const handleFavoriteToggle = (id: string | number) => {
    setJobs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all popular jobs clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<JobItem>[] = [
    {
      value: "tech",
      label: "Technology",
      data: jobs.slice(0, 6),
      renderCard: (job) => (
        <ListingCard
          {...job}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "finance",
      label: "Finance",
      data: jobs.slice(2, 5),
      renderCard: (job) => (
        <ListingCard
          {...job}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "creative",
      label: "Creative",
      data: jobs.slice(1, 4),
      renderCard: (job) => (
        <ListingCard
          {...job}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
  ];

  return (
    <TabbedCarousel
      title="Popular Jobs"
      tabs={tabs}
      defaultTab="tech"
      viewAllText="View all jobs"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
