import api from './api'

const chatService = {
  /**
   * Get all conversation threads for the current user.
   * @param {{ page, size }} params
   */
  getConversations: (params = {}) =>
    api.get('/api/chat/conversations', { params }),

  /**
   * Get or create a conversation with a seller about a product.
   * @param {string|number} sellerId
   * @param {string|number} productId
   */
  getOrCreateConversation: (sellerId, productId) =>
    api.post('/api/chat/conversations', { sellerId, productId }),

  /**
   * Get messages in a conversation.
   * @param {string|number} conversationId
   * @param {{ page, size, before }} params  `before` = message ID cursor
   */
  getMessages: (conversationId, params = {}) =>
    api.get(`/api/chat/conversations/${conversationId}/messages`, { params }),

  /**
   * Send a text message (REST fallback; prefer WebSocket).
   * @param {string|number} conversationId
   * @param {{ content, type }} data  type: 'TEXT' | 'IMAGE' | 'OFFER'
   */
  sendMessage: (conversationId, data) =>
    api.post(`/api/chat/conversations/${conversationId}/messages`, data),

  /**
   * Upload a chat image attachment.
   * @param {string|number} conversationId
   * @param {File} file
   */
  uploadAttachment: (conversationId, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(
      `/api/chat/conversations/${conversationId}/attachments`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
  },

  /** Mark all messages in a conversation as read */
  markAsRead: (conversationId) =>
    api.put(`/api/chat/conversations/${conversationId}/read`),

  /** Get unread message count across all conversations */
  getUnreadCount: () => api.get('/api/chat/unread-count'),

  /** Delete / archive a conversation */
  deleteConversation: (conversationId) =>
    api.delete(`/api/chat/conversations/${conversationId}`),
}

export default chatService
