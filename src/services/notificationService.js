import api from './api'

const notificationService = {
  /**
   * Get paginated notifications for current user.
   * @param {{ page, size, read }} params
   */
  getNotifications: (params = {}) =>
    api.get('/api/notifications', { params }),

  /** Get unread notification count */
  getUnreadCount: () => api.get('/api/notifications/unread-count'),

  /** Mark a single notification as read */
  markAsRead: (notificationId) =>
    api.put(`/api/notifications/${notificationId}/read`),

  /** Mark all notifications as read */
  markAllAsRead: () => api.put('/api/notifications/read-all'),

  /** Delete a notification */
  deleteNotification: (notificationId) =>
    api.delete(`/api/notifications/${notificationId}`),

  /**
   * Update push / email notification preferences.
   * @param {{ emailEnabled, pushEnabled, orderUpdates, chatMessages, promotions }} data
   */
  updatePreferences: (data) =>
    api.put('/api/notifications/preferences', data),

  /** Get current notification preferences */
  getPreferences: () => api.get('/api/notifications/preferences'),
}

export default notificationService
