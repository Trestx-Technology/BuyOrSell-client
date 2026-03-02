"use server";

import OpenAI from "openai";

// Initialize OpenAI client on server side
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use environment variable or fallback to cost-effective model
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Proofread and improve message
export async function proofreadMessage(message: string): Promise<string> {
  try {
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
        "No OpenAI API key found, returning fallback meeting request",
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
    if (!process.env.OPENAI_API_KEY) {
      return (
        existingDescription ||
        `Excellent ${categoryPath} for sale. Please contact for details.`
      );
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
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
    if (!process.env.OPENAI_API_KEY || imageUrls.length === 0) {
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
      model: MODEL,
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
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "AI credentials are not configured. Please contact support.",
      );
    }

    console.log(
      "[AI] providedCategories type:",
      typeof providedCategories,
      "isArray:",
      Array.isArray(providedCategories),
      "length:",
      providedCategories?.length,
    );

    // 1. Fetch the category tree using the service or use provided categories
    let categories: any[] = [];
    if (
      providedCategories &&
      Array.isArray(providedCategories) &&
      providedCategories.length > 0
    ) {
      // Check if first item has children (proper tree structure)
      const firstCat = providedCategories[0];
      console.log(
        "[AI] First provided category:",
        JSON.stringify({
          name: firstCat?.name,
          _id: firstCat?._id,
          hasChildren: !!firstCat?.children,
          childrenCount: firstCat?.children?.length,
        }).substring(0, 300),
      );

      categories = providedCategories;
      console.log(
        `[AI] Using ${categories.length} pre-provided root categories.`,
      );
    } else {
      // Fallback: fetch directly via fetch() since axiosInstance doesn't work in Server Actions
      console.log(
        "[AI] providedCategories not usable, fetching via direct fetch...",
      );
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!BACKEND_URL) {
        console.error("[AI] NEXT_PUBLIC_BACKEND_URL is not set!");
        return { redirectUrl: null, categoryPath: [] };
      }

      const res = await fetch(`${BACKEND_URL}/categories/tree`);
      const result = await res.json();

      console.log("[AI] Direct fetch response keys:", Object.keys(result));
      // API returns { statusCode, timestamp, data: SubCategory[] }
      categories = result.data || [];

      if (!categories || categories.length === 0) {
        console.error(
          "[AI] No categories from direct fetch:",
          JSON.stringify(result).substring(0, 500),
        );
      } else {
        console.log(
          `[AI] Fetched ${categories.length} root categories via direct fetch.`,
        );
      }
    }

    // 2. Flatten the tree to ALL categories with hierarchy tracking
    const allCategories: {
      id: string;
      name: string;
      path: string;
      rootId: string;
      hierarchy: CategoryHierarchy[];
      isLeaf: boolean;
    }[] = [];

    function traverse(
      cats: any[],
      path: string = "",
      rootId: string | null = null,
      hierarchy: CategoryHierarchy[] = [],
    ) {
      cats.forEach((cat) => {
        const currentPath = path ? `${path} > ${cat.name}` : cat.name;
        const currentRootId = rootId || cat._id;
        const currentHierarchy = [
          ...hierarchy,
          {
            id: cat._id,
            name: cat.name,
            parentId:
              hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].id : null,
          },
        ];

        const isLeaf = !cat.children || cat.children.length === 0;

        allCategories.push({
          id: cat._id,
          name: cat.name,
          path: currentPath,
          rootId: currentRootId,
          hierarchy: currentHierarchy,
          isLeaf: isLeaf,
        });

        if (!isLeaf) {
          traverse(cat.children, currentPath, currentRootId, currentHierarchy);
        }
      });
    }

    traverse(categories);

    if (allCategories.length === 0) {
      console.error(
        "[AI] CRITICAL: traverse() produced 0 categories! Categories input had",
        categories.length,
        "root items.",
      );
      console.error(
        "[AI] First root item keys:",
        categories[0] ? Object.keys(categories[0]) : "N/A",
      );
      return { redirectUrl: null, categoryPath: [] };
    }

    console.log(
      `[AI] Flattened ${allCategories.length} total categories from ${categories.length} roots. ${adType ? `Intent: ${adType}` : ""}`,
    );

    // 3. Use AI to refine the search query and suggest a title
    const aiResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert semantic search optimizer for "BuyOrSell".
Your task: Analyze the user's ad description and images to extract the core search query for a category database.

INSTRUCTIONS:
1. Extract the primary product type and brand (e.g., "Rolex watch", "Used BMW", "3 bedroom villa").
2. Determine if the user is looking for a JOB or an AD.
3. Return a JSON object only.

OUTPUT (JSON only):
{
  "searchQuery": "refined search query for category search",
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
      `[AI] Refined Query: "${searchQuery}", Intent: ${intentAdType}`,
    );

    // 4. Use the Semantic Search API to find the best category
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const semanticRes = await fetch(
      `${BACKEND_URL}/categories/search/semantic?query=${encodeURIComponent(searchQuery)}&limit=5`,
    );
    const semanticData = await semanticRes.json();
    const semanticResults = semanticData.results || [];

    if (semanticResults.length === 0) {
      console.warn(
        "[AI] Semantic API returned no results for query:",
        searchQuery,
      );
      return { redirectUrl: null, categoryPath: [] };
    }

    // 5. Match: Find the best result in our local tree to get full hierarchy
    const bestSemanticId = semanticResults[0].id;
    let matchedCategory = allCategories.find((c) => c.id === bestSemanticId);

    // Fallback fuzzy match if exact ID not found in current tree for some reason
    if (!matchedCategory) {
      const bestName = semanticResults[0].name.toLowerCase();
      matchedCategory = allCategories.find(
        (c) => c.name.toLowerCase() === bestName,
      );
    }

    if (!matchedCategory) {
      console.warn(
        "[AI] Could not match semantic result ID to local tree:",
        bestSemanticId,
      );
      return { redirectUrl: null, categoryPath: [] };
    }

    console.log(
      `[AI] SUCCESS -> ${matchedCategory?.path} (ID: ${matchedCategory?.id})`,
    );

    // 6. Build redirect URL
    const JOBS_ROOT_ID = categories.find((c: any) =>
      c.name.toLowerCase().includes("job"),
    )?._id;
    const pathPrefix =
      matchedCategory.rootId === JOBS_ROOT_ID ? "post-job" : "post-ad";
    const categoryPathParam = encodeURIComponent(
      JSON.stringify(matchedCategory.hierarchy),
    );
    const redirectUrl = `/${pathPrefix}/details/${matchedCategory.id}?categoryPath=${categoryPathParam}`;

    return {
      redirectUrl,
      categoryPath: matchedCategory.hierarchy,
      suggestedTitle: suggestedTitle || "",
    };
  } catch (error) {
    console.error("Error identifying category:", error);
    return { redirectUrl: null, categoryPath: [] };
  }
}
