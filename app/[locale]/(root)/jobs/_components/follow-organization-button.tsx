"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import {
  useFollowOrganization,
  useUnfollowOrganization,
} from "@/hooks/useOrganizations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowOrganizationButtonProps {
  organizationId: string;
  initialIsFollowing?: boolean;
  className?: string;
}

export const FollowOrganizationButton = ({
  organizationId,
  initialIsFollowing = false,
  className,
}: FollowOrganizationButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const userId = useAuthStore((state) => state.session.user?._id);
  const isAuthenticated = !!userId;

  const { mutateAsync: follow, isPending: isFollowingLoading } = useFollowOrganization();
  const { mutateAsync: unfollow, isPending: isUnfollowingLoading } = useUnfollowOrganization();

  const isLoading = isFollowingLoading || isUnfollowingLoading;

  // Keep internal state in sync with props
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to follow organizations");
      return;
    }

    if (isLoading) return;

    const prevIsFollowing = isFollowing;

    // Optimistic update
    setIsFollowing(!prevIsFollowing);

    try {
      if (prevIsFollowing) {
        await unfollow(organizationId);
        toast.success("Unfollowed organization");
      } else {
        await follow(organizationId);
        toast.success("Following organization");
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(prevIsFollowing);
      toast.error(prevIsFollowing ? "Failed to unfollow organization" : "Failed to follow organization");
    }
  };

  return (
    <Button
      onClick={handleToggleFollow}
      isLoading={isLoading}
      disabled={isLoading}
      size={"sm"}
      className={cn(
        "w-[96px] text-xs font-semibold transition-colors absolute bottom-3 right-3",
        className
      )}
      variant={isFollowing ? "outline" : "primary"}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
