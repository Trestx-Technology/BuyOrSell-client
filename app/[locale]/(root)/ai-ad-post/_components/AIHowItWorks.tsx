"use client";

import { AlertCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLocale } from "@/hooks/useLocale";

export function AIHowItWorks() {
  const { t } = useLocale();

  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div className="absolute -top-10 sm:-top-5 right-0 sm:-right-8 rounded-full flex items-center justify-center cursor-help">
          <AlertCircle className="size-6 text-purple" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="left">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-purple-600">
            {t.aiAdPost.howAIWorks}
          </h4>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-purple-500">🤖</span>
              <span>
                <strong>{t.aiAdPost.aiGeneration}</strong>{" "}
                {t.aiAdPost.aiGenerationDesc}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">📝</span>
              <span>
                <strong>{t.aiAdPost.templates}:</strong>{" "}
                {t.aiAdPost.templatesDesc}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-500">🖼️</span>
              <span>
                <strong>{t.aiAdPost.imageAnalysis}</strong>{" "}
                {t.aiAdPost.imageAnalysisDesc}
              </span>
            </div>
          </div>
          <div className="pt-1 border-t border-gray-200">
            <p className="text-xs text-purple-600 font-medium">
              {t.aiAdPost.tryTemplates}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
