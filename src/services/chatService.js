import api from './api'

const chatService = {
  /**
   * Get all conversation rooms for current user.
   */
  getMyRooms: () => api.get('/api/chat/rooms'),

  /** Alias for backward compatibility */
  getConversations: () => api.get('/api/chat/rooms'),

  /**
   * Start or retrieve a room with a seller for a specific product.
   * @param {{ sellerId: number, productId: number }}
   */
  startRoom: ({ sellerId, productId }) =>
    api.post('/api/chat/rooms', { sellerId, productId }),

  /** Alias */
  getOrCreateConversation: (sellerId, productId) =>
    api.post('/api/chat/rooms', { sellerId, productId }),

  /**
   * Get messages in a specific room.
   * @param {string|number} roomId
   * @param {{ page?: number }} params
   */
  getRoomMessages: (roomId, params = {}) =>
    api.get(`/api/chat/rooms/${roomId}/messages`, { params }),

  /** Alias */
  getMessages: (roomId, params = {}) =>
    api.get(`/api/chat/rooms/${roomId}/messages`, { params }),

  /**
   * Send a text message to a room.
   * @param {string|number} roomId
   * @param {{ content: string, type?: string }} data
   */
  sendMessage: (roomId, data) =>
    api.post(`/api/chat/rooms/${roomId}/messages`, {
      content: typeof data === 'string' ? data : data.content,
      type: (typeof data === 'object' && data.type) || 'TEXT',
    }),

  /** Mark all messages in a room as read */
  markAsRead: (roomId) => api.put(`/api/chat/rooms/${roomId}/read`),

  /** Block a chat room */
  blockRoom: (roomId) => api.put(`/api/chat/rooms/${roomId}/block`),

  /** Flag a suspicious message */
  flagMessage: (messageId, reason = 'Off-platform payment attempt') =>
    api.post('/api/chat/messages/flag', { messageId, reason }),
}

export default chatService
