import { categoriesQueries } from "@/api-queries/categories.query";
import { CategoriesApiResponse, CategoryTreeResponse } from "@/interfaces/categories.types";
import { axiosInstance } from "@/services/axios-api-client";


export const getCategories = async (params?: {
  filter?: string;
  limit?: number;
  page?: number;
}): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get(
    categoriesQueries.categories.endpoint,
    { params }
  );
  return response.data;
};

export const getCategoriesTree = async (): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get(
    categoriesQueries.categoriesTree.endpoint
  );
  return response.data;
};

export const getCategoryTreeById = async (
  id: string
): Promise<CategoryTreeResponse> => {
  const response = await axiosInstance.get(
    categoriesQueries.categoryTreeById.endpoint.replace(":id", id)
  );
  return response.data.data;
};

export const getCategoryFields = async (): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get(
    categoriesQueries.categoryFields.endpoint
  );
  return response.data;
};

export const getCategoryById = async (
  id: string
): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.get(
    categoriesQueries.categoryById.endpoint.replace(":id", id)
  );
  return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(
    categoriesQueries.deleteCategory.endpoint.replace(":id", id)
  );
  return response.data;
};

export const deleteCategoryFromTree = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(
    categoriesQueries.deleteCategoryFromTree.endpoint.replace(":id", id)
  );
  return response.data;
};

export const createCategory = async (
  data: Record<string, unknown>
): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.post(
    categoriesQueries.createCategory.endpoint,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const updateCategory = async (
  id: string,
  data: Record<string, unknown>
): Promise<CategoriesApiResponse> => {
  const response = await axiosInstance.put(
    categoriesQueries.updateCategory.endpoint.replace(":id", id),
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const downloadExcelTemplate = async (): Promise<Blob> => {
  const response = await axiosInstance.get(
    categoriesQueries.excelTemplate.endpoint,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

export const uploadExcel = async (
  file: File
): Promise<CategoriesApiResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    categoriesQueries.excelUpload.endpoint,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
