export const categoriesQueries = {
  categories: {
    key: "categories",
    endpoint: "/categories",
  },
  categoriesTree: {
    key: "categories-tree",
    endpoint: "/categories/tree",
  },
  categoryTreeById: {
    key: "category-tree-by-id",
    endpoint: "/categories/tree/:id",
  },
  categoryFields: {
    key: "category-fields",
    endpoint: "/categories/fields",
  },
  categoryById: {
    key: "category-by-id",
    endpoint: "/categories/:id",
  },
  createCategory: {
    key: "create-category",
    endpoint: "/categories",
  },
  updateCategory: {
    key: "update-category",
    endpoint: "/categories/:id",
  },
  deleteCategory: {
    key: "delete-category",
    endpoint: "/categories/:id",
  },
  deleteCategoryFromTree: {
    key: "delete-category-from-tree",
    endpoint: "/categories/tree/:id",
  },
  excelTemplate: {
    key: "excel-template",
    endpoint: "/categories/excel/template",
  },
  excelUpload: {
    key: "excel-upload",
    endpoint: "/categories/excel/upload",
  },
};
