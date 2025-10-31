import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoriesTree,
  getCategoryTreeById,
  getCategoryFields,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryFromTree,
  uploadExcel,
  downloadExcelTemplate
} from "@/app/api/categories";
import { categoriesQueries } from "@/api-queries/categories.query";
import { SubCategory, CategoriesApiResponse, CategoryTreeResponse } from "@/interfaces/categories.types";

// Query Hooks

export const useCategories = (params?: {
  filter?: string;
  limit?: number;
  page?: number;
}) => {
  return useQuery<CategoriesApiResponse, Error>({
    queryKey: [categoriesQueries.categories.key, params],
    queryFn: () => getCategories(params),
  });
};

export const useGetMainCategories = () => {
  return useQuery<CategoriesApiResponse, Error, SubCategory[]>({
    queryKey: [categoriesQueries.categoriesTree.key],
    queryFn: getCategoriesTree,
    select: (data: CategoriesApiResponse) => {
      return data.data.filter((category: SubCategory) => !category.parentID);
    },
  });
};

export const useCategoriesTree = () => {
  return useQuery<CategoriesApiResponse, Error, SubCategory[]>({
    queryKey: [categoriesQueries.categoriesTree.key],
    queryFn: getCategoriesTree,
    select: (data: CategoriesApiResponse) => {
      // Filter categories that don't have parentID (top-level categories)
      return data.data;
    },
  });
};

export const useCategoryTreeById = (id: string) => {
  return useQuery<CategoryTreeResponse, Error>({
    queryKey: [categoriesQueries.categoryTreeById.key, id],
    queryFn: () => getCategoryTreeById(id),
    enabled: !!id,
  });
};

export const useCategoryFields = () => {
  return useQuery<CategoriesApiResponse, Error>({
    queryKey: [categoriesQueries.categoryFields.key],
    queryFn: getCategoryFields,
  });
};

export const useCategoryById = (id: string) => {
  return useQuery<CategoriesApiResponse, Error>({
    queryKey: [categoriesQueries.categoryById.key, id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

// Mutation Hooks

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CategoriesApiResponse,
    Error,
    Record<string, unknown>
  >({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categories.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoriesTree.key] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CategoriesApiResponse,
    Error,
    { id: string; data: Record<string, unknown> }
  >({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categories.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoriesTree.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoryById.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoryTreeById.key] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categories.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoriesTree.key] });
    },
  });
};

export const useDeleteCategoryFromTree = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategoryFromTree,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categories.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoriesTree.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoryTreeById.key] });
    },
  });
};

export const useUploadExcel = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoriesApiResponse, Error, File>({
    mutationFn: uploadExcel,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categories.key] });
      queryClient.invalidateQueries({ queryKey: [categoriesQueries.categoriesTree.key] });
    },
  });
};

export const useDownloadExcelTemplate = () => {
  return useMutation<Blob, Error, void>({
    mutationFn: downloadExcelTemplate,
  });
};
