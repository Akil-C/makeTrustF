import api from './api'

const orderService = {
  /**
   * Place a new order.
   * @param {{ productId, quantity, shippingAddress, paymentMethod }} data
   */
  createOrder: (data) => api.post('/api/orders', data),

  /** Get a single order by ID */
  getOrderById: (id) => api.get(`/api/orders/${id}`),

  /**
   * Buyer: get own orders.
   * @param {{ page, size, status }} params
   */
  getBuyerOrders: (params = {}) => api.get('/api/orders/buyer', { params }),

  /**
   * Seller: get orders for their products.
   * @param {{ page, size, status }} params
   */
  getSellerOrders: (params = {}) => api.get('/api/orders/seller', { params }),

  /**
   * Admin: all orders.
   * @param {{ page, size, status, buyerId, sellerId }} params
   */
  getAllOrders: (params = {}) => api.get('/api/admin/orders', { params }),

  /** Seller confirms the order */
  confirmOrder: (id) => api.post(`/api/orders/${id}/confirm`),

  /** Seller marks order as shipped */
  markShipped: (id, trackingInfo) =>
    api.post(`/api/orders/${id}/ship`, trackingInfo),

  /** Buyer confirms delivery */
  confirmDelivery: (id) => api.post(`/api/orders/${id}/deliver`),

  /** Cancel an order */
  cancelOrder: (id, reason) => api.post(`/api/orders/${id}/cancel`, { reason }),

  /** Raise a dispute on an order */
  raiseDispute: (id, data) => api.post(`/api/orders/${id}/dispute`, data),

  /**
   * Admin: resolve a dispute.
   * @param {string|number} id
   * @param {{ resolution, refundAmount }} data
   */
  resolveDispute: (id, data) =>
    api.post(`/api/admin/orders/${id}/resolve`, data),

  /** Get order status timeline */
  getOrderTimeline: (id) => api.get(`/api/orders/${id}/timeline`),
}

export default orderService
