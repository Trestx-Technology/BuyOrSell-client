/**
 * Categories translations type definitions
 */
export type CategoriesTranslations = {
  // Breadcrumbs
  categories: string;

  // Sort options
  sort: {
    default: string;
    newest: string;
    oldest: string;
    priceLowToHigh: string;
    priceHighToLow: string;
  };

  // Filter labels
  filters: {
    price: string;
    deal: string;
    currentDate: string;
    fromDate: string;
    toDate: string;
    featured: string;
    neighbourhood: string;
    hasVideo: string;
  };

  // Price ranges
  priceRanges: {
    under50k: string;
    between50k100k: string;
    between100k200k: string;
    between200k500k: string;
    over500k: string;
  };

  // Boolean options
  boolean: {
    yes: string;
    no: string;
  };

  // Locations
  locations: {
    dubai: string;
    abuDhabi: string;
    sharjah: string;
    ajman: string;
    rasAlKhaimah: string;
    fujairah: string;
    ummAlQuwain: string;
  };

  // Placeholders
  placeholders: {
    selectPrice: string;
    select: string;
    selectStartDate: string;
    selectEndDate: string;
    tomorrowOrNextWeek: string;
  };

  // Search
  search: string;

  // Page header template
  forSaleIn: string; // "{{category}} for sale in Dubai ({{count}})"

  // Empty states
  noAdsFound: string;

  // Actions
  clearFilters: string;
};
