import api from '@/util/axios';

export interface Ticket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'bug' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface CreateTicketData {
  user_id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'general' | 'bug' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const supportService = {
  // Obtener todos los tickets
  async getAllTickets(): Promise<Ticket[]> {
    const response = await api.get('/support/tickets');
    return response.data;
  },

  // Obtener ticket por ID
  async getTicketById(id: string): Promise<Ticket> {
    const response = await api.get(`/support/tickets/${id}`);
    return response.data;
  },

  // Obtener tickets por usuario
  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    const response = await api.get(`/support/tickets/user/${userId}`);
    return response.data;
  },

  // Crear nuevo ticket
  async createTicket(ticketData: CreateTicketData): Promise<string> {
    const response = await api.post('/support/tickets', ticketData);
    return response.data.id;
  },

  // Actualizar ticket
  async updateTicket(id: string, updateData: Partial<Ticket>): Promise<Ticket> {
    const response = await api.put(`/support/tickets/${id}`, updateData);
    return response.data;
  },

  // Eliminar ticket
  async deleteTicket(id: string): Promise<void> {
    await api.delete(`/support/tickets/${id}`);
  },

  // Cambiar estado del ticket
  async updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket> {
    const response = await api.put(`/support/tickets/${id}/status`, { status });
    return response.data;
  },

  // Asignar ticket a un agente
  async assignTicket(id: string, agentId: string): Promise<Ticket> {
    const response = await api.put(`/support/tickets/${id}/assign`, { agent_id: agentId });
    return response.data;
  },

  // Obtener estadísticas de tickets
  async getTicketStats(userId?: string): Promise<{
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  }> {
    const url = userId ? `/support/tickets/stats/${userId}` : '/support/tickets/stats';
    const response = await api.get(url);
    return response.data;
  },
}; 