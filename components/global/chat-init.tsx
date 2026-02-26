"use client";

import React, { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { ChatService } from "@/lib/firebase/chat.service";
import { CreateChatParams } from "@/lib/firebase/types";
import { Button } from "@/components/ui/button";
import { AD } from "@/interfaces/ad";
import { cn } from "@/lib/utils";

interface ChatInitChildrenProps {
      isLoading: boolean;
      onClick: (e: React.MouseEvent) => void;
}

interface ChatInitProps {
      /** The full ad object. If provided, most other fields are resolved automatically. */
      ad?: AD;

      /** Ad ID override or manual provision */
      adId?: string;
      /** Ad Title override or manual provision */
      adTitle?: string;
      /** Ad Title in Arabic override or manual provision */
      adTitleAr?: string;
      /** Ad Main Image override or manual provision */
      adImage?: string;

      /** Seller/Recipient ID (Required if 'ad' is not provided) */
      sellerId?: string;
      /** Seller/Recipient Name override or manual provision */
      sellerName?: string;
      /** Seller/Recipient Name in Arabic override or manual provision */
      sellerNameAr?: string;
      /** Seller/Recipient Image override or manual provision */
      sellerImage?: string;
      /** Seller/Recipient Verification Status override or manual provision */
      sellerIsVerified?: boolean;

      /** The type of chat to initialize. Defaults to 'ad' */
      type?: "ad" | "dm" | "organisation";
      /** Organisation ID if type is 'organisation' */
      organisationId?: string;

      /** 
       * Custom trigger element. 
       * Can be a React node or a function (render prop) that receives { isLoading, onClick }.
       */
      children?: React.ReactNode | ((props: ChatInitChildrenProps) => React.ReactNode);

      /** Styles applied to the wrapper or default button */
      className?: string;

      // Default Button props (used only if 'children' is not provided)
      variant?:
      | "primary" | "outline" | "secondary" | "warning" | "warningOutlined"
      | "success" | "successOutlined" | "danger" | "dangerOutlined" | "ghost"
      | "filled" | "outlined" | "cancel" | "cancelOutlined" | "active" | "activeOutlined";
      size?: "default" | "small" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
      showLabel?: boolean;
      label?: string;
      iconSize?: number;
}

/**
 * A global reusable component to initialize a chat.
 * Can be used as a wrapper or a standalone button.
 * Handles auth check, finding existing chat, creating new chat, and navigation.
 */
export const ChatInit: React.FC<ChatInitProps> = ({
      ad,
      adId,
      adTitle,
      adTitleAr,
      adImage,
      sellerId,
      sellerName,
      sellerNameAr,
      sellerImage,
      sellerIsVerified,
      type = "ad",
      organisationId,
      children,
      className,
      variant = "ghost",
      size = "icon",
      showLabel = false,
      label = "Chat",
      iconSize = 20,
}) => {
      const [isLoading, setIsLoading] = useState(false);
      const router = useRouter();
      const { session, isAuthenticated } = useAuthStore((state: any) => state);

      const handleChat = async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isAuthenticated || !session.user) {
                  toast.error("Please login to start a chat");
                  router.push("/login");
                  return;
            }

            // Resolve Ad Data
            const finalAdId = ad?._id || adId;
            const finalAdTitle = ad?.title || adTitle;
            const finalAdTitleAr = ad?.titleAr || adTitleAr || finalAdTitle;
            const finalAdImage = ad?.images?.[0] || adImage || "";

            // Resolve Seller Data
            const ownerId = ad?.owner && (typeof ad.owner === 'object' ? ad.owner._id : ad.owner);
            const finalSellerId = ownerId || sellerId;

            const owner = ad?.owner && typeof ad.owner === 'object' ? ad.owner : null;
            const finalSellerName = owner?.firstName
                  ? `${owner.firstName} ${owner.lastName}`.trim()
                  : (sellerName || "Seller");
            const finalSellerNameAr = owner?.firstNameAr || sellerNameAr || finalSellerName;
            const finalSellerImage = owner?.image || sellerImage || "";
            const finalSellerVerified = owner?.emailVerified || owner?.phoneVerified || sellerIsVerified || false;

            if (!finalSellerId) {
                  toast.error("Recipient information not available");
                  return;
            }

            // Prevent chatting with self
            if (session.user._id === finalSellerId) {
                  toast.info("This is your own listing");
                  return;
            }

            setIsLoading(true);
            try {
                  const chatParams: CreateChatParams = {
                        type: type,
                        title: finalAdTitle || finalSellerName || "Chat",
                        titleAr: finalAdTitleAr || finalSellerNameAr || "Chat",
                        image: finalAdImage || finalSellerImage,
                        participants: [session.user._id, finalSellerId as string],
                        participantDetails: {
                              [session.user._id]: {
                                    name: `${session.user.firstName} ${session.user.lastName}`.trim(),
                                    nameAr: `${session.user.firstName} ${session.user.lastName}`.trim(),
                                    image: session.user.image || "",
                                    isVerified: session.user.emailVerified || false,
                              },
                              [finalSellerId as string]: {
                                    name: finalSellerName,
                                    nameAr: finalSellerNameAr,
                                    image: finalSellerImage,
                                    isVerified: finalSellerVerified,
                              },
                        },
                        adId: finalAdId,
                        adOwnerId: finalSellerId as string,
                        initiatorId: session.user._id,
                        organisationId: organisationId,
                  };

                  let chatId = await ChatService.findExistingChat(chatParams);
                  if (!chatId) {
                        chatId = await ChatService.createChat(chatParams);
                  }

                  if (chatId) {
                        router.push(`/chat?chatId=${chatId}&type=${type}`);
                  }
            } catch (error) {
                  console.error("Failed to initiate chat", error);
                  toast.error("Failed to start chat. Please try again.");
            } finally {
                  setIsLoading(false);
            }
      };

      // Render Prop Pattern
      if (typeof children === "function") {
            return <>{children({ isLoading, onClick: handleChat })}</>;
      }

      // Wrapper Pattern
      if (children) {
            return (
                  <div
                        onClick={handleChat}
                        className={cn(
                              "cursor-pointer inline-flex items-center justify-center",
                              isLoading && "opacity-50 pointer-events-none",
                              className
                        )}
                  >
                        {children}
                  </div>
            );
      }

      // Standalone Button Pattern
      return (
            <Button
                  variant={variant}
                  size={size}
                  className={cn("hover:bg-purple/10", className)}
                  onClick={handleChat}
                  isLoading={isLoading}
                  icon={<MessageSquareText size={iconSize} className="text-purple" />}
            >
                  {showLabel && !isLoading && <span className="ml-2">{label}</span>}
                  {isLoading && showLabel && <span className="ml-2">Loading...</span>}
            </Button>
      );
};
