export type FilterPayloadOptions = {
  categoryName?: string;
  searchQuery?: string;
  filters: Record<
    string,
    string | number | string[] | number[] | undefined | any
  >;
  extraFields?: Record<string, any>;
  locationQuery?: string;
  exchangable?: boolean;
};

export const buildAdFilterPayload = ({
  categoryName,
  searchQuery,
  filters,
  extraFields = {},
  locationQuery,
  exchangable,
}: FilterPayloadOptions) => {
  const payload: any = {};

  if (categoryName) {
    payload.category = categoryName;
  }

  // Search
  if (searchQuery?.trim()) {
    payload.search = searchQuery.trim();
  }

  // Location/Neigbourhood
  if (locationQuery) {
    payload.city = locationQuery;
  }
  if (filters.neighbourhood && typeof filters.neighbourhood === "string") {
    payload.neighbourhood = filters.neighbourhood;
  }

  // Price Range (Array) - used in Categories
  if (
    filters.price &&
    Array.isArray(filters.price) &&
    filters.price.length === 2
  ) {
    const [min, max] = filters.price as number[];
    if (typeof min === "number" && min > 0) payload.priceFrom = min;
    if (typeof max === "number" && max < 1000000) payload.priceTo = max;
  }

  // Salary (Enum-ish) - used in Jobs
  const salaryFilter = filters.salary as string;
  if (salaryFilter) {
    if (salaryFilter === "under-10k") {
      payload.priceTo = 10000;
    } else if (salaryFilter === "10k-20k") {
      payload.priceFrom = 10000;
      payload.priceTo = 20000;
    } else if (salaryFilter === "20k-30k") {
      payload.priceFrom = 20000;
      payload.priceTo = 30000;
    } else if (salaryFilter === "30k-50k") {
      payload.priceFrom = 30000;
      payload.priceTo = 50000;
    } else if (salaryFilter === "50k-100k") {
      payload.priceFrom = 50000;
      payload.priceTo = 100000;
    } else if (salaryFilter === "over-100k") {
      payload.priceFrom = 100000;
    }
  }

  // Boolean/Select filters
  if (filters.deal === "true") payload.deal = true;
  else if (filters.deal === "false") payload.deal = false;

  if (filters.isFeatured === "true") payload.isFeatured = true;
  else if (filters.isFeatured === "false") payload.isFeatured = false;

  if (filters.hasVideo === "true") payload.hasVideo = true;
  else if (filters.hasVideo === "false") payload.hasVideo = false;

  if (exchangable) payload.isExchangable = true;

  // Dates
  if (filters.fromDate && typeof filters.fromDate === "string") {
    payload.fromDate = new Date(filters.fromDate).toISOString();
  }
  if (filters.toDate && typeof filters.toDate === "string") {
    payload.toDate = new Date(filters.toDate).toISOString();
  }

  // Extra Fields
  const extraFieldsFilters: Record<string, any> = {};

  // Known top-level fields handled explicitly above
  const knownFields = [
    "neighbourhood",
    "price",
    "salary",
    "deal",
    "isFeatured",
    "hasVideo",
    "fromDate",
    "toDate",
    "search",
    "location",
  ];

  // Map any remaining filter keys into extraFields automatically
  Object.keys(filters).forEach((key) => {
    if (!knownFields.includes(key) && filters[key] !== undefined) {
      extraFieldsFilters[key] = filters[key];
    }
  });

  const finalExtraFields = { ...extraFieldsFilters, ...extraFields };
  if (Object.keys(finalExtraFields).length > 0) {
    payload.extraFields = finalExtraFields;
  }

  return payload;
};;
