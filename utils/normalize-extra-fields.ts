import { ProductExtraField, ProductExtraFields } from "@/interfaces/ad";

/**
 * Normalizes extraFields to a consistent array format
 * Handles both array and Record (object) formats
 * Preserves all metadata including optionalArray, type, icon, etc.
 *
 * @param extraFields - The extraFields to normalize (can be array or Record)
 * @returns Array of ProductExtraField objects, or empty array if invalid
 */
export const normalizeExtraFieldsToArray = (
  extraFields: ProductExtraFields | undefined | null
): ProductExtraField[] => {
  // Return empty array if extraFields is null, undefined, or empty
  if (!extraFields) {
    return [];
  }

  // If it's already an array, return it as is (preserves all metadata)
  if (Array.isArray(extraFields)) {
    return extraFields.filter(
      (field): field is ProductExtraField =>
        field !== null &&
        field !== undefined &&
        typeof field === "object" &&
        "name" in field
    );
  }

  // If it's an object/Record, convert to array format
  if (typeof extraFields === "object") {
    return Object.entries(extraFields).map(([name, value]) => {
      // Determine type from value
      let fieldType = "string";
      if (typeof value === "number") {
        fieldType = "number";
      } else if (typeof value === "boolean") {
        fieldType = "bool";
      } else if (Array.isArray(value)) {
        fieldType = "checkboxes";
      }

      return {
        name,
        type: fieldType,
        value,
      } as ProductExtraField;
    });
  }

  // Return empty array for any other type
  return [];
};

/**
 * Extracts specifications from extraFields
 * Filters for single-value fields (excludes arrays and booleans)
 *
 * @param extraFields - The extraFields to extract specifications from
 * @param limit - Optional limit on number of specifications to return (default: undefined for all)
 * @returns Array of specification objects with name, value, and icon
 */
export const getSpecifications = (
  extraFields: ProductExtraFields | undefined | null,
  limit?: number
): Array<{ name: string; value: string; icon?: string }> => {
  const normalizedFields = normalizeExtraFieldsToArray(extraFields);

  return normalizedFields
    .filter((field) => {
      // Only include fields with single values (not arrays)
      if (Array.isArray(field.value)) {
        return false;
      }
      // Filter out boolean fields
      if (field.type === "bool" || typeof field.value === "boolean") {
        return false;
      }
      // Filter out empty/null values
      if (
        field.value === null ||
        field.value === undefined ||
        field.value === ""
      ) {
        return false;
      }
      return true;
    })
    .slice(0, limit) // Apply limit if provided
    .map((field) => ({
      name: field.name,
      value: String(field.value),
      icon: field.icon,
    }));
};
