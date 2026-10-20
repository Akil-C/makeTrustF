import api from './api'

const sellerService = {
  /**
   * Get public seller profile by ID.
   * @param {string|number} sellerId
   */
  getSellerProfile: (sellerId) => api.get(`/api/sellers/${sellerId}/public`),

  /** Get current seller's own profile */
  getMyProfile: () => api.get('/api/sellers/me'),

  /**
   * Update seller profile
   * @param {object} data
   */
  updateProfile: (data) => api.put('/api/sellers/me', data),

  /**
   * Submit KYC documents.
   * Spring expects `@RequestPart("data") SubmitKycRequest`, `@RequestPart("idDocument")`, `@RequestPart("selfie")`
   * @param {FormData} formData
   */
  submitKYC: (formData) =>
    api.post('/api/sellers/me/kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** Get current KYC submission status */
  getKYCStatus: () => api.get('/api/sellers/me/kyc'),

  /**
   * Get top trusted sellers list
   * @param {{ page, size }} params
   */
  getTrustedSellers: (params = {}) => api.get('/api/sellers/trusted', { params }),

  /** Get seller-level info and requirements */
  getSellerLevelInfo: () => api.get('/api/sellers/me/level'),
}

export default sellerService
