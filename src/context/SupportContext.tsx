"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supportService, Ticket } from '@/services/support.service';
import { useAuth } from './AuthContext';

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_internal: boolean;
  created_at: string;
}

interface SupportContextType {
  tickets: Ticket[];
  loading: boolean;
  createTicket: (ticketData: {
    user_id: string;
    title: string;
    description: string;
    category: 'technical' | 'billing' | 'general' | 'bug' | 'feature';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }) => Promise<{ success: boolean; message: string; ticketId?: string }>;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<{ success: boolean; message: string }>;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByStatus: (status: Ticket['status']) => Ticket[];
  getTicketById: (ticketId: string) => Ticket | undefined;
  loadTickets: () => Promise<void>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar tickets al iniciar
  const loadTickets = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const userTickets = await supportService.getTicketsByUser(user.id);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTickets();
    }
  }, [user?.id]);

  const createTicket = async (ticketData: {
    user_id: string;
    title: string;
    description: string;
    category: 'technical' | 'billing' | 'general' | 'bug' | 'feature';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<{ success: boolean; message: string; ticketId?: string }> => {
    try {
      const ticketId = await supportService.createTicket(ticketData);
      
      const newTicket: Ticket = {
        id: ticketId,
        user_id: ticketData.user_id,
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setTickets(prev => [newTicket, ...prev]);
      
      return { success: true, message: 'Ticket creado exitosamente', ticketId };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { success: false, message: 'Error al crear el ticket' };
    }
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']): Promise<{ success: boolean; message: string }> => {
    try {
      const updatedTicket = await supportService.updateTicketStatus(ticketId, status);
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
      ));
      
      return { success: true, message: 'Estado del ticket actualizado' };
    } catch (error) {
      console.error('Error updating ticket status:', error);
      return { success: false, message: 'Error al actualizar el ticket' };
    }
  };

  const getTicketsByUser = (userId: string) => 
    tickets.filter(t => t.user_id === userId);

  const getTicketsByStatus = (status: Ticket['status']) => 
    tickets.filter(t => t.status === status);

  const getTicketById = (ticketId: string) => 
    tickets.find(t => t.id === ticketId);

  const value: SupportContextType = {
    tickets,
    loading,
    createTicket,
    updateTicketStatus,
    getTicketsByUser,
    getTicketsByStatus,
    getTicketById,
    loadTickets,
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