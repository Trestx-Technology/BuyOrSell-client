import { createTranslationNamespace } from "@/validations/utils";
import type { ExchangeTranslations } from "./types";

export const exchangeTranslations = createTranslationNamespace<ExchangeTranslations>({
  "en-US": {
    title: "Exchange Ads",
    subtitle: "Find great deals for swapping items",
    searchPlaceholder: "Search for exchange ads",
    browseCategories: "Browse Categories",
    noAdsFound: "No exchange ads found matching your criteria",
    sortOptions: {
      default: "Default",
      newest: "Newest",
      oldest: "Oldest",
      priceAsc: "Price (Low to High)",
      priceDesc: "Price (High to Low)",
    },
  },
  "nl-NL": {
    title: "Ruiladvertenties",
    subtitle: "Vind geweldige deals voor het ruilen van items",
    searchPlaceholder: "Zoek naar ruiladvertenties",
    browseCategories: "Blader door categorieën",
    noAdsFound: "Geen ruiladvertenties gevonden die aan uw criteria voldoen",
    sortOptions: {
      default: "Standaard",
      newest: "Nieuwste",
      oldest: "Oudste",
      priceAsc: "Prijs (Laag naar Hoog)",
      priceDesc: "Prijs (Hoog naar Laag)",
    },
  },
  nl: {
    title: "Ruiladvertenties",
    subtitle: "Vind geweldige deals voor het ruilen van items",
    searchPlaceholder: "Zoek naar ruiladvertenties",
    browseCategories: "Blader door categorieën",
    noAdsFound: "Geen ruiladvertenties gevonden die aan uw criteria voldoen",
    sortOptions: {
      default: "Standaard",
      newest: "Nieuwste",
      oldest: "Oudste",
      priceAsc: "Prijs (Laag naar Hoog)",
      priceDesc: "Prijs (Hoog naar Laag)",
    },
  },
  ar: {
    title: "إعلانات التبادل",
    subtitle: "ابحث عن صفقات رائعة لتبادل المنتجات",
    searchPlaceholder: "ابحث عن إعلانات التبادل",
    browseCategories: "تصفح الفئات",
    noAdsFound: "لم يتم العثور على إعلانات تبادل تطابق معاييرك",
    sortOptions: {
      default: "افتراضي",
      newest: "الأحدث",
      oldest: "الأقدم",
      priceAsc: "السعر (من الأقل إلى الأعلى)",
      priceDesc: "السعر (من الأعلى إلى الأقل)",
    },
  },
});
