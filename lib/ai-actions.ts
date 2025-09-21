"use server";

import OpenAI from "openai";

// Initialize OpenAI client on server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use environment variable or fallback to cost-effective model
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-nano"; // Fallback to valid model

// Proofread and improve message
export async function proofreadMessage(message: string): Promise<string> {
  try {
    console.log("Server action called with message:", message);
    console.log("API key exists:", !!process.env.OPENAI_API_KEY);
    console.log("Environment:", process.env.NODE_ENV);

    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key found, returning fallback message");
      return `[AI Proofread] ${message}`;
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert editor specializing in DM-style communication for BuyOrSell classified ads platform.

Your task is to proofread and enhance messages to make them:
1. Grammatically correct and error-free
2. Casual but respectful in tone (like DMs, not emails)
3. Clear, concise, and easy to understand
4. Polite and friendly in tone
5. Well-structured but conversational
6. Engaging and natural for the recipient
7. Appropriate for casual buyer-seller communication
8. Free of typos, spelling errors, and awkward phrasing
9. Enhanced with better vocabulary while keeping it conversational
10. Maintained original intent and casual tone

Guidelines:
- Fix all grammar, spelling, and punctuation errors
- Improve sentence structure and flow
- Enhance clarity and readability
- Keep the tone casual but respectful (like texting/DMing)
- Ensure appropriate communication etiquette for DMs
- Keep the message concise and conversational
- Maintain the original message's core intent and casual style
- Use appropriate casual greetings and closings if missing`,
        },
        {
          role: "user",
          content: `Please proofread and enhance this DM-style message for a classified ads platform: "${message}"

Make it:
- Grammatically perfect
- Casual but clear
- Polite and friendly
- Well-structured but conversational
- Appropriate for DM communication
- Error-free and natural`,
        },
      ],
      max_completion_tokens: 200,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || message;
  } catch (error) {
    console.error("Error proofreading message:", error);
    return message; // Return original message if AI fails
  }
}

// Generate professional inquiry
export async function generateInquiry(itemTitle: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key found, returning fallback inquiry");
      return `Hi! I'm interested in your ${itemTitle}. Could you please provide more details about the condition, price, and availability?`;
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert assistant that generates casual but professional DM-style inquiry messages for classified ads on BuyOrSell platform. 

Your task is to create engaging, direct messages that:
1. Show genuine interest in the item
2. Ask relevant questions in a conversational tone
3. Use casual but respectful language (like DMs, not emails)
4. Include specific questions about condition, history, features, and logistics
5. Sound like a real person interested in buying
6. Be friendly and approachable in tone
7. Use simple greetings and casual closings
8. Ask 2-4 specific, relevant questions
9. Mention willingness to view the item if appropriate
10. Keep the message concise and conversational (80-150 words)

Context: This is for a classified ads platform where buyers and sellers communicate via direct messages. The messages should be casual, friendly, and conversational - like texting or DMing someone, not formal business emails.`,
        },
        {
          role: "user",
          content: `Generate a casual, DM-style inquiry message for this item: "${itemTitle}"

The message should:
- Start with a casual greeting (Hi, Hello, Hey)
- Express genuine interest in the specific item
- Ask 2-4 relevant questions in a conversational way
- Inquire about condition, history, features, availability
- Show knowledge about the item type
- Mention willingness to view/inspect if appropriate
- End with a casual closing
- Sound like a real person DMing, not a formal email
- Be specific to the item type and category`,
        },
      ],
      max_completion_tokens: 300,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content ||
      "Hi! I'm interested in your item. Could you please provide more details?"
    );
  } catch (error) {
    console.error("Error generating inquiry:", error);
    return "Hi! I'm interested in your item. Could you please provide more details?";
  }
}

// Generate negotiation message
export async function generateNegotiation(
  originalPrice: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key found, returning fallback negotiation");
      return `Hi! I'm interested in your item. Is the price negotiable? I'm looking to pay around ${originalPrice}.`;
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert assistant that generates casual but respectful DM-style negotiation messages for classified ads on BuyOrSell platform.

Your task is to create friendly negotiation messages that:
1. Show genuine interest and respect for the seller
2. Use casual, conversational language (like DMs, not emails)
3. Be tactful but not overly formal about price discussions
4. Present negotiation points in a friendly way
5. Acknowledge the asking price casually
6. Suggest flexibility or alternative arrangements conversationally
7. Offer to discuss terms that work for both parties
8. Mention willingness to move quickly if terms work
9. Use casual but respectful tone
10. Keep the message concise and conversational (60-120 words)

Context: This is for a classified ads platform where buyers and sellers negotiate via direct messages. The messages should be casual, friendly, and conversational - like texting someone about a price, not formal business negotiations.`,
        },
        {
          role: "user",
          content: `Generate a casual, DM-style negotiation message for an item priced at: "${originalPrice}"

The message should:
- Start with a casual greeting (Hi, Hello, Hey)
- Acknowledge the asking price casually
- Express genuine interest in the item
- Suggest price flexibility in a friendly way
- Mention budget considerations tactfully
- Offer to discuss terms that work for both
- Show willingness to move forward quickly
- Use casual and friendly tone
- Avoid being pushy or demanding
- End with a casual closing`,
        },
      ],
      max_completion_tokens: 250,
      temperature: 0.6,
    });

    return (
      response.choices[0]?.message?.content ||
      "Hi! I'm interested in your item. Is the price negotiable?"
    );
  } catch (error) {
    console.error("Error generating negotiation:", error);
    return "Hi! I'm interested in your item. Is the price negotiable?";
  }
}

