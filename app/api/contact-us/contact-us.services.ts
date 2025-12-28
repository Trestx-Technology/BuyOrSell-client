import { axiosInstance } from "@/services/axios-api-client";
import { contactUsQueries } from "./index";

export interface ContactUsPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  category?: string;
  orderId?: string;
}

export interface ContactUsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    _id?: string;
    name: string;
    email: string;
    category?: string;
    subject?: string;
    message: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// Submit contact form
export const submitContactForm = async (
  data: ContactUsPayload
): Promise<ContactUsResponse> => {
  const response = await axiosInstance.post<ContactUsResponse>(
    contactUsQueries.submitContactForm.endpoint,
    data
  );
  return response.data;
};
