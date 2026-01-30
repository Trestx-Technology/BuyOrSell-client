"use client";

import { AlertCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useLocale } from "@/hooks/useLocale";

interface TemplateListProps {
  templates: { id: string; label: string }[];
  onSelect: (id: string) => void;
}

export function TemplateList({ templates, onSelect }: TemplateListProps) {
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#1D2939]">
          {t.aiAdPost.useTemplates}
        </h3>
        <HoverCard openDelay={100} closeDelay={50}>
          <HoverCardTrigger asChild>
            <div className="cursor-help">
              <AlertCircle className="w-4 h-4 text-gray-400 hover:text-purple-500 transition-colors" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-72" side="top">
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-purple-600">
                {t.aiAdPost.templates}
              </h4>
              <p className="text-xs text-gray-600">
                {t.aiAdPost.templatesDescription}
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>
                    <strong>{t.aiAdPost.templateLabels.cars}:</strong>{" "}
                    {t.aiAdPost.templateHints.cars}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>
                    <strong>{t.aiAdPost.templateLabels.sellProperty}:</strong>{" "}
                    {t.aiAdPost.templateHints.property}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>
                    <strong>{t.aiAdPost.templateLabels.sellLaptop}:</strong>{" "}
                    {t.aiAdPost.templateHints.electronics}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                  <span>
                    <strong>{t.aiAdPost.templateLabels.moreExamples}:</strong>{" "}
                    {t.aiAdPost.templateHints.more}
                  </span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <HoverCard key={template.id} openDelay={50} closeDelay={25}>
            <HoverCardTrigger asChild>
              <button
                onClick={() => onSelect(template.id)}
                className="px-3 py-1 bg-[#1C1F28] text-white text-xs rounded-full hover:bg-[#1C1F28]/80 transition-colors cursor-pointer"
              >
                {template.label}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64" side="top">
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold">{template.label}</h4>
                <p className="text-xs text-muted-foreground">
                  {template.id === "cars" && t.aiAdPost.templateDescriptions.cars}
                  {template.id === "sell-property" && t.aiAdPost.templateDescriptions.sellProperty}
                  {template.id === "sell-laptop" && t.aiAdPost.templateDescriptions.sellLaptop}
                  {template.id === "more-examples" && t.aiAdPost.templateDescriptions.moreExamples}
                </p>
                <div className="text-xs text-[#8B31E1] font-medium">
                  {t.aiAdPost.clickToApply}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
