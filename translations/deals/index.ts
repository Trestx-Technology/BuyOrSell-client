import { createTranslationNamespace } from "@/validations/utils";
import type { DealsTranslations } from "./types";

export const dealsTranslations = createTranslationNamespace<DealsTranslations>({
  "en-US": {
    title: "Hot Deals",
    subtitle: "Limited time offers you don't want to miss",
    searchPlaceholder: "Search for deals",
    browseCategories: "Browse Categories",
    limitedTimeOffers: "Limited time offers you don't want to miss",
    sortOptions: {
      default: "Default",
      newest: "Newest",
      oldest: "Oldest",
      priceAsc: "Price (Low to High)",
      priceDesc: "Price (High to Low)",
    },
  },
  "nl-NL": {
    title: "Hot Deals",
    subtitle: "Beperkte aanbiedingen die u niet wilt missen",
    searchPlaceholder: "Zoek naar deals",
    browseCategories: "Blader door categorieën",
    limitedTimeOffers: "Beperkte aanbiedingen die u niet wilt missen",
    sortOptions: {
      default: "Standaard",
      newest: "Nieuwste",
      oldest: "Oudste",
      priceAsc: "Prijs (Laag naar Hoog)",
      priceDesc: "Prijs (Hoog naar Laag)",
    },
  },
  nl: {
    title: "Hot Deals",
    subtitle: "Beperkte aanbiedingen die u niet wilt missen",
    searchPlaceholder: "Zoek naar deals",
    browseCategories: "Blader door categorieën",
    limitedTimeOffers: "Beperkte aanbiedingen die u niet wilt missen",
    sortOptions: {
      default: "Standaard",
      newest: "Nieuwste",
      oldest: "Oudste",
      priceAsc: "Prijs (Laag naar Hoog)",
      priceDesc: "Prijs (Hoog naar Laag)",
    },
  },
  ar: {
    title: "عروض ساخنة",
    subtitle: "عروض محدودة الوقت لا تريد أن تفوتها",
    searchPlaceholder: "ابحث عن العروض",
    browseCategories: "تصفح الفئات",
    limitedTimeOffers: "عروض محدودة الوقت لا تريد أن تفوتها",
    sortOptions: {
      default: "افتراضي",
      newest: "الأحدث",
      oldest: "الأقدم",
      priceAsc: "السعر (من الأقل إلى الأعلى)",
      priceDesc: "السعر (من الأعلى إلى الأقل)",
    },
  },
});

