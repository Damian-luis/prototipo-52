"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supportService } from '@/services/supabase';
import { useAuth } from './AuthContext';

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'contract' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  assigned_to?: string;
  assigned_to_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  ticket_messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface SupportNotification {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'new_message';
  ticket_id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface SupportContextType {
  tickets: SupportTicket[];
  notifications: SupportNotification[];
  loading: boolean;
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'ticket_messages' | 'status'>) => Promise<{ success: boolean; message: string; ticketId?: string }>;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status'], assignedTo?: string, assignedToName?: string) => Promise<{ success: boolean; message: string }>;
  addMessage: (ticketId: string, message: Omit<TicketMessage, 'id' | 'ticket_id' | 'created_at'>) => Promise<{ success: boolean; message: string }>;
  resolveTicket: (ticketId: string, resolution: string) => Promise<{ success: boolean; message: string }>;
  getTicketsByUser: (userId: string) => SupportTicket[];
  getTicketsByStatus: (status: SupportTicket['status']) => SupportTicket[];
  getTicketById: (ticketId: string) => SupportTicket | undefined;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  getUnreadNotifications: (userId: string) => SupportNotification[];
  loadTickets: () => Promise<void>;
  loadNotifications: () => Promise<void>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<SupportNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar tickets al iniciar
  const loadTickets = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await supportService.getTicketsByUser(user.id);
      if (result.success && result.data) {
        setTickets(result.data);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones al iniciar
  const loadNotifications = async () => {
    if (!user?.id) return;
    
    try {
      const result = await supportService.getNotificationsByUser(user.id);
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTickets();
      loadNotifications();
    }
  }, [user?.id]);

  const createTicket = async (ticketData: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'ticket_messages' | 'status'>): Promise<{ success: boolean; message: string; ticketId?: string }> => {
    try {
      const result = await supportService.createTicket(ticketData);
      
      if (result.success && result.data) {
        setTickets(prev => [result.data, ...prev]);
        
        // Crear notificación
        await supportService.createNotification({
          type: 'ticket_created',
          ticket_id: result.data.id,
          user_id: ticketData.user_id,
          message: `Nuevo ticket creado: ${ticketData.subject}`
        });
        
        return { success: true, message: 'Ticket creado exitosamente', ticketId: result.data.id };
      } else {
        return { success: false, message: 'Error al crear el ticket' };
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { success: false, message: 'Error al crear el ticket' };
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status'], assignedTo?: string, assignedToName?: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await supportService.updateTicketStatus(ticketId, status, assignedTo, assignedToName);
      
      if (result.success && result.data) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? { ...ticket, ...result.data } : ticket
        ));
        
        // Crear notificación
        await supportService.createNotification({
          type: 'ticket_updated',
          ticket_id: ticketId,
          user_id: result.data.user_id,
          message: `Ticket actualizado: ${status}`
        });
        
        return { success: true, message: 'Estado del ticket actualizado' };
      } else {
        return { success: false, message: 'Error al actualizar el ticket' };
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return { success: false, message: 'Error al actualizar el ticket' };
    }
  };

  const addMessage = async (ticketId: string, messageData: Omit<TicketMessage, 'id' | 'ticket_id' | 'created_at'>): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await supportService.addMessage({
        ...messageData,
        ticket_id: ticketId
      });
      
      if (result.success && result.data) {
        setTickets(prev => prev.map(ticket => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              ticket_messages: [...(ticket.ticket_messages || []), result.data]
            };
          }
          return ticket;
        }));
        
        // Crear notificación
        await supportService.createNotification({
          type: 'new_message',
          ticket_id: ticketId,
          user_id: messageData.user_id,
          message: `Nuevo mensaje en ticket`
        });
        
        return { success: true, message: 'Mensaje agregado exitosamente' };
      } else {
        return { success: false, message: 'Error al agregar el mensaje' };
      }
    } catch (error) {
      console.error('Error adding message:', error);
      return { success: false, message: 'Error al agregar el mensaje' };
    }
  };

  const resolveTicket = async (ticketId: string, resolution: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Agregar mensaje de resolución
      await addMessage(ticketId, {
        user_id: user?.id || '',
        user_name: 'Soporte',
        message: `**RESUELTO:** ${resolution}`,
        is_internal: false
      });
      
      // Actualizar estado a resuelto
      const result = await updateTicketStatus(ticketId, 'resolved');
      
      if (result.success) {
        // Crear notificación de resolución
        await supportService.createNotification({
          type: 'ticket_resolved',
          ticket_id: ticketId,
          user_id: user?.id || '',
          message: `Ticket resuelto: ${resolution}`
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error resolving ticket:', error);
      return { success: false, message: 'Error al resolver el ticket' };
    }
  };

  const getTicketsByUser = (userId: string) => 
    tickets.filter(t => t.user_id === userId);

  const getTicketsByStatus = (status: SupportTicket['status']) => 
    tickets.filter(t => t.status === status);

  const getTicketById = (ticketId: string) => 
    tickets.find(t => t.id === ticketId);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const result = await supportService.markNotificationAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getUnreadNotifications = (userId: string) => 
    notifications.filter(n => n.user_id === userId && !n.is_read);

  const value: SupportContextType = {
    tickets,
    notifications,
    loading,
    createTicket,
    updateTicketStatus,
    addMessage,
    resolveTicket,
    getTicketsByUser,
    getTicketsByStatus,
    getTicketById,
    markNotificationAsRead,
    getUnreadNotifications,
    loadTickets,
    loadNotifications
  };

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (context === undefined) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
}; 