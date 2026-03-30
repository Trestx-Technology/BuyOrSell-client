"use client";

import { useState, useMemo } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { identifyCategory, generatePromptFromImages } from "@/lib/ai-actions";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAITokenBalance, useConsumeTokens } from "@/hooks/useAITokens";
import { useAdPostingStore } from "@/stores/adPostingStore";

// Components
import { AIHowItWorks } from "./AIHowItWorks";
import { ImageGrid, AIImageItem } from "./ImageGrid";
import { PromptInput } from "./PromptInput";
import { TemplateList } from "./TemplateList";
import { NoCreditsDialog } from "@/components/global/NoCreditsDialog";
import { useAdSubscription } from "@/hooks/useAdSubscription";
import { InsufficientAdsDialog } from "@/components/global/InsufficientAdsDialog";
import { NoActivePlansDialog } from "@/components/global/NoActivePlansDialog";

export const AIAdPostContent = () => {
  console.log("[AIAdPostContent] Component rendered");
  const { t } = useLocale();
  const router = useRouter();

  // Diagnostic log on mount
  useMemo(() => {
    console.log("[AIAdPostContent] Initialized");
  }, []);

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<AIImageItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [adType, setAdType] = useState("");

  const { data: tokenBalance } = useAITokenBalance();
  const currentBalance = tokenBalance?.data?.tokensRemaining ?? 0;
  const { mutateAsync: consumeTokens } = useConsumeTokens();

  const [isNoCreditsOpen, setIsNoCreditsOpen] = useState(false);
  const [requiredCredits, setRequiredCredits] = useState(0);

  // Unified Subscription Hook
  const {
    checkAvailability,
    resolve,
    dialogProps: subscriptionDialogProps,
    isLoading: subscriptionsLoading,
  } = useAdSubscription();

  const { setStep, clearCategoryArray, addToCategoryArray, setActiveCategory } =
    useAdPostingStore();

  const MAGIC_SUGGEST_CREDITS = 5;
  const CATEGORIZATION_CREDITS = 3;

  const templates = useMemo(
    () => [
      { id: "cars", label: t.aiAdPost.templateLabels.cars },
      { id: "sell-property", label: t.aiAdPost.templateLabels.sellProperty },
      { id: "sell-laptop", label: t.aiAdPost.templateLabels.sellLaptop },
      { id: "more-examples", label: t.aiAdPost.templateLabels.moreExamples },
    ],
    [t],
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
      templatePrompts[templateId as keyof typeof templatePrompts] || "",
    );
  };

  const handleMagicSuggest = async (imagesToAnalyze: AIImageItem[]) => {
    const uploadedImages = imagesToAnalyze
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (uploadedImages.length === 0) return;

    if (currentBalance < MAGIC_SUGGEST_CREDITS) {
      setRequiredCredits(MAGIC_SUGGEST_CREDITS);
      setIsNoCreditsOpen(true);
      return;
    }

    setIsSuggesting(true);
    const toastId = toast.loading(t.aiAdPost.analyzingPrompt);

    try {
      const data = await generatePromptFromImages(uploadedImages);
      if (data.description) {
        setPrompt(data.description);
        setAdType(data.adType);
        // Consume 5 tokens
        await consumeTokens({
          tokens: MAGIC_SUGGEST_CREDITS,
          purpose: "magic_suggestion",
        });
        toast.success(t.aiAdPost.voilaSuggested, {
          id: toastId,
        });
      } else {
        toast.error(t.aiAdPost.couldNotGenerateSuggestion, {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Magic suggest error:", error);
      toast.error(t.aiAdPost.somethingWentWrong, { id: toastId });
    } finally {
      setIsSuggesting(false);
    }
  };

  // Auto-suggest removed as per user request

  const handleSubmit = async () => {
    console.log("[Client] handleSubmit triggered", {
      promptLength: prompt.length,
      imagesCount: images.length,
    });
    const uploadedImages = images
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (!prompt.trim() && uploadedImages.length === 0) {
      toast.error(t.aiAdPost.provideDescriptionOrImage);
      return;
    }

    if (currentBalance < CATEGORIZATION_CREDITS) {
      setRequiredCredits(CATEGORIZATION_CREDITS);
      setIsNoCreditsOpen(true);
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading(t.aiAdPost.analyzingPrompt);
    console.log("[Client] Calling identifyCategory...");
    try {
      let { redirectUrl, suggestedTitle, categoryPath } =
        await identifyCategory(
          prompt,
          uploadedImages,
          undefined, // categoriesData removed to fix serialization issues
          adType,
        );
      console.log("[Client] identifyCategory response:", {
        redirectUrl,
        suggestedTitle,
        categoryPath,
      });

      if (!redirectUrl) {
        toast.error(
          t.aiAdPost.couldNotIdentifyCategory,
          { id: toastId, duration: 6000 },
        );
        setIsGenerating(false);
        return;
      }

      // 1. CHECK AD AVAILABILITY
      if (categoryPath && categoryPath.length > 0) {
        const rootCategoryName = categoryPath[0]?.name || "Ads";
        const categoryId = categoryPath[categoryPath.length - 1]?.id;

        // Check availability
        if (!checkAvailability({
          action: "post",
          categoryType: rootCategoryName,
          categoryName: categoryPath[0].name,
          categoryId: categoryId,
        })) {
          toast.dismiss(toastId);
          setIsGenerating(false);
          return;
        }

        // 2. Resolve plan
        const resolved = resolve(rootCategoryName, categoryId);

        // Success Path with Resolved Plan
        if (resolved.subscription) {
          // Token balance deduction - ONLY ON SUCCESS
          await consumeTokens({
            tokens: CATEGORIZATION_CREDITS,
            purpose: "ad_categorization",
          });

          toast.dismiss(toastId);
          handleFinalRedirect(redirectUrl, resolved.subscription._id, categoryPath, suggestedTitle);
          setIsGenerating(false);
          return;
        }
      }

      // Success Path without specific plan (bypass/manual)
      await consumeTokens({
        tokens: CATEGORIZATION_CREDITS,
        purpose: "ad_categorization",
      });

      handleFinalRedirect(redirectUrl, undefined, categoryPath, suggestedTitle);
    } catch (error: any) {
      console.error("Error generating with AI:", error);
      const errorMessage =
        error.message ||
        "Something went wrong while analyzing your description. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalRedirect = (
    rawUrl: string,
    subId?: string,
    catPath?: any[],
    suggestedTitle?: string,
  ) => {
    // 1. Sync store
    clearCategoryArray();
    if (catPath && catPath.length > 0) {
      catPath.forEach((cat) => {
        addToCategoryArray({ id: cat.id, name: cat.name });
      });
      setActiveCategory(catPath[catPath.length - 1].id);
    }
    setStep(3);

    // 2. Build URL
    let finalUrl = `${rawUrl}&prompt=${encodeURIComponent(prompt)}`;
    if (subId) finalUrl += `&subscriptionId=${subId}`;
    if (suggestedTitle) finalUrl += `&title=${encodeURIComponent(suggestedTitle)}`;

    const uploadedImages = images
      .filter((img) => !img.uploading)
      .map((img) => img.url);

    if (uploadedImages.length > 0) {
      finalUrl += `&images=${encodeURIComponent(JSON.stringify(uploadedImages))}`;
    }

    router.push(finalUrl);
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
            isGenerating={isGenerating || isSuggesting}
            isAIGenerated={adType.length > 0}
          />

          {/* AI CTA Buttons */}
          <div className="mt-4 flex flex-col gap-3">
            {images.length > 0 && !images.some((img) => img.uploading) && (
              <button
                onClick={handleMagicSuggestManual}
                disabled={isSuggesting || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-[#8B31E1] text-[#8B31E1] hover:bg-[#8B31E1]/10 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSuggesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#8B31E1]/30 border-t-[#8B31E1] rounded-full animate-spin" />
                    {t.aiAdPost.analyzingImages}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t.aiAdPost.generateFromImages}
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={isGenerating || isSuggesting || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#8B31E1] hover:bg-[#7A2BC8] text-white transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,49,225,0.3)] hover:shadow-[0_0_20px_rgba(139,49,225,0.5)]"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t.aiAdPost.findingCategory}
                </>
              ) : (
                <>
                  {t.aiAdPost.continueToPostAd}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Templates Section */}
        <TemplateList templates={templates} onSelect={handleTemplateClick} />

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

      {/* Availability/Error Dialogs */}
      {subscriptionDialogProps.mode === "no_plans" && (
        <NoActivePlansDialog {...subscriptionDialogProps} />
      )}
      {subscriptionDialogProps.mode === "insufficient" && (
        <InsufficientAdsDialog {...subscriptionDialogProps} />
      )}

      <NoCreditsDialog
        isOpen={isNoCreditsOpen}
        onClose={() => setIsNoCreditsOpen(false)}
        requiredCredits={requiredCredits}
        currentBalance={currentBalance}
      />
    </Container1080>
  );
};
