import api from './api'

const reviewService = {
  /**
   * Get reviews for a seller.
   * @param {string|number} sellerId
   * @param {{ page, size }} params
   */
  getSellerReviews: (sellerId, params = {}) =>
    api.get(`/api/reviews/seller/${sellerId}`, { params }),

  /**
   * Get reviews for a product.
   * @param {string|number} productId
   * @param {{ page, size }} params
   */
  getProductReviews: (productId, params = {}) =>
    api.get(`/api/reviews/product/${productId}`, { params }),

  /**
   * Submit a verified review for a completed order.
   * @param {{ orderId: number, rating: number, title: string, comment: string, productConditionRating?: number, sellerCommunicationRating?: number, accuracyRating?: number }} data
   */
  createReview: (data) => api.post('/api/reviews', data),

  /** Check if current buyer is eligible to review an order */
  canReview: (orderId) => api.get(`/api/reviews/can-review/${orderId}`),

  /** Get all reviews written by current buyer */
  getMyReviews: (params = {}) => api.get('/api/reviews/my', { params }),

  /** Seller reply to a review */
  replyToReview: (reviewId, reply) =>
    api.put(`/api/reviews/${reviewId}/reply`, { reply }),

  /** Admin hide review */
  hideReview: (reviewId, reason = 'Policy violation') =>
    api.put(`/api/admin/reviews/${reviewId}/hide`, null, { params: { reason } }),
}

export default reviewService
