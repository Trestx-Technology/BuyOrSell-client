"use client";

import { useState, useMemo, useRef } from "react";
import { Smile, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
      Popover,
      PopoverContent,
      PopoverTrigger,
} from "@/components/ui/popover";
import { Typography } from "@/components/typography";
import { EMOJI_CATEGORIES } from "@/constants/emojis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EmojiPopoverProps {
      onEmojiSelect: (emoji: string) => void;
      className?: string;
}

export function EmojiPopover({ onEmojiSelect, className }: EmojiPopoverProps) {
      const [isOpen, setIsOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState("");
      const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].name);
      const scrollAreaRef = useRef<HTMLDivElement>(null);
      const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

      const filteredEmojis = useMemo(() => {
            if (!searchQuery) return EMOJI_CATEGORIES;

            return EMOJI_CATEGORIES.map((category) => ({
                  ...category,
                  emojis: category.emojis.filter((emoji) =>
                        emoji.includes(searchQuery)
                  )
            })).filter((category) => category.emojis.length > 0);
      }, [searchQuery]);

      const handleEmojiClick = (emoji: string) => {
            onEmojiSelect(emoji);
      };

      const scrollToCategory = (categoryName: string) => {
            setActiveCategory(categoryName);
            const categoryElement = categoryRefs.current[categoryName];
            if (categoryElement) {
                  categoryElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
      };

      return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                        <Button
                              variant="ghost"
                              size="sm"
                              className={cn("p-1.5 h-auto hover:bg-purple/10 dark:hover:bg-purple/20 transition-colors", className)}
                              title="Add Emoji"
                        >
                              <Smile className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-purple transition-colors" />
                        </Button>
                  </PopoverTrigger>

                  <PopoverContent
                        className="w-72 p-0 border-purple/20 dark:border-purple/30 shadow-xl overflow-hidden rounded-xl bg-white dark:bg-black"
                        align="end"
                        side="top"
                        sideOffset={12}
                  >
                        <div className="bg-white dark:bg-black">
                              {/* Header */}
                              <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                                    <Typography variant="body-small" className="font-semibold text-gray-900 dark:text-gray-100 mb-2 block">
                                          Emojis
                                    </Typography>
                                    <Input
                                          placeholder="Search emojis..."
                                          value={searchQuery}
                                          onChange={(e) => setSearchQuery(e.target.value)}
                                          inputSize="sm"
                                          leftIcon={<Search className="h-3.5 w-3.5" />}
                                          className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-purple/30 dark:focus:border-purple/40 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                              </div>

                              {/* Categories Horizontal Scroll */}
                              {!searchQuery && (
                                    <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar bg-white dark:bg-black py-1.5 px-2 gap-1">
                                          {EMOJI_CATEGORIES.map((cat) => (
                                                <button
                                                      key={cat.name}
                                                      onClick={() => scrollToCategory(cat.name)}
                                                      className={cn(
                                                            "px-2 py-1 text-[10px] whitespace-nowrap rounded-md transition-all",
                                                            activeCategory === cat.name
                                                                  ? "bg-purple text-white shadow-sm font-medium"
                                                                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                      )}
                                                >
                                                      {cat.name.split(" ")[0]}
                                                </button>
                                          ))}
                                    </div>
                              )}

                              {/* Emoji Grid */}
                              <ScrollArea className="h-64 p-2 pb-4" ref={scrollAreaRef}>
                                    {filteredEmojis.map((category) => (
                                          <div
                                                key={category.name}
                                                className="mb-4 last:mb-0"
                                                ref={(el) => { categoryRefs.current[category.name] = el; }}
                                          >
                                                <Typography variant="2xs-regular" className="text-gray-400 dark:text-gray-500 font-medium px-1 mb-1.5 sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm py-1 z-10">
                                                      {category.name}
                                                </Typography>
                                                <div className="grid grid-cols-7 gap-1">
                                                      {category.emojis.map((emoji, idx) => (
                                                            <button
                                                                  key={`${category.name}-${idx}`}
                                                                  onClick={() => handleEmojiClick(emoji)}
                                                                  className="h-8 w-8 flex items-center justify-center text-xl hover:bg-purple/5 dark:hover:bg-purple/10 hover:scale-125 rounded-md transition-all active:scale-95"
                                                            >
                                                                  {emoji}
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>
                                    ))}
                                    {filteredEmojis.length === 0 && (
                                          <div className="h-40 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                                                <span>No emojis found</span>
                                          </div>
                                    )}
                              </ScrollArea>

                              {/* Footer - Quick Picks */}
                              <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center px-3">
                                    <Typography variant="2xs-regular" className="font-medium text-gray-400 dark:text-gray-500">
                                          Recent
                                    </Typography>
                                    <div className="flex gap-1.5">
                                          {["❤️", "😂", "👍", "🔥"].map(emoji => (
                                                <button
                                                      key={emoji}
                                                      onClick={() => handleEmojiClick(emoji)}
                                                      className="hover:scale-110 transition-transform"
                                                >
                                                      {emoji}
                                                </button>
                                          ))}
                                    </div>
                              </div>
                        </div>
                  </PopoverContent>
            </Popover>
      );
}
