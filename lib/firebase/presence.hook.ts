"use client";

import { useEffect, useRef } from "react";
import { ChatService } from "./chat.service";

/**
 * Hook to manage user online/offline status
 * Uses Firestore with visibility API for presence management
 */
export function usePresence(userId: string | null) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!userId || isInitialized.current) return;

    // Set user online when component mounts
    const setOnline = async () => {
      await ChatService.setOnlineStatus(userId, true);
    };

    setOnline();
    isInitialized.current = true;

    // Set user offline when component unmounts or page closes
    const handleBeforeUnload = async () => {
      await ChatService.setOnlineStatus(userId, false);
    };

    // Handle page visibility changes
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await ChatService.setOnlineStatus(userId, false);
      } else {
        await ChatService.setOnlineStatus(userId, true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Set offline on cleanup
      if (userId) {
        ChatService.setOnlineStatus(userId, false).catch(console.error);
      }
    };
  }, [userId]);
}

/**
 * Alternative: Use Firestore with a cleanup function
 * This is a simpler approach that doesn't require Realtime Database
 */
export function usePresenceFirestore(userId: string | null) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!userId) return;

    let isOnline = true;

    // Set online status
    const setOnline = async () => {
      await ChatService.setOnlineStatus(userId, true);
      isOnline = true;
    };

    // Set offline status
    const setOffline = async () => {
      if (isOnline) {
        await ChatService.setOnlineStatus(userId, false);
        isOnline = false;
      }
    };

    // Initialize online status
    setOnline();

    // Update last seen periodically while online
    const lastSeenUpdateInterval = setInterval(async () => {
      if (isOnline && !document.hidden) {
        await ChatService.setOnlineStatus(userId, true);
      }
    }, 30000); // Update every 30 seconds

    // Handle page visibility changes
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        await setOffline();
      } else {
        await setOnline();
      }
    };

    // Handle page unload
    const handleBeforeUnload = async () => {
      await setOffline();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    cleanupRef.current = async () => {
      clearInterval(lastSeenUpdateInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      await setOffline();
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [userId]);
}

