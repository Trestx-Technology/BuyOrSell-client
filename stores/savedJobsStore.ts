import { create } from "zustand";

interface SavedJobsState {
  savedJobIds: string[];
  addSavedJobId: (id: string) => void;
  removeSavedJobId: (id: string) => void;
  isJobSaved: (id: string) => boolean;
}

export const useSavedJobsStore = create<SavedJobsState>((set, get) => ({
  savedJobIds: [],
  
  addSavedJobId: (id) => set((state) => {
    if (state.savedJobIds.includes(id)) return state;
    return { savedJobIds: [...state.savedJobIds, id] };
  }),
  
  removeSavedJobId: (id) => set((state) => ({
    savedJobIds: state.savedJobIds.filter((jobId) => jobId !== id)
  })),
  
  isJobSaved: (id) => get().savedJobIds.includes(id),
}));
