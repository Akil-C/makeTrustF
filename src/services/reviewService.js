import api from './api'

const reviewService = {
  /**
   * Get reviews for a seller.
   * @param {string|number} sellerId
   * @param {{ page, size, rating }} params
   */
  getSellerReviews: (sellerId, params = {}) =>
    api.get(`/api/sellers/${sellerId}/reviews`, { params }),

  /**
   * Get reviews for a product.
   * @param {string|number} productId
   * @param {{ page, size }} params
   */
  getProductReviews: (productId, params = {}) =>
    api.get(`/api/products/${productId}/reviews`, { params }),

  /**
   * Submit a review for a completed order.
   * @param {string|number} orderId
   * @param {{ rating, comment, images }} data
   */
  createReview: (orderId, data) =>
    api.post(`/api/orders/${orderId}/review`, data),

  /**
   * Update an existing review.
   * @param {string|number} reviewId
   * @param {{ rating, comment }} data
   */
  updateReview: (reviewId, data) =>
    api.put(`/api/reviews/${reviewId}`, data),

  /** Delete a review (admin or author) */
  deleteReview: (reviewId) => api.delete(`/api/reviews/${reviewId}`),

  /** Flag a review as inappropriate */
  flagReview: (reviewId, reason) =>
    api.post(`/api/reviews/${reviewId}/flag`, { reason }),

  /** Get the review a buyer left for a specific order */
  getOrderReview: (orderId) => api.get(`/api/orders/${orderId}/review`),
}

export default reviewService
