import { AD } from './ad';

// ============================================================================
// HOME API SPECIFIC TYPES
// ============================================================================

// Banner structure from home API
export interface HomeBanner {
  _id: string;
  title: string;
  subTitle: string;
  content: string;
  image: string;
  location: string;
  isActive: boolean;
  callToAction: string;
  promotional: boolean;
  sponsored: boolean;
  position: string;
  placement: string;
  bannerTypeId: string;
  __v: number;
}

// Category structure from home API categoryList
export interface HomeCategory {
  _id: string;
  name: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  fieldsCount: number;
}

// Subcategory structure from home API subCategoryList
export interface HomeSubCategory {
  _id: string;
  name: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  fieldsCount: number;
}

// Category with subcategories structure from home API subCategoryList
export interface CategoryWithSubCategories {
  category: string;
  subCategory: HomeSubCategory[];
}

// Category tree with ads - matches the API structure
export interface CategoryTreeWithAds {
  _id: string;
  name: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  fieldsCount: number;
  ads: AD[];
  children: CategoryTreeWithAds[]; // Recursive - same structure
}

// Latest ad structure (simplified version)
export interface LatestAd {
  id: string;
  title: string;
  price: number;
  discountedPrice: number;
  dealPercentage: number;
  dealValidThrough: string | null;
  extraFields: unknown[];
  exchanged: unknown | null;
  exchangeWith: unknown | null;
  isExchangeable: boolean | null;
  createdAt: string;
  connectionTypes: string[];
  images: string[];
  location: string | null;
  owner: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    image: string;
  };
}

// Ads grouped by category
export interface AdsByCategory {
  category: string;
  featuredAds: AD[];
  latestAds: LatestAd;
}

// Popular category with active ads count
export interface PopularCategory {
  category: {
    _id: string;
    name: string;
    icon: string | null;
    image: string | null;
    banner: string | null;
    desc: string | null;
    fieldsCount: number;
  };
  activeAdsCount: number;
}

// Home page data structure
export interface HomeData {
  banner: HomeBanner[];
  categoryList: HomeCategory[];
  subCategoryList: CategoryWithSubCategories[];
  categoryTreeWithAds: CategoryTreeWithAds[];
  categoryTreeWithDealAds: CategoryTreeWithAds[];
  categoryTreeWithExchangeAds: CategoryTreeWithAds[];
  adsByCategory: AdsByCategory[];
  popularCategories: PopularCategory[];
  recentlyViewed: AD[];
}

// Home API response
export interface HomeApiResponse {
  statusCode: number;
  timestamp: string;
  data: HomeData;
}
