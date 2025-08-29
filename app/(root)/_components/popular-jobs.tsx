"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for job items
interface JobItem {
  id: string;
  image: string;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  company: string;
  type: string;
  experience: string;
  skills: string;
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

interface PopularJobsProps {
  className?: string;
}

// Sample job data with Unsplash images
const sampleJobs: JobItem[] = [
  {
    id: "j1",
    title: "Senior Software Engineer",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Tech Hub",
    currentPrice: "25,000",
    originalPrice: "35,000",
    discount: "29%",
    company: "TechCorp Dubai",
    type: "Full-time",
    experience: "5+ years",
    skills: "React, TypeScript, Node.js",
    year: "2024",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    isFavorite: false,
    discountText: "29% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j2",
    title: "UX/UI Designer",
    image:
      "https://plus.unsplash.com/premium_photo-1673830185552-45cd9d2fba48?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Design District",
    currentPrice: "18,000",
    originalPrice: "25,000",
    discount: "28%",
    company: "Creative Studio Dubai",
    type: "Full-time",
    experience: "3+ years",
    skills: "Figma, Adobe Suite, Prototyping",
    year: "2024",
    timeAgo: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    endTime: new Date(Date.now() + 36 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "28% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j3",
    title: "Financial Analyst",
    image:
      "https://images.unsplash.com/photo-1528953030358-b0c7de371f1f?q=80&w=651&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Financial District",
    currentPrice: "22,000",
    originalPrice: "30,000",
    discount: "27%",
    company: "Dubai Finance Corp",
    type: "Full-time",
    experience: "4+ years",
    skills: "Excel, SQL, CFA, Financial Modeling",
    year: "2024",
    timeAgo: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "27% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j4",
    title: "Marketing Manager",
    image:
      "https://images.unsplash.com/photo-1597058557804-95ac4ee36e66?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Media City",
    currentPrice: "20,000",
    originalPrice: "28,000",
    discount: "29%",
    company: "Dubai Marketing Solutions",
    type: "Full-time",
    experience: "6+ years",
    skills: "Digital Marketing, Analytics, Strategy",
    year: "2024",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "29% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j5",
    title: "Project Manager",
    image:
      "https://plus.unsplash.com/premium_photo-1671808063645-390742d75983?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Business Bay",
    currentPrice: "28,000",
    originalPrice: "38,000",
    discount: "26%",
    company: "Dubai Project Solutions",
    type: "Full-time",
    experience: "7+ years",
    skills: "PMP, Agile, Stakeholder Management",
    year: "2024",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "26% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j6",
    title: "Software Engineer",
    image:
      "https://plus.unsplash.com/premium_photo-1678565869434-c81195861939?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai Business Bay",
    currentPrice: "28,000",
    originalPrice: "38,000",
    discount: "26%",
    company: "Dubai Project Solutions",
    type: "Full-time",
    experience: "7+ years",
    skills: "PMP, Agile, Stakeholder Management",
    year: "2024",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "26% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
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
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            company: property.company,
            type: property.type,
            experience: property.experience,
            skills: property.skills,
          }}
          category="jobs"
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
      value: "finance",
      label: "Finance",
      data: jobs.slice(2, 5),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            company: property.company,
            type: property.type,
            experience: property.experience,
            skills: property.skills,
          }}
          category="jobs"
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
      value: "creative",
      label: "Creative",
      data: jobs.slice(1, 4),
      renderCard: (property) => (
        <ListingCard
          {...property}
          specs={{
            company: property.company,
            type: property.type,
            experience: property.experience,
            skills: property.skills,
          }}
          category="jobs"
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
