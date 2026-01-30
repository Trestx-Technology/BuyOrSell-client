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
6. NO LINKS: Do not include external links or contact info.`,
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
    return existingDescription || "";
  }
}

/**
 * Generates a concise ad prompt based on uploaded images
 */
export async function generatePromptFromImages(
  imageUrls: string[]
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY || imageUrls.length === 0) {
      return "";
    }

    const content: any[] = [
      {
        type: "text",
        text: `Analyze these images and provide a SHORT prompt (2-3 sentences max) describing:
1. What item/product is shown in the images
2. The visible condition and key features
3. What type of ad this would be (e.g., "Used car for sale", "Apartment for rent", "Job posting")

Keep it brief and factual - just enough to identify the item and its purpose.`,
      },
    ];

    imageUrls.forEach((url) => {
      content.push({
        type: "image_url",
        image_url: {
          url: url,
        },
      });
    });

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing product images and creating concise descriptions.",
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error generating prompt from images:", error);
    return "";
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
  imageUrls: string[] = []
): Promise<{ redirectUrl: string | null; categoryPath: CategoryHierarchy[] }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { redirectUrl: null, categoryPath: [] };
    }

    // 1. Fetch the category tree
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/categories/tree`);
    const result = await response.json();
    const categories = result.data;

    // 2. Flatten the tree to leaf categories with hierarchy tracking
    const leafCategories: {
      id: string;
      name: string;
      path: string;
      rootId: string;
      hierarchy: CategoryHierarchy[];
    }[] = [];

    function traverse(
      cats: any[],
      path: string = "",
      rootId: string | null = null,
      hierarchy: CategoryHierarchy[] = []
    ) {
      cats.forEach((cat) => {
        const currentPath = path ? `${path} > ${cat.name}` : cat.name;
        const currentRootId = rootId || cat._id;
        const currentHierarchy = [
          ...hierarchy,
          {
            id: cat._id,
            name: cat.name,
            parentId: hierarchy.length > 0 ? hierarchy[hierarchy.length - 1].id : null,
          },
        ];

        if (!cat.children || cat.children.length === 0) {
          leafCategories.push({
            id: cat._id,
            name: cat.name,
            path: currentPath,
            rootId: currentRootId,
            hierarchy: currentHierarchy,
          });
        } else {
          traverse(cat.children, currentPath, currentRootId, currentHierarchy);
        }
      });
    }

    traverse(categories);

    // 3. Compact representation of categories
    const categoriesList = leafCategories
      .map((c) => `${c.path} (ID: ${c.id})`)
      .join("\n");

    const content: any[] = [
      {
        type: "text",
        text: `User Description: "${userPrompt}"\n\nAvailable Leaf Categories:\n${categoriesList.substring(0, 15000)}`,
      },
    ];

    imageUrls.forEach((url) => {
      content.push({
        type: "image_url",
        image_url: {
          url: url,
        },
      });
    });

    const aiResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert category classifier for "BuyOrSell".
Your task is to analyze a user's ad description and any provided images, then select the MOST SPECIFIC leaf category.

IMPORTANT:
1. Return ONLY the category ID (e.g., 68ef5f3c10fe86b65d1c9ea6).
2. Choose ONLY from the leaf categories.
3. If no category fits well, return "none".
4. Be as specific as possible.
5. If images are provided, use them to confirm the category choice.`,
        },
        {
          role: "user",
          content: content,
        },
      ],
    });

    const matchedId = aiResponse.choices[0]?.message?.content?.trim() || null;

    if (!matchedId || matchedId.toLowerCase() === "none") {
      return { redirectUrl: null, categoryPath: [] };
    }

    const matchedCategory = leafCategories.find((c) => c.id === matchedId);
    if (!matchedCategory) {
      return { redirectUrl: null, categoryPath: [] };
    }

    // Determine adType (prefix) based on root category (Jobs check)
    const JOBS_ROOT_ID = categories.find((c: any) => c.name === "Jobs")?._id;
    const pathPrefix = matchedCategory.rootId === JOBS_ROOT_ID ? "post-job" : "post-ad";

    const categoryPathParam = encodeURIComponent(
      JSON.stringify(matchedCategory.hierarchy)
    );
    
    const redirectUrl = `/${pathPrefix}/details/${matchedId}?categoryPath=${categoryPathParam}`;

    return {
      redirectUrl,
      categoryPath: matchedCategory.hierarchy,
    };
  } catch (error) {
    console.error("Error identifying category:", error);
    return { redirectUrl: null, categoryPath: [] };
  }
}


