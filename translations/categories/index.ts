import { createTranslationNamespace } from '../../validations/utils';
import type { CategoriesTranslations } from './types';

export const categoriesTranslations = createTranslationNamespace<CategoriesTranslations>({
  'en-US': {
    // Breadcrumbs
    categories: 'Categories',

    // Sort options
    sort: {
      default: 'Default',
      newest: 'Newest',
      oldest: 'Oldest',
      priceLowToHigh: 'Price (Low to High)',
      priceHighToLow: 'Price (High to Low)',
    },

    // Filter labels
    filters: {
      price: 'Price',
      deal: 'Deal',
      currentDate: 'Current Date',
      fromDate: 'From Date',
      toDate: 'To Date',
      featured: 'Featured',
      neighbourhood: 'Neighbourhood',
      hasVideo: 'Has Video',
    },

    // Price ranges
    priceRanges: {
      under50k: 'Under 50,000',
      between50k100k: '50,000 - 100,000',
      between100k200k: '100,000 - 200,000',
      between200k500k: '200,000 - 500,000',
      over500k: 'Over 500,000',
    },

    // Boolean options
    boolean: {
      yes: 'Yes',
      no: 'No',
    },

    // Locations
    locations: {
      dubai: 'Dubai',
      abuDhabi: 'Abu Dhabi',
      sharjah: 'Sharjah',
      ajman: 'Ajman',
      rasAlKhaimah: 'Ras Al Khaimah',
      fujairah: 'Fujairah',
      ummAlQuwain: 'Umm Al Quwain',
    },

    // Placeholders
    placeholders: {
      selectPrice: 'Select Price',
      select: 'Select',
      selectStartDate: 'Select start date',
      selectEndDate: 'Select end date',
      tomorrowOrNextWeek: 'Tomorrow or next week',
    },

    // Search
    search: 'Search',

    // Page header template
    forSaleIn: '{{category}} for sale in Dubai ({{count}})',

    // Empty states
    noAdsFound: 'No ads found matching your criteria.',

    // Actions
    clearFilters: 'Clear Filters',
  },
  'nl-NL': {
    // Breadcrumbs
    categories: 'Categorieën',

    // Sort options
    sort: {
      default: 'Standaard',
      newest: 'Nieuwste',
      oldest: 'Oudste',
      priceLowToHigh: 'Prijs (Laag naar Hoog)',
      priceHighToLow: 'Prijs (Hoog naar Laag)',
    },

    // Filter labels
    filters: {
      price: 'Prijs',
      deal: 'Aanbieding',
      currentDate: 'Huidige Datum',
      fromDate: 'Van Datum',
      toDate: 'Tot Datum',
      featured: 'Uitgelicht',
      neighbourhood: 'Buurt',
      hasVideo: 'Heeft Video',
    },

    // Price ranges
    priceRanges: {
      under50k: 'Onder 50.000',
      between50k100k: '50.000 - 100.000',
      between100k200k: '100.000 - 200.000',
      between200k500k: '200.000 - 500.000',
      over500k: 'Boven 500.000',
    },

    // Boolean options
    boolean: {
      yes: 'Ja',
      no: 'Nee',
    },

    // Locations
    locations: {
      dubai: 'Dubai',
      abuDhabi: 'Abu Dhabi',
      sharjah: 'Sharjah',
      ajman: 'Ajman',
      rasAlKhaimah: 'Ras Al Khaimah',
      fujairah: 'Fujairah',
      ummAlQuwain: 'Umm Al Quwain',
    },

    // Placeholders
    placeholders: {
      selectPrice: 'Selecteer Prijs',
      select: 'Selecteer',
      selectStartDate: 'Selecteer startdatum',
      selectEndDate: 'Selecteer einddatum',
      tomorrowOrNextWeek: 'Morgen of volgende week',
    },

    // Search
    search: 'Zoeken',

    // Page header template
    forSaleIn: '{{category}} te koop in Dubai ({{count}})',

    // Empty states
    noAdsFound: 'Geen advertenties gevonden die aan uw criteria voldoen.',

    // Actions
    clearFilters: 'Filters wissen',
  },
  'nl': {
    // Breadcrumbs
    categories: 'Categorieën',

    // Sort options
    sort: {
      default: 'Standaard',
      newest: 'Nieuwste',
      oldest: 'Oudste',
      priceLowToHigh: 'Prijs (Laag naar Hoog)',
      priceHighToLow: 'Prijs (Hoog naar Laag)',
    },

    // Filter labels
    filters: {
      price: 'Prijs',
      deal: 'Aanbieding',
      currentDate: 'Huidige Datum',
      fromDate: 'Van Datum',
      toDate: 'Tot Datum',
      featured: 'Uitgelicht',
      neighbourhood: 'Buurt',
      hasVideo: 'Heeft Video',
    },

    // Price ranges
    priceRanges: {
      under50k: 'Onder 50.000',
      between50k100k: '50.000 - 100.000',
      between100k200k: '100.000 - 200.000',
      between200k500k: '200.000 - 500.000',
      over500k: 'Boven 500.000',
    },

    // Boolean options
    boolean: {
      yes: 'Ja',
      no: 'Nee',
    },

    // Locations
    locations: {
      dubai: 'Dubai',
      abuDhabi: 'Abu Dhabi',
      sharjah: 'Sharjah',
      ajman: 'Ajman',
      rasAlKhaimah: 'Ras Al Khaimah',
      fujairah: 'Fujairah',
      ummAlQuwain: 'Umm Al Quwain',
    },

    // Placeholders
    placeholders: {
      selectPrice: 'Selecteer Prijs',
      select: 'Selecteer',
      selectStartDate: 'Selecteer startdatum',
      selectEndDate: 'Selecteer einddatum',
      tomorrowOrNextWeek: 'Morgen of volgende week',
    },

    // Search
    search: 'Zoeken',

    // Page header template
    forSaleIn: '{{category}} te koop in Dubai ({{count}})',

    // Empty states
    noAdsFound: 'Geen advertenties gevonden die aan uw criteria voldoen.',

    // Actions
    clearFilters: 'Filters wissen',
  },
  'ar': {
    // Breadcrumbs
    categories: 'الفئات',

    // Sort options
    sort: {
      default: 'افتراضي',
      newest: 'الأحدث',
      oldest: 'الأقدم',
      priceLowToHigh: 'السعر (من الأقل للأعلى)',
      priceHighToLow: 'السعر (من الأعلى للأقل)',
    },

    // Filter labels
    filters: {
      price: 'السعر',
      deal: 'العرض',
      currentDate: 'التاريخ الحالي',
      fromDate: 'من تاريخ',
      toDate: 'إلى تاريخ',
      featured: 'مميز',
      neighbourhood: 'الحي',
      hasVideo: 'يحتوي على فيديو',
    },

    // Price ranges
    priceRanges: {
      under50k: 'أقل من 50,000',
      between50k100k: '50,000 - 100,000',
      between100k200k: '100,000 - 200,000',
      between200k500k: '200,000 - 500,000',
      over500k: 'أكثر من 500,000',
    },

    // Boolean options
    boolean: {
      yes: 'نعم',
      no: 'لا',
    },

    // Locations
    locations: {
      dubai: 'دبي',
      abuDhabi: 'أبوظبي',
      sharjah: 'الشارقة',
      ajman: 'عجمان',
      rasAlKhaimah: 'رأس الخيمة',
      fujairah: 'الفجيرة',
      ummAlQuwain: 'أم القيوين',
    },

    // Placeholders
    placeholders: {
      selectPrice: 'اختر السعر',
      select: 'اختر',
      selectStartDate: 'اختر تاريخ البداية',
      selectEndDate: 'اختر تاريخ النهاية',
      tomorrowOrNextWeek: 'غداً أو الأسبوع القادم',
    },

    // Search
    search: 'بحث',

    // Page header template
    forSaleIn: '{{category}} للبيع في دبي ({{count}})',

    // Empty states
    noAdsFound: 'لم يتم العثور على إعلانات تطابق معاييرك.',

    // Actions
    clearFilters: 'مسح المرشحات',
  },
});
