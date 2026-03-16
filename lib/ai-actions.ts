"use server";

import OpenAI from "openai";
import { cookies } from "next/headers";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import {
  getCategoriesTree,
  semanticSearchCategories,
} from "@/app/api/categories/categories.services";

// Helper to get OpenAI client lazily to ensure environment variables are loaded
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("[AI] OPENAI_API_KEY is missing in current environment!");
    return null;
  }
  return new OpenAI({ apiKey });
}

// Helper to get model with fallback
function getAIModel() {
  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

// Proofread and improve message
export async function proofreadMessage(message: string): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[AI] No OpenAI API key found, returning fallback message");
      return `[AI Proofread] ${message}`;
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
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
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[AI] No OpenAI API key found, returning fallback inquiry");
      return `Hi! I'm interested in your ${itemTitle}. Could you please provide more details about the condition, price, and availability?`;
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
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
  originalPrice: string,
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[AI] No OpenAI API key found, returning fallback negotiation");
      return `Hi! I'm interested in your item. Is the price negotiable? I'm looking to pay around ${originalPrice}.`;
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
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
    const openai = getOpenAIClient();
    if (!openai) {
      console.log(
        "[AI] No OpenAI API key found, returning fallback meeting request",
      );
      return "Hi! I'd like to arrange a meeting to view the item. When would be a convenient time for you?";
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
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
  targetLanguage: string = "English",
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[AI] No OpenAI API key found, returning original message");
      return message;
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
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
    });

    return response.choices[0]?.message?.content || message;
  } catch (error) {
    console.error("Error translating message:", error);
    return message;
  }
}

// Generate ad/job description
export async function generateDescription(
  categoryPath: string,
  userPrompt?: string,
  existingDescription?: string,
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[AI] No OpenAI API key found, using fallback");
      return (
        existingDescription ||
        `Excellent ${categoryPath} for sale. Please contact for details.`
      );
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
      messages: [
        {
          role: "system",
          content: `You are an expert copywriter for "BuyOrSell".
Write a high-quality, professional description for a listing.

GUIDELINES:
1. SAFETY: Do NOT generate offensive or harmful content.
2. LENGTH: Max 2000 characters.
3. CONTEXT: Category is "${categoryPath}".
4. TONE: Professional and appealing.
5. FORMAT: Use clear paragraphs with double newlines (\n\n) between them. Use bullet points for lists to ensure great readability.
6. NO LINKS: Do not include external links or contact info.
7. SPECIFICITY: Mention specific details if provided in the notes (e.g., brand, model, condition).`,
        },
        {
          role: "user",
          content: `Category: "${categoryPath}"
${userPrompt ? `Notes: "${userPrompt}"` : ""}
${existingDescription ? `Original: "${existingDescription}"` : "Create a new description."}`,
        },
      ],
    });

    let content = response.choices[0]?.message?.content || "";

    if (!content && response.choices[0]?.finish_reason === "content_filter") {
      return "I'm sorry, but I couldn't generate a description for this request. Please try a different or more specific prompt.";
    }

    // Safety check on the output (redundant but good practice)
    if (content.length > 2000) {
      content = content.substring(0, 1997) + "...";
    }

    return content;
  } catch (error: any) {
    console.error("Error generating description:", error);
    throw new Error(
      error.message ||
        "Failed to generate description. Please try again with different details.",
    );
  }
}

