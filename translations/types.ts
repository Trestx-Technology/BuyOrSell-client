import { type Locale } from '@/lib/i18n/config';

/**
 * Base type for all translation namespaces
 * Each namespace should be a Record<Locale, TranslationObject>
 */
export type TranslationNamespace<T> = Record<Locale, T>;

/**
 * Auth translations type
 */
export type AuthTranslations = {
  login: {
    title: string;
    email: string;
    password: string;
    forgotPassword: string;
    loginButton: string;
    orContinueWith: string;
    continueWithGoogle: string;
    continueWithApple: string;
    continueWithEmail: string;
    dontHaveAccount: string;
    signUp: string;
    back: string;
  };
  signup: {
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordStrength: string;
    createAccount: string;
    orContinueWith: string;
    continueWithGoogle: string;
    continueWithApple: string;
    alreadyHaveAccount: string;
    logIn: string;
    back: string;
  };
  methods: {
    title: string;
    subtitle: string;
    continueWithGoogle: string;
    continueWithEmail: string;
    continueWithApple: string;
    or: string;
    dontHaveAccount: string;
    signUp: string;
  };
  forgotPassword: {
    title: string;
    subtitle: string;
    email: string;
    sendResetLink: string;
    rememberPassword: string;
    logIn: string;
    back: string;
    checkEmail: string;
    emailSent: string;
    backToLogin: string;
    resendEmail: string;
  };
  resetPassword: {
    title: string;
    subtitle: string;
    newPassword: string;
    confirmPassword: string;
    passwordHint: string;
    resetPassword: string;
    rememberPassword: string;
    logIn: string;
    back: string;
    success: string;
    successMessage: string;
    goToLogin: string;
    invalidLink: string;
    invalidLinkMessage: string;
    requestNewLink: string;
    backToLogin: string;
  };
};

/**
 * Combined translations type
 * Add new translation namespaces here as you create them
 */
export type Translations = {
  auth: AuthTranslations;
  // Add more namespaces here as needed:
  // common: CommonTranslations;
  // navigation: NavigationTranslations;
  // etc.
};

