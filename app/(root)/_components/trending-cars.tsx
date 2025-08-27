"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import car1 from "@/public/cars/car1.jpg";
import car2 from "@/public/cars/car2.jpg";
import car3 from "@/public/cars/car3.jpg";
import car4 from "@/public/cars/car4.jpg";
import car5 from "@/public/cars/car1.jpg";
import car6 from "@/public/cars/car2.jpg";

// Types for the car listings
interface CarItem {
  id: string;
  image: string | StaticImageData;
  title: string;
  location: string;
  currentPrice: string;
  originalPrice: string;
  discount: string;
  transmission: string;
  fuelType: string;
  mileage: string;
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

interface TrendingCarsProps {
  className?: string;
}

// Sample car data
const sampleCars: CarItem[] = [
  {
    id: "0",
    title: "BMW 5 Series 2023",
    image: car1,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "1",
    title: "BMW 5 Series 2023",
    image: car1,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "2",
    title: "BMW 5 Series 2023",
    image: car2,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "3",
    title: "BMW 5 Series 2023",
    image: car3,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "4",
    title: "BMW 5 Series 2023",
    image: car4,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "5",
    title: "BMW 5 Series 2023",
    image: car5,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "6",
    title: "BMW 5 Series 2023",
    image: car6,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "6",
    title: "BMW 5 Series 2023",
    image: car6,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "6",
    title: "BMW 5 Series 2023",
    image: car6,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "6",
    title: "BMW 5 Series 2023",
    image: car6,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "6",
    title: "BMW 5 Series 2023",
    image: car6,
    location: "Business Bay, Dubai",
    currentPrice: "105,452",
    originalPrice: "125,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "35,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "12% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
];

export default function TrendingCars({ className = "" }: TrendingCarsProps) {
  const [cars, setCars] = useState<CarItem[]>(sampleCars);

  const handleFavoriteToggle = (id: string | number) => {
    setCars((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    // Handle view all action
    console.log("View all trending cars clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
    // You can handle additional logic here when tabs change
  };

  // Define tabs with data and render functions
  const tabs: TabItem<CarItem>[] = [
    {
      value: "cars",
      label: "Cars",
      data: cars,
      renderCard: (car) => (
        <ListingCard
          {...car}
          specs={{
            transmission: car.transmission,
            fuelType: car.fuelType,
            mileage: car.mileage,
            year: car.year,
          }}
          category="car"
          showDiscountBadge={false}
          discountBadgeBg={car.discountBadgeBg}
          discountBadgeTextColor={car.discountBadgeTextColor}
          showTimer={false}
          timerBg={car.timerBg}
          timerTextColor={car.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "rental-cars",
      label: "Rental Cars New",
      data: cars.slice(0, 4),
      renderCard: (car) => (
        <ListingCard
          {...car}
          specs={{
            transmission: car.transmission,
            fuelType: car.fuelType,
            mileage: car.mileage,
            year: car.year,
          }}
          category="car"
          showDiscountBadge={false}
          discountBadgeBg={car.discountBadgeBg}
          discountBadgeTextColor={car.discountBadgeTextColor}
          showTimer={false}
          timerBg={car.timerBg}
          timerTextColor={car.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "new-cars",
      label: "New Cars",
      data: cars.slice(0, 5),
      renderCard: (car) => (
        <ListingCard
          {...car}
          specs={{
            transmission: car.transmission,
            fuelType: car.fuelType,
            mileage: car.mileage,
            year: car.year,
          }}
          category="car"
          showDiscountBadge={false}
          discountBadgeBg={car.discountBadgeBg}
          discountBadgeTextColor={car.discountBadgeTextColor}
          showTimer={false}
          timerBg={car.timerBg}
          timerTextColor={car.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "export-cars",
      label: "Export Cars",
      data: cars.slice(0, 3),
      renderCard: (car) => (
        <ListingCard
          {...car}
          specs={{
            transmission: car.transmission,
            fuelType: car.fuelType,
            mileage: car.mileage,
            year: car.year,
          }}
          category="car"
          showDiscountBadge={false}
          discountBadgeBg={car.discountBadgeBg}
          discountBadgeTextColor={car.discountBadgeTextColor}
          showTimer={false}
          timerBg={car.timerBg}
          timerTextColor={car.timerTextColor}
          onFavoriteToggle={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
  ];

  return (
    <TabbedCarousel
      title="Trending Cars"
      tabs={tabs}
      defaultTab="cars"
      viewAllText="View all"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
