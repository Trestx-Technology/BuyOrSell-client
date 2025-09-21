"use client";

import { useState } from "react";
import ListingCard from "@/components/global/listing-card";
import TabbedCarousel, { TabItem } from "@/components/global/tabbed-carousel";

// Types for product items - matching ListingCardProps
interface ProductItem {
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

interface TrendingProductsProps {
  className?: string;
}

// Sample product data with Unsplash images
const sampleProducts: ProductItem[] = [
  {
    id: "p1",
    title: "Wireless Bluetooth Headphones",
    price: 89,
    originalPrice: 129,
    discount: 31,
    location: "Tech District",
    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Premium Audio",
      fuelType: "New Condition",
      mileage: "2 Years Warranty",
      year: 2023,
    },
    postedTime: "1 hour ago",
    views: 45,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "p2",
    title: "Smart Fitness Watch",
    price: 199,
    originalPrice: 299,
    discount: 33,
    location: "Fitness Center",
    images: [
      "https://images.unsplash.com/photo-1651954376743-c47e75c74186?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "FitTech",
      fuelType: "Like New",
      mileage: "1 Year Warranty",
      year: 2023,
    },
    postedTime: "3 hours ago",
    views: 67,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "p3",
    title: "Portable Power Bank",
    price: 45,
    originalPrice: 65,
    discount: 31,
    location: "Mall Area",
    images: [
      "https://images.unsplash.com/photo-1560369457-fb1181a7ac4c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "PowerMax",
      fuelType: "Excellent",
      mileage: "6 Months Warranty",
      year: 2023,
    },
    postedTime: "5 hours ago",
    views: 34,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "p4",
    title: "Gaming Mouse",
    price: 75,
    originalPrice: 99,
    discount: 24,
    location: "Gaming Zone",
    images: [
      "https://images.unsplash.com/photo-1555864326-5cf22ef123cf?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "GameMaster",
      fuelType: "Good",
      mileage: "1 Year Warranty",
      year: 2022,
    },
    postedTime: "7 hours ago",
    views: 89,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "p5",
    title: "USB-C Hub",
    price: 35,
    originalPrice: 55,
    discount: 36,
    location: "Office Complex",
    images: [
      "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "ConnectPro",
      fuelType: "New",
      mileage: "1 Year Warranty",
      year: 2023,
    },
    postedTime: "9 hours ago",
    views: 56,
    isPremium: false,
    isFavorite: false,
  },
  {
    id: "p6",
    title: "Wireless Charger",
    price: 28,
    originalPrice: 42,
    discount: 33,
    location: "Electronics Store",
    images: [
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "ChargeTech",
      fuelType: "Excellent",
      mileage: "6 Months Warranty",
      year: 2023,
    },
    postedTime: "11 hours ago",
    views: 78,
    isPremium: false,
    isFavorite: false,
  },
];

export default function TrendingProducts({
  className = "",
}: TrendingProductsProps) {
  const [products, setProducts] = useState<ProductItem[]>(sampleProducts);

  const handleFavoriteToggle = (id: string | number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleViewAll = () => {
    console.log("View all trending products clicked");
  };

  const handleTabChange = (tabValue: string) => {
    console.log("Tab changed to:", tabValue);
  };

  // Define tabs with data and render functions
  const tabs: TabItem<ProductItem>[] = [
    {
      value: "electronics",
      label: "Electronics",
      data: products.slice(0, 6),
      renderCard: (product) => (
        <ListingCard
          {...product}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "gadgets",
      label: "Gadgets",
      data: products.slice(2, 6),
      renderCard: (product) => (
        <ListingCard
          {...product}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
    {
      value: "accessories",
      label: "Accessories",
      data: products.slice(0, 3),
      renderCard: (product) => (
        <ListingCard
          {...product}
          onFavorite={handleFavoriteToggle}
          className="w-full"
        />
      ),
    },
  ];

  return (
    <TabbedCarousel
      title="Trending Products"
      tabs={tabs}
      defaultTab="electronics"
      viewAllText="View all products"
      onViewAll={handleViewAll}
      onTabChange={handleTabChange}
      className={className}
      showViewAll={true}
      showNavigation={true}
    />
  );
}
