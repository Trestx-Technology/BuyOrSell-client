import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================
export interface CategoryNameItem {
  id: number;
  name: string;
}

export interface AdFormData {
  // Basic Information
  category: string;
  subcategory: string;
  categoryNames: CategoryNameItem[];
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

export interface AdPostingStore {
  // Form Data
  formData: AdFormData;
  updateFormData: (data: Partial<AdFormData>) => void;
  resetFormData: () => void;

  // Category Names Array (read-only access)
  categoryNames: CategoryNameItem[];

  // Category Management
  addCategoryName: (name: string) => void;
  removeCategoryName: (index: number) => void;
  clearCategoryNames: () => void;

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
  setIsSubmitting: (isSubmitting: boolean) => void;
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
  categoryNames: [],
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
// ZUSTAND STORE
// ============================================================================
export const useAdPostingStore = create<AdPostingStore>()(
  persist(
    (set, get) => ({
      // Form Data
      formData: initialFormData,

      // Category Names getter
      get categoryNames() {
        return get().formData.categoryNames;
      },

      updateFormData: (data: Partial<AdFormData>) => {
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
            updatedAt: new Date(),
          },
        }));
      },

      resetFormData: () => {
        set({
          formData: initialFormData,
          currentStep: 1,
        });
      },

      // Category Management
      addCategoryName: (name: string) => {
        set((state) => ({
          formData: {
            ...state.formData,
            categoryNames: [
              ...state.formData.categoryNames,
              {
                id: state.formData.categoryNames.length + 1,
                name: name,
              },
            ],
            updatedAt: new Date(),
          },
        }));
      },

      removeCategoryName: (index: number) => {
        set((state) => ({
          formData: {
            ...state.formData,
            categoryNames: state.formData.categoryNames.filter((_, i) => i !== index),
            updatedAt: new Date(),
          },
        }));
      },

      clearCategoryNames: () => {
        set((state) => ({
          formData: {
            ...state.formData,
            categoryNames: [],
            updatedAt: new Date(),
          },
        }));
      },

      // Validation
      isStepValid: (step: string): boolean => {
        const { formData } = get();
        switch (step) {
          case "categories":
            return formData.categoryNames.length > 0;
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
      },

      getValidationErrors: (step: string): string[] => {
        const { formData } = get();
        const errors: string[] = [];

        switch (step) {
          case "categories":
            if (formData.categoryNames.length === 0) {
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
      },

      // Media Management
      addImage: (imageUrl: string) => {
        set((state) => ({
          formData: {
            ...state.formData,
            images: [...state.formData.images, imageUrl],
            updatedAt: new Date(),
          },
        }));
      },

      removeImage: (index: number) => {
        set((state) => ({
          formData: {
            ...state.formData,
            images: state.formData.images.filter((_, i) => i !== index),
            updatedAt: new Date(),
          },
        }));
      },

      reorderImages: (fromIndex: number, toIndex: number) => {
        set((state) => {
          const newImages = [...state.formData.images];
          const [movedImage] = newImages.splice(fromIndex, 1);
          newImages.splice(toIndex, 0, movedImage);
          return {
            formData: {
              ...state.formData,
              images: newImages,
              updatedAt: new Date(),
            },
          };
        });
      },

      // Form State
      currentStep: 1,

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      nextStep: () => {
        const { currentStep } = get();
        const newStep = currentStep + 1;
        set({ currentStep: newStep });

        // Note: Navigation logic should be handled in components
        // since Zustand stores shouldn't handle routing directly
      },

      prevStep: () => {
        const { currentStep } = get();
        const newStep = Math.max(1, currentStep - 1);
        set({ currentStep: newStep });

        // Note: Navigation logic should be handled in components
      },

      selectCategory: (categoryId: string, categoryName?: string) => {
        const name = categoryName || categoryId;
        set((state) => ({
          formData: {
            ...state.formData,
            category: categoryId,
            categoryNames: [
              ...state.formData.categoryNames,
              {
                id: state.formData.categoryNames.length + 1,
                name: name,
              },
            ],
            updatedAt: new Date(),
          },
        }));
      },

      // Submission
      isSubmitting: false,

      setIsSubmitting: (isSubmitting: boolean) => {
        set({ isSubmitting });
      },

      submitAd: async () => {
        const { setIsSubmitting } = get();
        setIsSubmitting(true);
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 2000));

          set((state) => ({
            formData: {
              ...state.formData,
              status: "pending",
              updatedAt: new Date(),
            },
          }));

          // In real app, make API call to submit ad
          console.log("Ad submitted:", get().formData);
        } catch (error) {
          console.error("Error submitting ad:", error);
          throw error;
        } finally {
          setIsSubmitting(false);
        }
      },

      // Draft Management
      saveDraft: () => {
        const { formData } = get();
        const draftId = `draft_${Date.now()}`;
        sessionStorage.setItem(`ad_draft_${draftId}`, JSON.stringify(formData));
        console.log("Draft saved:", draftId);
      },

      loadDraft: (draftId: string) => {
        const draft = sessionStorage.getItem(`ad_draft_${draftId}`);
        if (draft) {
          const parsedDraft = JSON.parse(draft);
          set({
            formData: parsedDraft,
          });
        }
      },

      deleteDraft: (draftId: string) => {
        sessionStorage.removeItem(`ad_draft_${draftId}`);
      },

      // AI Features
      generateWithAI: async (prompt: string) => {
        const { updateFormData } = get();
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
      },

      getAISuggestions: async (field: string): Promise<string[]> => {
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
      },
    }),
    {
      name: 'ad-posting-store',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist formData and currentStep
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);
