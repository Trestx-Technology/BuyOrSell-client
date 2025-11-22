export const categoriesQueries = {
  categories: {
    Key: ['categories'],
    endpoint: '/categories',
  },
  categoriesTree: {
    Key: ['categories', 'tree'],
    endpoint: '/categories/tree',
  },
  categoryTreeById: (id: string) => ({
    Key: ['category', 'tree', id],
    endpoint: `/categories/tree/${id}`,
  }),
  categoryFields: {
    Key: ['categories', 'fields'],
    endpoint: '/categories/fields',
  },
  categoryById: (id: string) => ({
    Key: ['category', id],
    endpoint: `/categories/${id}`,
  }),
  createCategory: {
    Key: ['category', 'create'],
    endpoint: '/categories',
  },
  updateCategory: (id: string) => ({
    Key: ['category', id, 'update'],
    endpoint: `/categories/${id}`,
  }),
  deleteCategory: (id: string) => ({
    Key: ['category', id, 'delete'],
    endpoint: `/categories/${id}`,
  }),
  deleteCategoryFromTree: (id: string) => ({
    Key: ['category', 'tree', id, 'delete'],
    endpoint: `/categories/tree/${id}`,
  }),
  excelTemplate: {
    Key: ['categories', 'excel', 'template'],
    endpoint: '/categories/excel/template',
  },
  excelUpload: {
    Key: ['categories', 'excel', 'upload'],
    endpoint: '/categories/excel/upload',
  },
};

