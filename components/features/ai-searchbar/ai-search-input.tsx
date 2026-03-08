"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AISearchInputProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onSearch: () => void;
  isSearching?: boolean;
}

export function AISearchInput({
  searchQuery,
  onSearchQueryChange,
  onKeyDown,
  onReset,
  onSearch,
  isSearching,
}: AISearchInputProps) {
  return (
    <motion.div
      key="ai"
      layout
      className="flex items-center flex-1 gap-2"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 6 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <div className="relative w-full flex items-center bg-transparent border border-gray-700/50 rounded-lg">
        <Input
          leftIcon={<SearchIcon className="size-4 text-gray-400" />}
          type="text"
          placeholder="Type or select by suggestions"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="pl-9 pr-4 flex-1 w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 border-0 h-10 rounded-lg"
        />
      </div>
      <button
        onClick={() => !isSearching && onSearch()}
        disabled={isSearching}
        className="flex shrink-0 items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-wait text-white font-medium text-xs px-4 h-10 rounded-lg transition-colors shadow-sm"
      >
        <Image
          src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-purple-bg.svg"
          width={16}
          height={16}
          alt="AI"
          className={cn("brightness-0 invert", isSearching && "animate-spin")}
        />
        {isSearching ? "Searching" : "Search"}
      </button>
    </motion.div>
  );
}
