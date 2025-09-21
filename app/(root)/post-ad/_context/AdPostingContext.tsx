"use client";

import Image from "next/image";
import React, { createContext, useContext, useState, ReactNode } from "react";
import ProgressBar from "../_components/ProgressBar";
import { House } from "lucide-react";
import { useRouter } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================
export interface AdFormData {
  // Basic Information
  category: string;
  subcategory: string;
  categoryPath: string[];
  title: string;
  description: string;

  // Pricing
  price: number;
  currency: string;
  negotiable: boolean;

  // Location
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };

  // Contact Information
  contact: {
    name: string;
    phone: string;
    email: string;
    showPhone: boolean;
    showEmail: boolean;
  };

  // Media
  images: string[];
  videos?: string[];

  // Category-specific features
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: Record<string, any>;

  // Promotion
  promotion: {
    featured: boolean;
    premium: boolean;
    package: string;
    duration: number; // days
  };

  // Additional Details
  condition: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  material?: string;
  dimensions?: string;
  age?: number; // months

  // Status
  status:
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "published"
    | "expired";
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;

  // AI Assistance
  aiGenerated?: boolean;
  aiSuggestions?: string[];
}

export interface AdPostingContextType {
  // Form Data
  formData: AdFormData;
  updateFormData: (data: Partial<AdFormData>) => void;
  resetFormData: () => void;

  // Category Management
  setCategoryPath: (path: string[]) => void;
  addToCategoryPath: (category: string) => void;
  removeFromCategoryPath: (index: number) => void;

  // Validation
  isStepValid: (step: string) => boolean;
  getValidationErrors: (step: string) => string[];

  // Media Management
  addImage: (imageUrl: string) => void;
  removeImage: (index: number) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;

  // Form State
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Category Selection
  selectCategory: (categoryId: string) => void;

  // Submission
  isSubmitting: boolean;
  submitAd: () => Promise<void>;

  // Draft Management
  saveDraft: () => void;
  loadDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;

