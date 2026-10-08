import api from './api'

const aiService = {
  /**
   * Get AI-generated pricing suggestion for a product.
   * @param {{ title, description, category, condition, location }} data
   */
  getPricingSuggestion: (data) =>
    api.post('/api/seller/ai/pricing', data),

  /**
   * Get AI-generated description for a product.
   * @param {{ title, category, condition, keyPoints }} data
   */
  generateDescription: (data) =>
    api.post('/api/seller/ai/description', data),

  /**
   * Get AI-powered insights for the seller's store.
   * @param {{ period }} params
   */
  getStoreInsights: (params = {}) =>
    api.get('/api/seller/ai/insights', { params }),

  /**
   * Get demand forecast for a category/location.
   * @param {{ category, lat, lng }} data
   */
  getDemandForecast: (data) =>
    api.post('/api/seller/ai/demand-forecast', data),

  /**
   * Get tag suggestions for a product.
   * @param {{ title, description, category }} data
   */
  suggestTags: (data) =>
    api.post('/api/seller/ai/tags', data),

  /**
   * Fraud/quality check for a product listing (admin).
   * @param {string|number} productId
   */
  analyzeProduct: (productId) =>
    api.post(`/api/admin/ai/analyze/${productId}`),
}

export default aiService
