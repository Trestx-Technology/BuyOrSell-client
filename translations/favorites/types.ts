/**
 * Favorites translations type definitions
 */
export type FavoritesTranslations = {
  // Page titles
  myFavorites: string;
  collection: string;

  // Sort options
  sort: {
    default: string;
    newest: string;
    oldest: string;
    priceLowToHigh: string;
    priceHighToLow: string;
  };

  // Sections
  list: string;
  favorites: string;
  items: string;

  // Loading states
  loadingCollections: string;
  loadingFavorites: string;
  loadingCollection: string;

  // Search placeholders
  searchFavorites: string;
  searchItems: string;

  // Empty states
  noFavoritesYet: string;
  noItemsInCollection: string;
  startAddingItems: string;

  // Error states
  collectionNotFound: string;
  collectionNotFoundDescription: string;

  // Actions
  backToFavorites: string;
  backToCollections: string;

  // Dynamic text
  itemsCount: string; // "{count} items"
  createdAt: string; // "Created {date}"
};
