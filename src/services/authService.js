import api from './api'

const authService = {
  /**
   * Register a new user account.
   * @param {{ name, email, password, role, captchaToken }} data
   */
  register: (data) => api.post('/api/auth/register', data),

  /**
   * Login with credentials.
   * @param {{ email, password, captchaToken }} data
   * Returns { accessToken, refreshToken, user }
   */
  login: (data) => api.post('/api/auth/login', data),

  /**
   * Invalidate the refresh token on the server.
   * @param {string} refreshToken
   */
  logout: (refreshToken) => api.post('/api/auth/logout', { refreshToken }),

  /**
   * Exchange a refresh token for a new access token pair.
   * @param {string} refreshToken
   */
  refreshToken: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),

  /**
   * Send password-reset email.
   * @param {string} email
   */
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),

  /**
   * Reset password using the emailed token.
   * @param {string} token
   * @param {string} password
   */
  resetPassword: (token, password) =>
    api.post('/api/auth/reset-password', { token, password }),

  /**
   * Get the currently authenticated user's profile.
   */
  getCurrentUser: () => api.get('/api/auth/me'),

  /**
   * Update the current user's profile.
   * @param {object} data
   */
  updateProfile: (data) => api.put('/api/auth/me', data),

  /**
   * Change password (authenticated).
   * @param {{ currentPassword, newPassword }} data
   */
  changePassword: (data) => api.put('/api/auth/me/password', data),
}

export default authService
