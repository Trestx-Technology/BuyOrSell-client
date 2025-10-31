import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
} from "axios";
import { toast } from "sonner";
import { Logout } from "@/app/api/auth";
import { LocalStorageService } from "./local-storage";

export const CreateAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    transformRequest: [
      (data: unknown): string | unknown => {
        // Skip transformation for FormData to preserve binary content
        if (data instanceof FormData) {
          return data;
        }

        return data;
      },
      ...(axios.defaults.transformRequest as Array<(data: unknown) => unknown>),
    ],

    transformResponse: [
      ...(axios.defaults.transformResponse as Array<
        (data: unknown) => unknown
      >),
      (data: unknown): unknown => {
        return data;
      },
    ],
  });

  if (typeof window !== "undefined") {
    instance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig
      ): Promise<InternalAxiosRequestConfig> => {
        // Get access token from cookies on each request
        const accessToken = LocalStorageService.get("dealdome_access_token");

        if (accessToken && config.headers) {
          config.headers.Authorization = "Bearer " + accessToken;
        }

        return config;
      },
      (error: Error): Promise<Error> => {
        return Promise.reject(error);
      }
    );
  }

  instance.interceptors.response.use(
    async (response: AxiosResponse): Promise<AxiosResponse> => {
      if (response.status === 401) {
        Logout();
        toast.error("Session expired. Please log in again.");
        // window.location.href = "/login";
      }
      return response;
    },
    (error: AxiosError): Promise<never> => {
      const status = error.response?.status;
      
      // Helper function to extract error message from different error response structures
      const getErrorMessage = (): string => {
        if (!error.response?.data) {
          return error.message || "Something went wrong.";
        }

        const errorData = error.response.data as Record<string, unknown>;
        
        // Try to extract message from various possible structures
        if (typeof errorData === 'string') {
          return errorData;
        }
        
        if (typeof errorData.message === 'string') {
          return errorData.message;
        }
        
        if (typeof errorData.error === 'string') {
          return errorData.error;
        }
        
        if (errorData.error && typeof errorData.error === 'object') {
          const errorObj = errorData.error as Record<string, unknown>;
          if (typeof errorObj.message === 'string') {
            return errorObj.message;
          }
        }
        
        // Fallback to axios error message or default
        return error.message || "Something went wrong.";
      };

      const message = getErrorMessage();

      // Avoid showing error if you're on login route
      if (
        typeof window !== "undefined" &&
        window.location.pathname === "/login"
      ) {
        toast.error(message);
        return Promise.reject(error);
      }

      // Handle specific status codes
      if (status === 401) {
        // Clear the cookie by setting it with expired date
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else if (status === 403) {
        toast.error(message || "You do not have permission to perform this action.");
      } else if (status === 500) {
        toast.error("Internal Server Error. Please try again later.");
      } else {
        toast.error(message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = CreateAxiosInstance(
  process.env.NEXT_PUBLIC_BACKEND_URL!
);
