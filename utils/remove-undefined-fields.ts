/**
 * Removes all undefined fields from an object
 * This is useful for cleaning payloads before sending to APIs
 * 
 * @param obj - The object to clean
 * @returns The same object with undefined fields removed (mutates the original object)
 * 
 * @example
 * const payload = { name: "John", age: undefined, email: "john@example.com" };
 * removeUndefinedFields(payload);
 * // payload is now { name: "John", email: "john@example.com" }
 */
export const removeUndefinedFields = <T extends object>(
  obj: T
): T => {
  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

