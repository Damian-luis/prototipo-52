import api from '@/util/axios';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  read: boolean;
  createdAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
}

export const notificationsService = {
  // Get user notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },

  // Get notification stats
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await api.get('/notifications/stats');
    return response.data;
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Get notifications by type
  async getNotificationsByType(type: string): Promise<Notification[]> {
    const response = await api.get(`/notifications/type/${type}`);
    return response.data;
  },
};

export default notificationsService; 