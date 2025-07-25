import axios from 'axios';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  name?: string;
  participants: string[];
  participantNames: string[];
  participantAvatars: (string | undefined)[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomRequest {
  participants: string[];
  name?: string;
}

export interface SendMessageRequest {
  content: string;
  roomId: string;
  type?: 'text' | 'file' | 'image';
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
  lastSeen?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const chatService = {
  // Obtener todas las salas de chat del usuario
  async getRooms(): Promise<ChatRoom[]> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  // Crear una nueva sala de chat
  async createRoom(data: CreateRoomRequest): Promise<ChatRoom> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/chat/rooms`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  // Obtener mensajes de una sala específica
  async getRoomMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/chat/rooms/${roomId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching room messages:', error);
      throw error;
    }
  },

  // Enviar un mensaje
  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/chat/messages`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Marcar mensajes como leídos
  async markMessagesAsRead(roomId: string): Promise<void> {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/chat/rooms/${roomId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Obtener usuarios disponibles para chat
  async getAvailableUsers(): Promise<ChatUser[]> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/chat/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  },

  // Subir archivo para chat
  async uploadFile(file: File): Promise<{ url: string; fileName: string; fileSize: number }> {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/chat/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Obtener estadísticas de chat
  async getChatStats(): Promise<{
    totalRooms: number;
    unreadMessages: number;
    totalMessages: number;
  }> {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/chat/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  },
};

export default chatService; 