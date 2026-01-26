"use client";

import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { useSavedJobsStore } from "@/stores/savedJobsStore";
import {
      useSaveJob,
      useDeleteSavedJobByJobAndSeeker,
} from "@/hooks/useSavedJobs";

interface SaveJobButtonProps {
      jobId: string;
      isSaved?: boolean;
      isApplied?: boolean;
      isJobOwner?: boolean;
      className?: string;
      iconOnly?: boolean;
}

export const SaveJobButton = ({
      jobId,
      isSaved = false,
      isApplied = false,
      isJobOwner = false,
      className,
      iconOnly = false,
}: SaveJobButtonProps) => {
      const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
      const { data: jobseekerProfile } = useGetJobseekerProfile();
      const jobSeekerId = jobseekerProfile?.data?.profile?.userId;

      // Use Zustand store for global session-level state
      const addSavedJobId = useSavedJobsStore((state) => state.addSavedJobId);
      const removeSavedJobId = useSavedJobsStore((state) => state.removeSavedJobId);
      const isCurrentlySavedInStore = useSavedJobsStore((state) => state.isJobSaved(jobId));

      // Determine if saved based on props OR session-level shared store OR applied status
      const isCurrentlySaved = isSaved || isCurrentlySavedInStore;

      const { mutate: saveJob, isPending: isSaving } = useSaveJob();
      const { mutate: deleteSavedJob, isPending: isDeleting } =
            useDeleteSavedJobByJobAndSeeker();

      const handleSaveToggle = (e: React.MouseEvent) => {
            e.stopPropagation();

            if (!isAuthenticated) {
                  toast.error("Please login to save jobs");
                  return;
            }

            if (!jobSeekerId) {
                  toast.error("Please create a jobseeker profile first");
                  return;
            }

            if (isCurrentlySaved) {
                  // Optimistic Unsave: Update store
                  removeSavedJobId(jobId);

                  deleteSavedJob(
                        { jobSeekerId, jobId },
                        {
                              onSuccess: () => {
                                    toast.success("Job removed from saved jobs");
                              },
                              onError: () => {
                                    // Revert on error
                                    addSavedJobId(jobId);
                              },
                        }
                  );
            } else {
                  // Optimistic Save: Update store
                  addSavedJobId(jobId);

                  saveJob(
                        { jobSeekerId, jobId },
                        {
                              onSuccess: () => {
                                    toast.success("Job saved successfully");
                              },
                              onError: () => {
                                    // Revert on error
                                    removeSavedJobId(jobId);
                              },
                        }
                  );
            }
      };

      if (isJobOwner) return null;

      return (
            <button
                  onClick={handleSaveToggle}
                  disabled={isSaving || isDeleting}
                  className={cn(
                        "flex flex-col items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
                        className
                  )}
            >
                  <Heart
                        className={cn(
                              "w-5 h-5",
                              isCurrentlySaved ? "fill-red-500 text-red-500" : "text-grey-blue"
                        )}
                        strokeWidth={1.5}
                  />
                  {!iconOnly && (
                        <span className="text-xs text-grey-blue font-medium">Save</span>
                  )}
            </button>
      );
};
