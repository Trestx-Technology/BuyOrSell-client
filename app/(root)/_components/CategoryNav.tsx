"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  Bell,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "../../../components/typography";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";

import {
  motorsData,
  propertyData,
  jobsData,
  classifiedsData,
  furnitureData,
  electronicsData,
  communityData,
  othersData,
  NavItem,
} from "@/constants/navigationData";
import Image from "next/image";
import { SearchAnimated } from "@/components/global/ai-search-bar";
import { useRouter } from "nextjs-toploader/app";

// Framer Motion animation variants - using improved patterns from AI search bar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3, // Increased delay for smoother transition after loading
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "tween" as const,
      duration: 0.35,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const subcategoryVariants = {
  hidden: { opacity: 0, x: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 20,
    },
  },
};

// Types
interface CategoryButtonProps {
  categoryType: string;
  label: string;
  isActive: boolean;
  onMouseEnter: (categoryType: string) => void;
  onMouseLeave: () => void;
}

interface CategoryDropdownProps {
  isVisible: boolean;
  onMouseLeave: () => void;
  categoryData: NavItem[];
  activeCategory: NavItem | null;
  onCategoryHover: (category: NavItem) => void;
}

interface SubcategoryPanelProps {
  subcategories: NavItem[];
  activeCategoryId: string;
}

// Reusable Components
const CategoryButton: React.FC<CategoryButtonProps> = ({
  categoryType,
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      "h-9 px-2 lg:px-5 text-xs font-regular rounded-sm text-white hover:bg-white hover:text-purple transition-colors",
      isActive && "bg-white text-purple"
    )}
    onMouseEnter={() => onMouseEnter(categoryType)}
    onMouseLeave={onMouseLeave}
  >
    {label}
  </Button>
);

