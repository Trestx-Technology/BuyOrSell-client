export interface SeoData {
  _id: string;
  route: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  author?: string;
  publisher?: string;
  viewport?: string;
  charSet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeoDto {
  route: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  author?: string;
  publisher?: string;
}

export interface GetSeoResponse {
  data: SeoData[];
  message: string;
}

export interface GetOneSeoResponse {
  data: SeoData;
  message: string;
}
