"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Smile, Paperclip, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIFeaturesPopover } from "./AIFeaturesPopover";
import { AutosizeTextarea } from "@/components/global/autosize-textarea";
import { toast } from "sonner";
import { LocationSelectorDialog } from "./LocationSelectorDialog"; // Import new component

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (data?: {
    type: "text" | "location" | "file";
    text?: string;
    fileUrl?: string;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  onAIMessageGenerated: (message: string) => void;
  itemTitle?: string;
  itemPrice?: string;
  placeholder?: string;
  maxRows?: number;
  minRows?: number;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onAIMessageGenerated,
  itemTitle = "Item",
  itemPrice = "",
  maxRows = 5,
  minRows = 1,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setRows] = useState(minRows);
  const [isUploading, setIsUploading] = useState(false);
  // const [isLocating, setIsLocating] = useState(false); // Removed direct locating state
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the number of rows needed
    const lineHeight = 24; // Approximate line height in pixels
    const padding = 16; // Total padding (8px top + 8px bottom)
    const scrollHeight = textarea.scrollHeight;

    // If content is empty, reset to minRows
    if (!value.trim()) {
      setRows(minRows);
      textarea.style.height = `${minRows * lineHeight + padding}px`;
      return;
    }

    const newRows = Math.max(
      minRows,
      Math.min(maxRows, Math.ceil((scrollHeight - padding) / lineHeight))
    );

    setRows(newRows);
    textarea.style.height = `${newRows * lineHeight + padding}px`;
  }, [value, minRows, maxRows]);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  // Reset height when component mounts or value becomes empty
  useEffect(() => {
    if (!value.trim()) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = `${minRows * 24 + 16}px`;
        setRows(minRows);
      }
    }
  }, [value, minRows]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Open the location dialog instead of direct geolocation
  const handleLocationShare = () => {
    setIsLocationDialogOpen(true);
  };

  // Handle location selection from the map component
  const handleLocationSelect = (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => {
    onSend({
      type: "location",
      coordinates: {
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
      },
      text: "Shared a location", // Or use location.address if preferred
    });
    setIsLocationDialogOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);

      // Upload to your API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      onSend({
        type: "file",
        fileUrl: data.url || data.fileUrl, // Adjust based on your API response
        text: "Shared an image",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="border-t border-gray-200 sticky bottom-0 bg-white">
      <div className="flex items-center gap-2 md:gap-3 bg-purple/10 p-4">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
        />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-500 hover:text-purple hover:bg-purple/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Send Image"
          >
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-500 hover:text-purple hover:bg-purple/10"
            onClick={handleLocationShare}
            disabled={isUploading}
            title="Share Location"
          >
            <MapPin className="h-5 w-5" />
          </Button>
        </div>

        <AIFeaturesPopover
          onMessageGenerated={onAIMessageGenerated}
          currentMessage={value}
          itemTitle={itemTitle}
          itemPrice={itemPrice}
        />

        <div className="flex-1 relative">
          <AutosizeTextarea
            placeholder="Enter your message"
            maxHeight={200}
            minHeight={42}
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isUploading}
          />

          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Smile className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        <Button
          onClick={() => onSend()}
          disabled={!value.trim() || isUploading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 p-3"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      <LocationSelectorDialog
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
