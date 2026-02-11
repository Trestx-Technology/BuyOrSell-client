"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { AD } from "@/interfaces/ad";
import { useAuthStore } from "@/stores/authStore";
import { ChatInit } from "@/components/global/chat-init";

interface ContactActionsProps {
  ad: AD;
}

const ContactActions: React.FC<ContactActionsProps> = ({ ad }) => {
  const { session } = useAuthStore((state) => state);
  
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

      {/* Message Button via ChatInit */}
      <ChatInit ad={ad}>
        {({ isLoading, onClick }) => (
          <Button
            onClick={onClick}
            isLoading={isLoading}
            variant="outline"
            icon={<MdMessage className="h-5 w-5 -mr-2 fill-dark-blue" stroke="0" />}
            iconPosition="center"
            className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center h-10 lg:h-12"
          >
            Send Message
          </Button>
        )}
      </ChatInit>

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
