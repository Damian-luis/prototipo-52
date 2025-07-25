"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { showNotification } from '@/util/notifications';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Funciones
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const clearError = () => setError(null);

  const connectToNotifications = () => {
    if (!user || socketRef.current?.connected) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found for notifications');
        return;
      }

      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/notifications`, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('🔔 Notifications connected');
        setError(null);
      });

      newSocket.on('disconnect', () => {
        console.log('🔔 Notifications disconnected');
      });

      newSocket.on('connect_error', (error) => {
        console.error('🔔 Notifications connection error:', error);
        setError('Error de conexión con las notificaciones');
      });

      // Escuchar nuevas notificaciones
      newSocket.on('newNotification', (notification: Notification) => {
        console.log('🔔 New notification received:', notification);
        
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Mostrar notificación toast
        const notificationType = getNotificationType(notification.type);
        showNotification(notification.message, notificationType);
      });

      // Escuchar actualización de contador
      newSocket.on('unreadCount', (count: number) => {
        console.log('🔔 Unread count updated:', count);
        setUnreadCount(count);
      });

      socketRef.current = newSocket;
    } catch (error) {
      console.error('Error connecting to notifications:', error);
      setError('Error al conectar con las notificaciones');
    }
  };

  const disconnectFromNotifications = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const getNotificationType = (type: string): 'success' | 'error' | 'warning' | 'info' => {
    const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
      'job_application': 'info',
      'new_job_posted': 'info',
      'application_status_changed': 'info',
      'new_message': 'info',
      'company_message': 'info',
      'professional_message': 'info',
      'contract_signed': 'success',
      'payment_received': 'success',
      'payment_sent': 'success',
      'project_completed': 'success',
      'evaluation_received': 'info',
      'project_added': 'info',
      'task_assigned': 'info',
      'mention_comment': 'warning',
      'invitation_accepted': 'success',
      'task_status_changed': 'info',
    };

    return typeMap[type] || 'info';
  };

  const markAsRead = async (notificationId: string) => {
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('markAsRead', notificationId);
      }

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      setError('Error al marcar notificación como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('markAllAsRead');
      }

      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Error al marcar todas las notificaciones como leídas');
    }
  };

  // Cargar notificaciones existentes
  const loadNotifications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar contador de no leídas
  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  // Conectar/desconectar basado en el usuario
  useEffect(() => {
    if (user) {
      connectToNotifications();
      loadNotifications();
      loadUnreadCount();
    } else {
      disconnectFromNotifications();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      disconnectFromNotifications();
    };
  }, [user]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 