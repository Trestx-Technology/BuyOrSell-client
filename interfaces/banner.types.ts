export interface Banner {
  _id: string;
  title: string;
  titleAr?: string;
  subTitle?: string;
  subTitleAr?: string;
  content?: string;
  contentAr?: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  callToAction?: string[];
  callToActionAr?: string;
  sponsored?: boolean;
  isSponsored?: boolean; // alias fallback
  sponsoredLink?: string;
  buttonLabel?: string;
  buttonLabelAr?: string;
  position?: string;
  order?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  location?: string;
  locationId?: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerApiResponse {
  statusCode: number;
  timestamp: string;
  data: Banner;
}

export interface BannersApiResponse {
  statusCode: number;
  timestamp: string;
  data: Banner[];
}

export interface BannersListApiResponse {
  statusCode: number;
  timestamp: string;
  data: {
    banners: Banner[];
    total: number;
    page?: number;
    limit?: number;
  };
}

export interface CreateBannerPayload {
  title: string;
  titleAr?: string;
  subTitle?: string;
  subTitleAr?: string;
  content?: string;
  contentAr?: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  callToAction?: string;
  callToActionAr?: string;
  sponsored?: boolean;
  isSponsored?: boolean; // alias fallback
  sponsoredLink?: string;
  buttonLabel?: string;
  buttonLabelAr?: string;
  position?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  slug?: string;
}

export type UpdateBannerPayload = Partial<CreateBannerPayload>;
