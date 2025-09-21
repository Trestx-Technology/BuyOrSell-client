"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for the car listings
interface CarItem {
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

interface TrendingCarsProps {
  className?: string;
}

// Sample car data with Unsplash images
const sampleCars: CarItem[] = [
  {
    id: "0",
    title: "BMW 5 Series 2023",
    price: 105452,
    originalPrice: 125000,
    discount: 16,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "35,000 KM",
      year: 2023,
    },
    postedTime: "2 hours ago",
    views: 245,
    isPremium: true,
  },
  {
    id: "1",
    title: "Mercedes C-Class 2023",
    price: 95000,
    originalPrice: 110000,
    discount: 14,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1615141850218-9163d187fbda?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "28,000 KM",
      year: 2023,
    },
    postedTime: "4 hours ago",
    views: 189,
    isPremium: false,
  },
  {
    id: "2",
    title: "Audi A6 2023",
    price: 115000,
    originalPrice: 135000,
    discount: 15,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "32,000 KM",
      year: 2023,
    },
    postedTime: "6 hours ago",
    views: 156,
    isPremium: true,
  },
  {
    id: "3",
    title: "BMW X5 2023",
    price: 145000,
    originalPrice: 165000,
    discount: 12,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1602033960063-5b06d6edfcd3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "25,000 KM",
      year: 2023,
    },
    postedTime: "8 hours ago",
    views: 134,
    isPremium: false,
  },
  {
    id: "4",
    title: "Mercedes GLE 2023",
    price: 155000,
    originalPrice: 175000,
    discount: 11,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1574023196529-c31cab2cbba3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "22,000 KM",
      year: 2023,
    },
    postedTime: "10 hours ago",
    views: 98,
    isPremium: true,
  },
  {
    id: "5",
    title: "Audi Q7 2023",
    price: 135000,
    originalPrice: 155000,
    discount: 13,
    location: "Business Bay, Dubai",
    images: [
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1170&auto=format&fit=crop",
    ],
    specifications: {
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: "30,000 KM",
      year: 2023,
    },
    postedTime: "12 hours ago",
    views: 87,
    isPremium: false,
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
          onFavorite={handleFavoriteToggle}
          onShare={() => console.log("Share car:", car.id)}
          onClick={() => console.log("Click car:", car.id)}
          showSeller={false}
          showSocials={false}
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
          onFavorite={handleFavoriteToggle}
          onShare={() => console.log("Share car:", car.id)}
          onClick={() => console.log("Click car:", car.id)}
          showSeller={false}
          showSocials={false}
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
          onFavorite={handleFavoriteToggle}
          onShare={() => console.log("Share car:", car.id)}
          onClick={() => console.log("Click car:", car.id)}
          showSeller={false}
          showSocials={false}
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
          onFavorite={handleFavoriteToggle}
          onShare={() => console.log("Share car:", car.id)}
          onClick={() => console.log("Click car:", car.id)}
          showSeller={false}
          showSocials={false}
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
