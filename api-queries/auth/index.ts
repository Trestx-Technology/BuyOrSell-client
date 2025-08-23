export const authQueries = {
  login: {
    endpoint: "/auth/login",
    key: "login",
  },
  signUp: {
    endpoint: "/signup",
    key: "signup",
  },
  logout: {
    endpoint: "/auth/logout",
    key: "logout",
  },
  forgotPassword: {
    endpoint: "/auth/forgot-password",
    key: "forgot-password",
  },
  resetPassword: {
    endpoint: "/auth/reset-password",
    key: "reset-password",
  },
  socialLogin: {
    endpoint: "/auth/social-login",
    key: "social-login",
  },
  verifyEmailOtp: {
    endpoint: "/auth/verify-email-otp",
    key: "verify-email-otp",
  },
  verifyPhoneOtp: {
    endpoint: "/auth/verify-phone-otp",
    key: "verify-phone-otp",
  },
  refreshToken: {
    endpoint: "/auth/refresh-token",
    key: "refresh-token",
  },
  requestResetPassword: {
    Key: "reset-password",
    endpoint: `/auth/request-password-reset`,
  },
  verifyResetToken: {
    Key: "verify-reset-token",
    endpoint: `/auth/reset-password`,
  },
};
