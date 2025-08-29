"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Typography } from "@/components/typography";
import { ListingCard } from "@/components/global/listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardStagger = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// Types for the deals - using ListingCard interface
interface DealItem {
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

interface HostDealsProps {
  className?: string;
}

// Sample deals data - adapted for ListingCard
const sampleDeals: DealItem[] = [
  {
    id: "1",
    title: "MacBook Pro M2 2022",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Ras Al Khaimah",
    currentPrice: "95,000",
    originalPrice: "95,000",
    discount: "10%",
    transmission: " Apple M2",
    fuelType: "RAM 16GB",
    mileage: "16GB",
    year: "2022",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
    isFavorite: false,
    discountText: "Top Discount of the Sale",
    discountBadgeBg: "bg-white text-black",
    discountBadgeTextColor: "text-black",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "2",
    title: "MacBook Pro M2 2022",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Ras Al Khaimah",
    currentPrice: "95,000",
    originalPrice: "95,000",
    discount: "10%",
    transmission: " Apple M2",
    fuelType: "RAM 16GB",
    mileage: "16GB",
    year: "2022",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-white text-black",
    discountBadgeTextColor: "text-black",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "3",
    title: "MacBook Pro M2 2022",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Ras Al Khaimah",
    currentPrice: "95,000",
    originalPrice: "95,000",
    discount: "10%",
    transmission: " Apple M2",
    fuelType: "RAM 16GB",
    mileage: "16GB",
    year: "2022",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 15 * 60 * 60 * 1000), // 15 hours from now
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-white text-black",
    discountBadgeTextColor: "text-black",
    timerBg: "bg-[#4A4A4A]",
    timerTextColor: "text-white",
  },
  {
    id: "4",
    title: "MacBook Pro M2 2022",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Ras Al Khaimah",
    currentPrice: "95,000",
    originalPrice: "95,000",
    discount: "10%",
    transmission: " Apple M2",
    fuelType: "RAM 16GB",
    mileage: "16GB",
    year: "2022",
    timeAgo: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
    isFavorite: false,
    discountText: "FLAT 12% OFF",
    discountBadgeBg: "bg-[#FB9800] text-white",
    discountBadgeTextColor: "text-white",
    timerBg: "bg-[#FB4918]",
    timerTextColor: "text-white",
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className={`bg-[#B7FBE9] max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto px-5">
        {/* Header with Timer */}
        <motion.div
          variants={fadeInUp}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4">
            {/* Hot Deals Title */}
            <Typography
              variant="lg-black-inter"
              className="text-lg font-medium text-dark-blue"
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
        <motion.div variants={fadeInUp} className="mb-4">
          <Tabs defaultValue="electronics" className="w-full">
            <TabsList className="flex items-center justify-start w-full bg-transparent gap-3">
              <TabsTrigger
                value="electronics"
                className="data-[state=active]:bg-purple data-[state=active]:text-white data-[state=active]:shadow-sm w-fit"
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
              <div className="flex gap-4 items-center">
                {/* Deals Carousel */}
                <div className="flex-1">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <ListingCard
                          {...deal}
                          // Map existing car fields to new specs system
                          specs={{
                            transmission: deal.transmission,
                            fuelType: deal.fuelType,
                            mileage: deal.mileage,
                            year: deal.year,
                          }}
                          category="electronics"
                          showDiscountBadge={true}
                          discountBadgeBg={deal.discountBadgeBg}
                          discountBadgeTextColor={deal.discountBadgeTextColor}
                          showTimer={true}
                          timerBg={deal.timerBg}
                          timerTextColor={deal.timerTextColor}
                          onFavoriteToggle={handleFavoriteToggle}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </CardsCarousel>
                </div>

                {/* Sponsored Banner */}
                <div className="relative w-[352px] h-[290px]     bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
              </div>
            </TabsContent>

            {/* Property Tab */}
            <TabsContent value="property" className="mt-4">
              <div className="flex gap-4">
                {/* Deals Carousel */}
                <div className="flex-1">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.slice(0, 3).map((deal, index) => (
                      <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        key={deal.id}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <ListingCard
                          {...deal}
                          showDiscountBadge={true}
                          discountBadgeBg={deal.discountBadgeBg}
                          discountBadgeTextColor={deal.discountBadgeTextColor}
                          showTimer={true}
                          timerBg={deal.timerBg}
                          timerTextColor={deal.timerTextColor}
                          onFavoriteToggle={handleFavoriteToggle}
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
              </div>
            </TabsContent>

            {/* Car Tab */}
            <TabsContent value="car" className="mt-4">
              <div className="flex gap-4">
                {/* Deals Carousel */}
                <div className="flex-1">
                  <CardsCarousel title="" showNavigation={true}>
                    {deals.slice(0, 2).map((deal, index) => (
                      <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.3 }}
                        key={deal.id}
                        className="flex-[0_0_auto] max-w-[170px] w-full"
                      >
                        <ListingCard
                          {...deal}
                          // Map existing car fields to new specs system
                          specs={{
                            transmission: deal.transmission,
                            fuelType: deal.fuelType,
                            mileage: deal.mileage,
                            year: deal.year,
                          }}
                          category="car"
                          showDiscountBadge={true}
                          discountBadgeBg={deal.discountBadgeBg}
                          discountBadgeTextColor={deal.discountBadgeTextColor}
                          showTimer={true}
                          timerBg={deal.timerBg}
                          timerTextColor={deal.timerTextColor}
                          onFavoriteToggle={handleFavoriteToggle}
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
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.section>
  );
}
