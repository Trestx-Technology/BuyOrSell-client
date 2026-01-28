import { axiosInstance } from '@/services/axios-api-client';
import { categoriesQueries } from './index';
import {
  CategoriesApiResponse,
  CategoryApiResponse,
  CategoryTreeResponse,
  CategoryTreeAdsResponse,
  JobSubcategoriesApiResponse,
} from '@/interfaces/categories.types';

export const getCategoriesWithFilter = async (params?: {
  filter?: string;
  limit?: number;
  page?: number;
}): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get<CategoriesApiResponse>(
    categoriesQueries.categories.endpoint,
    { params },
  );
  return response.data;
};

export const getCategoriesTree = async (): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get<CategoriesApiResponse>(
    categoriesQueries.categoriesTree.endpoint,
  );
  return response.data;
};

export const getCategoryTreeById = async (
  id: string,
): Promise<CategoryTreeResponse> => {
  const response = await axiosInstance.get<{ data: CategoryTreeResponse }>(
    categoriesQueries.categoryTreeById(id).endpoint,
  );
  return response.data.data;
};

export const getCategoryTreeAdsById = async (
  id: string,
): Promise<CategoryTreeAdsResponse> => {
  const response = await axiosInstance.get<CategoryTreeAdsResponse>(
    categoriesQueries.categoryTreeAdsById(id).endpoint,
  );
  return response.data;
};

export const getCategoryFields = async (): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get<CategoriesApiResponse>(
    categoriesQueries.categoryFields.endpoint,
  );
  return response.data;
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryApiResponse> => {
  const response = await axiosInstance.get<CategoryApiResponse>(
    categoriesQueries.categoryById(id).endpoint,
  );
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(
    categoriesQueries.deleteCategory(id).endpoint,
  );
  return response.data;
};

export const deleteCategoryFromTree = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(
    categoriesQueries.deleteCategoryFromTree(id).endpoint,
  );
  return response.data;
};

export const createCategory = async (
  data: Record<string, unknown>,
): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.post<CategoriesApiResponse>(
    categoriesQueries.createCategory.endpoint,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: Record<string, unknown>,
): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.put<CategoriesApiResponse>(
    categoriesQueries.updateCategory(id).endpoint,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const downloadExcelTemplate = async (): Promise<Blob> => {
  const response = await axiosInstance.get(
    categoriesQueries.excelTemplate.endpoint,
    {
      responseType: 'blob',
    },
  );
  return response.data;
};

export const uploadExcel = async (
  file: File,
): Promise<CategoriesApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<CategoriesApiResponse>(
    categoriesQueries.excelUpload.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const getJobSubcategories = async (params?: {
  parentCategoryId?: string;
  adType?: string;
}): Promise<JobSubcategoriesApiResponse> => {
  const response = await axiosInstance.get<JobSubcategoriesApiResponse>(
    categoriesQueries.jobSubcategories(params).endpoint,
    { params },
  );
  return response.data;
};

export const validateCategoryPath = async (
  path: string
): Promise<CategoryApiResponse> => {
  const response = await axiosInstance.get<CategoryApiResponse>(
    categoriesQueries.validateCategoryPath(path).endpoint,
    {
      skipErrorToast: true,
    },
  );
  return response.data;
};

