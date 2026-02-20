export interface Banner {
  _id: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  callToAction?: string;
  callToActionAr?: string;
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
  description?: string;
  descriptionAr?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  callToAction?: string;
  callToActionAr?: string;
  position?: string;
  order?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  slug?: string;
}

export type UpdateBannerPayload = Partial<CreateBannerPayload>;
