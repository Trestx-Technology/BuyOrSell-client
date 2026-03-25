/**
 * Ad page translations type definitions
 */
export type AdTranslations = {
  header: {
    back: string;
    share: string;
    save: string;
  };
  tabs: {
    description: string;
    specifications: string;
    location: string;
    reviews: string;
    similarCars: string;
  };
  errors: {
    failedToLoad: string;
    unableToFetch: string;
    adNotFound: string;
    adNotFoundDescription: string;
  };
  sellerInfo: {
    title: string;
    location: string;
    memberSince: string;
    rating: string;
    verifiedDealer: string;
    privateSeller: string;
    locationNotSpecified: string;
    notAvailable: string;
  };
  similarAds: {
    title: string;
  };
  report: {
    button: string;
    title: string;
    reasonLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    submit: string;
    cancel: string;
    successMessage: string;
    errorMessage: string;
    reasons: {
      spam: string;
      inappropriate: string;
      scam: string;
      incorrectInfo: string;
      other: string;
    };
  };
};
