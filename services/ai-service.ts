// Client-side AI service that uses server actions
// This keeps the OpenAI API key secure on the server side

import {
  proofreadMessage,
  generateInquiry,
  generateNegotiation,
  generateMeetingRequest,
  translateMessage,
} from "@/lib/ai-actions";

export interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  action: (text: string) => Promise<string>;
}

export class AIService {
  // Proofread and improve message
  static async proofreadMessage(message: string): Promise<string> {
    try {
      return await proofreadMessage(message);
    } catch (error) {
      console.error("Error proofreading message:", error);
      return message; // Return original message if AI fails
    }
  }

  // Generate professional inquiry
  static async generateInquiry(itemTitle: string): Promise<string> {
    try {
      const data = await generateInquiry(itemTitle);
      console.log("data: ", data);
      return data;
    } catch (error) {
      console.error("Error generating inquiry:", error);
      return "Hi! I'm interested in your item. Could you please provide more details?";
    }
  }

  // Generate negotiation message
  static async generateNegotiation(originalPrice: string): Promise<string> {
    try {
      return await generateNegotiation(originalPrice);
    } catch (error) {
      console.error("Error generating negotiation:", error);
      return "Hi! I'm interested in your item. Is the price negotiable?";
    }
  }

  // Generate meeting request
  static async generateMeetingRequest(): Promise<string> {
    try {
      return await generateMeetingRequest();
    } catch (error) {
      console.error("Error generating meeting request:", error);
      return "Hi! I'd like to arrange a meeting to view the item. When would be a convenient time for you?";
    }
  }

  // Translate message
  static async translateMessage(
    message: string,
    targetLanguage: string = "English"
  ): Promise<string> {
    try {
      return await translateMessage(message, targetLanguage);
    } catch (error) {
      console.error("Error translating message:", error);
      return message;
    }
  }

  // Get available AI features
  static getAIFeatures(): AIFeature[] {
    return [
      {
        id: "proofread",
        name: "Proofread",
        description: "Improve grammar and make message more professional",
        icon: "✏️",
        action: this.proofreadMessage,
      },
      {
        id: "inquiry",
        name: "Generate Inquiry",
        description: "Create a professional inquiry message",
        icon: "💬",
        action: this.generateInquiry,
      },
      {
        id: "negotiation",
        name: "Price Negotiation",
        description: "Generate a polite negotiation message",
        icon: "💰",
        action: this.generateNegotiation,
      },
      {
        id: "meeting",
        name: "Meeting Request",
        description: "Ask to arrange a meeting to view item",
        icon: "📅",
        action: this.generateMeetingRequest,
      },
      {
        id: "translate",
        name: "Translate",
        description: "Translate message to another language",
        icon: "🌐",
        action: this.translateMessage,
      },
    ];
  }
}
