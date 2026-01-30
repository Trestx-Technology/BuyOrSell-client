"use client";

import { useState } from "react";
import { Sparkles, Loader2, X, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { generateDescription } from "@/lib/ai-actions";
import { toast } from "sonner";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";

interface AIDescriptionAssistantProps {
      isOpen: boolean;
      onClose: () => void;
      onApply: (description: string) => void;
      categoryPath: string;
      currentValue: string;
}

export function AIDescriptionAssistant({
      isOpen,
      onClose,
      onApply,
      categoryPath,
      currentValue,
}: AIDescriptionAssistantProps) {
      const [prompt, setPrompt] = useState("");
      const [isGenerating, setIsGenerating] = useState(false);
      const [generatedResult, setGeneratedResult] = useState("");
      const [error, setError] = useState<string | null>(null);

      const handleGenerate = async () => {
            try {
                  setIsGenerating(true);
                  setError(null);

                  const result = await generateDescription(categoryPath, prompt, currentValue);
                  if (!result) {
                        throw new Error("No description was generated. Please try a different prompt.");
                  }

                  setGeneratedResult(result);
            } catch (err: any) {
                  const errorMessage = err.message || "Failed to generate description. Please try again.";
                  setError(errorMessage);
                  toast.error(errorMessage);
            } finally {
                  setIsGenerating(false);
            }
      };

      const handleApply = () => {
            if (generatedResult) {
                  onApply(generatedResult);
                  onClose();
            }
      };

      return (
            <ResponsiveDialogDrawer
                  open={isOpen}
                  onOpenChange={(open) => !open && onClose()}
                  dialogContentClassName="sm:max-w-[640px] bg-white rounded-xl overflow-hidden p-0 gap-0"
                  drawerContentClassName="bg-white rounded-t-2xl p-0"
            >
                  <div className="flex flex-col h-full max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-purple/5 p-6 border-b border-[#F5EBFF] shrink-0">
                              <div className="flex items-center gap-2 text-purple font-bold text-lg mb-1">
                                    <Sparkles className="size-5" />
                                    AI Description Assistant
                              </div>
                              <Typography variant="h5" className="text-gray-500 font-normal">
                                    Enhance your listing for <span className="text-purple font-medium">{categoryPath}</span>
                              </Typography>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                              <div className="space-y-3">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                                          What should the AI focus on?
                                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded">Optional</span>
                                    </label>
                                    <div className="relative group">
                                          <Input
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="Ex: Mention the warranty, include some features, or use a friendly tone..."
                                                className="pr-12 h-12 border-[#F5EBFF] focus-visible:ring-purple/20 transition-all duration-300 group-hover:border-purple/30"
                                                disabled={isGenerating}
                                                onKeyDown={(e) => {
                                                      if (e.key === "Enter" && !isGenerating) {
                                                            handleGenerate();
                                                      }
                                                }}
                                          />
                                          <Button
                                                onClick={handleGenerate}
                                                disabled={isGenerating}
                                                className="absolute right-1 top-1 h-10 w-10 p-0 bg-transparent hover:bg-purple/5 text-purple rounded-lg transition-colors"
                                                type="button"
                                          >
                                                {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                                          </Button>
                                    </div>
                              </div>

                              {error && (
                                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                          <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                                          <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                              )}

                              {(generatedResult || isGenerating) && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                          <label className="text-sm font-semibold text-gray-700">AI Suggestion</label>
                                          <div className="relative">
                                                <div className={`p-5 rounded-xl border-2 transition-all duration-300 min-h-[200px] max-h-[400px] overflow-y-auto text-sm leading-relaxed ${isGenerating ? 'border-dashed border-purple/20 bg-purple/5 opacity-60' : 'border-[#F5EBFF] bg-white text-slate-700 whitespace-pre-wrap'}`}>
                                                      {isGenerating ? (
                                                            <div className="flex flex-col items-center justify-center h-[160px] text-purple/40">
                                                                  <Loader2 className="size-8 animate-spin mb-2" />
                                                                  <p className="font-medium animate-pulse">Crafting the perfect description...</p>
                                                                  <p className="text-[10px] mt-2 opacity-50">This may take a few seconds</p>
                                                            </div>
                                                      ) : (
                                                            <div className="font-medium">
                                                                  {generatedResult}
                                                            </div>
                                                      )}
                                                </div>
                                                {generatedResult && !isGenerating && (
                                                      <Button
                                                            onClick={() => setGeneratedResult("")}
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-200 p-0 text-gray-400 hover:text-red-500 shadow-sm"
                                                      >
                                                            <X className="size-3" />
                                                      </Button>
                                                )}
                                          </div>
                                          {!isGenerating && (
                                                <p className="text-[10px] text-center text-gray-400 font-medium italic">
                                                      Tip: You can refine the prompt and generate again to get better results.
                                                </p>
                                          )}
                                    </div>
                              )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[#F5EBFF] bg-gray-50/50 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                              <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="w-full sm:w-auto hover:bg-gray-100 font-semibold"
                                    disabled={isGenerating}
                              >
                                    Cancel
                              </Button>
                              <Button
                                    onClick={handleApply}
                                    disabled={!generatedResult || isGenerating}
                                    className="w-full sm:w-auto bg-purple hover:bg-purple-dark text-white font-bold px-8 shadow-lg shadow-purple/10 transition-all active:scale-95 disabled:opacity-50"
                              >
                                    Apply Description
                              </Button>
                        </div>
                  </div>
            </ResponsiveDialogDrawer>
      );
}
