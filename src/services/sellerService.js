import api from './api'

const sellerService = {
  /**
   * Get a public seller profile by ID.
   * @param {string|number} sellerId
   */
  getSellerProfile: (sellerId) => api.get(`/api/sellers/${sellerId}`),

  /** Get current seller's own profile / store settings */
  getMyProfile: () => api.get('/api/seller/profile'),

  /**
   * Update the seller's store profile.
   * @param {object} data  { storeName, description, contactPhone, location, ... }
   */
  updateProfile: (data) => api.put('/api/seller/profile', data),

  /**
   * Upload a new store banner image.
   * @param {File} file
   */
  uploadBanner: (file) => {
    const form = new FormData()
    form.append('banner', file)
    return api.post('/api/seller/profile/banner', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  /**
   * Submit or update KYC documents.
   * @param {FormData} formData  Contains id_front, id_back, selfie, etc.
   */
  submitKYC: (formData) =>
    api.post('/api/seller/kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** Get current KYC submission status */
  getKYCStatus: () => api.get('/api/seller/kyc'),

  /**
   * Get seller analytics dashboard data.
   * @param {{ period }} params  period: '7d' | '30d' | '90d' | '1y'
   */
  getAnalytics: (params = {}) =>
    api.get('/api/seller/analytics', { params }),

  /** Get seller-level info and requirements for next level */
  getSellerLevel: () => api.get('/api/seller/level'),

  /** Get public product list for a seller (for buyer-facing profile) */
  getSellerPublicProducts: (sellerId, params = {}) =>
    api.get(`/api/sellers/${sellerId}/products`, { params }),

  /**
   * Feature (boost) a product via ad credit.
   * @param {string|number} productId
   * @param {{ days }} data
   */
  boostProduct: (productId, data) =>
    api.post(`/api/seller/products/${productId}/boost`, data),
}

export default sellerService
