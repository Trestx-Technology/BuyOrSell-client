export const authQueries = {
  login: {
    Key: ['auth', 'login'],
    endpoint: '/auth/login',
  },
  signUp: {
    Key: ['auth', 'signup'],
    endpoint: '/signup',
  },
  logout: {
    Key: ['auth', 'logout'],
    endpoint: '/auth/logout',
  },
  sendResetPasswordEmail: {
    Key: ['auth', 'send-reset-password-email'],
    endpoint: '/auth/request-password-reset',
  },
  resetPassword: {
    Key: ['auth', 'reset-password'],
    endpoint: '/auth/reset-password',
  },
  socialLogin: {
    Key: ['auth', 'social-login'],
    endpoint: '/auth/social-login',
  },
  verifyEmailOtp: {
    Key: ['auth', 'verify-email-otp'],
    endpoint: '/auth/verify-email-otp',
  },
  verifyPhoneOtp: {
    Key: ['auth', 'verify-phone-otp'],
    endpoint: '/auth/verify-phone-otp',
  },
  refreshToken: {
    Key: ['auth', 'refresh-token'],
    endpoint: '/auth/refresh-token',
  },
  requestResetPassword: {
    Key: ['auth', 'request-reset-password'],
    endpoint: '/auth/request-password-reset',
  },
  verifyResetToken: {
    Key: ['auth', 'verify-reset-token'],
    endpoint: '/auth/reset-password',
  },
};

