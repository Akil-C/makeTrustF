import api from './api'

const adService = {
  /**
   * Get available ad packages / pricing.
   */
  getAdPackages: () => api.get('/api/ads/packages'),

  /**
   * Create a new ad / boost request.
   * @param {{ productId, packageId, startDate, endDate, targetRadius }} data
   */
  createAd: (data) => api.post('/api/seller/ads', data),

  /**
   * Get the seller's own active / past ads.
   * @param {{ page, size, status }} params
   */
  getMyAds: (params = {}) => api.get('/api/seller/ads', { params }),

  /**
   * Cancel a pending or active ad.
   * @param {string|number} adId
   */
  cancelAd: (adId) => api.post(`/api/seller/ads/${adId}/cancel`),

  /**
   * Get ad performance metrics.
   * @param {string|number} adId
   */
  getAdStats: (adId) => api.get(`/api/seller/ads/${adId}/stats`),

  // ── Admin ────────────────────────────────────────────────────────────────
  /** Admin: get all ads */
  adminGetAllAds: (params = {}) => api.get('/api/admin/ads', { params }),
  /** Admin: approve an ad */
  adminApproveAd: (adId) => api.post(`/api/admin/ads/${adId}/approve`),
  /** Admin: reject an ad with reason */
  adminRejectAd: (adId, reason) =>
    api.post(`/api/admin/ads/${adId}/reject`, { reason }),
}

export default adService
