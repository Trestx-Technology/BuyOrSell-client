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
          content: `You are Nora, an expert professional editor.
Your task is to proofread and enhance messages based on the user's intent.

Make the message:
1. Grammatically correct and error-free.
2. Tone-appropriate (casual for DMs, professional for formal contexts).
3. Clear, concise, and easy to understand.
4. Polite and respectful.
5. Well-structured but natural.
6. Enhanced with better vocabulary while keeping the original intent.
7. Free of typos, spelling errors, and awkward phrasing.

Guidelines:
- Fix all grammar, spelling, and punctuation errors.
- Improve sentence structure and flow.
- Maintain the original message's core meaning.
- Keep the tone natural for the context.`,
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
          content: `You are Nora, a professional communication assistant. 
Your task is to create engaging, direct inquiry messages that:
1. Show genuine interest in the specific item or service.
2. Ask 2-4 relevant questions in a conversational tone.
3. Be respectful and friendly.
4. Sound like a real person interested and ready to proceed.
5. Include specific questions about condition, history, features, or logistics.
6. Use simple greetings and natural closings.
7. Keep the message concise (80-150 words).

Context: This message should be direct and helpful, encouraging the seller/provider to respond quickly with details.`,
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
      console.log(
        "[AI] No OpenAI API key found, returning fallback negotiation",
      );
      return `Hi! I'm interested in your item. Is the price negotiable? I'm looking to pay around ${originalPrice}.`;
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
      messages: [
        {
          role: "system",
          content: `You are Nora, an expert negotiation assistant.
Your task is to create friendly, respectful, and effective price negotiation messages that:
1. Show genuine interest and respect for the seller or provider.
2. Be tactful and professional about price discussions.
3. Present negotiation points clearly and politely.
4. Suggest flexibility or alternative arrangements conversationally.
5. Offer to discuss terms that work for both parties.
6. Mention willingness to move quickly if an agreement is reached.
7. Avoid being pushy, demanding, or disrespectful.
8. Keep the message concise (60-120 words).`,
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
          content: `You are Nora, a professional assistant for arranging meetings.
Your task is to create friendly meeting request messages that:
1. Express genuine interest in viewing the item or meeting.
2. Show respect for the other person's time.
3. Demonstrate serious intent and readiness to proceed.
4. Suggest flexible timing and location options naturally.
5. Ask about viewing conditions or requirements politely.
6. Express readiness to make a decision after the meeting.
7. Keep the message professional but natural.
8. Include a simple greeting and natural closing.
9. Keep the message concise (60-120 words).`,
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
          content: `You are Nora, an expert professional translator.
Your task is to translate messages while:
1. Maintaining the original tone, intent, and impact perfectly.
2. Preserving natural conversational flow for the context.
3. Ensuring cultural sensitivity and local context for the target language.
4. Maintaining casual/professional greetings and closings appropriately.
5. Preserving technical terms and specific terminology accurately.
6. Ensuring the translation sounds native and natural.
7. Preserving any emotional tone or urgency.
8. Keeping the translation natural and fluent.`,
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
  orgName?: string,
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    console.log(
      `[AI] Generating description for: ${categoryPath}${orgName ? ` (Org: ${orgName})` : ""}`,
    );
    const openai = getOpenAIClient();

    if (!openai) {
      console.warn(
        "[AI] Failure: OPENAI_API_KEY is not configured in the environment.",
      );
      return {
        success: false,
        error:
          "Nora is temporarily resting and cannot help right now. Please try again later.",
      };
    }

    const response = await openai.chat.completions.create({
      model: getAIModel(),
      messages: [
        {
          role: "system",
          content: `You are Nora, an expert professional copywriter. 
Your goal is to generate high-quality, compelling descriptions based EXCLUSIVELY on the provided category and user instructions.

GUIDELINES:
1. FOCUS: Stick strictly to the user's prompt. If they ask for a job description, provide ONLY a job description. Do not add generic platform filler.
2. PLATFORM AGNOSTIC: Do NOT mention "BuyOrSell" or any specific marketplace platform. The description should be generic and usable anywhere unless the user mentions a specific platform.
3. PERSPECTIVE: ${orgName ? `Write from the perspective of "${orgName}".` : "Write a clear, engaging description for the listing."}
4. SAFETY: Do NOT generate offensive or harmful content.
5. LENGTH: Max 5000 characters.
6. CONTEXT: The primary category/context is "${categoryPath}".
7. TONE: Professional, appealing, and tailored to the context (e.g., professional for jobs, descriptive for products).
8. FORMAT: Use clear paragraphs with double newlines (\\n\\n) between them. Use bullet points for lists to prioritize readability.
9. NO LINKS: Do not include external links or placeholder contact info.
10. SOURCING: Use the user's notes as the primary source of truth for features, requirements, or values.`,
        },
        {
          role: "user",
          content: `${orgName ? `Organization: "${orgName}"\n` : ""}Category Context: "${categoryPath}"
${userPrompt ? `User Instructions: "${userPrompt}"` : ""}
${existingDescription ? `Current Draft: "${existingDescription}"` : "Task: Create a detailed and professional description based on the context provided above."}`,
        },
      ],
    });

    let content = response.choices[0]?.message?.content || "";

    if (!content && response.choices[0]?.finish_reason === "content_filter") {
      return {
        success: false,
        error:
          "The request was flagged by content filters. Please try a more specific or different prompt.",
      };
    }

    // Safety check on the output
    if (content.length > 5000) {
      content = content.substring(0, 4997) + "...";
    }

    return { success: true, data: content };
  } catch (error: any) {
    console.error("[AI] Error generating description:", error);

    // Check for specific OpenAI errors
    if (error?.status === 401) {
      return {
        success: false,
        error:
          "We're having trouble connecting to Nora. Our team has been notified.",
      };
    }
    if (error?.status === 429) {
      return {
        success: false,
        error:
          "Nora is a bit busy right now. Please wait a moment before trying again.",
      };
    }

    return {
      success: false,
      error:
        "Something went wrong while generating the description. Please try again with simple instructions.",
    };
  }
}

export async function generatePromptFromImages(
  imageUrls: string[],
): Promise<{ description: string; adType: string }> {
  try {
    const openai = getOpenAIClient();
    if (!openai || imageUrls.length === 0) {
      console.log(
        "[AI] Skipping prompt generation: missing OpenAI key or no images",
      );
      return { description: "", adType: "AD" };
    }

    const content: any[] = [
      {
        type: "text",
        text: `Analyze these images and identify:
1. Brand, model, color, and condition.
2. Determine if this is an AD for a product/service or a JOB posting.

Return a JSON object:
{
  "description": "bulleted description",
  "adType": "AD" | "JOB"
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
      adType: result.adType || "AD",
    };
  } catch (error) {
    console.error("Error generating prompt from images:", error);
    return { description: "", adType: "AD" };
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
          content: `You are Nora, an expert semantic search optimizer.
Your task: Analyze the user's input and images to extract the core search query for a category database.

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
      `[AI] Fetching semantic results from: ${BACKEND_URL}/categories/search/semantic?query=${searchQuery}&adType=${intentAdType}`,
    );

    const semanticRes = await fetch(
      `${BACKEND_URL}/categories/search/semantic?query=${encodeURIComponent(searchQuery)}&adType=${intentAdType}&limit=1`,
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
    console.log(
      "[AI] Semantic API full response:",
      JSON.stringify(semanticData, null, 2),
    );
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
