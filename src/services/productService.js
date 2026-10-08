import api from './api'

const productService = {
  /**
   * Paginated product list with optional filters.
   * @param {{ page, size, category, condition, minPrice, maxPrice, sortBy }} params
   */
  getProducts: (params = {}) => api.get('/api/products', { params }),

  /** Get single product by ID */
  getProductById: (id) => api.get(`/api/products/${id}`),

  /**
   * Full-text search with filters.
   * @param {{ q, page, size, category, condition, minPrice, maxPrice, lat, lng, radius }} params
   */
  searchProducts: (params = {}) => api.get('/api/products/search', { params }),

  /**
   * Products within a radius (km) of the given coordinates.
   * @param {number} lat
   * @param {number} lng
   * @param {number} radius  km
   * @param {object} extraParams
   */
  getNearbyProducts: (lat, lng, radius = 10, extraParams = {}) =>
    api.get('/api/products/nearby', { params: { lat, lng, radius, ...extraParams } }),

  /** Latest published products */
  getRecentProducts: (limit = 12) =>
    api.get('/api/products/recent', { params: { limit } }),

  /** Trending / most-viewed products */
  getTrendingProducts: (limit = 12) =>
    api.get('/api/products/trending', { params: { limit } }),

  /** Products similar to the given product */
  getSimilarProducts: (id, limit = 6) =>
    api.get(`/api/products/${id}/similar`, { params: { limit } }),

  // ── Seller mutations ────────────────────────────────────────────────────

  /**
   * Create a new product.
   * @param {object} data Product payload
   */
  createProduct: (data) => api.post('/api/products', data),

  /**
   * Update an existing product.
   * @param {string|number} id
   * @param {object} data
   */
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),

  /**
   * Upload product images (multipart).
   * @param {string|number} id
   * @param {File[]} files
   * @param {(progress: number) => void} onProgress
   */
  uploadImages: (id, files, onProgress) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return api.post(`/api/products/${id}/images`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
  },

  /** Publish a draft product */
  publishProduct: (id) => api.put(`/api/products/${id}/publish`),

  /** Soft-delete a product */
  deleteProduct: (id) => api.delete(`/api/products/${id}`),

  /** Pause (delist) a product */
  pauseProduct: (id) => api.put(`/api/products/${id}/pause`),

  /** Reactivate a paused product */
  reactivateProduct: (id) => api.put(`/api/products/${id}/reactivate`),

  /** Mark a product as sold */
  markAsSold: (id) => api.put(`/api/products/${id}/sold`),

  /**
   * Seller's own product list with optional filters.
   * @param {{ page, size, status }} params
   */
  getSellerProducts: (params = {}) =>
    api.get('/api/products/my', { params }),

  /** Delete a product image by image ID */
  deleteImage: (productId, imageId) =>
    api.delete(`/api/products/${productId}/images/${imageId}`),

  /** Set the primary image for a product */
  setPrimaryImage: (productId, imageId) =>
    api.put(`/api/products/${productId}/images/${imageId}/primary`),
}

export default productService
