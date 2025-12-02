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
  formValues: Record<string, unknown>
): { value: string; label: string }[] => {
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
      if (field.optionalMapOfArray[normalizedParentValue]) {
        return field.optionalMapOfArray[normalizedParentValue].map(
          (option: string) => ({
            value: option,
            label: option,
          })
        );
      }

      // Try case-insensitive match
      const matchingKey = Object.keys(field.optionalMapOfArray).find(
        (key) => key.trim().toLowerCase() === normalizedParentValue.toLowerCase()
      );

      if (matchingKey && field.optionalMapOfArray[matchingKey]) {
        return field.optionalMapOfArray[matchingKey].map((option: string) => ({
          value: option,
          label: option,
        }));
      }
    }
    return []; // Return empty if parent not selected
  }

  // Otherwise use optionalArray
  if (field.optionalArray && field.optionalArray.length > 0) {
    return field.optionalArray.map((option: string) => ({
      value: option,
      label: option,
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

