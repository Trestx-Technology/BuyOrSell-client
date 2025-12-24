import { createTranslationNamespace } from '../../validations/utils';
import type { AdTranslations } from './types';

export const adTranslations = createTranslationNamespace<AdTranslations>({
  'en-US': {
    header: {
      back: 'Back',
      share: 'Share',
      save: 'Save',
    },
    tabs: {
      description: 'Description',
      specifications: 'Specifications',
      location: 'Location',
      reviews: 'Reviews',
      similarCars: 'Similar Cars',
    },
    errors: {
      failedToLoad: 'Failed to load ad',
      unableToFetch: 'Unable to fetch ad details. Please try again later.',
      adNotFound: 'Ad not found',
      adNotFoundDescription: 'The ad you\'re looking for doesn\'t exist or has been removed.',
    },
    sellerInfo: {
      title: 'Seller Information',
      location: 'Location',
      memberSince: 'Member Since',
      rating: 'Rating',
      verifiedDealer: 'Verified Dealer',
      privateSeller: 'Private Seller',
      locationNotSpecified: 'Location not specified',
      notAvailable: 'N/A',
    },
    similarAds: {
      title: 'Similar Ads',
    },
  },
  'nl-NL': {
    header: {
      back: 'Terug',
      share: 'Delen',
      save: 'Opslaan',
    },
    tabs: {
      description: 'Beschrijving',
      specifications: 'Specificaties',
      location: 'Locatie',
      reviews: 'Beoordelingen',
      similarCars: 'Vergelijkbare auto\'s',
    },
    errors: {
      failedToLoad: 'Kan advertentie niet laden',
      unableToFetch: 'Kan advertentiegegevens niet ophalen. Probeer het later opnieuw.',
      adNotFound: 'Advertentie niet gevonden',
      adNotFoundDescription: 'De advertentie die je zoekt bestaat niet of is verwijderd.',
    },
    sellerInfo: {
      title: 'Verkoper informatie',
      location: 'Locatie',
      memberSince: 'Lid sinds',
      rating: 'Beoordeling',
      verifiedDealer: 'Geverifieerde dealer',
      privateSeller: 'Particuliere verkoper',
      locationNotSpecified: 'Locatie niet opgegeven',
      notAvailable: 'N.v.t.',
    },
    similarAds: {
      title: 'Vergelijkbare advertenties',
    },
  },
  'nl': {
    header: {
      back: 'Terug',
      share: 'Delen',
      save: 'Opslaan',
    },
    tabs: {
      description: 'Beschrijving',
      specifications: 'Specificaties',
      location: 'Locatie',
      reviews: 'Beoordelingen',
      similarCars: 'Vergelijkbare auto\'s',
    },
    errors: {
      failedToLoad: 'Kan advertentie niet laden',
      unableToFetch: 'Kan advertentiegegevens niet ophalen. Probeer het later opnieuw.',
      adNotFound: 'Advertentie niet gevonden',
      adNotFoundDescription: 'De advertentie die je zoekt bestaat niet of is verwijderd.',
    },
    sellerInfo: {
      title: 'Verkoper informatie',
      location: 'Locatie',
      memberSince: 'Lid sinds',
      rating: 'Beoordeling',
      verifiedDealer: 'Geverifieerde dealer',
      privateSeller: 'Particuliere verkoper',
      locationNotSpecified: 'Locatie niet opgegeven',
      notAvailable: 'N.v.t.',
    },
    similarAds: {
      title: 'Vergelijkbare advertenties',
    },
  },
  'ar': {
    header: {
      back: 'العودة',
      share: 'مشاركة',
      save: 'حفظ',
    },
    tabs: {
      description: 'الوصف',
      specifications: 'المواصفات',
      location: 'الموقع',
      reviews: 'التقييمات',
      similarCars: 'سيارات مشابهة',
    },
    errors: {
      failedToLoad: 'فشل في تحميل الإعلان',
      unableToFetch: 'تعذر جلب تفاصيل الإعلان. يرجى المحاولة مرة أخرى لاحقاً.',
      adNotFound: 'الإعلان غير موجود',
      adNotFoundDescription: 'الإعلان الذي تبحث عنه غير موجود أو تم حذفه.',
    },
    sellerInfo: {
      title: 'معلومات البائع',
      location: 'الموقع',
      memberSince: 'عضو منذ',
      rating: 'التقييم',
      verifiedDealer: 'تاجر معتمد',
      privateSeller: 'بائع خاص',
      locationNotSpecified: 'الموقع غير محدد',
      notAvailable: 'غير متوفر',
    },
    similarAds: {
      title: 'إعلانات مشابهة',
    },
  },
});
