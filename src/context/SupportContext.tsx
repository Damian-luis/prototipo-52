"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supportService, Ticket, CreateTicketData } from '@/services/support.service';
import { useAuth } from './AuthContext';

interface SupportContextType {
  tickets: Ticket[];
  loading: boolean;
  createTicket: (ticketData: CreateTicketData) => Promise<{ success: boolean; message: string; ticket?: Ticket }>;
  updateTicket: (ticketId: string, updateData: any) => Promise<{ success: boolean; message: string }>;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByStatus: (status: string) => Ticket[];
  getTicketById: (ticketId: string) => Ticket | undefined;
  loadTickets: () => Promise<void>;
  loadAllTickets: () => Promise<void>; // Para admin
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar tickets del usuario actual
  const loadTickets = async () => {
    if (!user?.id) {
      console.log('⚠️ [SUPPORT CONTEXT] No user authenticated, skipping ticket load');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 [SUPPORT CONTEXT] Loading tickets for user:', user.id);
      // Para usuarios normales, cargar todos los tickets y filtrar por los que crearon o les fueron asignados
      const allTickets = await supportService.getAllTickets();
      const userTickets = allTickets.filter(ticket => 
        ticket.creatorId === user.id || ticket.assigneeId === user.id
      );
      console.log('✅ [SUPPORT CONTEXT] Loaded tickets:', userTickets.length);
      setTickets(userTickets);
    } catch (error) {
      console.error('❌ [SUPPORT CONTEXT] Error loading tickets:', error);
      // No lanzar el error, solo mostrar en consola
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los tickets (para admin)
  const loadAllTickets = async () => {
    if (!user?.id) {
      console.log('⚠️ [SUPPORT CONTEXT] No user authenticated, skipping ticket load');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 [SUPPORT CONTEXT] Loading all tickets for admin:', user.id);
      const allTickets = await supportService.getAllTickets();
      console.log('✅ [SUPPORT CONTEXT] Loaded all tickets:', allTickets.length);
      setTickets(allTickets);
    } catch (error) {
      console.error('❌ [SUPPORT CONTEXT] Error loading all tickets:', error);
      // No lanzar el error, solo mostrar en consola
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      // Si es admin, cargar todos los tickets, sino solo los del usuario
      if (user.role === 'ADMIN') {
        loadAllTickets();
      } else {
        loadTickets();
      }
    }
  }, [user?.id, user?.role]);

  const createTicket = async (ticketData: CreateTicketData): Promise<{ success: boolean; message: string; ticket?: Ticket }> => {
    try {
      const newTicket = await supportService.createTicket(ticketData);
      
      setTickets(prev => [newTicket, ...prev]);
      
      return { success: true, message: 'Ticket creado exitosamente', ticket: newTicket };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { success: false, message: 'Error al crear el ticket' };
    }
  };

  const updateTicket = async (ticketId: string, updateData: any): Promise<{ success: boolean; message: string }> => {
    try {
      const updatedTicket = await supportService.updateTicket(ticketId, updateData);
      
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? updatedTicket : ticket
      ));
      
      return { success: true, message: 'Ticket actualizado exitosamente' };
    } catch (error) {
      console.error('Error updating ticket:', error);
      return { success: false, message: 'Error al actualizar el ticket' };
    }
  };

  const getTicketsByUser = (userId: string) => 
    tickets.filter(t => t.creatorId === userId || t.assigneeId === userId);

  const getTicketsByStatus = (status: string) => 
    tickets.filter(t => t.status === status);

  const getTicketById = (ticketId: string) => 
    tickets.find(t => t.id === ticketId);

  const value: SupportContextType = {
    tickets,
    loading,
    createTicket,
    updateTicket,
    getTicketsByUser,
    getTicketsByStatus,
    getTicketById,
    loadTickets,
    loadAllTickets,
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