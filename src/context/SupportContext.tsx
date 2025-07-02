"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'account' | 'contract' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  messages: TicketMessage[];
  attachments?: Attachment[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface SupportNotification {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_resolved' | 'new_message';
  ticketId: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SupportContextType {
  tickets: SupportTicket[];
  notifications: SupportNotification[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>) => Promise<{ success: boolean; message: string; ticketId?: string }>;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => Promise<{ success: boolean; message: string }>;
  assignTicket: (ticketId: string, assignedTo: string, assignedToName: string) => Promise<{ success: boolean; message: string }>;
  addMessage: (ticketId: string, message: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt'>) => Promise<{ success: boolean; message: string }>;
  resolveTicket: (ticketId: string, resolution: string) => Promise<{ success: boolean; message: string }>;
  getTicketsByUser: (userId: string) => SupportTicket[];
  getTicketsByStatus: (status: SupportTicket['status']) => SupportTicket[];
  getTicketById: (ticketId: string) => SupportTicket | undefined;
  markNotificationAsRead: (notificationId: string) => void;
  getUnreadNotifications: (userId: string) => SupportNotification[];
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [notifications, setNotifications] = useState<SupportNotification[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedTickets = localStorage.getItem('supportTickets');
    const storedNotifications = localStorage.getItem('supportNotifications');
    
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    } else {
      // Crear tickets de ejemplo
      const defaultTickets: SupportTicket[] = [
        {
          id: '1',
          userId: '2',
          userName: 'Juan Pérez',
          userEmail: 'juan@example.com',
          subject: 'No puedo acceder a mi cuenta',
          description: 'Desde ayer no puedo iniciar sesión en mi cuenta. Me aparece un error de credenciales inválidas.',
          category: 'account',
          priority: 'high',
          status: 'open',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            {
              id: '1',
              ticketId: '1',
              userId: '1',
              userName: 'Soporte',
              message: 'Hola Juan, estamos revisando tu caso. ¿Podrías confirmar si has intentado restablecer tu contraseña?',
              isInternal: false,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ];
      localStorage.setItem('supportTickets', JSON.stringify(defaultTickets));
      setTickets(defaultTickets);
    }

    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  const createNotification = (type: SupportNotification['type'], ticketId: string, userId: string, message: string) => {
    const newNotification: SupportNotification = {
      id: Date.now().toString(),
      type,
      ticketId,
      userId,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem('supportNotifications', JSON.stringify(updatedNotifications));
  };

  const createTicket = async (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'status'>): Promise<{ success: boolean; message: string; ticketId?: string }> => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: Date.now().toString(),
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));

    // Crear notificación para administradores
    createNotification('ticket_created', newTicket.id, '1', `Nuevo ticket: ${ticketData.subject}`);

    return { 
      success: true, 
      message: 'Ticket creado exitosamente', 
      ticketId: newTicket.id 
    };
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']): Promise<{ success: boolean; message: string }> => {
    const updatedTickets = tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            status,
            updatedAt: new Date().toISOString(),
            resolvedAt: status === 'resolved' ? new Date().toISOString() : t.resolvedAt
          }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      createNotification('ticket_updated', ticketId, ticket.userId, `Tu ticket "${ticket.subject}" ha sido actualizado`);
    }

    return { success: true, message: 'Estado del ticket actualizado' };
  };

  const assignTicket = async (ticketId: string, assignedTo: string, assignedToName: string): Promise<{ success: boolean; message: string }> => {
    const updatedTickets = tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            assignedTo,
            assignedToName,
            updatedAt: new Date().toISOString()
          }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));

    return { success: true, message: 'Ticket asignado exitosamente' };
  };

  const addMessage = async (ticketId: string, messageData: Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt'>): Promise<{ success: boolean; message: string }> => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return { success: false, message: 'Ticket no encontrado' };
    }

    const newMessage: TicketMessage = {
      ...messageData,
      id: Date.now().toString(),
      ticketId,
      createdAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            messages: [...t.messages, newMessage],
            updatedAt: new Date().toISOString()
          }
        : t
    );
    setTickets(updatedTickets);
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));

    // Notificar al usuario si el mensaje es del soporte
    if (messageData.userId !== ticket.userId) {
      createNotification('new_message', ticketId, ticket.userId, `Nuevo mensaje en tu ticket: ${ticket.subject}`);
    }

    return { success: true, message: 'Mensaje agregado exitosamente' };
  };

  const resolveTicket = async (ticketId: string, resolution: string): Promise<{ success: boolean; message: string }> => {
    // Agregar mensaje de resolución
    await addMessage(ticketId, {
      userId: '1',
      userName: 'Sistema',
      message: `Ticket resuelto: ${resolution}`,
      isInternal: false
    });

    // Actualizar estado
    await updateTicketStatus(ticketId, 'resolved');

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      createNotification('ticket_resolved', ticketId, ticket.userId, `Tu ticket "${ticket.subject}" ha sido resuelto`);
    }

    return { success: true, message: 'Ticket resuelto exitosamente' };
  };

  const getTicketsByUser = (userId: string) => 
    tickets.filter(t => t.userId === userId);

  const getTicketsByStatus = (status: SupportTicket['status']) => 
    tickets.filter(t => t.status === status);

  const getTicketById = (ticketId: string) => 
    tickets.find(t => t.id === ticketId);

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('supportNotifications', JSON.stringify(updatedNotifications));
  };

  const getUnreadNotifications = (userId: string) => 
    notifications.filter(n => n.userId === userId && !n.read);

  return (
    <SupportContext.Provider value={{
      tickets,
      notifications,
      createTicket,
      updateTicketStatus,
      assignTicket,
      addMessage,
      resolveTicket,
      getTicketsByUser,
      getTicketsByStatus,
      getTicketById,
      markNotificationAsRead,
      getUnreadNotifications
    }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport debe ser usado dentro de SupportProvider');
  }
  return context;
}; 