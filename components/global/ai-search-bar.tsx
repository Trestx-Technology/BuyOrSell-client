"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SearchIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { BorderBeam } from "../magicui/border-beam";

// Color system (exactly 4 colors total):
// 1) Primary brand: teal-400 (#2dd4bf)
// 2) Neutral: white (#ffffff)
// 3) Neutral: slate-900 (#0f172a)
// 4) Accent: purple-500 (#8b5cf6)
const COLORS = {
  teal: "#2dd4bf",
  white: "#ffffff",
  slate900: "#0f172a",
  purple: "#8b5cf6",
};

const suggestions = [
  "Motors",
  "Job",
  "Property for Rent",
  "Property for Sell",
  "Furniture",
  "Community",
  "Others",
];

export function SearchAnimated() {
  const [isAI, setIsAI] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const handleTrigger = () => setIsAI(true);
  const handleReset = () => setIsAI(false);

  // Close AI mode when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsAI(false);
      }
    };

    if (isAI) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAI]);

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative flex items-center  border border-gray-300 rounded-lg h-10 flex-1 z-100",
        !isAI && "overflow-hidden"
      )}
    >
      <motion.section
        layout
        aria-label="Search"
        className={cn(
          "w-full bg-transparent rounded-lg rounded-b-none h-full relative"
        )}
        animate={{
          backgroundColor: isAI ? COLORS.slate900 : "#F2F4F7",
          boxShadow: isAI
            ? "0 0 0 1px rgba(45,212,191,0.35), 0 16px 60px rgba(139,92,246,0.25)"
            : "0 2px 10px rgba(0,0,0,0.06)",
        }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <motion.div layout className="relative overflow-visible">
          <motion.div layout aria-live="polite">
            {/* Left: leading icon or dropdown + input label */}
            <motion.div layout className="flex items-center flex-1 h-full">
              {!isAI ? (
                // Simple input bar (light)
                <motion.div
                  key="simple"
                  layout
                  className="flex items-center flex-1 "
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <CategoryDropdown />
                  <div
                    className="hidden lg:block h-6 w-px bg-black/10"
                    aria-hidden="true"
                  />
                  <Input
                    onRightIconClick={handleTrigger}
                    leftIcon={
                      <SearchIcon className="size-5 text-gray-400 -ml-2" />
                    }
                    rightIcon={
                      <Image
                        src={
                          "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-bg-white.svg"
                        }
                        width={20}
                        height={20}
                        alt="AI Logo"
                      />
                    }
                    type="text"
                    inputSize="sm"
                    placeholder="Search any product.."
                    className="pl-8 flex-1 block w-full bg-transparent text-xs placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
                  />
                </motion.div>
              ) : (
                // AI container header (dark)
                <motion.div
                  key="ai"
                  layout
                  className="flex items-center flex-1"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 6 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <Input
                    onRightIconClick={handleReset}
                    leftIcon={
                      <SearchIcon className="size-5 text-gray-400 -ml-2" />
                    }
                    rightIcon={
                      <Image
                        src={
                          "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-purple-bg.svg"
                        }
                        width={20}
                        height={20}
                        alt="AI Logo"
                      />
                    }
                    type="text"
                    inputSize="sm"
                    placeholder="Type or select by suggestions"
                    className="pl-8 flex-1 block w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 border-0 h-full"
                  />
                </motion.div>
              )}
            </motion.div>

            <AnimatePresence>
              {isAI && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    marginTop: 16,
                  }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ type: "tween", duration: 0.35 }}
                  className={cn(
                    "top-0 left-0 w-full p-4 rounded-lg rounded-t-none relative"
                  )}
                  style={{ backgroundColor: COLORS.slate900 }}
                >
                  <motion.div
                    className="flex flex-wrap gap-2 rounded-lg"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {
                        transition: {
                          staggerChildren: 0.05,
                          staggerDirection: -1,
                        },
                      },
                      visible: { transition: { staggerChildren: 0.2 } },
                    }}
                  >
                    {suggestions.map((label) => (
                      <motion.button
                        key={label}
                        type="button"
                        className="rounded-full px-3 py-1.5 text-sm bg-white/10 text-white/90 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                        style={{ borderColor: COLORS.teal }}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 6 },
                          visible: { opacity: 1, scale: 1, y: 0 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 22,
                        }}
                        onClick={() =>
                          console.log("[v0] suggestion selected:", label)
                        }
                      >
                        {label}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {isAI && (
              <BorderBeam
                colorTo="#36E8B8"
                colorFrom="#8B31E1"
                borderWidth={2}
                duration={5}
                size={100}
              />
            )}
          </motion.div>

          {/* Suggestions reveal with stagger when AI mode is active */}
        </motion.div>
      </motion.section>
    </div>
  );
}

export const CategoryDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          icon={<ChevronDown className="-ml-3" />}
          iconPosition="right"
          className="px-2 text-xs text-gray-600 hover:text-purple transition-colors h-full  border-[#929292] rounded-none hover:bg-transparent data-[state=open]:text-purple lg:flex hidden"
        >
          All Categories
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 z-[60]" align="start">
        <DropdownMenuItem>Electronics</DropdownMenuItem>
        <DropdownMenuItem>Vehicles</DropdownMenuItem>
        <DropdownMenuItem>Property</DropdownMenuItem>
        <DropdownMenuItem>Fashion</DropdownMenuItem>
        <DropdownMenuItem>Home & Garden</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
