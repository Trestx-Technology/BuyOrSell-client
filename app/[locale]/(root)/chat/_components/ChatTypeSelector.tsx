"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ChatType = "ad" | "dm" | "organisation";

interface ChatTypeSelectorProps {
  value: ChatType;
  onChange: (value: ChatType) => void;
}

export function ChatTypeSelector({ value, onChange }: ChatTypeSelectorProps) {
  return (
    <Tabs value={value} onValueChange={(value) => onChange(value as ChatType)} className="w-full">
      <TabsList className="w-full grid grid-cols-3 h-10 gap-2 bg-gray-100 p-1 bg-purple">
        <TabsTrigger
          value="ad"
          className="flex-1 text-xs sm:text-sm"
        >
          Ad
        </TabsTrigger>
        <TabsTrigger
          value="dm"
          className="flex-1 text-xs sm:text-sm "
        >
          DM
        </TabsTrigger>
        <TabsTrigger
          value="organisation"
          className="flex-1 text-xs sm:text-sm "
        >
          Organisation
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

