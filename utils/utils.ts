export function isColor(value: string): boolean {
  return (
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ||
    /^rgb(a?)\((\s*\d+\s*,){2,3}\s*[\d.]+\s*\)$/.test(value) ||
    /^hsl(a?)\((\s*\d+\s*,){2}\s*[\d.]+%\s*\)$/.test(value)
  );
}

/**
 * Get an appropriate icon emoji for a specification key
 * @param key - The specification key (e.g., 'year', 'mileage', 'fuel')
 * @returns An emoji string representing the specification type
 */
export function getSpecIcon(key: string): string {
  // Map common specification keys to appropriate emojis
  const keyToIcon: Record<string, string> = {
    // Motors
    year: "📅",
    mileage: "🚗",
    fuel: "⛽",
    transmission: "⚙️",
    engine: "🔧",
    cylinders: "🔢",

    // Real Estate
    bedrooms: "🛏️",
    bathrooms: "🚿",
    area: "📐",
    floors: "🏢",
    parking: "🅿️",

    // Electronics
    brand: "🏷️",
    model: "📱",
    storage: "💾",
    ram: "🧠",
    screen: "📺",
    battery: "🔋",

    // General
    color: "🎨",
    size: "📏",
    weight: "⚖️",
    condition: "⭐",
  };

  // Normalize key to lowercase for matching
  const normalizedKey = key.toLowerCase();

  // Try exact match first
  if (keyToIcon[normalizedKey]) {
    return keyToIcon[normalizedKey];
  }

  // Try partial matches
  for (const [specKey, icon] of Object.entries(keyToIcon)) {
    if (normalizedKey.includes(specKey) || specKey.includes(normalizedKey)) {
      return icon;
    }
  }

  // Default fallback icon
  return "📋";
}

/**
 * Format a specification value for display
 * @param key - The specification key
 * @param value - The specification value
 * @returns A formatted string for display
 */
export function formatSpecValue(key: string, value: string | number): string {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);
  const normalizedKey = key.toLowerCase();

  // Special formatting for different types of values
  if (normalizedKey.includes("mileage") || normalizedKey.includes("km")) {
    // Format mileage with commas
    const numValue =
      typeof value === "number" ? value : parseFloat(stringValue);
    if (!isNaN(numValue)) {
      return `${numValue.toLocaleString()} km`;
    }
  }

  if (normalizedKey.includes("year") && !isNaN(Number(stringValue))) {
    // Keep year as is
    return stringValue;
  }

  if (normalizedKey.includes("area") || normalizedKey.includes("size")) {
    // Format area/size
    const numValue =
      typeof value === "number" ? value : parseFloat(stringValue);
    if (!isNaN(numValue)) {
      return `${numValue.toLocaleString()} sqft`;
    }
  }

  if (normalizedKey.includes("price") || normalizedKey.includes("cost")) {
    // Format price
    const numValue =
      typeof value === "number" ? value : parseFloat(stringValue);
    if (!isNaN(numValue)) {
      return `AED ${numValue.toLocaleString()}`;
    }
  }

  if (normalizedKey.includes("weight")) {
    // Format weight
    const numValue =
      typeof value === "number" ? value : parseFloat(stringValue);
    if (!isNaN(numValue)) {
      return `${numValue}kg`;
    }
  }

  // Default: capitalize first letter and return
  return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
}
