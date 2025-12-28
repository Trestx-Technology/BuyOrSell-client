/**
 * Organization translations type definitions
 */
export type OrganizationTranslations = {
  // List Page
  list: {
    pageTitle: string;
    myOrganizations: string;
    manageOrganizations: string;
    createNew: string;
    createNewOrganization: string;
    noOrganizationsFound: string;
    createFirstOrganization: string;
    createOrganization: string;
    verified: string;
    organization: string;
  };

  // Status Badges
  status: {
    draft: string;
    active: string;
    inactive: string;
    suspended: string;
  };

  // Form Page (Create/Edit)
  form: {
    backToOrganizations: string;
    createNewOrganization: string;
    editOrganization: string;
    fillDetailsToCreate: string;
    updateDetails: string;
    basicInformation: string;
    licenseInformation: string;
    addressInformation: string;
    contactInformation: string;
    additionalInformation: string;
    organizationType: string;
    selectOrganizationType: string;
    country: string;
    emirate: string;
    selectEmirate: string;
    loadingEmirates: string;
    legalName: string;
    enterLegalName: string;
    tradeName: string;
    enterTradeName: string;
    tradeLicenseNumber: string;
    enterTradeLicenseNumber: string;
    tradeLicenseExpiry: string;
    selectExpiryDate: string;
    trn: string;
    enterTRN: string;
    reraNumber: string;
    enterRERANumber: string;
    optional: string;
    addressLine1: string;
    enterAddressLine1: string;
    addressLine2: string;
    enterAddressLine2: string;
    city: string;
    enterCity: string;
    poBox: string;
    enterPOBox: string;
    contactName: string;
    enterContactName: string;
    contactEmail: string;
    enterContactEmail: string;
    contactPhone: string;
    enterContactPhone: string;
    website: string;
    enterWebsiteURL: string;
    organizationLogo: string;
    uploadLogo: string;
    businessHours: string;
    certificates: string;
    languages: string;
    addLanguages: string;
    brands: string;
    addBrands: string;
    dealershipCodes: string;
    addDealershipCodes: string;
    creating: string;
    createOrganization: string;
    updating: string;
    updateOrganization: string;
    cancel: string;
    myOrganizations: string;
    viewAll: string;
    noOrganizationsYet: string;
    viewAllCount: string;
  };

  // Error Messages
  errors: {
    organizationNotFound: string;
    organizationNotFoundDescription: string;
    noPermissionToView: string;
    pleaseLoginToCreate: string;
    pleaseLoginToUpdate: string;
    organizationIdMissing: string;
    failedToCreate: string;
    failedToUpdate: string;
    organizationCreatedSuccess: string;
    organizationUpdatedSuccess: string;
  };

  // Dialog Messages
  dialog: {
    organizationRequired: string;
    organizationRequiredDescription: string;
  };
};

