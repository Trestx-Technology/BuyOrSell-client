"use client";

import { useLocale } from "@/hooks/useLocale";

interface PromptInputProps {
      prompt: string;
      setPrompt: (val: string) => void;
      isGenerating: boolean;
      isAIGenerated?: boolean;
}

export function PromptInput({
      prompt,
      setPrompt,
      isGenerating,
      isAIGenerated,
}: PromptInputProps) {
      const { t } = useLocale();

      return (
            <div className="relative">
                  {/* Label */}
                  <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                              {isAIGenerated ? "AI-Generated Description" : "Ad Description"}
                        </span>
                        {isAIGenerated && (
                              <span className="text-[10px] font-medium text-purple bg-purple/10 px-1.5 py-0.5 rounded-full">
                                    ✨ AI
                              </span>
                        )}
                  </div>

                  <div className="bg-[#2D3347] rounded-lg overflow-hidden">
                        <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder={t.aiAdPost.placeholder}
                              className="w-full bg-transparent text-white placeholder-[#929292] text-sm focus:outline-none resize-none min-h-[60px] max-h-[200px] p-4 overflow-y-auto"
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
