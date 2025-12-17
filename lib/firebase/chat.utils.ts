"use client";

import { ChatService } from "./chat.service";
import { ChatType } from "./types";
import { AD } from "@/interfaces/ad";
import { SessionUser } from "@/stores/authStore";

/**
 * Find or create a chat for an ad
 * @param ad - The ad object
 * @param currentUser - The current authenticated user
 * @returns The chat ID
 */
export async function findOrCreateAdChat(
  ad: AD,
  currentUser: SessionUser
): Promise<string> {
  // Get ad owner ID
  const adOwnerId =
    typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
  
  if (!adOwnerId) {
    throw new Error("Ad owner not found");
  }

  const currentUserId = currentUser._id;

  // Check if chat already exists
  // Get all chats for current user of type "ad"
  const userChats = await ChatService.getUserChats(currentUserId, "ad");

  // Find chat that matches this ad
  const existingChat = userChats.find(
    (chat) =>
      chat.ad?.adId === ad._id &&
      chat.participants.includes(adOwnerId) &&
      chat.participants.includes(currentUserId)
  );

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const adOwner = typeof ad.owner === "string" ? null : ad.owner;
  const adOwnerName = adOwner
    ? `${adOwner.firstName} ${adOwner.lastName}`.trim() || adOwner.name || "Seller"
    : "Seller";
  const adOwnerAvatar = adOwner?.image || "";
  const adOwnerVerified = adOwner?.emailVerified || false;

  const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`.trim();
  const currentUserAvatar = ""; // You may need to get this from user profile
  const currentUserVerified = currentUser.emailVerified || false;

  const chatId = await ChatService.createChat({
    chatType: "ad" as ChatType,
    participants: [currentUserId, adOwnerId],
    participantDetails: {
      [currentUserId]: {
        name: currentUserName,
        avatar: currentUserAvatar,
        isVerified: currentUserVerified,
      },
      [adOwnerId]: {
        name: adOwnerName,
        avatar: adOwnerAvatar,
        isVerified: adOwnerVerified,
      },
    },
    ad: {
      adId: ad._id,
      adTitle: ad.title,
      adImage: ad.images?.[0] || "",
      adPrice: ad.price || 0,
    },
  });

  return chatId;
}

