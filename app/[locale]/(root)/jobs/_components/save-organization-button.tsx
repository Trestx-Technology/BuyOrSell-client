"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import {
  useSaveOrganization,
  useRemoveSavedOrganizationByUserAndOrg,
} from "@/hooks/useSavedOrganizations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SaveOrganizationButtonProps {
  organizationId: string;
  initialIsSaved?: boolean;
  className?: string;
}

export const SaveOrganizationButton = ({
  organizationId,
  initialIsSaved = false,
  className,
}: SaveOrganizationButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  const userId = useAuthStore((state) => state.session.user?._id);
  const isAuthenticated = !!userId;

  const { mutateAsync: saveOrg, isPending: isSaving } = useSaveOrganization();
  const { mutateAsync: removeOrg, isPending: isRemoving } = useRemoveSavedOrganizationByUserAndOrg();

  // Keep internal state in sync with props
  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save organizations");
      return;
    }

    // Prevent double clicks
    if (isSaving || isRemoving) return;

    const prevIsSaved = isSaved;

    // Optimistic update
    setIsSaved(!prevIsSaved);

    try {
      if (prevIsSaved) {
        if (!userId) return;
        await removeOrg({ userId, organizationId });
        toast.success("Organization removed from saved list");
      } else {
        if (!userId) return;
        await saveOrg({ userId, organizationId });
        toast.success("Organization saved successfully");
      }
    } catch (error) {
      // Revert on error
      setIsSaved(prevIsSaved);
      toast.error(prevIsSaved ? "Failed to remove organization" : "Failed to save organization");
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isSaving || isRemoving}
      className={cn(
        "rounded-full p-2 hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label={isSaved ? "Remove from saved" : "Save organization"}
    >
      <Heart
        size={24}
        className={cn(
          "transition-colors",
          isSaved
            ? "fill-red-500 stroke-red-500"
            : "stroke-gray-800 hover:stroke-red-500"
        )}
      />
    </button>
  );
};
