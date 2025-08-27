"use client";

import { useState } from "react";
import { Typography } from "@/components/typography";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Briefcase,
  Building2,
  Code,
  Palette,
  Calculator,
  Microscope,
} from "lucide-react";

// Types for job items
interface JobItem {
  id: string;
  image: React.ReactNode;
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

// Sample job data
const sampleJobs: JobItem[] = [
  {
    id: "j1",
    title: "Senior Frontend Developer",
    image: <Code className="w-full h-full text-blue-600" />,
    location: "Tech Hub",
    currentPrice: "85,000",
    originalPrice: "120,000",
    discount: "29%",
    company: "TechCorp Inc.",
    type: "Full-time",
    experience: "5+ years",
    skills: "React, TypeScript",
    year: "2023",
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
    image: <Palette className="w-full h-full text-purple-600" />,
    location: "Design District",
    currentPrice: "65,000",
    originalPrice: "90,000",
    discount: "28%",
    company: "Creative Studio",
    type: "Full-time",
    experience: "3+ years",
    skills: "Figma, Adobe Suite",
    year: "2023",
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
    image: <Calculator className="w-full h-full text-green-600" />,
    location: "Financial District",
    currentPrice: "70,000",
    originalPrice: "95,000",
    discount: "26%",
    company: "Finance Corp",
    type: "Full-time",
    experience: "4+ years",
    skills: "Excel, SQL, CFA",
    year: "2023",
    timeAgo: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "26% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j4",
    title: "Data Scientist",
    image: <Microscope className="w-full h-full text-indigo-600" />,
    location: "Research Park",
    currentPrice: "95,000",
    originalPrice: "130,000",
    discount: "27%",
    company: "DataTech Solutions",
    type: "Full-time",
    experience: "6+ years",
    skills: "Python, ML, Statistics",
    year: "2023",
    timeAgo: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    endTime: new Date(Date.now() + 60 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "27% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j5",
    title: "Marketing Manager",
    image: <Building2 className="w-full h-full text-orange-600" />,
    location: "Business Center",
    currentPrice: "60,000",
    originalPrice: "80,000",
    discount: "25%",
    company: "Marketing Pro",
    type: "Full-time",
    experience: "5+ years",
    skills: "Digital Marketing, Analytics",
    year: "2023",
    timeAgo: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    endTime: new Date(Date.now() + 84 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "25% OFF",
    discountBadgeBg: "bg-green-500",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "j6",
    title: "Project Manager",
    image: <Briefcase className="w-full h-full text-gray-600" />,
    location: "Corporate Plaza",
    currentPrice: "75,000",
    originalPrice: "100,000",
    discount: "25%",
    company: "Project Solutions",
    type: "Full-time",
    experience: "7+ years",
    skills: "PMP, Agile, Leadership",
    year: "2023",
    timeAgo: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    endTime: new Date(Date.now() + 96 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "25% OFF",
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
      data: jobs.slice(0, 4),
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
