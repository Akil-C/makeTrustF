import api from './api'

const walletService = {
  /** Get current user's wallet balance and transaction summary */
  getBalance: () => api.get('/api/wallet/balance'),

  /**
   * Paginated wallet transaction history.
   * @param {{ page, size, type }} params
   */
  getTransactions: (params = {}) => api.get('/api/wallet/transactions', { params }),

  /**
   * Transfer credits to another user.
   * @param {{ recipientId, amount, note }} data
   */
  transfer: (data) => api.post('/api/wallet/transfer', data),

  /**
   * Admin: manually top up a user's wallet.
   * @param {{ userId, amount, reason }} data
   */
  adminTopUp: (data) => api.post('/api/admin/wallet/topup', data),

  /**
   * Admin: deduct credits from a user's wallet.
   * @param {{ userId, amount, reason }} data
   */
  adminDeduct: (data) => api.post('/api/admin/wallet/deduct', data),
}

export default walletService
