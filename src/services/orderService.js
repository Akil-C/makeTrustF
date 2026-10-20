import api from './api'

const orderService = {
  /**
   * Place a new order into MC Escrow.
   * @param {{ productId: number, quantity: number, deliveryAddress: string, notes?: string, idempotencyKey: string }} data
   */
  createOrder: (data) => api.post('/api/orders', data),

  /** Get a single order by ID */
  getOrderById: (id) => api.get(`/api/orders/${id}`),

  /**
   * Buyer: get own orders.
   * @param {{ page, size, status }} params
   */
  getBuyerOrders: (params = {}) =>
    api.get('/api/orders/my/buyer', { params }).catch((err) => {
      // Fallback endpoint if older route was used
      if (err.response?.status === 404) {
        return api.get('/api/orders/buyer', { params })
      }
      throw err
    }),

  /**
   * Seller: get orders for their products.
   * @param {{ page, size, status }} params
   */
  getSellerOrders: (params = {}) =>
    api.get('/api/orders/my/seller', { params }).catch((err) => {
      if (err.response?.status === 404) {
        return api.get('/api/orders/seller', { params })
      }
      throw err
    }),

  /**
   * Admin: all orders across marketplace.
   * @param {{ page, size, status, buyerId, sellerId }} params
   */
  getAllOrders: (params = {}) => api.get('/api/admin/orders', { params }),

  /** Seller / Admin updates order status (e.g. PROCESSING, SHIPPED, DELIVERED) */
  updateOrderStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),

  /** Seller confirms the order */
  confirmOrder: (id) =>
    api.put(`/api/orders/${id}/status`, { newStatus: 'CONFIRMED', notes: 'Seller confirmed order' }),

  /** Seller marks order as shipped */
  markShipped: (id, trackingNumber = '') =>
    api.put(`/api/orders/${id}/status`, {
      newStatus: 'SHIPPED',
      trackingNumber,
      notes: trackingNumber ? `Dispatched via tracking #${trackingNumber}` : 'Dispatched with local courier',
    }),

  /** Buyer confirms delivery to release escrow credits */
  confirmDelivery: (id) =>
    api.put(`/api/orders/${id}/status`, { newStatus: 'BUYER_CONFIRMED', notes: 'Buyer verified and confirmed delivery' }),

  /** Cancel an order */
  cancelOrder: (id, reason = 'Buyer requested cancellation') =>
    api.put(`/api/orders/${id}/cancel`, null, { params: { reason } }),

  /** Raise a dispute on an order */
  raiseDispute: (id, data) => api.post(`/api/orders/${id}/dispute`, data),

  /** Admin: override order status */
  adminUpdateStatus: (id, data) => api.put(`/api/admin/orders/${id}/status`, data),

  /** Get order status timeline */
  getOrderTimeline: (id) => api.get(`/api/orders/${id}/timeline`),
}

export default orderService