  // AI Features
  generateWithAI: (prompt: string) => Promise<void>;
  getAISuggestions: (field: string) => Promise<string[]>;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================
const initialFormData: AdFormData = {
  category: "",
  subcategory: "",
  categoryPath: [],
  title: "",
  description: "",
  price: 0,
  currency: "INR",
  negotiable: true,
  location: {
    address: "",
    city: "",
    state: "",
    coordinates: { lat: 0, lng: 0 },
  },
  contact: {
    name: "",
    phone: "",
    email: "",
    showPhone: true,
    showEmail: true,
  },
  images: [],
  videos: [],
  features: {},
  promotion: {
    featured: false,
    premium: false,
    package: "basic",
    duration: 7,
  },
  condition: "",
  status: "draft",
  createdAt: new Date(),
  updatedAt: new Date(),
  aiGenerated: false,
  aiSuggestions: [],
};

// ============================================================================
// CONTEXT
// ============================================================================
const AdPostingContext = createContext<AdPostingContextType | null>(null);

export const useAdPosting = () => {
  const context = useContext(AdPostingContext);
  if (!context) {
    throw new Error("useAdPosting must be used within AdPostingProvider");
  }
  return context;
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
interface AdPostingProviderProps {
  children: ReactNode;
}

export const AdPostingProvider: React.FC<AdPostingProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<AdFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // FORM DATA MANAGEMENT
  // ============================================================================
  const updateFormData = (data: Partial<AdFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      updatedAt: new Date(),
    }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  // ============================================================================
  // CATEGORY MANAGEMENT
  // ============================================================================
  const setCategoryPath = (path: string[]) => {
    setFormData((prev) => ({
      ...prev,
      categoryPath: path,
      category: path[0] || "",
      subcategory: path[path.length - 1] || "",
      updatedAt: new Date(),
    }));
  };

  const addToCategoryPath = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryPath: [...prev.categoryPath, category],
      subcategory: category,
      updatedAt: new Date(),
    }));
  };

  const removeFromCategoryPath = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryPath: prev.categoryPath.slice(0, index + 1),
      subcategory: prev.categoryPath[index] || "",
      updatedAt: new Date(),
    }));
  };

  // ============================================================================
  // VALIDATION
  // ============================================================================
  const isStepValid = (step: string): boolean => {
    switch (step) {
      case "categories":
        return formData.categoryPath.length > 0;
      case "form":
        return !!formData.title && !!formData.description;
      case "images":
        return formData.images.length > 0;
      case "location":
        return !!formData.location.address && !!formData.location.city;
      case "pricing":
        return formData.price > 0;
      case "review":
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  const getValidationErrors = (step: string): string[] => {
    const errors: string[] = [];

    switch (step) {
      case "categories":
        if (formData.categoryPath.length === 0) {
          errors.push("Please select a category");
        }
        break;
      case "form":
        if (!formData.title) errors.push("Title is required");
        if (!formData.description) errors.push("Description is required");
        break;
      case "images":
        if (formData.images.length === 0) {
          errors.push("At least one image is required");
        }
        break;
      case "location":
        if (!formData.location.address) errors.push("Address is required");
        if (!formData.location.city) errors.push("City is required");
        break;
      case "pricing":
        if (formData.price <= 0) errors.push("Price must be greater than 0");
        break;
    }

    return errors;
  };

  // ============================================================================
  // MEDIA MANAGEMENT
  // ============================================================================
  const addImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
      updatedAt: new Date(),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      updatedAt: new Date(),
    }));
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return {
        ...prev,
        images: newImages,
        updatedAt: new Date(),
      };
    });
  };

  // ============================================================================
  // STEP MANAGEMENT
  // ============================================================================
  const nextStep = () => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);

    // Navigate based on current step
    switch (newStep) {
      case 2:
        router.push("/post-ad/motors");
        break;
      case 3:
        router.push("/post-ad/details");
        break;
      case 4:
        router.push("/");
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    const newStep = Math.max(1, currentStep - 1);
    setCurrentStep(newStep);

    // Navigate based on current step
    switch (newStep) {
      case 1:
        router.push("/post-ad");
        break;
      case 2:
        router.push("/post-ad/categories");
        break;
      case 3:
        router.push("/post-ad/details");
        break;
      default:
        break;
    }
  };

  const selectCategory = (categoryId: string) => {
    // Update form data with selected category
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      categoryPath: [categoryId],
      updatedAt: new Date(),
    }));
  };

  // ============================================================================
  // SUBMISSION
  // ============================================================================
  const submitAd = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFormData((prev) => ({
        ...prev,
        status: "pending",
        updatedAt: new Date(),
      }));

      // In real app, make API call to submit ad
      console.log("Ad submitted:", formData);
    } catch (error) {
      console.error("Error submitting ad:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // DRAFT MANAGEMENT
  // ============================================================================
  const saveDraft = () => {
    const draftId = `draft_${Date.now()}`;
    localStorage.setItem(`ad_draft_${draftId}`, JSON.stringify(formData));
    console.log("Draft saved:", draftId);
  };

  const loadDraft = (draftId: string) => {
    const draft = localStorage.getItem(`ad_draft_${draftId}`);
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setFormData(parsedDraft);
    }
  };

  const deleteDraft = (draftId: string) => {
    localStorage.removeItem(`ad_draft_${draftId}`);
  };

  // ============================================================================
  // AI FEATURES
  // ============================================================================
  const generateWithAI = async (prompt: string) => {
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiGeneratedData = {
        title: `AI Generated: ${prompt}`,
        description: `This is an AI-generated description for: ${prompt}`,
        aiGenerated: true,
      };

      updateFormData(aiGeneratedData);
    } catch (error) {
      console.error("Error generating with AI:", error);
    }
  };

  const getAISuggestions = async (field: string): Promise<string[]> => {
    try {
      // Simulate AI suggestions
      await new Promise((resolve) => setTimeout(resolve, 500));

      const suggestions: Record<string, string[]> = {
        title: ["Great condition", "Must sell", "Negotiable", "Rare find"],
        description: [
          "Well maintained",
          "Excellent condition",
          "Perfect for",
          "Ideal for",
        ],
        features: ["New", "Used", "Refurbished", "Original"],
      };

      return suggestions[field] || [];
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      return [];
    }
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================
  const contextValue: AdPostingContextType = {
    formData,
    updateFormData,
    resetFormData,
    setCategoryPath,
    addToCategoryPath,
    removeFromCategoryPath,
    isStepValid,
    getValidationErrors,
    addImage,
    removeImage,
    reorderImages,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    selectCategory,
    isSubmitting,
    submitAd,
    saveDraft,
    loadDraft,
    deleteDraft,
    generateWithAI,
    getAISuggestions,
  };

  return (
    <AdPostingContext.Provider value={contextValue}>
      <main className="h-dvh bg-[#F7F8FA] w-full border">
        <section className=" flex h-full overflow-y-auto flex-col max-w-[1080px] mx-auto bg-white px-6">
          <div className="pt-6">
            <Image
              src="/images/category-icons/logo.png"
              alt="BuyOrSell Logo"
              width={155}
              height={49}
              className="mb-8"
            />
          </div>
          <div className="w-full max-w-[888px] mb-4 mx-auto">
            <ProgressBar currentStep={1} totalSteps={4} />
            {/* Title Section */}
            <div className="mt-6">
              <h1 className="text-xl font-semibold text-[#1D2939] mb-2">
                Place Ad Manually
              </h1>
              <p className="text-xs text-[#8A8A8A] mb-4">Choose ad category</p>

              {/* Divider Line */}
              <div className="w-full h-px bg-[#F0F0F1] mb-6"></div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1">
              <House className="w-4 h-4 text-purple" />
              <span className="text-xs font-bold text-purple">Home</span>
            </div>
          </div>

          {children}
        </section>
      </main>
    </AdPostingContext.Provider>
  );
};
