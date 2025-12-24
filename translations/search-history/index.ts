import { createTranslationNamespace } from '../../validations/utils';
import type { SearchHistoryTranslations } from './types';

export const searchHistoryTranslations = createTranslationNamespace<SearchHistoryTranslations>({
  'en-US': {
    // Popover
    mySearches: 'My Searches',
    clearAll: 'Clear All',
    clearing: 'Clearing...',
    noRecentSearches: 'No recent searches',

    // Page
    pageTitle: 'Search History',
    pageDescription: 'View and manage your recent searches',
    loadingSearchHistory: 'Loading search history...',
    failedToLoad: 'Failed to load search history',
    failedToLoadDescription: 'Unable to fetch your search history. Please try again later.',
    noSearchHistory: 'No search history',
    noSearchHistoryDescription: 'Your recent searches will appear here',

    // Messages
    searchDeleted: 'Search deleted',
    clearAllConfirm: 'Are you sure you want to clear all search history?',
    clearAllSuccess: 'All search history cleared',
    clearAllError: 'Failed to clear search history',
  },
  'nl-NL': {
    // Popover
    mySearches: 'Mijn Zoekopdrachten',
    clearAll: 'Alles Wissen',
    clearing: 'Aan het wissen...',
    noRecentSearches: 'Geen recente zoekopdrachten',

    // Page
    pageTitle: 'Zoekgeschiedenis',
    pageDescription: 'Bekijk en beheer je recente zoekopdrachten',
    loadingSearchHistory: 'Zoekgeschiedenis laden...',
    failedToLoad: 'Kan zoekgeschiedenis niet laden',
    failedToLoadDescription: 'Kan je zoekgeschiedenis niet ophalen. Probeer het opnieuw.',
    noSearchHistory: 'Geen zoekgeschiedenis',
    noSearchHistoryDescription: 'Je recente zoekopdrachten verschijnen hier',

    // Messages
    searchDeleted: 'Zoekopdracht verwijderd',
    clearAllConfirm: 'Weet je zeker dat je alle zoekgeschiedenis wilt wissen?',
    clearAllSuccess: 'Alle zoekgeschiedenis gewist',
    clearAllError: 'Kan zoekgeschiedenis niet wissen',
  },
  'nl': {
    // Popover
    mySearches: 'Mijn Zoekopdrachten',
    clearAll: 'Alles Wissen',
    clearing: 'Aan het wissen...',
    noRecentSearches: 'Geen recente zoekopdrachten',

    // Page
    pageTitle: 'Zoekgeschiedenis',
    pageDescription: 'Bekijk en beheer je recente zoekopdrachten',
    loadingSearchHistory: 'Zoekgeschiedenis laden...',
    failedToLoad: 'Kan zoekgeschiedenis niet laden',
    failedToLoadDescription: 'Kan je zoekgeschiedenis niet ophalen. Probeer het opnieuw.',
    noSearchHistory: 'Geen zoekgeschiedenis',
    noSearchHistoryDescription: 'Je recente zoekopdrachten verschijnen hier',

    // Messages
    searchDeleted: 'Zoekopdracht verwijderd',
    clearAllConfirm: 'Weet je zeker dat je alle zoekgeschiedenis wilt wissen?',
    clearAllSuccess: 'Alle zoekgeschiedenis gewist',
    clearAllError: 'Kan zoekgeschiedenis niet wissen',
  },
  'ar': {
    // Popover
    mySearches: 'عمليات البحث الخاصة بي',
    clearAll: 'مسح الكل',
    clearing: 'جارٍ المسح...',
    noRecentSearches: 'لا توجد عمليات بحث حديثة',

    // Page
    pageTitle: 'سجل البحث',
    pageDescription: 'عرض وإدارة عمليات البحث الأخيرة',
    loadingSearchHistory: 'جارٍ تحميل سجل البحث...',
    failedToLoad: 'فشل في تحميل سجل البحث',
    failedToLoadDescription: 'تعذر جلب سجل البحث الخاص بك. يرجى المحاولة مرة أخرى لاحقاً.',
    noSearchHistory: 'لا يوجد سجل بحث',
    noSearchHistoryDescription: 'ستظهر عمليات البحث الأخيرة هنا',

    // Messages
    searchDeleted: 'تم حذف البحث',
    clearAllConfirm: 'هل أنت متأكد من أنك تريد مسح جميع سجل البحث؟',
    clearAllSuccess: 'تم مسح جميع سجل البحث',
    clearAllError: 'فشل في مسح سجل البحث',
  },
});
