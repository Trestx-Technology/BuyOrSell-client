import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";

const ContactButtons = () => {
  return (
    <div className="space-y-3">
      {/* Call Button */}
      <Button
        variant="primary"
        icon={<Phone className="h-5 w-5 -mr-2 fill-white" stroke="0" />}
        iconPosition="center"
        className="w-full h-12"
      >
        Call Seller
      </Button>

      {/* Message Button */}
      <Button
        variant="outline"
        icon={
          <MdMessage className="h-5 w-5 -mr-2 fill-dark-blue" stroke="white" />
        }
        iconPosition="center"
        className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12"
      >
        Send Message
      </Button>

      {/* WhatsApp Button */}
      <Button
        variant="outline"
        icon={
          <FaWhatsapp className="h-5 w-5 -mr-2 fill-green-500" stroke="0" />
        }
        iconPosition="center"
        className="w-full border-gray-300 text-dark-blue hover:bg-gray-50 flex items-center justify-center gap-2 h-12"
      >
        WhatsApp
      </Button>
    </div>
  );
};

export default ContactButtons;
