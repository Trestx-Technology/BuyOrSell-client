"use server";

import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchWithAI(userQuery: string): Promise<{
  keywords: string[];
  searchQuery: string;
  results: any[];
  success: boolean;
}> {
  try {
    if (!process.env.OPENAI_API_KEY || !userQuery.trim()) {
      return {
        keywords: [],
        searchQuery: userQuery,
        results: [],
        success: false,
      };
    }

    // Step 1: Use AI to extract keywords and optimize query
    const response = await openai.chat.completions.create({
      model: MODEL, // Use a smart model for better query understanding
      messages: [
        {
          role: "system",
          content: `You are an expert search query optimizer for "BuyOrSell", a premium classifieds platform.
Your task is to analyze a user's natural language search query and extract the most relevant keywords and parameters.

GUIDELINES:
1. Extract 3-7 HIGH-VALUE keywords (brand, model, version, condition, location).
2. Remove all conversational filler ("I want", "looking for", "please find", etc.).
3. Normalize synonyms (e.g., "bmw" -> "BMW", "cheap" -> "affordable", "mobile" -> "smartphone").
4. If a price range is mentioned (e.g., "under 5000"), include it in the optimized searchQuery.
5. If a condition is mentioned (e.g., "new", "used", "mint"), ensure it is a primary keyword.
6. Return a JSON object ONLY:
   {
     "keywords": ["keyword1", "keyword2", ...],
     "searchQuery": "optimized search string including key parameters"
   }

EXAMPLES:
Input: "find me a red used ferrari under 1 million in Dubai"
Output: {"keywords": ["Ferrari", "red", "used", "Dubai", "supercar"], "searchQuery": "Ferrari red used Dubai under 1000000"}

Input: "looking for a 3 bedroom villa near the beach"
Output: {"keywords": ["villa", "3 bedroom", "beachfront", "beach side"], "searchQuery": "3 bedroom villa beach side"}`,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      response_format: { type: "json_object" },
    });

    const aiResult = JSON.parse(
      response.choices[0]?.message?.content?.trim() || "{}",
    );

    const keywords = aiResult.keywords || [];
    const searchQuery = aiResult.searchQuery || userQuery;


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const searchUrl = `${backendUrl}/ad?search=${encodeURIComponent(searchQuery)}&limit=20`;

    const fetchResponse = await fetch(searchUrl);
    const searchData = await fetchResponse.json();

    if (!searchData || !searchData.data) {
      throw new Error("Search API failed");
    }

    return {
      keywords,
      searchQuery,
      results: searchData.data.adds || searchData.data.ads || [],
      success: true,
    };
  } catch (error) {
    console.error("Error in AI search:", error);
    return {
      keywords: [],
      searchQuery: userQuery,
      results: [],
      success: false,
    };
  }
}
