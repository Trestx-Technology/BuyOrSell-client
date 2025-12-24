/**
 * Auth translations type definitions
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
