"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface AISearchInputProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export function AISearchInput({
  searchQuery,
  onSearchQueryChange,
  onKeyDown,
  onReset,
}: AISearchInputProps) {
  return (
    <motion.div
      key="ai"
      layout
      className="flex items-center flex-1"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 6 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <Input
        onRightIconClick={onReset}
        leftIcon={<SearchIcon className="size-5 text-gray-400 -ml-2" />}
        rightIcon={
          <Image
            src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-purple-bg.svg"
            width={20}
            height={20}
            alt="AI Logo"
          />
        }
        type="text"
        inputSize="sm"
        placeholder="Type or select by suggestions"
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="pl-8 flex-1 block w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-0 border-0 h-full"
      />
    </motion.div>
  );
}


