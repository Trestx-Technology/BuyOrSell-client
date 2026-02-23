"use client";

import React from "react";
import Image from "next/image";
import { useAITokenBalance } from "@/hooks/useAITokens";
import { ICONS } from "@/constants/icons";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AITokenBalanceProps {
  className?: string;
  showText?: boolean;
}

export const AITokenBalance: React.FC<AITokenBalanceProps> = ({ 
  className,
  showText = true 
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: balanceData, isLoading, error } = useAITokenBalance();

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800", className)}>
        <Skeleton className="size-5 rounded-full" />
        {showText && <Skeleton className="h-4 w-12" />}
      </div>
    );
  }

  if (error) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            href="/ai-tokens"
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors group",
              className
            )}
          >
            <Image 
              src={ICONS.ai.aiPurpleBg} 
              alt="AI Tokens" 
              width={20} 
              height={20}
              className="group-hover:scale-110 transition-transform"
            />
            {showText && (
              <span className="text-sm font-bold text-purple dark:text-purple-400 whitespace-nowrap">
                {balanceData?.data.tokensRemaining?.toLocaleString() || 0}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p className="text-xs font-medium">AI Token Balance</p>
          <p className="text-[10px] text-gray-500">Click to top up</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