const SubcategoryPanel: React.FC<SubcategoryPanelProps> = ({
  subcategories,
  activeCategoryId,
}) => (
  <div className="w-full lg:w-[400px] flex-1 bg-purple/10 overflow-y-auto">
    <div className="flex flex-col w-full">
      {subcategories.map((subcategory) => (
        <motion.div
          key={subcategory.id}
          variants={subcategoryVariants}
          className="transition-colors group"
        >
          <div className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300">
            <Typography variant="xs-bold" className="text-gray-600">
              {subcategory.name}
            </Typography>
            <div className="ml-auto group-hover:block hidden">
              <Link
                href={`/category/${activeCategoryId}`}
                className="text-purple text-xs hover:text-purple/80 flex items-center gap-1"
              >
                <Typography variant="xs-regular-inter" className="text-xs">
                  View all
                </Typography>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {subcategory.children && (
            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2 px-5 py-2.5">
              {subcategory.children.map((child) => (
                <motion.div key={child.id} variants={itemVariants}>
                  <Link
                    href={`/category/${subcategory.id}/${child.id}`}
                    className="text-sm text-grey-blue hover:text-purple hover:underline cursor-pointer transition-colors"
                  >
                    {child.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isVisible,
  onMouseLeave,
  categoryData,
  activeCategory,
  onCategoryHover,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute w-full px-4 lg:px-0 lg:w-fit lg:mt-1 top-full flex-1 z-[9999] left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-0"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onMouseLeave={onMouseLeave}
          onMouseEnter={() => {
            // Keep dropdown open when hovering over it
            // This prevents premature closing when moving from button to dropdown
          }}
        >
          <motion.div className="flex mx-auto bg-white rounded-xl rounded-tl-none w-full rounded-tr-none shadow-lg border border-gray-200 overflow-hidden max-h-[500px]">
            {/* Main Categories Panel */}
            <div className="w-60 border-r border-gray-300  overflow-y-auto">
              {categoryData
                .filter(
                  (category) =>
                    category.children && category.children.length > 0
                )
                .map((category) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    className={cn(
                      "flex items-center text-xs justify-between p-3 hover:bg-purple/10 cursor-pointer transition-colors group",
                      activeCategory?.id === category.id &&
                        "bg-purple/10 text-purple"
                    )}
                    onMouseEnter={() => onCategoryHover(category)}
                  >
                    <Typography
                      variant="xs-regular-inter"
                      className={cn(
                        "text-gray-600 group-hover:text-gray-900 text-xs",
                        activeCategory?.id === category.id &&
                          "text-purple font-semibold"
                      )}
                    >
                      {category.name}
                    </Typography>
                    {activeCategory?.id === category.id ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </motion.div>
                ))}
            </div>

            {/* Subcategories Panel */}
            {activeCategory && activeCategory.children && (
              <SubcategoryPanel
                subcategories={activeCategory.children}
                activeCategoryId={activeCategory.id}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CategoryNav: React.FC<{ className?: string }> = ({ className }) => {
  const [activeCategory, setActiveCategory] = useState<NavItem | null>(null);
  const [activeCategoryType, setActiveCategoryType] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Use the useWindowSize hook to get current window width
  const { width: windowWidth } = useWindowSize();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  // Simulate loading state for category data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show loader for 1.2s to simulate data loading and prevent laggy feel

    return () => clearTimeout(timer);
  }, []);

  // Calculate visible categories - remove "Others" if less than 870px
  const getVisibleCategoriesCount = () => {
    if (!windowWidth || windowWidth >= 870) return 8;
    return 7; // Remove "Others" category below 870px
  };

  const visibleCategories = getVisibleCategoriesCount();

  // Category data mapping
  const categoryDataMap = {
    motors: motorsData,
    property: propertyData,
    jobs: jobsData,
    classifieds: classifiedsData,
    furniture: furnitureData,
    electronics: electronicsData,
    community: communityData,
    others: othersData,
  };

  // Event handlers
  const handleCategoryHover = (category: NavItem) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    // Reset all dropdown states when leaving the entire category area
    setActiveCategory(null);
    setActiveCategoryType(null);
  };

  const handleCategoryTypeHover = (categoryType: string) => {
    setActiveCategoryType(categoryType);
    // Don't auto-select the first subcategory - let user choose
    setActiveCategory(null);
  };

  // Reset dropdown when moving away from category button
  const handleCategoryButtonLeave = () => {
    // Small delay to allow moving to dropdown
    setTimeout(() => {
      // Only reset if we're not hovering over the dropdown
      if (!activeCategoryType) {
        setActiveCategory(null);
        setActiveCategoryType(null);
      }
    }, 150);
  };

  const getCurrentCategoryData = () => {
    if (!activeCategoryType) return motorsData;
    return (
      categoryDataMap[activeCategoryType as keyof typeof categoryDataMap] ||
      motorsData
    );
  };

  // Category configurations
  const categories = [
    { type: "motors", label: "Motors" },
    { type: "property", label: "Property" },
    { type: "jobs", label: "Jobs" },
    { type: "classifieds", label: "Classifieds" },
    { type: "furniture", label: "Furniture" },
    { type: "electronics", label: "Electronics" },
    { type: "community", label: "Community" },
    { type: "others", label: "Others" },
  ];

  // Filter categories based on responsive hook
  const visibleCategoriesList = categories.slice(0, visibleCategories);

  // Loader component
  const CategoryLoader = () => (
    <div className="hidden w-full md:flex flex-1 items-center justify-between">
      {Array.from({ length: visibleCategories }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-9 w-16 bg-white/20 rounded-sm"></div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className={cn("relative md:bg-purple", className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: isLoading ? 0 : 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-[1080px] mx-auto px-4 xl:px-0">
        <nav
          className="flex items-center justify-between py-1 w-full"
          onMouseLeave={handleMouseLeave}
        >
          {/* Categories Section - Horizontal Scrollable on small screens */}
          {isLoading ? (
            <CategoryLoader />
          ) : (
            <motion.div
              className="hidden w-full md:flex flex-1 items-center justify-between"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {visibleCategoriesList.map(({ type, label }) => (
                <motion.div
                  key={type}
                  variants={itemVariants}
                  className="lg:relative"
                >
                  <CategoryButton
                    categoryType={type}
                    label={label}
                    isActive={activeCategoryType === type}
                    onMouseEnter={handleCategoryTypeHover}
                    onMouseLeave={handleCategoryButtonLeave}
                  />

                  <CategoryDropdown
                    isVisible={activeCategoryType === type}
                    onMouseLeave={handleMouseLeave}
                    categoryData={getCurrentCategoryData()}
                    activeCategory={activeCategory}
                    onCategoryHover={handleCategoryHover}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="flex md:hidden flex-1">
            <SearchAnimated />
            {/* <SearchAnimated /> */}
          </div>

          {/* Right Side Icons and Map View Button */}
          {isLoading ? (
            <div className="flex items-center justify-between gap-5 ml-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="size-8 bg-white/20 rounded-full"></div>
                </div>
              ))}
              <div className="animate-pulse">
                <div className="h-10 w-20 bg-white/20 rounded-md"></div>
              </div>
            </div>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className=" w-fit min-[1080px]:w-full min-[1080px]:flex items-center justify-between lg:gap-5 ml-2">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.1,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/mystery.svg"
                          }
                          alt="mystery"
                          className="size-6 hover:scale-110 transition-all duration-300"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mystery Search</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.15,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/help.svg"
                          }
                          alt="help"
                          className="size-6 hover:scale-110 transition-all duration-300"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>My Ads</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.2,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/chat"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/unread_chat.svg"
                          }
                          alt="unread_chat"
                          className="size-6 hover:scale-110 transition-all duration-300"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Messages</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.25,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/favorites"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Heart className="size-6 hover:scale-110 transition-all duration-300 text-white" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.3,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Bell className="size-6 hover:scale-110 transition-all duration-300 text-white" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.35,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        icon={<MapPin className="w-4 h-4 -mr-3" />}
                        iconPosition="center"
                        className=" hover:bg-white hover:text-purple py-5 md:py-4"
                        variant={isMobile ? "filled" : "outline"}
                        size={"sm"}
                        onClick={() => router.push("/map-view")}
                      >
                        Map View
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Map</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </TooltipProvider>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default CategoryNav;
