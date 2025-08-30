"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { ListingCard } from "@/components/global/listing-card";
import { ListingItem } from "@/constants/sample-listings";
import { useRouter } from "nextjs-toploader/app";

export interface ProductsGridProps {
  className?: string;
  products: ListingItem[];
  title?: string;
  showReturnButton?: boolean;
  onProductClick?: (product: ListingItem) => void;
  onFavoriteToggle?: (productId: string) => void;
}

export default function ProductsGrid({
  className,
  products,
  title = "Properties for sale in UAE",
  showReturnButton = true,
  onProductClick,
  onFavoriteToggle,
}: ProductsGridProps) {
  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
      },
    },
  };

  const handleProductClick = (product: ListingItem) => {
    onProductClick?.(product);
  };

  const handleFavoriteToggle = (productId: string | number) => {
    onFavoriteToggle?.(productId.toString());
  };

  const router = useRouter();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "w-full max-w-sm mx-auto py-4 h-full overflow-y-auto",
        className
      )}
    >
      {/* Header Section */}
      <div className="mb-2">
        {showReturnButton && (
          <motion.button
            variants={itemVariants}
            className="flex items-center gap-2 text-[#8B31E1] hover:text-[#7A2BC8] transition-colors cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-sm font-medium font-inter">
              Return to regular search
            </span>
          </motion.button>
        )}

        <div className="flex items-center justify-between mt-4">
          <motion.h1
            variants={itemVariants}
            className="text-md font-normal text-[#1D2939] font-inter"
          >
            {title}
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-[#1D2939]"
          >
            <span className="text-sm font-inter">TruCheck</span>
            <span className="text-sm font-inter">first</span>
            <span className="text-xs font-inter">TM</span>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <ListingCard
              id={product.id}
              image={product.image}
              title={product.title}
              location={product.location}
              currentPrice={product.currentPrice}
              originalPrice={product.originalPrice}
              discount={product.discount}
              specs={{
                transmission: product.transmission,
                fuelType: product.fuelType,
                mileage: product.mileage,
                year: product.year,
              }}
              category="car"
              timeAgo={product.timeAgo}
              isFavorite={product.isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
              showDiscountBadge={!!product.discount}
              discountBadgeBg="bg-[#37E7B6]"
              discountBadgeTextColor="text-white"
              discountText={product.discount}
              showTimer={!!product.endTime}
              endTime={product.endTime}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500 font-inter">No products found</p>
        </motion.div>
      )}
    </motion.div>
  );
}
