import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategoriesTree,
  getCategoryTreeById,
  getCategoryFields,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategoryFromTree,
  uploadExcel,
  downloadExcelTemplate,
  getCategoriesWithFilter,
} from '@/app/api/categories/categories.services';
import { categoriesQueries } from '@/app/api/categories/index';
import { SubCategory, CategoriesApiResponse, CategoryApiResponse, CategoryTreeResponse } from "@/interfaces/categories.types";

// Query Hooks

export const useCategoriesWithFilters = (params?: {
  filter?: string;
  limit?: number;
  page?: number;
}) => {
  return useQuery<CategoriesApiResponse, Error>({
    queryKey: [...categoriesQueries.categories.Key, params],
    queryFn: () => getCategoriesWithFilter(params),
  });
};

export const useGetMainCategories = () => {
  return useQuery<CategoriesApiResponse, Error, SubCategory[]>({
    queryKey: categoriesQueries.categoriesTree.Key,
    queryFn: getCategoriesTree,
    select: (data: CategoriesApiResponse) => {
      return data.data.filter((category: SubCategory) => !category.parentID);
    },
  });
};

export const useCategoriesTree = () => {
  return useQuery<CategoriesApiResponse, Error, SubCategory[]>({
    queryKey: categoriesQueries.categoriesTree.Key,
    queryFn: getCategoriesTree,
    select: (data: CategoriesApiResponse) => {
      // Filter categories that don't have parentID (top-level categories)
      return data.data;
    },
  });
};

export const useCategoryTreeById = (id: string) => {
  return useQuery<CategoryTreeResponse, Error>({
    queryKey: [...categoriesQueries.categoryTreeById(id).Key],
    queryFn: () => getCategoryTreeById(id),
    enabled: !!id,
  });
};

export const useCategoryFields = () => {
  return useQuery<CategoriesApiResponse, Error>({
    queryKey: categoriesQueries.categoryFields.Key,
    queryFn: getCategoryFields,
  });
};
  
export const useCategoryById = (id: string) => {
  return useQuery<CategoryApiResponse, Error>({
    queryKey: [...categoriesQueries.categoryById(id).Key],
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
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categories.Key });
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categoriesTree.Key });
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
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categories.Key });
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categoriesTree.Key });
      // Invalidate all category by id queries (prefix match)
      queryClient.invalidateQueries({ 
        queryKey: ['category'],
        exact: false 
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categories.Key });
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categoriesTree.Key });
    },
  });
};

export const useDeleteCategoryFromTree = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCategoryFromTree,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categories.Key });
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categoriesTree.Key });
      // Invalidate all category tree queries (prefix match)
      queryClient.invalidateQueries({ 
        queryKey: ['category', 'tree'],
        exact: false 
      });
    },
  });
};

export const useUploadExcel = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoriesApiResponse, Error, File>({
    mutationFn: uploadExcel,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categories.Key });
      queryClient.invalidateQueries({ queryKey: categoriesQueries.categoriesTree.Key });
    },
  });
};

export const useDownloadExcelTemplate = () => {
  return useMutation<Blob, Error, void>({
    mutationFn: downloadExcelTemplate,
  });
};
