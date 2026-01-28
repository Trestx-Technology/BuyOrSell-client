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
      chat.adId === ad._id &&
      chat.participants.includes(adOwnerId) &&
      chat.participants.includes(currentUserId)
  );

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const adOwner = typeof ad.owner === "string" ? null : ad.owner;
  const adOwnerName = adOwner
    ? `${adOwner.firstName} ${adOwner.lastName}`.trim() ||
      adOwner.name ||
      "Seller"
    : "Seller";
  // Assuming arabic name isn't readily available in adOwner fields shown, reusing name
  const adOwnerNameAr = adOwnerName;
  const adOwnerAvatar = adOwner?.image || "";
  const adOwnerVerified = adOwner?.emailVerified || false;

  const currentUserName =
    `${currentUser.firstName} ${currentUser.lastName}`.trim();
  const currentUserNameAr = currentUserName; // Fallback
  const currentUserAvatar = ""; // You may need to get this from user profile
  const currentUserVerified = currentUser.emailVerified || false;

  const chatId = await ChatService.createChat({
    type: "ad",
    title: ad.title,
    titleAr: ad.titleAr || ad.title,
    image: ad.images?.[0] || "",
    participants: [currentUserId, adOwnerId],
    participantDetails: {
      [currentUserId]: {
        name: currentUserName,
        nameAr: currentUserNameAr,
        image: currentUserAvatar,
        isVerified: currentUserVerified,
      },
      [adOwnerId]: {
        name: adOwnerName,
        nameAr: adOwnerNameAr,
        image: adOwnerAvatar,
        isVerified: adOwnerVerified,
      },
    },
    adId: ad._id,
  });

  return chatId;
}

/**
 * Find or create a DM (Direct Message) chat between two users
 * @param currentUser - The current authenticated user
 * @param otherUser - Information about the user to chat with
 * @returns The chat ID
 */
export async function findOrCreateDmChat(
  currentUser: SessionUser,
  otherUser: { id: string; name: string; image?: string; isVerified?: boolean }
): Promise<string> {
  const currentUserId = currentUser._id;
  const otherUserId = otherUser.id;

  if (!otherUserId) {
    throw new Error("Target user ID not found");
  }

  // Check if DM chat already exists
  // Get all chats for current user of type "dm"
  const userChats = await ChatService.getUserChats(currentUserId, "dm");

  // Find chat where participants are exactly these two users
  const existingChat = userChats.find(
    (chat) =>
      chat.participants.length === 2 &&
      chat.participants.includes(otherUserId) &&
      chat.participants.includes(currentUserId)
  );

  if (existingChat) {
    return existingChat.id;
  }

  // Create new DM chat
  const currentUserName = `${currentUser.firstName} ${currentUser.lastName}`.trim();
  const currentUserNameAr = currentUserName;
  const currentUserAvatar = currentUser.image || "";
  const currentUserVerified = currentUser.emailVerified || false;

  const chatId = await ChatService.createChat({
    type: "dm",
    title: otherUser.name,
    titleAr: otherUser.name,
    image: otherUser.image || "",
    participants: [currentUserId, otherUserId],
    participantDetails: {
      [currentUserId]: {
        name: currentUserName,
        nameAr: currentUserNameAr,
        image: currentUserAvatar,
        isVerified: currentUserVerified,
      },
      [otherUserId]: {
        name: otherUser.name,
        nameAr: otherUser.name,
        image: otherUser.image || "",
        isVerified: otherUser.isVerified || false,
      },
    },
  });

  return chatId;
}

