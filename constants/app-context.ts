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
  // --- 1. SEARCH & DISCOVERY ---
  {
    id: "search_general",
    keywords: ["find", "search", "looking for", "buy", "purchase", "browse", "item", "product", "ad"],
    response:
      "I am Nora, your Digital Guide. While I can't search for specific items directly in this chat, you can find anything using our powerful search bar. Try 'AI Search' for smart, context-aware results or use the 'AI Suggestions' that appear as you type!",
  },
  {
    id: "ai_searchbar",
    keywords: ["smart search", "suggestions", "prediction", "advanced search", "ai search"],
    response:
      "Our AI Search understands your intent! Look for the 'AI Search' toggle in the search bar. It provides smart suggestions and helps you find exactly what you need based on thousands of categories.",
  },
  {
    id: "command_menu",
    keywords: ["command", "quick search", "shortcuts", "cmd", "ctrl k", "navigation menu"],
    response:
      "For power users, our 'Command Menu' (Ctrl+K) allows you to jump to any page, category, or setting instantly. It's the fastest way to navigate BuyOrSell!",
  },
  {
    id: "map_view",
    keywords: ["map", "location", "near me", "nearby", "interactive map", "distance", "where", "view on map"],
    response:
      "Browse visually! Use our Interactive Map to find listings, jobs, and offices near your current location. You can filter by categories directly on the map.",
    action: { label: "Explore Map", url: "/map-view" },
  },
  {
    id: "emirate_selector",
    keywords: ["emirate", "dubai", "abu dhabi", "sharjah", "ajman", "rak", "fujairah", "uaq", "location filter", "region"],
    response:
      "You can filter the entire platform by Emirate! Use the location selector in the header to see only ads and jobs in your preferred region.",
  },

  // --- 2. CORE CATEGORIES ---
  {
    id: "cars_motors",
    keywords: ["car", "vehicle", "auto", "toyota", "nissan", "mercedes", "bmw", "motors", "suv", "truck", "bike", "motorcycle", "boats"],
    response:
      "Our Motors section is the largest in the UAE. From luxury SUVs and family cars to bikes and boats—all with detailed specifications and verified seller info.",
    action: { label: "Search Motors", url: "/search?category=motors" },
  },
  {
    id: "real_estate",
    keywords: ["apartment", "villa", "rent", "flat", "property", "real estate", "house", "studio", "office", "shop", "commercial", "residential"],
    response:
      "Find properties for rent or sale. We cover residential (villas, flats) and commercial (offices, shops) listings across all major UAE projects.",
    action: { label: "Browse Properties", url: "/search?category=real-estate" },
  },
  {
    id: "electronics_gadgets",
    keywords: ["iphone", "samsung", "mobile", "laptop", "tv", "computer", "gadget", "electronics", "phone", "tablet", "camera", "playstation"],
    response:
      "Get the best deals on electronics. Whether it's the latest iPhone, a gaming laptop, or home appliances, you'll find it here.",
    action: { label: "Shop Electronics", url: "/search?category=electronics" },
  },

  // --- 3. SELLING & AD MANAGEMENT ---
  {
    id: "post_ad_flow",
    keywords: ["sell", "post", "listing", "upload", "create ad", "make ad", "place ad"],
    response:
      "Posting is easy! Choose your category, add details, and your ad will be live in minutes. Use our 'Dynamic Field Renderer' to see exactly what info bidders need.",
    action: { label: "Start Posting", url: "/post-ad" },
  },
  {
    id: "ai_description",
    keywords: ["write for me", "help with description", "ai writer", "description assistant", "auto write"],
    response:
      "Stuck on what to write? Our 'AI Description Assistant' can generate a professional, SEO-friendly description for your ad automatically!",
  },
  {
    id: "ad_boost_renew",
    keywords: ["boost", "feature", "renew", "repost", "mark as sold", "bump up", "top of list"],
    response:
      "Get 10x more views! You can 'Feature' your ads to stay at the top or 'Renew' them to refresh the posting date. Once sold, just mark it as 'Sold' to stop inquiries.",
    action: { label: "Manage My Ads", url: "/user/ads" },
  },
  {
    id: "premium_plans",
    keywords: ["subscription", "package", "pricing", "plans", "gold", "silver", "basic", "premium features"],
    response:
      "We offer flexible plans for everyone. From free basic posts to professional packages with unlimited featured ads and business tools.",
    action: { label: "View All Plans", url: "/plans" },
  },

  // --- 4. JOBS & RECRUITMENT ---
  {
    id: "job_search",
    keywords: ["find job", "hiring", "career", "apply", "cv", "resume", "vacancy", "employment"],
    response:
      "Browse thousands of active vacancies. Filter by industry, salary, and location. Our 'Job Detail Content' gives you all the info you need before applying.",
    action: { label: "Search Jobs", url: "/jobs/listing" },
  },
  {
    id: "emirati_talent",
    keywords: ["emirati", "uae national", "nafis", "citizen jobs", "local talent"],
    response:
      "We are committed to Emiratization! We have a dedicated path for UAE Nationals to find positions in both government and private sectors.",
    action: { label: "Emirati Jobs", url: "/jobs/listing/emirati-jobs" },
  },
  {
    id: "jobseeker_profile",
    keywords: ["my cv", "job profile", "candidate dashboard", "my career"],
    response:
      "Your 'Jobseeker Profile' is your digital CV. Keep it updated with your latest experience and skills to get noticed by top recruiters.",
    action: { label: "My Job Profile", url: "/jobs/my-profile" },
  },
  {
    id: "employer_tools",
    keywords: ["post job", "recruiter", "find staff", "applicants", "tracking", "hiring dashboard"],
    response:
      "Hiring? Post jobs and track applicants in real-time. Our 'Applicant Manager' allows you to review CVs and manage interview stages easily.",
    action: { label: "Employer Portal", url: "/post-job" },
  },

  // --- 5. BUSINESS & ORGANIZATIONS ---
  {
    id: "business_portal",
    keywords: ["organization", "business profile", "company page", "trade name", "legal name", "corporate account"],
    response:
      "Scale your business! Verified organizations get a custom 'Organization Profile' with their logo, trade licenses, and certificates displayed for trust.",
    action: { label: "Business Hub", url: "/organizations/my" },
  },
  {
    id: "org_management",
    keywords: ["business hours", "team members", "certificates", "org settings", "company info"],
    response:
      "Complete your profile! Add your business hours, upload trade certificates, and manage your team from the Organization Settings.",
  },

  // --- 6. USER ACCOUNT & SECURITY ---
  {
    id: "account_settings",
    keywords: ["my profile", "settings", "password", "security", "blocked users", "notifications"],
    response:
      "Manage your privacy and security. You can update your password, manage your 'Blocked Users' list, and customize app notifications in one place.",
    action: { label: "Account Settings", url: "/user/profile/settings" },
  },
  {
    id: "user_verification",
    keywords: ["verify email", "verify phone", "otp", "identity", "blue tick", "verified seller"],
    response:
      "Trust is key. Verify your email and phone number via OTP to get a verified badge and increase your selling potential.",
  },
  {
    id: "manage_addresses",
    keywords: ["my address", "shipping address", "saved locations", "pickup point"],
    response:
      "Save multiple addresses to your profile for faster checkouts and easier location tagging on your ads.",
    action: { label: "Manage Addresses", url: "/user/address" },
  },
  {
    id: "search_history",
    keywords: ["history", "past searches", "revisit", "recent activity"],
    response:
      "Forgot that ad you saw yesterday? Re-check your 'Search History' to find all your recent queries and viewed categories.",
    action: { label: "Search History", url: "/user/search-history" },
  },

  // --- 7. COMMUNITY & SOCIAL ---
  {
    id: "chat_messages",
    keywords: ["chat", "inbox", "message", "talk to seller", "dm", "conversation"],
    response:
      "Our 'Chat Center' is safe and fast. You can talk to buyers/sellers, share images, and even see if the other person is a 'Verified Organization'.",
    action: { label: "Open Messages", url: "/chat" },
  },
  {
    id: "collections_favs",
    keywords: ["favorite", "saved", "collection", "wishlist", "folder", "save ad"],
    response:
      "Organize your finds! Use our 'Collection Manager' to create custom folders and save your favorite ads for later.",
    action: { label: "My Collections", url: "/favorites" },
  },
  {
    id: "social_connections",
    keywords: ["follow", "followers", "following", "social network", "connections"],
    response:
      "Stay connected! Follow your favorite sellers or businesses to get notified when they post something new.",
    action: { label: "My Network", url: "/connections" },
  },
  {
    id: "reviews_ratings",
    keywords: ["rate seller", "review", "feedback", "stars", "seller rating"],
    response:
      "Check seller credibility through our 'Reviews' system. You can read feedback from other buyers before making a purchase.",
  },

  // --- 8. VIDEO & COMMUNITY CONTENT ---
  {
    id: "watch_shorts",
    keywords: ["watch", "videos", "shorts", "reels", "video ads", "stories", "clips"],
    response:
      "Experience ads in motion! The 'Watch' section features short video previews of products, cars, and home tours.",
    action: { label: "Watch Now", url: "/watch" },
  },
  {
    id: "blog_insights",
    keywords: ["blog", "article", "news", "tips", "market trends", "latest stories"],
    response:
      "Get expert advice on the UAE marketplace. Read our latest blog posts for buying guides, safety tips, and platform updates.",
    action: { label: "Read Blog", url: "/blog" },
  },

  // --- 9. DEALS & EXCHANGES ---
  {
    id: "hot_deals",
    keywords: ["discount", "deal", "offer", "hot deal", "sale", "special price", "best price"],
    response:
      "Looking for high-value savings? Our 'Hot Deals' section features limited-time discounts and specially promoted offers.",
    action: { label: "View Deals", url: "/deals" },
  },
  {
    id: "exchange_swap",
    keywords: ["swap", "trade", "exchange", "no cash", "barter"],
    response:
      "Don't want to spend cash? Many sellers are open to a 'Swap' or 'Exchange'. Look for the exchange badge on listings!",
    action: { label: "Exchange Portal", url: "/exchange" },
  },

  // --- 10. TOKENS & BILLING ---
  {
    id: "ai_tokens",
    keywords: ["audit tokens", "credits", "token balance", "buy tokens", "wallet"],
    response:
      "AI tokens power your smart assistants. Check your 'AI Token Balance' in your profile or top up to keep using premium AI features.",
    action: { label: "AI Tokens Hub", url: "/ai-tokens" },
  },
  {
    id: "billing_subscriptions",
    keywords: ["my plans", "active subscriptions", "billing history", "invoice", "manage plan"],
    response:
      "Manage your current subscriptions and see when they expire in our 'My Subscriptions' dashboard.",
    action: { label: "My Subscriptions", url: "/my-subscriptions" },
  },

  // --- 11. SUPPORT & FEEDBACK ---
  {
    id: "help_support",
    keywords: ["support", "help", "faq", "safety", "tutorial", "contact us"],
    response:
      "We're here for you! Visit our 'Help Center' for tutorials or reach out to our dedicated support team via the 'Contact Us' form.",
    action: { label: "Help Hub", url: "/help-centre" },
  },
  {
    id: "report_rate",
    keywords: ["report bot", "bug", "issue", "rate app", "feedback", "suggestion"],
    response:
      "Your voice matters. Report issues through the 'Report Issue' portal or tell us how we're doing via the 'Rate Us' page.",
    action: { label: "Provide Feedback", url: "/rate-us" },
  },
  {
    id: "privacy_legal",
    keywords: ["terms", "privacy", "policy", "legal", "conditions", "safety tips"],
    response:
      "Your data is safe with us. Read our 'Privacy Policy' and 'Terms of Service' for all the legal details.",
    action: { label: "Legal Center", url: "/privacy-policy" },
  },

  // --- 12. GREETINGS & PERSONALITY ---
  {
    id: "nora_identity",
    keywords: ["who are you", "what is nora", "how do you help", "purpose"],
    response:
      "I'm Nora, your Digital Guide to BuyOrSell. I know this platform inside and out—from how to start a business organization to finding the best car deal. Ask me anything about our features!",
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "greetings", "good morning", "good evening", "howdy"],
    response:
      "Hello! Nora here. I have full context of all platform features. Looking for a job, selling a car, or moving house? I can guide you to the right place!",
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "appreciate", "good job", "nice", "helpful"],
    response:
      "Happy to help! Our team built me to make your marketplace experience smoother. Let me know if you need anything else!",
  },
];

/**
 * Finds the most relevant resolution for a given user query.
 * Enhanced to handle multi-keyword ranking.
 */
export function findResolution(query: string): AppResolution | undefined {
  const lowerQuery = query.toLowerCase();

  const ranked = APP_RESOLUTIONS.map((res) => {
    const matches = res.keywords.filter((kw) => lowerQuery.includes(kw)).length;
    return { ...res, matchCount: matches };
  })
    .filter((res) => res.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return ranked[0];
}
