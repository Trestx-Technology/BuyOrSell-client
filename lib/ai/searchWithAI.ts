"use server";

import { getAds, searchAds } from "@/app/api/ad/ad.services";
import { axiosInstance } from "@/services/axios-api-client";
import OpenAI from "openai";

const MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

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
          content: `You are an expert search query optimizer for a classifieds platform.
Your task is to analyze a user's natural language search query and extract the most relevant keywords.

GUIDELINES:
1. Extract 3-7 relevant keywords from the user's query
2. Include product names, brands, models, conditions, locations, or other specific details
3. Remove filler words like "I want", "looking for", "need", etc.
4. Normalize terms (e.g., "car" instead of "cars", "phone" instead of "phones")
5. Include synonyms or related terms if helpful (e.g., "mobile" for "phone")
6. Return a JSON object with this structure:
   {
     "keywords": ["keyword1", "keyword2", ...],
     "searchQuery": "optimized search string"
   }

EXAMPLES:
Input: "I'm looking for a used iPhone 13 in good condition"
Output: {"keywords": ["iPhone", "13", "used", "good condition", "mobile", "smartphone"], "searchQuery": "iPhone 13 used good condition"}

Input: "Need a 2 bedroom apartment for rent near downtown"
Output: {"keywords": ["apartment", "2 bedroom", "rent", "downtown", "flat"], "searchQuery": "2 bedroom apartment rent downtown"}`,
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


    const searchResponse = await getAds({
      search: searchQuery,
      limit: 20,
    });


    // If the POST endpoint doesn't exist, we might need to fallback to the existing list/search API.
    // But let's assume the user knows their backend or wants this exact logic.

    // Handling the case where fetch fails (e.g. 404 on POST)
    if (!searchResponse.data) {
      throw new Error("Search API failed");
    }

    return {
      keywords,
      searchQuery,
      results: searchResponse.data.adds || [],
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
