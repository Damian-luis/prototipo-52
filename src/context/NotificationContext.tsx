"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationsService } from '@/services/notifications.service';
import { Notification } from '@/types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  getNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  createNotification: (notificationData: Omit<Notification, 'id' | 'created_at'>) => Promise<{ success: boolean; message: string }>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotifications = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const userNotifications = await notificationsService.getNotificationsByUser(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      const message = 'Error al obtener notificaciones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await notificationsService.markAsRead(id);

      // Actualizar estado local
      setNotifications(prev => prev.map(notification =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      ));
    } catch (error) {
      const message = 'Error al marcar notificación como leída';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      await notificationsService.markAllAsRead(user.id);

      // Actualizar estado local
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        is_read: true
      })));
    } catch (error) {
      const message = 'Error al marcar todas las notificaciones como leídas';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'created_at'>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      const notificationId = await notificationsService.createNotification({
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        is_read: notificationData.is_read || false,
        data: notificationData.data,
      });

      // Actualizar estado local
      const newNotification: Notification = {
        id: notificationId,
        ...notificationData,
        created_at: new Date().toISOString()
      };

      setNotifications(prev => [newNotification, ...prev]);

      return { success: true, message: 'Notificación creada exitosamente' };
    } catch (error) {
      const message = 'Error al crear notificación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones cuando el usuario cambie
  useEffect(() => {
    if (user?.id) {
      getNotifications();
    }
  }, [user?.id]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    error,
    getNotifications,
    markAsRead,
    markAllAsRead,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 