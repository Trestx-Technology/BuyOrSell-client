"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Send, AlertCircle } from "lucide-react";
import Navbar from "@/components/global/Navbar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";

const templates = [
  { id: "cars", label: "Cars" },
  { id: "sell-property", label: "Sell Property" },
  { id: "sell-laptop", label: "Sell Laptop" },
  { id: "more-examples", label: "More examples" },
];

export default function AIPromptPage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([
    "/images/ai-prompt/car-image-1.png",
    "/images/ai-prompt/car-image-1.png",
    "/images/ai-prompt/car-image-1.png",
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    // In a real app, this would open a file picker
    setImages((prev) => [...prev, "/images/ai-prompt/car-image-1.png"]);
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

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // Check character limit
    if (prompt.length > 2000) {
      alert("Prompt is too long. Please keep it under 2000 characters.");
      return;
    }

    setIsGenerating(true);
    try {
      return toast.info("AI Ad posting in under Development...");
      // In a real app, this would navigate to the next step
      console.log("AI generation completed");
    } catch (error) {
      console.error("Error generating with AI:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="border-b">
        <Navbar />
      </div>
      {/* Main Container */}
      <div className="max-w-[1080px] w-full mx-auto bg-white h-full flex justify-center items-center">
        {/* Progress Bar Section */}

        {/* Main Content */}
        <div className="px-4 pb-8 w-full max-w-[628px]">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-2xl font-semibold text-[#1D2939] mb-2">
              Place Ad Free with AI
            </h1>
            {/* Error/Info Icon */}
          </div>

          {/* Main Card */}
          <div className="bg-[#1C1F28] rounded-xl p-4 mb-6 relative">
            {/* Info Icon with Hover Card */}
            <HoverCard openDelay={100} closeDelay={50}>
              <HoverCardTrigger asChild>
                <div className="absolute -top-10 sm:-top-5 right-0 sm:-right-8 rounded-full flex items-center justify-center cursor-help">
                  <AlertCircle className="size-6 text-purple" />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" side="left">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-purple-600">
                    How AI Works
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">🤖</span>
                      <span>
                        <strong>AI Generation:</strong> Creates optimized
                        titles, descriptions & pricing
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">📝</span>
                      <span>
                        <strong>Templates:</strong> Quick-start prompts for
                        different categories
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-500">🖼️</span>
                      <span>
                        <strong>Image Analysis:</strong> Suggests features &
                        market positioning
                      </span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-gray-200">
                    <p className="text-xs text-purple-600 font-medium">
                      Try templates below or describe your item!
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Images Section */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {/* Existing Images */}
              {images.map((image, index) => (
                <HoverCard key={index} openDelay={50} closeDelay={25}>
                  <HoverCardTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <div className="w-[54px] h-[54px] rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Uploaded image ${index + 1}`}
                          width={54}
                          height={54}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-125 transition-all duration-300"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-72 p-0" side="top">
                    <div className="relative">
                      <Image
                        src={image}
                        alt={`Preview of uploaded image ${index + 1}`}
                        width={288}
                        height={216}
                        className="w-full h-auto rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1.5 rounded-b-lg">
                        <p className="text-xs font-medium">Image {index + 1}</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}

              {/* Add Image Button */}
              <HoverCard openDelay={50} closeDelay={25}>
                <HoverCardTrigger asChild>
                  <button
                    onClick={handleAddImage}
                    className="w-[54px] h-[54px] border-2 border-[#37E7B6] border-dashed rounded-lg flex flex-col items-center justify-center hover:bg-[#37E7B6]/10 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#37E7B6] mb-1" />
                    <span className="text-[10px] text-[#37E7B6] font-normal">
                      Add
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-56" side="top">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-semibold">Add Image</h4>
                    <p className="text-xs text-muted-foreground">
                      Upload JPG, PNG, or WebP files
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#37E7B6]">
                      <Plus className="w-3 h-3" />
                      <span>Click to browse</span>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            {/* Input Section */}
            <div className="relative">
              <div className="bg-[#2D3347] rounded-lg overflow-hidden">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter your prompt here..."
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
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isGenerating}
                  className="absolute top-2 right-2 w-8 h-8 bg-[#667085] rounded-md flex items-center justify-center hover:bg-[#667085]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Character Counter and Tips */}
              <div className="flex justify-between items-center mt-2 px-1">
                <div className="text-xs text-gray-400">
                  {prompt.length > 0 && (
                    <span
                      className={
                        prompt.length > 1000
                          ? "text-orange-400"
                          : "text-gray-400"
                      }
                    >
                      {prompt.length}/2000 characters
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Send Button */}
          </div>

          {/* Templates Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#1D2939]">
                Use Templates
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
                      Templates
                    </h4>
                    <p className="text-xs text-gray-600">
                      Pre-optimized prompts for better ads quickly
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>
                          <strong>Cars:</strong> Vehicle listings + pricing
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>
                          <strong>Property:</strong> Real estate + amenities
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>
                          <strong>Electronics:</strong> Tech specs + condition
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                        <span>
                          <strong>More:</strong> Additional categories
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
                      onClick={() => handleTemplateClick(template.id)}
                      className="px-3 py-1 bg-[#1C1F28] text-white text-xs rounded-full hover:bg-[#1C1F28]/80 transition-colors"
                    >
                      {template.label}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64" side="top">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-semibold">
                        {template.label}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {template.id === "cars" &&
                          "Car listings with pricing insights"}
                        {template.id === "sell-property" &&
                          "Property with location & amenities"}
                        {template.id === "sell-laptop" &&
                          "Tech specs & condition details"}
                        {template.id === "more-examples" &&
                          "Additional categories & use cases"}
                      </p>
                      <div className="text-xs text-[#8B31E1] font-medium">
                        Click to apply
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-[#1D2939]">
                <div className="w-4 h-4 border-2 border-[#8B31E1] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Generating your ad with AI...</span>
              </div>
            </div>
          )}

          {/* Generated Content Preview */}
          {/* {formData.aiGenerated && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">
                AI Generated Content:
              </h4>
              <div className="text-sm text-green-700">
                <p>
                  <strong>Title:</strong> {formData.title}
                </p>
                <p>
                  <strong>Description:</strong> {formData.description}
                </p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
