"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Typography } from "@/components/typography";
import HotDealsListingCard from "@/components/global/hot-deals-listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { motion } from "framer-motion";

// Framer Motion animation variants - using improved patterns from AI search bar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.1,
    },
  },
};

const tabsVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.3,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.5,
    },
  },
};

// Types for the deals - using HotDealsListingCard interface
interface DealItem {
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
  // Hot deals specific props
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  showDiscountBadge?: boolean;
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  endTime?: Date;
}

interface HostDealsProps {
  className?: string;
}

// Sample deals data - adapted for ListingCard
const sampleDeals: DealItem[] = [
  {
    id: "1",
    title: "MacBook Pro M2 2022",
    price: 95000,
    originalPrice: 95000,
    discount: 10,
    location: "Ras Al Khaimah",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Apple M2",
      fuelType: "RAM 16GB",
      mileage: "16GB SSD",
      year: 2022,
    },
    postedTime: "1 hour ago",
    views: 45,
    isPremium: true,
    isFavorite: false,
    discountText: "Top Discount of the Sale",
    discountBadgeBg: "bg-white",
    discountBadgeTextColor: "text-black",
    showDiscountBadge: true,
    showTimer: true,
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
  },
  {
    id: "2",
    title: "MacBook Pro M2 2022",
    price: 95000,
    originalPrice: 95000,
    discount: 10,
    location: "Ras Al Khaimah",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Apple M2",
      fuelType: "RAM 16GB",
      mileage: "16GB SSD",
      year: 2022,
    },
    postedTime: "1 hour ago",
    views: 67,
    isPremium: true,
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-white",
    discountBadgeTextColor: "text-black",
    showDiscountBadge: true,
    showTimer: true,
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
  },
  {
    id: "3",
    title: "MacBook Pro M2 2022",
    price: 95000,
    originalPrice: 95000,
    discount: 10,
    location: "Ras Al Khaimah",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Apple M2",
      fuelType: "RAM 16GB",
      mileage: "16GB SSD",
      year: 2022,
    },
    postedTime: "1 hour ago",
    views: 89,
    isPremium: true,
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-white",
    discountBadgeTextColor: "text-black",
    showDiscountBadge: true,
    showTimer: true,
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
  },
  {
    id: "4",
    title: "MacBook Pro M2 2022",
    price: 95000,
    originalPrice: 95000,
    discount: 10,
    location: "Ras Al Khaimah",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    specifications: {
      transmission: "Apple M2",
      fuelType: "RAM 16GB",
      mileage: "16GB SSD",
      year: 2022,
    },
    postedTime: "1 hour ago",
    views: 112,
    isPremium: true,
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-[#FB9800]",
    discountBadgeTextColor: "text-white",
    showDiscountBadge: true,
    showTimer: true,
    timerBg: "bg-[#FB4918]",
    timerTextColor: "text-white",
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
  },
];

export default function HostDeals({ className = "" }: HostDealsProps) {
  const [deals, setDeals] = useState<DealItem[]>(sampleDeals);

  const handleFavoriteToggle = (id: string | number) => {
    setDeals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{
        background:
          "radial-gradient(circle, rgba(180, 207, 199, 1) 0%, rgba(132, 75, 143, 1) 100%)",
      }}
      className={`bg-[#B7FBE9] rounded-lg max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto px-5">
        {/* Header with Timer */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4">
            {/* Hot Deals Title */}
            <Typography
              variant="lg-black-inter"
              className="text-lg font-medium text-white"
            >
              Hot Deals
            </Typography>

            {/* Main Timer */}
            <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
              <Clock className="w-4 h-4 text-red-500" />
              <Typography
                variant="xs-black-inter"
                className="text-error-100 text-sm font-medium"
              >
                22h 55m 20s remaining
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          variants={tabsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-4"
        >
          <Tabs defaultValue="electronics" className="w-full">
            <TabsList className="flex items-center justify-start w-full bg-transparent gap-3">
              <TabsTrigger
                value="electronics"
                className="data-[state=active]:bg-teal data-[state=active]:text-white data-[state=active]:shadow-sm w-fit"
              >
                Electronics
              </TabsTrigger>
              <TabsTrigger
                value="property"
                className="data-[state=active]:bg-purple bg-white data-[state=active]:text-white data-[state=active]:shadow-sm w-fit"
              >
                Property
              </TabsTrigger>
              <TabsTrigger
                value="car"
                className="data-[state=active]:bg-purple bg-white data-[state=active]:text-white data-[state=active]:shadow-sm w-fit"
              >
                Car
              </TabsTrigger>
            </TabsList>

            {/* Electronics Tab */}
            <TabsContent value="electronics" className="mt-4">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-4 items-center"
              >
                {/* Deals Carousel */}
                <div className="flex-1 overflow-hidden">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          type: "spring" as const,
                          stiffness: 300,
                          damping: 22,
                          delay: 0.6 + index * 0.08, // Staggered delay for each deal
                        }}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <HotDealsListingCard
                          {...deal}
                          onFavorite={handleFavoriteToggle}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </CardsCarousel>
                </div>

                {/* Sponsored Banner */}
                <div className="hidden lg:block relative max-w-[352px] w-full h-[290px]     bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1629581678313-36cf745a9af9?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Sponsored Deal"
                    width={352}
                    height={290}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/80 rounded px-2.5 py-1">
                    <Typography
                      variant="xs-black-inter"
                      className="text-black text-sm font-medium"
                    >
                      Sponsored
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Property Tab */}
            <TabsContent value="property" className="mt-4">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-4"
              >
                {/* Deals Carousel */}
                <div className="flex-1">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.slice(0, 3).map((deal, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          type: "spring" as const,
                          stiffness: 300,
                          damping: 22,
                          delay: 0.6 + index * 0.08, // Staggered delay for each deal
                        }}
                        key={deal.id}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <HotDealsListingCard
                          {...deal}
                          onFavorite={handleFavoriteToggle}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </CardsCarousel>
                </div>

                {/* Sponsored Banner */}
                <div className="relative w-[352px] h-[290px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1629581678313-36cf745a9af9?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Sponsored Deal"
                    width={352}
                    height={290}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/80 rounded px-2.5 py-1">
                    <Typography
                      variant="xs-black-inter"
                      className="text-black font-medium"
                    >
                      Sponsored
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Car Tab */}
            <TabsContent value="car" className="mt-4">
              <motion.div
                variants={contentVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex gap-4"
              >
                {/* Deals Carousel */}
                <div className="flex-1">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.slice(0, 2).map((deal, index) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                          type: "spring" as const,
                          stiffness: 300,
                          damping: 22,
                          delay: 0.6 + index * 0.08, // Staggered delay for each deal
                        }}
                        key={deal.id}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <HotDealsListingCard
                          {...deal}
                          onFavorite={handleFavoriteToggle}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </CardsCarousel>
                </div>

                {/* Sponsored Banner */}
                <div className="relative w-[352px] h-[290px] bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1629581678313-36cf745a9af9?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Sponsored Deal"
                    width={352}
                    height={290}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-white/80 rounded px-2.5 py-1">
                    <Typography
                      variant="xs-black-inter"
                      className="text-black font-medium"
                    >
                      Sponsored
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.section>
  );
}
