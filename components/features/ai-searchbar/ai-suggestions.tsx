"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS, suggestions } from "./constants";

interface AISuggestionsProps {
  isAI: boolean;
  onSuggestionClick: (label: string) => void;
}

export function AISuggestions({
  isAI,
  onSuggestionClick,
}: AISuggestionsProps) {
  return (
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
                className="rounded-full px-3 py-1.5 text-xs bg-white/10 text-white/90 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
                onClick={() => onSuggestionClick(label)}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


