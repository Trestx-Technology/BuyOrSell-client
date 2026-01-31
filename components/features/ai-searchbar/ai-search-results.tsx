"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS } from "./constants";
import Image from "next/image";
import { Typography } from "@/components/typography";

interface AISearchResultsProps {
  results: any[];
  onSelect: (ad: any) => void;
}

export function AISearchResults({ results, onSelect }: AISearchResultsProps) {
  if (!results || results.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="results"
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{
          opacity: 1,
          height: "auto",
          marginTop: 16,
        }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        transition={{ type: "tween", duration: 0.35 }}
        className={cn(
          "top-0 left-0 w-full p-2 rounded-lg rounded-t-none relative max-h-[300px] overflow-y-auto custom-scrollbar"
        )}
        style={{ backgroundColor: COLORS.slate900 }}
      >
        <motion.div
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {results.map((ad: any) => (
            <motion.div
              key={ad._id || ad.id}
              onClick={() => onSelect(ad)}
              className="flex items-center overflow-y-auto gap-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {/* Product Image */}
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                {ad.images && ad.images.length > 0 ? (
                  <Image
                    src={ad.images[0]}
                    alt={ad.title || "Ad Image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    No Img
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <Typography
                  variant="sm-medium"
                  className="text-white truncate"
                >
                  {ad.title}
                </Typography>
                <div className="flex items-center justify-between mt-1">
                  <Typography
                    variant="xs-regular"
                    className="text-gray-400 truncate"
                  >
                    {ad.category?.name || "Category"}
                  </Typography>
                  <Typography
                    variant="xs-bold"
                    className="text-teal-400"
                  >
                    {ad.price ? `AED ${ad.price}` : "Price N/A"}
                  </Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
