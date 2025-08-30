"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";

// Import all category icons
import furnitureIcon from "@/public/category-icons/furniture.svg";
import appliancesIcon from "@/public/category-icons/appliances.svg";
import businessIcon from "@/public/category-icons/business.svg";
import communityIcon from "@/public/category-icons/community.svg";
import electronicsIcon from "@/public/category-icons/electronics.svg";
import saleIcon from "@/public/category-icons/sale.svg";
import rentIcon from "@/public/category-icons/rent.svg";
import motorsIcon from "@/public/category-icons/motors.svg";
import Link from "next/link";

const categoryData = [
  {
    id: 1,
    name: "Motors",
    icon: motorsIcon,
    description: "Vehicles & Auto Parts",
  },
  {
    id: 2,
    name: "Property for Rent",
    icon: rentIcon,
    description: "Rental Properties",
  },
  {
    id: 3,
    name: "Property for Sale",
    icon: saleIcon,
    description: "Properties for Sale",
  },
  {
    id: 4,
    name: "Electronics",
    icon: electronicsIcon,
    description: "Gadgets & Technology",
  },
  {
    id: 5,
    name: "Community",
    icon: communityIcon,
    description: "Community & Events",
  },
  {
    id: 6,
    name: "Business & Industrial",
    icon: businessIcon,
    description: "Business Services & Equipment",
  },
  {
    id: 7,
    name: "Home Appliances",
    icon: appliancesIcon,
    description: "Home & Kitchen Appliances",
  },
  {
    id: 8,
    name: "Furniture",
    icon: furnitureIcon,
    description: "Home & Office Furniture",
  },
];

const CategoriesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    align: "start",
    loop: false,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 1 }, // sm: 1 item
      "(min-width: 768px)": { slidesToScroll: 2 }, // md: 2 items
      "(min-width: 1024px)": { slidesToScroll: 3 }, // lg: 3 items
      "(min-width: 1280px)": { slidesToScroll: 4 }, // xl: 4 items
    },
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Framer Motion animation variants
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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

  // Check scroll availability
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi && canScrollPrev) emblaApi.scrollPrev();
  }, [emblaApi, canScrollPrev]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi && canScrollNext) emblaApi.scrollNext();
  }, [emblaApi, canScrollNext]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex gap-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-3 min-w-[calc(100%/4)] sm:min-w-[calc(100%/5)] md:min-w-[calc(100%/6)] lg:min-w-[calc(100%/7)] xl:min-w-[calc(100%/8)]"
        >
          <div className="rounded-full size-[60px] bg-gray-200"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="hidden sm:block w-full max-w-[1180px] mx-auto mt-5 md:mt-0 ">
      <div className="relative">
        {/* Left Navigation Arrow - Only show when can scroll prev */}
        {!isLoading && (
          <Button
            variant="filled"
            disabled={!canScrollPrev}
            className="absolute left-2 xl:left-0 top-1/2 -translate-y-1/2 z-10  rounded-full size-10 shadow-lg transition-all duration-300 hover:scale-110"
            size="icon"
            onClick={scrollPrev}
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}

        {/* Categories Container */}
        <div className="overflow-hidden py-5" ref={emblaRef}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              className="flex"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
            >
              {categoryData.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  className="flex flex-col items-center gap-3 min-w-[calc(100%/4)] sm:min-w-[calc(100%/5)] md:min-w-[calc(100%/6)] lg:min-w-[calc(100%/7)] xl:min-w-[calc(100%/7)] cursor-pointer group relative"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link
                    href={`/categories/${category.id}`}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="rounded-full flex items-center justify-center size-[60px] bg-[#FAFAFC] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 group-hover:border-purple-200 group-hover:bg-purple-50">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="size-10 transition-all duration-300 hover:scale-110"
                      />
                    </div>
                    <span className="text-sm font-medium text-grey-blue text-center transition-all duration-300 group-hover:text-purple-600 group-hover:scale-105">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right Navigation Arrow - Only show when can scroll next */}
        {!isLoading && (
          <Button
            variant="filled"
            disabled={!canScrollNext}
            className="absolute right-2 xl:right-0 top-1/2 -translate-y-1/2 z-10 rounded-full size-10 shadow-lg transition-all duration-300 hover:scale-110"
            size="icon"
            onClick={scrollNext}
          >
            <ChevronRight className="size-5" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default CategoriesCarousel;
