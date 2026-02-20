import { AD } from './ad';

// ============================================================================
// HOME API SPECIFIC TYPES
// ============================================================================

// Banner structure from home API
export interface HomeBanner {
  _id: string;
  title: string;
  titleAr: string;
  subTitle: string;
  subTitleAr: string;
  content: string;
  contentAr: string;
  image: string;
  location: string;
  isActive: boolean;
  callToAction: string;
  callToActionAr:string
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
  nameAr?: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  descAr?: string | null;
  fieldsCount: number;
}

// Subcategory structure from home API subCategoryList
export interface HomeSubCategory {
  _id: string;
  name: string;
  nameAr?: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  descAr?: string | null;
  fieldsCount: number;
  ads: AD[];
}

// Category with subcategories structure from home API subCategoryList
export interface CategoryWithSubCategories {
  category: string;
  categoryAr?: string;
  subCategory: HomeSubCategory[];
}

// Category tree with ads - matches the API structure
export interface CategoryTreeWithAds {
  _id: string;
  name: string;
  nameAr?: string;
  icon: string | null;
  image: string | null;
  banner: string | null;
  desc: string | null;
  descAr?: string | null;
  fieldsCount: number;
  ads: AD[] | DealAd[] | LatestAd[]; // Can be AD, DealAd, or LatestAd depending on context
  children: CategoryTreeWithAds[]; // Recursive - same structure
}

// Extra field structure
export interface ExtraField {
  name: string;
  value: string | number | boolean | string[] | null;
  icon: string | null;
}

// Latest ad structure (simplified version)
export interface LatestAd {
  id: string;
  title: string;
  titleAr?: string;
  price: number;
  discountedPrice: number | null;
  dealPercentage: number | null;
  dealValidThrough: string | null;
  extraFields: ExtraField[];
  exchanged: boolean | null;
  exchangeWith?: {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    imageUrl?: string;
    _id?: string;
  } | null;
  isExchangeable: boolean | null;
  createdAt: string;
  connectionTypes: string[];
  images: string[];
  views?: number;
  location: string | null;
  address?: {
    state: string;
    city: string;
  } | null;
  addressAr?: {
    state: string;
    city: string;
  } | null;
  owner: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

// Deal ad structure from categoryTreeWithDealAds
export interface DealAd {
  id: string;
  _id?: string;
  title: string;
  titleAr?: string;
  price: number;
  discountedPrice: number | null;
  dealPercentage: number | null;
  dealValidThru?: string | null;
  dealValidThrough: string | null;
  extraFields: ExtraField[];
  exchanged: boolean | null;
  exchangeWith?: {
    title: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    imageUrl?: string;
    _id?: string;
  } | null;
  isExchangeable: boolean | null;
  createdAt: string;
  connectionTypes: string[];
  relatedCategories: string[];
  images: string[];
  views?: number;
  address: {
    state: {
      state: string;
      city: string;
      area?: string;
      latitude?: number;
      longitude?: number;
    };
  } | null;
  addressAr?: {
    state: string;
    city: string;
  } | null;
  owner: {
    id: string;
    _id?: string;
    name: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

// Ads grouped by category
export interface AdsByCategory {
  category: string;
  categoryAr: string
  featuredAds: AD[];
  latestAds: LatestAd;
}

// Popular category with active ads count
export interface PopularCategory {
  category: {
    _id: string;
    name: string;
    nameAr?: string;
    icon: string | null;
    image: string | null;
    banner: string | null;
    desc: string | null;
    descAr?: string | null;
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
