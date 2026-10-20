import api from './api'

const adminService = {
  // ── Dashboard ───────────────────────────────────────────────────────────
  getDashboardStats: () => api.get('/api/admin/dashboard'),

  // ── Users ───────────────────────────────────────────────────────────────
  getUsers: (params = {}) => api.get('/api/admin/users', { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  suspendUser: (id, reason = 'Policy violation') =>
    api.put(`/api/admin/users/${id}/suspend`, null, { params: { reason } }),
  unsuspendUser: (id) => api.put(`/api/admin/users/${id}/unsuspend`),
  banUser: (id, reason = 'Severe violation') =>
    api.put(`/api/admin/users/${id}/ban`, null, { params: { reason } }),
  unbanUser: (id) => api.put(`/api/admin/users/${id}/unban`),

  // ── Sellers ─────────────────────────────────────────────────────────────
  getSellers: (params = {}) => api.get('/api/admin/sellers', { params }),
  getSellerById: (id) => api.get(`/api/sellers/${id}/public`),
  updateSellerLevel: (id, level) =>
    api.put(`/api/admin/sellers/${id}/level`, { level }),

  // ── KYC ─────────────────────────────────────────────────────────────────
  getPendingKYC: (params = {}) => api.get('/api/admin/kyc', { params }),
  approveKYC: (sellerId, notes = 'Verified identity') =>
    api.put(`/api/admin/kyc/${sellerId}/approve`, null, { params: { notes } }),
  rejectKYC: (sellerId, reason = 'Documents invalid or unclear') =>
    api.put(`/api/admin/kyc/${sellerId}/reject`, null, { params: { reason } }),

  // ── Products ─────────────────────────────────────────────────────────────
  getProducts: (params = {}) => api.get('/api/admin/products', { params }),
  getAllProducts: (params = {}) => api.get('/api/admin/products', { params }),
  removeProduct: (id, reason = 'Policy violation') =>
    api.delete(`/api/admin/products/${id}`, { params: { reason } }),

  // ── Orders ───────────────────────────────────────────────────────────────
  getAllOrders: (params = {}) => api.get('/api/admin/orders', { params }),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/api/admin/orders/${id}/status`, data),

  // ── Reports ───────────────────────────────────────────────────────────────
  getReports: (params = {}) => api.get('/api/admin/reports', { params }),
  resolveReport: (id, data) => api.put(`/api/admin/reports/${id}/resolve`, data),
  rejectReport: (id, notes = '') => api.put(`/api/admin/reports/${id}/reject`, null, { params: { notes } }),
  dismissReport: (id, notes = '') => api.put(`/api/admin/reports/${id}/reject`, null, { params: { notes } }),

  // ── Disputes ─────────────────────────────────────────────────────────────
  getDisputes: (params = {}) =>
    api.get('/api/admin/orders', { params: { status: 'DISPUTED', ...params } }),
  resolveDispute: (id, data) => api.put(`/api/admin/orders/${id}/status`, data),

  // ── Ads / Promotions ──────────────────────────────────────────────────────
  getAds: (params = {}) => api.get('/api/admin/ads', { params }),
  createAd: (data) => api.post('/api/admin/ads', data),
  approveAd: (id) => api.put(`/api/admin/ads/${id}/activate`),
  pauseAd: (id) => api.put(`/api/admin/ads/${id}/pause`),
  deleteAd: (id) => api.delete(`/api/admin/ads/${id}`),

  // ── Credits & Ledger ───────────────────────────────────────────────────────
  grantCredits: (targetUserIdOrData, amount, reason) => {
    if (typeof targetUserIdOrData === 'object' && targetUserIdOrData !== null) {
      const payload = {
        targetUserId: targetUserIdOrData.targetUserId || targetUserIdOrData.userId,
        amount: Number(targetUserIdOrData.amount),
        reason: targetUserIdOrData.reason || 'Admin Credit Grant',
      }
      return api.post('/api/admin/wallet/grant', payload)
    }
    return api.post('/api/admin/wallet/grant', {
      targetUserId: targetUserIdOrData,
      amount: Number(amount),
      reason: reason || 'Admin Credit Grant',
    })
  },
  adjustCredits: (data) => api.post('/api/admin/wallet/adjust', data),
  freezeWallet: (userId, reason = 'Administrative hold') =>
    api.post(`/api/admin/wallet/${userId}/freeze`, null, { params: { reason } }),
  unfreezeWallet: (userId) => api.post(`/api/admin/wallet/${userId}/unfreeze`),
  getPlatformWalletStats: () => api.get('/api/admin/wallet/stats'),
  getUserWallet: (userId) => api.get(`/api/admin/wallet/${userId}`),
}

export default adminService
