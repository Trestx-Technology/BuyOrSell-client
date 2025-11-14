import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================================================
// TYPES
// ============================================================================
export interface CategoryBreadcrumbItem {
  id: string;
  name: string;
}

export interface AdPostingStore {
  // Category Array (for breadcrumbs)
  categoryArray: CategoryBreadcrumbItem[];
  addToCategoryArray: (category: CategoryBreadcrumbItem) => void;
  removeFromCategoryArray: (categoryId: string) => void;
  clearCategoryArray: () => void;

  // Active Category (current category ID being viewed)
  activeCategory: string | null;
  setActiveCategory: (categoryId: string | null) => void;

  // Steps (1, 2, 3, or 4)
  currentStep: number;
  setStep: (step: number) => void;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================
const initialState = {
  categoryArray: [],
  activeCategory: null,
  currentStep: 1, // Step 1: Default initial state
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================
export const useAdPostingStore = create<AdPostingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Category Array (Breadcrumbs)
      addToCategoryArray: (category: CategoryBreadcrumbItem) => {
        set((state) => {
          // Check if category already exists
          const exists = state.categoryArray.some(
            (item) => item.id === category.id
          );

          if (exists) {
            // If exists, remove everything after it (for backward navigation)
            const index = state.categoryArray.findIndex(
              (item) => item.id === category.id
            );
            return {
              categoryArray: state.categoryArray.slice(0, index + 1),
            };
          }

          // Add new category to array
          return {
            categoryArray: [...state.categoryArray, category],
          };
        });
      },

      removeFromCategoryArray: (categoryId: string) => {
        set((state) => ({
          categoryArray: state.categoryArray.filter(
            (item) => item.id !== categoryId
          ),
        }));
      },

      clearCategoryArray: () => {
        set({ categoryArray: [], currentStep: 1, activeCategory: null });
      },

      // Active Category
      setActiveCategory: (categoryId: string | null) => {
        set({ activeCategory: categoryId });
      },

      // Steps
      setStep: (step: number) => {
        // Ensure step is between 1 and 4
        const validStep = Math.max(1, Math.min(4, step));
        set({ currentStep: validStep });
      },

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 4) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Reset
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "ad-posting-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist all state
      partialize: (state) => ({
        categoryArray: state.categoryArray,
        activeCategory: state.activeCategory,
        currentStep: state.currentStep,
      }),
    }
  )
);

