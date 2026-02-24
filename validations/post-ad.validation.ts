import { Field, SubCategory } from "@/interfaces/categories.types";
import { Organization } from "@/interfaces/organization.types";

/**
 * Check if a category is a job category (case-insensitive)
 * @param categoryName - The name of the category
 * @returns true if the category is a job category
 */
export const isJobCategory = (categoryName: string): boolean => {
  const normalizedName = categoryName.toLowerCase().trim();
  return normalizedName === "job" || normalizedName === "jobs";
};

/**
 * Check if user has any organizations
 * @param organizations - Array of user organizations
 * @returns true if user has at least one organization
 */
export const hasOrganization = (organizations: Organization[]): boolean => {
  return organizations && organizations.length > 0;
};

/**
 * Check if a category has fields defined
 * @param category - The category object
 * @returns true if category has fields
 */
export const hasFields = (category?: SubCategory): boolean => {
  return !!(
    category?.fields &&
    Array.isArray(category.fields) &&
    category.fields.length > 0
  );
};

/**
 * Check if a category is a leaf category (no children but has fields)
 * @param category - The category object
 * @returns true if category is a leaf category
 */
export const isLeafCategory = (category?: SubCategory): boolean => {
  const hasNoChildren =
    !category?.children || category.children.length === 0;
  return hasNoChildren && hasFields(category);
};

/**
 * Get options for a field based on dependencies and form values
 * @param field - The field object
 * @param formValues - Current form values
 * @returns Array of options with value and label
 */
export const getFieldOptions = (
  field: Field,
  formValues: Record<string, unknown>,
  locale: string = "en",
): { value: string; label: string }[] => {
  const getOptionLabel = (option: unknown) => {
    if (typeof option === "object" && option !== null) {
      const opt = option as {
        area?: string;
        areaAr?: string;
        name?: string;
        nameAr?: string;
        label?: string;
        [key: string]: unknown;
      };
      if (locale === "ar") {
        return (
          opt.areaAr ||
          opt.nameAr ||
          opt.area ||
          opt.name ||
          opt.label ||
          JSON.stringify(opt)
        );
      }
      return opt.area || opt.name || opt.label || JSON.stringify(opt);
    }
    return String(option);
  };

  const getOptionValue = (option: unknown) => {
    if (typeof option === "object" && option !== null) {
      const opt = option as {
        area?: string;
        name?: string;
        value?: string;
        id?: string;
      };
      return opt.area || opt.name || opt.value || opt.id || String(option);
    }
    return String(option);
  };

  // If field depends on another field (and it's not "none"), use optionalMapOfArray
  if (
    field.dependsOn &&
    field.dependsOn !== "none" &&
    field.dependsOn.trim() !== "" &&
    field.optionalMapOfArray &&
    Object.keys(field.optionalMapOfArray).length > 0
  ) {
    const parentValue = formValues[field.dependsOn];
    // Ensure parentValue is a string for the map lookup
    if (parentValue && typeof parentValue === "string") {
      const normalizedParentValue = parentValue.trim();

      // First try exact match
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const exactMatch = (field.optionalMapOfArray as any)[
        normalizedParentValue
      ];
      if (exactMatch) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return exactMatch.map((option: any) => ({
          value: getOptionValue(option),
          label: getOptionLabel(option),
        }));
      }

      // Try case-insensitive match
      const matchingKey = Object.keys(field.optionalMapOfArray).find(
        (key) =>
          key.trim().toLowerCase() === normalizedParentValue.toLowerCase(),
      );

      if (matchingKey) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = (field.optionalMapOfArray as any)[matchingKey];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return options.map((option: any) => ({
          value: getOptionValue(option),
          label: getOptionLabel(option),
        }));
      }
    }
    return []; // Return empty if parent not selected
  }

  // Otherwise use optionalArray
  if (field.optionalArray && field.optionalArray.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (field.optionalArray as any[]).map((option: any) => ({
      value: getOptionValue(option),
      label: getOptionLabel(option),
    }));
  }

  return [];
};

/**
 * Check if a field should be shown based on dependencies
 * @param field - The field object
 * @param formValues - Current form values
 * @returns true if field should be shown
 */
export const shouldShowField = (
  field: Field,
  formValues: Record<string, unknown>
): boolean => {
  // If field depends on another field, only show if parent has a value
  // Handle cases where dependsOn is "none" or empty string (no dependency)
  if (
    field.dependsOn &&
    field.dependsOn !== "none" &&
    field.dependsOn.trim() !== ""
  ) {
    const parentValue = formValues[field.dependsOn];
    return !!parentValue;
  }
  return true;
};

/**
 * Recursively search for a category by ID in the category tree
 * @param tree - The category tree to search in
 * @param categoryId - The ID of the category to find
 * @returns The found category or null if not found
 */
export const findCategoryInTree = (
  tree: SubCategory | null | undefined,
  categoryId: string
): SubCategory | null => {
  if (!tree) return null;
  if (tree._id === categoryId) return tree;
  
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findCategoryInTree(child, categoryId);
      if (found) return found;
    }
  }
  
  return null;
};

/**
 * Search for a category by ID across a flat list of root category trees.
 * This is used to derive category data from the already-cached /categories/tree
 * response instead of making a separate /categories/tree/:id API call.
 * @param trees - The array of root categories (as returned by /categories/tree)
 * @param categoryId - The ID of the category to find
 * @returns The found SubCategory (with its children) or undefined
 */
export const findCategoryInTreeList = (
  trees: SubCategory[],
  categoryId: string
): SubCategory | undefined => {
  for (const root of trees) {
    const found = findCategoryInTree(root, categoryId);
    if (found) return found;
  }
  return undefined;
};

