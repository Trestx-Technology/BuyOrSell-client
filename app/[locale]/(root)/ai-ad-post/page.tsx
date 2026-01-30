"use client";

import { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { identifyCategory, generatePromptFromImages } from "@/lib/ai-actions";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";

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

    setIsSuggesting(true);
    const toastId = toast.loading("Analyzing your images to write a great description...");

    try {
      const suggestion = await generatePromptFromImages(uploadedImages);
      if (suggestion) {
        setPrompt(suggestion);
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

  // Auto-suggest when images are uploaded and prompt is empty
  useMemo(() => {
    const uploadedCount = images.filter(img => !img.uploading).length;
    if (uploadedCount > 0 && !prompt.trim() && !isSuggesting) {
      handleMagicSuggest(images);
    }
  }, [images, prompt, isSuggesting]);

  const handleSubmit = async () => {
    const uploadedImages = images
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (!prompt.trim() && uploadedImages.length === 0) {
      toast.error("Please provide a description or upload an image first.");
      return;
    }

    setIsGenerating(true);
    try {
      const { redirectUrl } = await identifyCategory(prompt, uploadedImages);

      if (!redirectUrl) {
        toast.error("I couldn't quite figure out the best category for your ad. Could you please provide a few more details?");
        return;
      }

      toast.success("Category identified! Redirecting you to the form...");

      router.push(`${redirectUrl}&prompt=${encodeURIComponent(prompt)}`);
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

          {images.length > 0 && !images.some(img => img.uploading) && (
            <button
              onClick={handleMagicSuggestManual}
              disabled={isSuggesting}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple/10 border border-purple/30 text-purple hover:bg-purple/20 transition-all text-sm font-medium disabled:opacity-50 group"
            >
              <Sparkles className={`w-4 h-4 ${isSuggesting ? 'animate-pulse' : 'group-hover:scale-125 transition-transform'}`} />
              {isSuggesting ? "Analyzing Images..." : "Magic Suggestion from Images"}
            </button>
          )}
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
