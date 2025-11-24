"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import ListingCard from "@/components/global/listing-card";
import { ListingItem } from "@/constants/sample-listings";
import { useRouter } from "nextjs-toploader/app";

export interface ProductsGridProps {
  className?: string;
  products: ListingItem[];
  title?: string;
  showReturnButton?: boolean;
  onProductClick?: (product: ListingItem) => void;
  onFavoriteToggle?: (productId: string) => void;
  gridClassName?: string;
}

export default function ProductsGrid({
  className,
  products,
  title = "Properties for sale in UAE",
  showReturnButton = true,
  onProductClick,
  onFavoriteToggle,
  gridClassName,
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
      className={cn("w-full mx-auto py-4 h-full", className)}
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
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", gridClassName)}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="group cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <ListingCard
              id={product.id}
              images={[
                typeof product.image === "string"
                  ? product.image
                  : product.image.src,
              ]}
              title={product.title}
              location={product.location}
              price={parseFloat(product.currentPrice.replace(/,/g, ""))}
              originalPrice={
                product.originalPrice
                  ? parseFloat(product.originalPrice.replace(/,/g, ""))
                  : undefined
              }
              discount={
                product.discount
                  ? typeof product.discount === "string"
                    ? parseFloat(product.discount.replace("%", ""))
                    : product.discount
                  : undefined
              }
              specifications={{
                transmission: product.transmission,
                fuelType: product.fuelType,
                mileage: product.mileage,
                year: parseInt(product.year),
              }}
              postedTime={product.timeAgo.toString()}
              isFavorite={product.isFavorite}
              onFavorite={handleFavoriteToggle}
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
