import api from '@/util/axios';
import { Notification } from '@/types';

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: 'project' | 'contract' | 'payment' | 'task' | 'consultation' | 'system';
  is_read?: boolean;
  data?: any;
}

export const notificationsService = {
  // Obtener todas las notificaciones
  async getAllNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Obtener notificación por ID
  async getNotificationById(id: string): Promise<Notification> {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  // Obtener notificaciones por usuario
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  // Crear nueva notificación
  async createNotification(notificationData: CreateNotificationData): Promise<string> {
    const response = await api.post('/notifications', notificationData);
    return response.data.id;
  },

  // Actualizar notificación
  async updateNotification(id: string, updateData: Partial<Notification>): Promise<Notification> {
    const response = await api.put(`/notifications/${id}`, updateData);
    return response.data;
  },

  // Eliminar notificación
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  // Marcar como leída
  async markAsRead(id: string): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  },

  // Marcar todas como leídas para un usuario
  async markAllAsRead(userId: string): Promise<void> {
    await api.put(`/notifications/user/${userId}/read-all`);
  },

  // Obtener estadísticas de notificaciones
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    read: number;
  }> {
    const response = await api.get(`/notifications/stats/${userId}`);
    return response.data;
  },
}; 