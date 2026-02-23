"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Typography } from "@/components/typography";
import { AIService } from "@/services/ai-service";
import { useAITokenBalance, useConsumeTokens } from "@/hooks/useAITokens";
import { NoCreditsDialog } from "@/components/global/NoCreditsDialog";

interface AIFeaturesPopoverProps {
  onMessageGenerated: (message: string) => void;
  currentMessage?: string;
  itemTitle?: string;
  itemPrice?: string;
}

export function AIFeaturesPopover({
  onMessageGenerated,
  currentMessage = "",
  itemTitle = "item",
  itemPrice = "",
}: AIFeaturesPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isNoCreditsOpen, setIsNoCreditsOpen] = useState(false);

  const { data: tokenBalance } = useAITokenBalance();
  const currentBalance = tokenBalance?.data?.tokensRemaining ?? 0;
  const { mutateAsync: consumeTokens } = useConsumeTokens();

  const aiFeatures = AIService.getAIFeatures();
  const CREDIT_COST = 1;

  const handleFeatureClick = async (feature: {
    id: string;
    name: string;
    action: (text: string) => Promise<string>;
  }) => {
    if (currentBalance < CREDIT_COST) {
      setIsNoCreditsOpen(true);
      setIsOpen(false);
      return;
    }

    setIsLoading(feature.id);

    try {
      let result: string;

      switch (feature.id) {
        case "proofread":
          result = await AIService.proofreadMessage(currentMessage || "Hello");
          break;
        case "inquiry":
          result = await AIService.generateInquiry(itemTitle);
          break;
        case "negotiation":
          result = await AIService.generateNegotiation(itemPrice);
          break;
        case "meeting":
          result = await AIService.generateMeetingRequest();
          break;
        case "translate":
          result = await AIService.translateMessage(currentMessage || "Hello");
          break;
        default:
          result =
            "Hi! I'm interested in your item. Could you please provide more details?";
      }

      // Consume token
      await consumeTokens({ tokens: CREDIT_COST, purpose: "help_centre_assistant" });

      onMessageGenerated(result);
      setIsOpen(false);
    } catch (error) {
      console.error(`Error with ${feature.name}:`, error);
      // Fallback message
      onMessageGenerated(
        `Hi! I'm interested in your ${itemTitle}. Could you please provide more details?`
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            disabled={isLoading !== null}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-80 p-0"
          align="end"
          side="top"
          sideOffset={8}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <Typography
                variant="2xs-regular"
                className="font-semibold text-gray-900"
              >
                AI Assistant
              </Typography>
            </div>

            <div className="space-y-1">
              {aiFeatures.map((feature) => (
                <Button
                  key={feature.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-lg transition-all"
                  onClick={() => handleFeatureClick(feature)}
                  disabled={isLoading !== null}
                >
                  <div className="flex items-start gap-2 w-full">
                    <span className="text-sm flex-shrink-0 mt-0.5">
                      {feature.icon}
                    </span>
                    <div className="flex-1 text-left min-w-0 overflow-hidden">
                      <Typography
                        variant="2xs-regular"
                        className="font-medium text-gray-900 block text-xs break-words whitespace-normal"
                      >
                        {feature.name}
                      </Typography>
                      <Typography
                        variant="2xs-regular"
                        className="text-gray-500 text-xs break-words leading-relaxed whitespace-normal"
                      >
                        {feature.description}
                      </Typography>
                    </div>
                    {isLoading === feature.id && (
                      <Loader2 className="h-3 w-3 animate-spin text-purple-600 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100">
              <Typography
                variant="2xs-regular"
                className="text-gray-400 text-center text-xs"
              >
                Powered by{" "}
                <span className="font-medium text-purple">BuyorSell</span>
              </Typography>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <NoCreditsDialog
        isOpen={isNoCreditsOpen}
        onClose={() => setIsNoCreditsOpen(false)}
        requiredCredits={CREDIT_COST}
        currentBalance={currentBalance}
      />
    </>
  );
}
