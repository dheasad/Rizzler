/**
 * Authentication configuration
 * Contains endpoints and metadata for authentication routes
 */
export default {
  endpoints: {
    signup: {path: '/signup', version: 'v1'},
    login: {path: '/login', version: 'v1'},
    logout: {path: '/logout', version: 'v1'},
    refreshToken: {path: '/refresh-token', version: 'v1'},
    // forgotPassword: {path: '/auth/forgot-password', version: 'v1'},
    // resetPassword: {path: '/auth/reset-password', version: 'v1'},
    // verifyEmail: {path: '/auth/verify-email', version: 'v1'}
  },

}