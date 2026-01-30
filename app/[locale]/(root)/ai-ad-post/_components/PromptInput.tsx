"use client";

import { Send } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface PromptInputProps {
      prompt: string;
      setPrompt: (val: string) => void;
      onSubmit: () => void;
      isGenerating: boolean;
      hasImages?: boolean;
}

export function PromptInput({
      prompt,
      setPrompt,
      onSubmit,
      isGenerating,
      hasImages,
}: PromptInputProps) {
      const { t } = useLocale();

      const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
            }
      };

      return (
            <div className="relative">
                  <div className="bg-[#2D3347] rounded-lg overflow-hidden">
                        <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              onKeyDown={handleKeyPress}
                              placeholder={t.aiAdPost.placeholder}
                              className="w-full bg-transparent text-white placeholder-[#929292] text-sm focus:outline-none resize-none min-h-[40px] max-h-[200px] p-4 pr-12 overflow-y-auto"
                              disabled={isGenerating}
                              style={{
                                    height: "auto",
                                    overflow: "auto",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#6b7280 #374151",
                              }}
                              onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto";
                                    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                              }}
                        />
                        <button
                              onClick={onSubmit}
                              disabled={(!prompt.trim() && !hasImages) || isGenerating}
                              className="absolute top-2 right-2 w-8 h-8 bg-[#667085] rounded-md flex items-center justify-center hover:bg-[#667085]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={!prompt.trim() && hasImages ? "Identify Category from Images" : "Send Description"}
                        >
                              <Send className="w-4 h-4 text-white" />
                        </button>
                  </div>

                  {/* Character Counter */}
                  <div className="flex justify-between items-center mt-2 px-1">
                        <div className="text-xs text-gray-400">
                              {prompt.length > 0 && (
                                    <span
                                          className={
                                                prompt.length > 1000 ? "text-orange-400" : "text-gray-400"
                                          }
                                    >
                                          {prompt.length}/2000 {t.aiAdPost.characters}
                                    </span>
                              )}
                        </div>
                  </div>
            </div>
      );
}