export async function generatePromptFromImages(
  imageUrls: string[],
): Promise<{ description: string; adType: string }> {
  try {
    const openai = getOpenAIClient();
    if (!openai || imageUrls.length === 0) {
      console.log("[AI] Skipping prompt generation: missing OpenAI key or no images");
      return { description: "", adType: "Item/Classified" };
    }

    const content: any[] = [
      {
        type: "text",
        text: `Analyze these images and identify:
1. Brand, model, color, and condition.
2. The ad category type (e.g., 'Vehicles', 'Electronics', 'Jewelry & Watches', 'Jobs', 'Real Estate').

Return a JSON object:
{
  "description": "bulleted description",
  "adType": "Specific Category Group"
}`,
      },
    ];

    imageUrls.forEach((url) => {
      content.push({
        type: "image_url",
        image_url: {
          url: url,
          detail: "auto",
        },
      });
    });

    const response = await openai.chat.completions.create({
      model: getAIModel(),
      messages: [
        {
          role: "system",
          content:
            "You are an expert at analyzing product images and identifying intent and product details.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      description: result.description || "",
      adType: result.adType || "Item/Classified",
    };
  } catch (error) {
    console.error("Error generating prompt from images:", error);
    return { description: "", adType: "Item/Classified" };
  }
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  parentId: string | null;
  relatedTo?: string;
}

/**
 * Identifies the most appropriate category and returns a redirect URL with hierarchy info
 */
export async function identifyCategory(
  userPrompt: string,
  imageUrls: string[] = [],
  providedCategories?: any[],
  adType?: string,
): Promise<{
  redirectUrl: string | null;
  categoryPath: CategoryHierarchy[];
  suggestedTitle?: string;
}> {
  console.log("[AI] identifyCategory called with:", {
    userPromptLength: userPrompt?.length,
    imagesCount: imageUrls?.length,
    adType,
  });
  try {
    // 0. Preliminary credentials check
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error(
        "AI credentials are not configured. Please contact support.",
      );
    }

    // 1. Use AI to refine the search query and suggest a title/type
    const aiResponse = await openai.chat.completions.create({
      model: getAIModel(),
      messages: [
        {
          role: "system",
          content: `You are an expert semantic search optimizer for "BuyOrSell".
Your task: Analyze the user's ad description and images to extract the core search query for a category database.

INSTRUCTIONS:
1. Extract the primary product type and brand (e.g., "Rolex watch", "Used BMW", "3 bedroom villa").
2. Determine if the user is looking for a JOB or an AD.
3. Your search query should be targeted towards finding a SPECIFIC LEAF CATEGORY (the most granular level).
   Example: If the product is a laptop, don't just search for "Electronics", search for "Laptops".
4. Return a JSON object only.

OUTPUT (JSON only):
{
  "searchQuery": "refined search query for leaf category search",
  "title": "Short catchy ad title (max 50 chars)",
  "adType": "AD" | "JOB",
  "reasoning": "Quick reasoning"
}`,
        },
        {
          role: "user",
          content: `User Prompt: "${userPrompt}"\n${adType ? `Context Ad Type: ${adType}` : ""}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseContent = aiResponse.choices[0]?.message?.content || "{}";
    const parsedResponse = JSON.parse(responseContent);
    const {
      searchQuery,
      title: suggestedTitle,
      adType: intentAdType,
    } = parsedResponse;

    console.log(
      `[AI] Refined Query: "${searchQuery}", intentAdType: ${intentAdType}`,
    );

    // 2. Use the Semantic Category Search API directly via fetch (safer in Server Actions)
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!BACKEND_URL) {
      console.error("[AI] NEXT_PUBLIC_BACKEND_URL is missing!");
      return { redirectUrl: null, categoryPath: [] };
    }

    // Get auth token from cookies for the server-side request
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_NAMES.ACCESS_TOKEN)?.value;

    console.log(
      `[AI] Fetching semantic results from: ${BACKEND_URL}/categories/search/semantic`,
    );

    const semanticRes = await fetch(
      `${BACKEND_URL}/categories/search/semantic?query=${encodeURIComponent(searchQuery)}&limit=1`,
      {
        cache: "no-store",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
        },
      },
    );

    if (!semanticRes.ok) {
      console.error(
        `[AI] Semantic API failed: ${semanticRes.status} ${semanticRes.statusText}`,
      );
      return { redirectUrl: null, categoryPath: [] };
    }

    const semanticData = await semanticRes.json();
    // API structure: { statusCode: 200, data: { results: [...] } }
    let bestMatch = semanticData.data?.results?.[0];

    if (!bestMatch) {
      console.warn(
        "[AI] Semantic API returned no results for query:",
        searchQuery,
      );
      return { redirectUrl: null, categoryPath: [] };
    }

    // Capture initial parent hierarchy if it exists from semantic search result
    let parentId = bestMatch.parentId;
    let parentName = bestMatch.parentName;
    let rootRelatedTo = bestMatch.tree?.relatedTo;

    // Recursively drill down to the absolute leaf node
    // We follow the 'tree' property returned by the API which contains nested children
    let currentTree = bestMatch.tree;
    while (
      currentTree &&
      currentTree.children &&
      currentTree.children.length > 0
    ) {
      console.log(`[AI] Drilling down from: ${currentTree.name}`);

      // Update parent info as we move down
      parentId = currentTree._id;
      parentName = currentTree.name;

      // Take the first child (most relevant usually)
      const nextChild = currentTree.children[0];

      // Update bestMatch reference for the final ID/Name
      bestMatch = {
        ...bestMatch,
        id: nextChild._id,
        name: nextChild.name,
        parentId: parentId,
        parentName: parentName,
        // Update the tree reference to continue recursion
        tree: nextChild,
        relatedTo: nextChild.relatedTo || rootRelatedTo,
      };

      // Move deeper
      currentTree = nextChild;
    }

    console.log(`[AI] FINAL LEAF -> ${bestMatch.name} (ID: ${bestMatch.id})`);

    // 3. Determine redirect parameters
    const pathPrefix = intentAdType === "JOB" ? "post-job" : "post-ad";

    // Create a hierarchy for the redirect
    const hierarchy: CategoryHierarchy[] = [];
    if (bestMatch.parentId && bestMatch.parentName) {
      hierarchy.push({
        id: bestMatch.parentId,
        name: bestMatch.parentName,
        parentId: null,
        relatedTo: rootRelatedTo,
      });
    }
    hierarchy.push({
      id: bestMatch.id,
      name: bestMatch.name,
      parentId: bestMatch.parentId || null,
      relatedTo: bestMatch.relatedTo || rootRelatedTo,
    });

    const categoryPathParam = encodeURIComponent(JSON.stringify(hierarchy));
    const redirectUrl = `/${pathPrefix}/details/${bestMatch.id}?categoryPath=${categoryPathParam}`;

    return {
      redirectUrl,
      categoryPath: hierarchy,
      suggestedTitle: suggestedTitle || "",
    };
  } catch (error) {
    console.error("Error identifying category:", error);
    return { redirectUrl: null, categoryPath: [] };
  }
}
