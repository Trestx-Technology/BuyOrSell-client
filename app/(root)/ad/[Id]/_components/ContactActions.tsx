"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
interface ContactActionsProps {
  adId: string;
}

const ContactActions: React.FC<ContactActionsProps> = () => {
  const handleCall = () => {
    // Implement call functionality
    console.log("Call seller");
  };

  const handleMessage = () => {
    // Implement message functionality
    console.log("Send message");
  };

  const handleWhatsApp = () => {
    // Implement WhatsApp functionality
    console.log("WhatsApp seller");
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
        variant="outline"
        icon={<MdMessage className="h-5 w-5 -mr-2 fill-dark-blue" stroke="0" />}
        iconPosition="center"
        className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-10 lg:h-12"
      >
        Send Message
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
