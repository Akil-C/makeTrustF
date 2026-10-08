import api from './api'

const adminService = {
  // ── Dashboard ───────────────────────────────────────────────────────────
  /** Summary statistics for the admin dashboard */
  getDashboardStats: () => api.get('/api/admin/stats'),

  // ── Users ───────────────────────────────────────────────────────────────
  getUsers: (params = {}) => api.get('/api/admin/users', { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  banUser: (id, reason) => api.post(`/api/admin/users/${id}/ban`, { reason }),
  unbanUser: (id) => api.post(`/api/admin/users/${id}/unban`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // ── Sellers ─────────────────────────────────────────────────────────────
  getSellers: (params = {}) => api.get('/api/admin/sellers', { params }),
  getSellerById: (id) => api.get(`/api/admin/sellers/${id}`),
  updateSellerLevel: (id, level) =>
    api.put(`/api/admin/sellers/${id}/level`, { level }),

  // ── KYC ─────────────────────────────────────────────────────────────────
  getPendingKYC: (params = {}) =>
    api.get('/api/admin/kyc', { params }),
  getKYCById: (id) => api.get(`/api/admin/kyc/${id}`),
  approveKYC: (id, notes) =>
    api.post(`/api/admin/kyc/${id}/approve`, { notes }),
  rejectKYC: (id, reason) =>
    api.post(`/api/admin/kyc/${id}/reject`, { reason }),

  // ── Products ─────────────────────────────────────────────────────────────
  getAllProducts: (params = {}) => api.get('/api/admin/products', { params }),
  approveProduct: (id) => api.post(`/api/admin/products/${id}/approve`),
  removeProduct: (id, reason) =>
    api.delete(`/api/admin/products/${id}`, { data: { reason } }),

  // ── Orders ───────────────────────────────────────────────────────────────
  getAllOrders: (params = {}) => api.get('/api/admin/orders', { params }),
  getOrderById: (id) => api.get(`/api/admin/orders/${id}`),

  // ── Reports ───────────────────────────────────────────────────────────────
  getReports: (params = {}) => api.get('/api/admin/reports', { params }),
  resolveReport: (id, action) =>
    api.post(`/api/admin/reports/${id}/resolve`, { action }),
  dismissReport: (id) => api.post(`/api/admin/reports/${id}/dismiss`),

  // ── Disputes ─────────────────────────────────────────────────────────────
  getDisputes: (params = {}) => api.get('/api/admin/disputes', { params }),
  resolveDispute: (id, data) =>
    api.post(`/api/admin/disputes/${id}/resolve`, data),

  // ── Ads / Promotions ──────────────────────────────────────────────────────
  getAds: (params = {}) => api.get('/api/admin/ads', { params }),
  approveAd: (id) => api.post(`/api/admin/ads/${id}/approve`),
  rejectAd: (id, reason) =>
    api.post(`/api/admin/ads/${id}/reject`, { reason }),

  // ── Credits ───────────────────────────────────────────────────────────────
  getCreditTransactions: (params = {}) =>
    api.get('/api/admin/credits', { params }),
  issueCredits: (data) => api.post('/api/admin/credits/issue', data),

  // ── Analytics ─────────────────────────────────────────────────────────────
  getPlatformAnalytics: (params = {}) =>
    api.get('/api/admin/analytics', { params }),

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  getAuditLogs: (params = {}) =>
    api.get('/api/admin/audit-logs', { params }),

  // ── Settings ──────────────────────────────────────────────────────────────
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (data) => api.put('/api/admin/settings', data),
}

export default adminService
