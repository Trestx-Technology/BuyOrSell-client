"use client";

import { useState } from "react";
import { ListingCard } from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for the car listings
interface CarItem {
  id: string;
  image: string;
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

// Sample car data with Unsplash images
const sampleCars: CarItem[] = [
  {
    id: "0",
    title: "BMW 5 Series 2023",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
    title: "Mercedes C-Class 2023",
    image:
      "https://images.unsplash.com/photo-1615141850218-9163d187fbda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Business Bay, Dubai",
    currentPrice: "95,000",
    originalPrice: "110,000",
    discount: "14%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "28,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    isFavorite: false,
    discountText: "14% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "2",
    title: "Audi A6 2023",
    image:
      "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Business Bay, Dubai",
    currentPrice: "115,000",
    originalPrice: "135,000",
    discount: "15%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "32,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "15% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "3",
    title: "BMW X5 2023",
    image:
      "https://images.unsplash.com/photo-1602033960063-5b06d6edfcd3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Business Bay, Dubai",
    currentPrice: "145,000",
    originalPrice: "165,000",
    discount: "12%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "25,000 KM",
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
    title: "Mercedes GLE 2023",
    image:
      "https://images.unsplash.com/photo-1574023196529-c31cab2cbba3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Business Bay, Dubai",
    currentPrice: "155,000",
    originalPrice: "175,000",
    discount: "11%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "22,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "11% OFF",
    discountBadgeBg: "bg-[#37E7B6]",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "5",
    title: "Audi Q7 2023",
    image:
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Business Bay, Dubai",
    currentPrice: "135,000",
    originalPrice: "155,000",
    discount: "13%",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileage: "30,000 KM",
    year: "2023",
    timeAgo: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isFavorite: false,
    discountText: "13% OFF",
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
