import api from './api'

const wishlistService = {
  /** Get all wishlist items for current buyer */
  getWishlist: (params = {}) => api.get('/api/wishlist', { params }),

  /**
   * Add a product to the wishlist.
   * @param {string|number} productId
   */
  addToWishlist: (productId) => api.post(`/api/wishlist/${productId}`),

  /**
   * Remove a product from the wishlist.
   * @param {string|number} productId
   */
  removeFromWishlist: (productId) => api.delete(`/api/wishlist/${productId}`),

  /**
   * Check if a product is in the wishlist.
   * @param {string|number} productId
   */
  isInWishlist: (productId) => api.get(`/api/wishlist/${productId}/check`),

  /** Clear the entire wishlist */
  clearWishlist: () => api.delete('/api/wishlist'),
}

export default wishlistService
