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
  currentUser: SessionUser,
): Promise<string> {
  // Get ad owner ID
  const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;

  if (!adOwnerId) {
    throw new Error("Ad owner not found");
  }

  const currentUserId = currentUser._id;

  // With deterministic IDs and ChatService.createChat checking for existence,
  // we can just prepare the data and call createChat.

  const adOwner = typeof ad.owner === "string" ? null : ad.owner;
  const adOwnerName = adOwner
    ? `${adOwner.firstName} ${adOwner.lastName}`.trim() ||
      adOwner.name ||
      "Seller"
    : "Seller";
  const adOwnerNameAr = adOwnerName;
  const adOwnerAvatar = adOwner?.image || "";
  const adOwnerVerified = adOwner?.emailVerified || false;

  const currentUserName =
    `${currentUser.firstName} ${currentUser.lastName}`.trim();
  const currentUserNameAr = currentUserName;
  const currentUserAvatar = currentUser.image || "";
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
    adOwnerId: adOwnerId,
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
  otherUser: { id: string; name: string; image?: string; isVerified?: boolean },
): Promise<string> {
  const currentUserId = currentUser._id;
  const otherUserId = otherUser.id;

  if (!otherUserId) {
    throw new Error("Target user ID not found");
  }

  const currentUserName =
    `${currentUser.firstName} ${currentUser.lastName}`.trim();
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
    initiatorId: currentUserId,
  });

  return chatId;
}

/**
 * Find or create an organization-based chat
 * @param currentUser - The current authenticated user
 * @param otherUser - Information about the user to chat with
 * @param organisationId - The ID of the organization initiating the chat
 * @returns The chat ID
 */
export async function findOrCreateOrganisationChat(
  currentUser: SessionUser,
  otherUser: { id: string; name: string; image?: string; isVerified?: boolean },
  organisationId: string,
  organisationName?: string,
  organisationImage?: string,
): Promise<string> {
  const currentUserId = currentUser._id;
  const otherUserId = otherUser.id;

  if (!otherUserId) {
    throw new Error("Target user ID not found");
  }

  const currentUserName =
    `${currentUser.firstName} ${currentUser.lastName}`.trim();
  const currentUserNameAr = currentUserName;
  const currentUserAvatar = currentUser.image || "";
  const currentUserVerified = currentUser.emailVerified || false;

  const chatId = await ChatService.createChat({
    type: "organisation",
    title: organisationName || otherUser.name,
    titleAr: organisationName || otherUser.name,
    image: organisationImage || otherUser.image || "",
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
    organisationId: organisationId,
    initiatorId: currentUserId,
  });

  return chatId;
}

