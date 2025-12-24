import { createTranslationNamespace } from '../../validations/utils';
import type { FavoritesTranslations } from './types';

export const favoritesTranslations = createTranslationNamespace<FavoritesTranslations>({
  'en-US': {
    // Page titles
    myFavorites: 'My Favorites',
    collection: 'Collection',

    // Sort options
    sort: {
      default: 'Default',
      newest: 'Newest',
      oldest: 'Oldest',
      priceLowToHigh: 'Price (Low to High)',
      priceHighToLow: 'Price (High to Low)',
    },

    // Sections
    list: 'List',
    favorites: 'Favorites',
    items: 'Items',

    // Loading states
    loadingCollections: 'Loading collections...',
    loadingFavorites: 'Loading favorites...',
    loadingCollection: 'Loading collection...',

    // Search placeholders
    searchFavorites: 'Search favorites...',
    searchItems: 'Search items...',

    // Empty states
    noFavoritesYet: 'No favorites yet. Click on a collection to view its items.',
    noItemsInCollection: 'No items in this collection',
    startAddingItems: 'Start adding items to your collection to see them here.',

    // Error states
    collectionNotFound: 'Collection Not Found',
    collectionNotFoundDescription: 'The collection you\'re looking for doesn\'t exist or has been removed.',

    // Actions
    backToFavorites: 'Back to Favorites',
    backToCollections: 'Back to Collections',

    // Dynamic text
    itemsCount: '{{count}} items',
    createdAt: 'Created {{date}}',
  },
  'nl-NL': {
    // Page titles
    myFavorites: 'Mijn Favorieten',
    collection: 'Collectie',

    // Sort options
    sort: {
      default: 'Standaard',
      newest: 'Nieuwste',
      oldest: 'Oudste',
      priceLowToHigh: 'Prijs (Laag naar Hoog)',
      priceHighToLow: 'Prijs (Hoog naar Laag)',
    },

    // Sections
    list: 'Lijst',
    favorites: 'Favorieten',
    items: 'Items',

    // Loading states
    loadingCollections: 'Collecties laden...',
    loadingFavorites: 'Favorieten laden...',
    loadingCollection: 'Collectie laden...',

    // Search placeholders
    searchFavorites: 'Zoek favorieten...',
    searchItems: 'Zoek items...',

    // Empty states
    noFavoritesYet: 'Nog geen favorieten. Klik op een collectie om de items te bekijken.',
    noItemsInCollection: 'Geen items in deze collectie',
    startAddingItems: 'Begin met het toevoegen van items aan je collectie om ze hier te zien.',

    // Error states
    collectionNotFound: 'Collectie Niet Gevonden',
    collectionNotFoundDescription: 'De collectie die je zoekt bestaat niet of is verwijderd.',

    // Actions
    backToFavorites: 'Terug naar Favorieten',
    backToCollections: 'Terug naar Collecties',

    // Dynamic text
    itemsCount: '{{count}} items',
    createdAt: 'Gemaakt {{date}}',
  },
  'nl': {
    // Page titles
    myFavorites: 'Mijn Favorieten',
    collection: 'Collectie',

    // Sort options
    sort: {
      default: 'Standaard',
      newest: 'Nieuwste',
      oldest: 'Oudste',
      priceLowToHigh: 'Prijs (Laag naar Hoog)',
      priceHighToLow: 'Prijs (Hoog naar Laag)',
    },

    // Sections
    list: 'Lijst',
    favorites: 'Favorieten',
    items: 'Items',

    // Loading states
    loadingCollections: 'Collecties laden...',
    loadingFavorites: 'Favorieten laden...',
    loadingCollection: 'Collectie laden...',

    // Search placeholders
    searchFavorites: 'Zoek favorieten...',
    searchItems: 'Zoek items...',

    // Empty states
    noFavoritesYet: 'Nog geen favorieten. Klik op een collectie om de items te bekijken.',
    noItemsInCollection: 'Geen items in deze collectie',
    startAddingItems: 'Begin met het toevoegen van items aan je collectie om ze hier te zien.',

    // Error states
    collectionNotFound: 'Collectie Niet Gevonden',
    collectionNotFoundDescription: 'De collectie die je zoekt bestaat niet of is verwijderd.',

    // Actions
    backToFavorites: 'Terug naar Favorieten',
    backToCollections: 'Terug naar Collecties',

    // Dynamic text
    itemsCount: '{{count}} items',
    createdAt: 'Gemaakt {{date}}',
  },
  'ar': {
    // Page titles
    myFavorites: 'المفضلة',
    collection: 'المجموعة',

    // Sort options
    sort: {
      default: 'افتراضي',
      newest: 'الأحدث',
      oldest: 'الأقدم',
      priceLowToHigh: 'السعر (من الأقل للأعلى)',
      priceHighToLow: 'السعر (من الأعلى للأقل)',
    },

    // Sections
    list: 'القائمة',
    favorites: 'المفضلة',
    items: 'العناصر',

    // Loading states
    loadingCollections: 'جاري تحميل المجموعات...',
    loadingFavorites: 'جاري تحميل المفضلة...',
    loadingCollection: 'جاري تحميل المجموعة...',

    // Search placeholders
    searchFavorites: 'البحث في المفضلة...',
    searchItems: 'البحث في العناصر...',

    // Empty states
    noFavoritesYet: 'لا توجد مفضلة بعد. انقر على مجموعة لعرض عناصرها.',
    noItemsInCollection: 'لا توجد عناصر في هذه المجموعة',
    startAddingItems: 'ابدأ بإضافة عناصر إلى مجموعتك لرؤيتها هنا.',

    // Error states
    collectionNotFound: 'المجموعة غير موجودة',
    collectionNotFoundDescription: 'المجموعة التي تبحث عنها غير موجودة أو تم حذفها.',

    // Actions
    backToFavorites: 'العودة إلى المفضلة',
    backToCollections: 'العودة إلى المجموعات',

    // Dynamic text
    itemsCount: '{{count}} عنصر',
    createdAt: 'تم الإنشاء {{date}}',
  },
});
