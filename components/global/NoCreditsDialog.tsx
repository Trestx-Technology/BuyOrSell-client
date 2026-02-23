"use client";

import React from "react";
import { Sparkles, Coins, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";

interface NoCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentBalance?: number;
}

export function NoCreditsDialog({
  isOpen,
  onClose,
  requiredCredits = 0,
  currentBalance = 0,
}: NoCreditsDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const handlePurchase = () => {
    router.push(`/${locale}/ai-tokens`);
    onClose();
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ResponsiveModalContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white dark:bg-gray-950">
        <ResponsiveModalHeader className="p-6 pb-0">
          <ResponsiveModalTitle className="flex items-center gap-3 text-xl font-black text-gray-900 dark:text-white">
            <div className="size-10 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertOctagon className="size-5 text-red-600 dark:text-red-400" />
            </div>
            Insufficient Credits
          </ResponsiveModalTitle>
        </ResponsiveModalHeader>

        <div className="p-6 space-y-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/10 dark:to-red-900/5 border border-red-100 dark:border-red-900/20 p-6 overflow-hidden text-center">
            <div className="absolute -right-8 -top-8 size-32 bg-red-500/5 rounded-full blur-2xl" />
            
            <Coins className="size-12 text-red-500 mx-auto mb-4 animate-bounce" />
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              You need <span className="font-bold text-gray-900 dark:text-white">{requiredCredits} tokens</span> for this action, but you only have <span className="font-bold text-red-600">{currentBalance}</span>.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Top up your balance to continue using AI features.
            </p>
          </div>

          <div className="space-y-4">
             <div className="flex items-start gap-3">
                <div className="size-6 rounded-full bg-purple/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="size-3 text-purple" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    AI features use varying amounts of credits to ensure top-quality results tailored to your specific listing needs.
                </p>
             </div>
          </div>
        </div>

        <ResponsiveModalFooter className="p-6 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            Not Now
          </Button>
          <Button
            onClick={handlePurchase}
            className="flex-[2] h-12 rounded-2xl font-bold bg-purple hover:bg-purple/90 text-white shadow-xl shadow-purple/20 transition-all active:scale-95 group relative overflow-hidden"
            icon={
              <ShoppingCart className="size-4 group-hover:scale-110 transition-transform" />
            }
            iconPosition="center"
            size={"small"}
          >
            Buy Tokens
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

function AlertOctagon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
