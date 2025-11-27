/**
 * Formats a date string to a human-readable relative time or date format
 * @param dateString - ISO date string or date string
 * @returns Formatted string like "2 hours ago", "3 days ago", "1 week ago", "1 month ago", or "14th June"
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  if (diffMonths < 2) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
  
  // Format date as "14th June" or "14th June 2024" if different year
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  const currentYear = now.getFullYear();
  
  const getOrdinalSuffix = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };
  
  const ordinalDay = `${day}${getOrdinalSuffix(day)}`;
  
  if (year === currentYear) {
    return `${ordinalDay} ${month}`;
  }
  return `${ordinalDay} ${month} ${year}`;
};

