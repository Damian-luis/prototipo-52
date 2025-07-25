import api from '@/util/axios';

// Interfaz que coincide con la respuesta real del backend
export interface Ticket {
  id: string;
  key: string; // Ej: "SUP-123"
  title: string;
  description?: string;
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW' | 'LOWEST';
  status: string; // 'OPEN', 'CLOSED', etc.
  projectName?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  
  // Relaciones
  creator: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  creatorId: string;
  
  assignee?: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  assigneeId?: string;
  
  workspaceId: string;
  
  messages: TicketMessage[];
  attachments: TicketAttachment[];
}

export interface TicketMessage {
  id: string;
  content: string;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  attachments: TicketMessageAttachment[];
}

export interface TicketAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface TicketMessageAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description?: string;
  priority: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW' | 'LOWEST';
  projectName?: string;
}

export interface CreateTicketMessageData {
  content: string;
  mentions?: string[];
}

export interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: 'HIGHEST' | 'HIGH' | 'MEDIUM' | 'LOW' | 'LOWEST';
  status?: string;
  projectName?: string;
  assigneeId?: string;
}

export const supportService = {
  // Obtener todos los tickets (para admin)
  async getAllTickets(): Promise<Ticket[]> {
    const response = await api.get('/tickets');
    return response.data;
  },

  // Obtener ticket por ID
  async getTicketById(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Crear nuevo ticket
  async createTicket(ticketData: CreateTicketData, files?: File[]): Promise<Ticket> {
    const formData = new FormData();
    
    // Agregar datos del ticket
    Object.entries(ticketData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });
    
    // Agregar archivos si existen
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }
    
    const response = await api.post('/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar ticket
  async updateTicket(id: string, updateData: UpdateTicketData): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}`, updateData);
    return response.data;
  },

  // Eliminar ticket
  async deleteTicket(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`);
  },

  // Asignar ticket a un usuario
  async assignTicket(id: string, assigneeId: string): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}/assign`, { assigneeId });
    return response.data;
  },

  // Agregar mensaje a un ticket
  async addMessage(ticketId: string, messageData: CreateTicketMessageData, files?: File[]): Promise<TicketMessage> {
    const formData = new FormData();
    
    // Agregar datos del mensaje
    formData.append('content', messageData.content);
    if (messageData.mentions && messageData.mentions.length > 0) {
      formData.append('mentions', JSON.stringify(messageData.mentions));
    }
    
    // Agregar archivos si existen
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('attachments', file);
      });
    }
    
    const response = await api.post(`/tickets/${ticketId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obtener estadísticas básicas (calculadas en el frontend)
  async getTicketStats(): Promise<{
    total: number;
    open: number;
    closed: number;
    assigned: number;
    unassigned: number;
  }> {
    const tickets = await this.getAllTickets();
    
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'OPEN').length,
      closed: tickets.filter(t => t.status === 'CLOSED').length,
      assigned: tickets.filter(t => t.assigneeId).length,
      unassigned: tickets.filter(t => !t.assigneeId).length,
    };
    
    return stats;
  },
}; 