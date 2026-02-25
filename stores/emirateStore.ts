import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EMIRATE_STORAGE_KEY } from "@/constants/emirate.constants";

interface EmirateState {
  selectedEmirate: string;
  setSelectedEmirate: (emirate: string) => void;
  clearEmirate: () => void;
}

export const useEmirateStore = create<EmirateState>()(
  persist(
    (set) => ({
      selectedEmirate: "",
      setSelectedEmirate: (emirate: string) =>
        set({ selectedEmirate: emirate }),
      clearEmirate: () => set({ selectedEmirate: "" }),
    }),
    {
      name: "emirate-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