// Generate meeting request
export async function generateMeetingRequest(): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log(
        "No OpenAI API key found, returning fallback meeting request"
      );
      return "Hi! I'd like to arrange a meeting to view the item. When would be a convenient time for you?";
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert assistant that generates casual but respectful DM-style meeting request messages for classified ads on BuyOrSell platform.

Your task is to create friendly meeting request messages that:
1. Express genuine interest in viewing the item
2. Show respect for the seller's time in a casual way
3. Demonstrate serious buyer intent conversationally
4. Suggest flexible timing options casually
5. Mention willingness to travel or meet at convenient locations
6. Ask about viewing conditions in a friendly way
7. Express readiness to make a decision after viewing
8. Use casual but courteous language (like DMs, not emails)
9. Include simple greeting and casual closing
10. Keep the message concise and conversational (60-120 words)

Context: This is for a classified ads platform where buyers request to view items via direct messages. The messages should be casual, friendly, and conversational - like texting someone to arrange a meeting, not formal business requests.`,
        },
        {
          role: "user",
          content: `Generate a casual, DM-style meeting request message for viewing an item.

The message should:
- Start with a casual greeting (Hi, Hello, Hey)
- Express genuine interest in viewing the item
- Show respect for the seller's time casually
- Suggest flexible meeting times and locations
- Ask about viewing requirements in a friendly way
- Demonstrate serious buyer intent conversationally
- Mention willingness to travel if needed
- Express readiness to make a decision after viewing
- Use casual and friendly tone
- End with a casual closing`,
        },
      ],
      max_completion_tokens: 250,
      temperature: 0.6,
    });

    return (
      response.choices[0]?.message?.content ||
      "Hi! I'd like to arrange a meeting to view the item. When would be a convenient time for you?"
    );
  } catch (error) {
    console.error("Error generating meeting request:", error);
    return "Hi! I'd like to arrange a meeting to view the item. When would be a convenient time for you?";
  }
}

// Translate message
export async function translateMessage(
  message: string,
  targetLanguage: string = "English"
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("No OpenAI API key found, returning original message");
      return message;
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert translator specializing in DM-style communication for BuyOrSell classified ads platform.

Your task is to translate messages while:
1. Maintaining the original casual tone and intent perfectly
2. Preserving the DM-style communication style
3. Keeping the message casual but appropriate
4. Ensuring cultural sensitivity and local context
5. Maintaining casual greetings and closings
6. Preserving any specific terminology or technical terms
7. Keeping the message natural and fluent in the target language
8. Maintaining the same casual level as the original
9. Ensuring the translation sounds native and conversational
10. Preserving any emotional tone or urgency

Guidelines:
- Translate accurately while maintaining natural conversational flow
- Preserve casual communication standards (like DMs/texting)
- Keep the same level of friendliness and respect
- Maintain any specific formatting or structure
- Ensure cultural appropriateness for the target language
- Keep technical terms accurate and consistent
- Maintain the original message's casual impact and effectiveness`,
        },
        {
          role: "user",
          content: `Translate this DM-style classified ads message to ${targetLanguage}: "${message}"

Requirements:
- Maintain the original casual tone and intent
- Keep it conversational and DM-appropriate
- Preserve all casual greetings, closings, and structure
- Ensure natural and fluent translation
- Maintain the same casual level
- Keep any technical terms accurate`,
        },
      ],
      max_completion_tokens: 200,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || message;
  } catch (error) {
    console.error("Error translating message:", error);
    return message;
  }
}
