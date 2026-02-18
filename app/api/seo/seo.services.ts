import { axiosInstance } from "@/services/axios-api-client";
import { seoQueries } from "./index";
import { CreateSeoDto, GetOneSeoResponse, GetSeoResponse, SeoData } from "@/interfaces/seo";

// Get all SEO data
export const getAllSeo = async (): Promise<GetSeoResponse> => {
  const response = await axiosInstance.get<GetSeoResponse>(
    seoQueries.getAllSeo.endpoint
  );
  return response.data;
};

// Create new SEO data
export const createSeo = async (
  payload: CreateSeoDto
): Promise<SeoData> => {
  const response = await axiosInstance.post<SeoData>(
    seoQueries.createSeo.endpoint,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Get SEO data by route
export const getSeoByRoute = async (route: string): Promise<GetOneSeoResponse> => {
  // Check if route has query params, if so, strip them for matching or keep depending on backend logic.
  // Assuming exact match on route path.
  // Need to encode the route since it contains slashes, but typically API designing for /seo/{route} where route is a path might require encoding or passing as query param.
  // Based on the user provided API: /seo/{route}, let's assume route needs to be URL encoded if it contains slashes.
  const encodedRoute = encodeURIComponent(route);
  
  try {
    const response = await axiosInstance.get<GetOneSeoResponse>(
      seoQueries.getSeoByRoute(encodedRoute).endpoint
    );
    return response.data;
  } catch (error) {
    // If 404, we might want to return null or throw. 
    // For generateMetadata, returning null allows fallback to default metadata.
    console.warn(`SEO data not found for route: ${route}`);
    throw error;
  }
};
