/**
 * This file defines the core context and "resolutions" for the BuyOrSell AI Assistant.
 * It contains information about the app's features, navigation, and common user tasks.
 */

export interface AppResolution {
  id: string;
  keywords: string[];
  response: string;
  action?: {
    label: string;
    url: string;
  };
}

export const APP_RESOLUTIONS: AppResolution[] = [
  // --- 1. SEARCH & CATEGORIES ---
  {
    id: "search_general",
    keywords: ["find", "search", "looking for", "buy", "purchase", "browse"],
    response:
      "I can help you find exactly what you're looking for. Use our main search bar to see all listings, or browse by category.",
    action: { label: "Explore All Ads", url: "/search" },
  },
  {
    id: "categories_browse",
    keywords: ["category", "categories", "sections", "types"],
    response:
      "From Cars to Electronics and Jobs to Real Estate, we have it all categorized for you.",
    action: { label: "Browse Categories", url: "/categories" },
  },
  {
    id: "cars_search",
    keywords: [
      "car",
      "vehicle",
      "auto",
      "toyota",
      "nissan",
      "mercedes",
      "bmw",
      "motors",
    ],
    response:
      "Looking for a new ride? Our Motors section has thousands of verified cars for sale across the UAE.",
    action: { label: "Search Cars", url: "/search?category=motors" },
  },
  {
    id: "real_estate",
    keywords: [
      "apartment",
      "villa",
      "rent",
      "flat",
      "property",
      "real estate",
      "house",
    ],
    response:
      "Find your dream home or next office space in our Real Estate section. We have listings for both rent and sale.",
    action: { label: "Browse Properties", url: "/search?category=real-estate" },
  },
  {
    id: "electronics",
    keywords: [
      "iphone",
      "samsung",
      "mobile",
      "laptop",
      "tv",
      "computer",
      "gadget",
      "electronics",
    ],
    response:
      "Looking for the latest gadgets? Check out our Electronics section for great deals on mobiles, laptops, and more.",
    action: { label: "Shop Electronics", url: "/search?category=electronics" },
  },

  // --- 2. SELLING & POSTING ---
  {
    id: "sell_item",
    keywords: ["sell", "post", "listing", "upload", "create ad"],
    response:
      "Ready to reach thousands of buyers? You can post your ad in just a few minutes. Don't forget to use our AI Assistant to write a great description!",
    action: { label: "Post an Ad", url: "/post-ad" },
  },
  {
    id: "premium_ads",
    keywords: ["premium", "boost", "standard", "featured", "top ad"],
    response:
      "Want more views? You can choose between Standard and Premium ad packages when posting to get your item noticed faster.",
    action: { label: "Learn About Plans", url: "/plans" },
  },

  // --- 3. JOBS ---
  {
    id: "find_job",
    keywords: [
      "job",
      "work",
      "hiring",
      "career",
      "vacancy",
      "opening",
      "employment",
    ],
    response:
      "Looking for your next career move? Check out the latest job openings from top companies in the UAE.",
    action: { label: "Search Jobs", url: "/jobs/listing" },
  },
  {
    id: "post_job",
    keywords: ["hire", "recruiting", "post job", "find staff", "employer"],
    response:
      "Find the perfect candidate for your company. Start by posting a job vacancy today.",
    action: { label: "Post a Job", url: "/post-job" },
  },

  // --- 4. ORGANIZATIONS ---
  {
    id: "create_org",
    keywords: ["organization", "business", "company account", "org"],
    response:
      "Are you a business owner? Create an Organization profile to manage multiple ads, members, and showcase your brand.",
    action: { label: "Manage Organizations", url: "/user/organizations" },
  },

  // --- 5. EXCHANGES ---
  {
    id: "exchange_item",
    keywords: ["exchange", "swap", "trade", "barter"],
    response:
      "BuyOrSell isn't just for cash deals. You can also find items available for exchange or swap!",
    action: { label: "View Exchange Deals", url: "/exchange" },
  },

  // --- 6. DEALS & OFFERS ---
  {
    id: "daily_deals",
    keywords: ["deal", "discount", "offer", "sale", "cheap", "best price"],
    response:
      "Don't miss out on our daily deals! Browse the best offers currently available on the platform.",
    action: { label: "View All Deals", url: "/deals" },
  },

  // --- 7. AI FEATURES & TOKENS ---
  {
    id: "ai_assistant",
    keywords: ["ai assistant", "help desk", "what is this", "bot", "assistant"],
    response:
      "I'm your AI guide! I can help you find products, write ad descriptions, and navigate the platform faster using AI tokens.",
    action: { label: "How AI Works", url: "/ai-tokens" },
  },
  {
    id: "ai_tokens",
    keywords: ["tokens", "token", "credits", "buy tokens"],
    response:
      "AI tokens power our smart features like the Description Assistant. You can purchase tokens to keep using these advanced tools.",
    action: { label: "Get AI Tokens", url: "/ai-tokens" },
  },

  // --- 8. ACCOUNT & PROFILE ---
  {
    id: "user_profile",
    keywords: ["profile", "my account", "settings", "password", "details"],
    response:
      "You can update your personal information, manage your notifications, and see your activity in your profile.",
    action: { label: "View Profile", url: "/user/profile" },
  },
  {
    id: "saved_items",
    keywords: ["saved", "favorites", "wishlist", "heart", "collection"],
    response:
      "Keep track of items you're interested in by saving them to your favorites collection.",
    action: { label: "My Favorites", url: "/favorites" },
  },
  {
    id: "my_ads",
    keywords: ["my ads", "my listings", "manage ads", "edit ad"],
    response:
      "View and manage all the ads you've posted in your personalized dashboard.",
    action: { label: "My Ads", url: "/user/ads" },
  },

  // --- 9. MAP VIEW ---
  {
    id: "map_view",
    keywords: ["map", "location", "near me", "nearby", "interactive map"],
    response:
      "Use our interactive map to find items, properties, and jobs exactly where you need them.",
    action: { label: "Open Map View", url: "/map-view" },
  },

  // --- 10. SUPPORT & SAFETY ---
  {
    id: "help_center",
    keywords: ["help", "support", "faq", "question", "how to"],
    response:
      "Got a question? Our Help Center has detailed guides on how to use BuyOrSell effectively and safely.",
    action: { label: "Visit Help Center", url: "/help-centre" },
  },
  {
    id: "contact_us",
    keywords: ["contact", "email", "phone", "support team", "report"],
    response:
      "Need direct help? You can contact our support team through our contact form or official channels.",
    action: { label: "Contact Support", url: "/contact-us" },
  },
  {
    id: "safety_tips",
    keywords: ["safety", "scam", "safe", "payment", "verification"],
    response:
      "Your safety is our priority. We recommend meeting in public places, inspecting items, and never sharing sensitive payment info online.",
    action: { label: "Safety Guidelines", url: "/help-centre/safety" },
  },

  // --- 11. ABOUT ---
  {
    id: "about_us",
    keywords: ["about", "company", "who are you", "what is buyorsell"],
    response:
      "BuyOrSell is the UAE's premier marketplace for buying, selling, and exchanging everything from cars and furniture to jobs and real estate.",
    action: { label: "About BuyOrSell", url: "/about-us" },
  },

  // --- 12. GREETINGS ---
  {
    id: "greeting",
    keywords: [
      "hi",
      "hello",
      "hey",
      "greetings",
      "good morning",
      "good evening",
    ],
    response:
      "Hello! I'm your BuyOrSell AI assistant. How can I help you today? You can ask about finding products, posting ads, or navigating the platform.",
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "appreciate", "good job"],
    response:
      "You're very welcome! I'm always here to help. Is there anything else you need?",
  },
];

/**
 * Finds the most relevant resolution for a given user query.
 */
export function findResolution(query: string): AppResolution | undefined {
  const lowerQuery = query.toLowerCase();

  // Rank resolutions based on keyword matches
  const ranked = APP_RESOLUTIONS.map((res) => {
    const matches = res.keywords.filter((kw) => lowerQuery.includes(kw)).length;
    return { ...res, matchCount: matches };
  })
    .filter((res) => res.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return ranked[0];
}
