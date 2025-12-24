"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { AD } from "@/interfaces/ad";
import { useRouter } from "nextjs-toploader/app";
import { useAuthStore } from "@/stores/authStore";
import { findOrCreateAdChat } from "@/lib/firebase/chat.utils";
import { toast } from "sonner";

interface ContactActionsProps {
  ad: AD;
}

const ContactActions: React.FC<ContactActionsProps> = ({ ad }) => {
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if current user is the owner or organization owner
  const isOwner = useMemo(() => {
    if (!session.user?._id) return false;
    
    const currentUserId = session.user._id;
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
    const orgOwnerId = ad.organization?.owner;
    
    return currentUserId === adOwnerId || currentUserId === orgOwnerId;
  }, [session.user?._id, ad.owner, ad.organization?.owner]);
  
  // Don't show contact options if user is viewing their own ad
  if (isOwner) {
    return null;
  }

  const handleCall = () => {
    if (ad.contactPhoneNumber) {
      window.location.href = `tel:${ad.contactPhoneNumber}`;
    } else {
      console.log("Phone number not available");
    }
  };

  const handleMessage = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !session.user) {
      toast.error("Please login to send a message");
      router.push("/login");
      return;
    }

    // Check if ad has an owner
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
    if (!adOwnerId) {
      toast.error("Unable to find ad owner");
      return;
    }

    setIsLoading(true);
    try {
      // Find or create chat
      const chatId = await findOrCreateAdChat(ad, session.user);
      
      // Navigate to chat page with the chat ID
      router.push(`/chat?chatId=${chatId}&type=ad`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (ad.contactPhoneNumber) {
      const phoneNumber = ad.contactPhoneNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
    } else {
      console.log("Phone number not available");
    }
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky bottom-0 z-[111]">
      {/* Call Button */}
      <Button
        onClick={handleCall}
        variant="primary"
        icon={<Phone className="h-5 w-5 -mr-2 fill-white" stroke="0" />}
        iconPosition="center"
        className="w-full h-10 lg:h-12"
      >
        Call Seller
      </Button>

      {/* Message Button */}
      <Button
        onClick={handleMessage}
        disabled={isLoading}
        variant="outline"
        icon={<MdMessage className="h-5 w-5 -mr-2 fill-dark-blue" stroke="0" />}
        iconPosition="center"
        className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-10 lg:h-12 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Loading..." : "Send Message"}
      </Button>

      {/* WhatsApp Button */}
      <Button
        onClick={handleWhatsApp}
        variant="outline"
        icon={
          <FaWhatsapp className="h-5 w-5 -mr-2 fill-green-500" stroke="1" />
        }
        iconPosition="center"
        className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-10 lg:h-12"
      >
        WhatsApp
      </Button>
    </div>
  );
};

export default ContactActions;
