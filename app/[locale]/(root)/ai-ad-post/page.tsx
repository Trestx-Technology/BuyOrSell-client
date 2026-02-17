"use client";

import { useState, useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { identifyCategory, generatePromptFromImages } from "@/lib/ai-actions";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

// Components
import { AIHowItWorks } from "./_components/AIHowItWorks";
import { ImageGrid, AIImageItem } from "./_components/ImageGrid";
import { PromptInput } from "./_components/PromptInput";
import { TemplateList } from "./_components/TemplateList";

export default function AIPromptPage() {
  const { t, locale } = useLocale();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<AIImageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const templates = useMemo(
    () => [
      { id: "cars", label: t.aiAdPost.templateLabels.cars },
      { id: "sell-property", label: t.aiAdPost.templateLabels.sellProperty },
      { id: "sell-laptop", label: t.aiAdPost.templateLabels.sellLaptop },
      { id: "more-examples", label: t.aiAdPost.templateLabels.moreExamples },
    ],
    [t]
  );

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTemplateClick = (templateId: string) => {
    const templatePrompts = {
      cars: "I want to sell my car - a 2020 Honda City VX MT in excellent condition. The car has run 45,000 km, is regularly serviced, has no accidents, and comes with all original documents. It's been well-maintained with regular oil changes and tire rotations. The car is in perfect running condition with no mechanical issues. Looking for ₹8.5 lakhs or best offer. Contact for test drive.",
      "sell-property":
        "I want to sell my 2 BHK apartment in a prime location. The property is 1200 sq ft, fully furnished, with 2 bedrooms, 2 bathrooms, living room, kitchen, and balcony. It's on the 5th floor with good ventilation and natural light. The building has 24/7 security, parking space, lift, and is close to schools, hospitals, and shopping centers. All legal documents are clear. Price: ₹45 lakhs negotiable.",
      "sell-laptop":
        "I want to sell my MacBook Pro 13-inch 2020 model with M1 chip, 8GB RAM, and 256GB SSD. The laptop is in excellent condition with no scratches or dents. It comes with original charger, box, and all accessories. Battery health is 95% and it runs perfectly. Used for light work and web browsing. Looking for ₹75,000 or best offer. Can provide original purchase receipt.",
      "more-examples":
        "Show me more examples of how to write effective ads for different categories like electronics, furniture, books, or other items.",
    };

    setPrompt(
      templatePrompts[templateId as keyof typeof templatePrompts] || ""
    );
  };

  const handleMagicSuggest = async (imagesToAnalyze: AIImageItem[]) => {
    const uploadedImages = imagesToAnalyze
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (uploadedImages.length === 0) return;

    const { canUseAi, useAi } = useSubscriptionStore.getState();

    if (!canUseAi()) {
      toast.error("No AI tokens available. Please upgrade your plan.");
      return;
    }

    setIsSuggesting(true);
    const toastId = toast.loading("Analyzing your images to write a great description...");

    try {
      const suggestion = await generatePromptFromImages(uploadedImages);
      if (suggestion) {
        setPrompt(suggestion);
        // Increment AI usage
        await useAi();
        toast.success("Voila! Here's a suggested description.", { id: toastId });
      } else {
        toast.error("I couldn't generate a suggestion right now.", { id: toastId });
      }
    } catch (error) {
      console.error("Magic suggest error:", error);
      toast.error("Something went wrong.", { id: toastId });
    } finally {
      setIsSuggesting(false);
    }
  };

  // Auto-suggest removed as per user request

  const handleSubmit = async () => {
    const uploadedImages = images
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (!prompt.trim() && uploadedImages.length === 0) {
      toast.error("Please provide a description or upload an image first.");
      return;
    }

    const { canUseAi, useAi } = useSubscriptionStore.getState();

    if (!canUseAi()) {
      toast.error("No AI tokens available. Please upgrade your plan.");
      return;
    }

    setIsGenerating(true);
    try {
      const { redirectUrl, suggestedTitle } = await identifyCategory(prompt, uploadedImages);

      // Increment AI usage on success
      await useAi();

      if (!redirectUrl) {
        toast.error("I couldn't quite figure out the best category for your ad. Could you please provide a few more details?");
        return;
      }

      toast.success("Category identified! Redirecting you to the form...");

      let redirectUrlWithParams = `${redirectUrl}&prompt=${encodeURIComponent(prompt)}`;

      if (suggestedTitle) {
        redirectUrlWithParams += `&title=${encodeURIComponent(suggestedTitle)}`;
      }

      if (uploadedImages.length > 0) {
        redirectUrlWithParams += `&images=${encodeURIComponent(JSON.stringify(uploadedImages))}`;
      }

      router.push(redirectUrlWithParams);
    } catch (error) {
      console.error("Error generating with AI:", error);
      toast.error("Something went wrong while analyzing your description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMagicSuggestManual = () => handleMagicSuggest(images);

  return (
    <Container1080 className="flex justify-center items-center min-h-[550px] sm:min-h-[calc(100dvh-150px)]">
      <div className=" w-full max-w-[628px]">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-lg sm:text-2xl font-semibold text-[#1D2939] mb-2">
            {t.aiAdPost.title}
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-[#1C1F28] rounded-xl p-4 mb-6 relative">
          <AIHowItWorks />

          <ImageGrid
            images={images}
            setImages={setImages}
            onRemove={handleRemoveImage}
          />

          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleSubmit}
            isGenerating={isGenerating}
            hasImages={images.length > 0 && !images.some(img => img.uploading)}
          />

          <div className="mt-4 space-y-3">
            {prompt.trim().length > 0 ? (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#8B31E1] hover:bg-[#7A2BC8] text-white transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,49,225,0.3)] hover:shadow-[0_0_20px_rgba(139,49,225,0.5)]"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Post Ad
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              images.length > 0 && !images.some(img => img.uploading) && (
                <button
                  onClick={handleMagicSuggestManual}
                  disabled={isSuggesting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple/10 border border-purple/30 text-purple hover:bg-purple/20 transition-all text-sm font-medium disabled:opacity-50 group"
                  >
                    <Sparkles className={`w-4 h-4 ${isSuggesting ? 'animate-pulse' : 'group-hover:scale-125 transition-transform'}`} />
                    {isSuggesting ? "Analyzing Images..." : "Magic Suggestion from Images"}
                  </button>
                )
            )}
          </div>
        </div>

        {/* Templates Section */}
        <TemplateList
          templates={templates}
          onSelect={handleTemplateClick}
        />

        {/* Loading State */}
        {isGenerating && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-[#1D2939]">
              <div className="w-4 h-4 border-2 border-[#8B31E1] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">{t.aiAdPost.generating}</span>
            </div>
          </div>
        )}
      </div>
    </Container1080>
  );
}
