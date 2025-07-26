import api from '@/util/axios';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  type: 'TEXT' | 'FILE' | 'IMAGE';
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
  type?: 'TEXT' | 'FILE' | 'IMAGE';
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

const chatService = {
  // Obtener todas las salas de chat del usuario
  async getRooms(): Promise<ChatRoom[]> {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  // Crear una nueva sala de chat
  async createRoom(data: CreateRoomRequest): Promise<ChatRoom> {
    try {
      const response = await api.post('/chat/rooms', data);
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  // Obtener mensajes de una sala específica
  async getRoomMessages(roomId: string): Promise<{ messages: ChatMessage[]; pagination: any }> {
    try {
      console.log('🔍 [SERVICE] getRoomMessages called with roomId:', roomId);
      console.log('🔍 [SERVICE] Making request to:', `/chat/rooms/${roomId}/messages`);
      
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      console.log('🔍 [SERVICE] Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching room messages:', error);
      throw error;
    }
  },

  // Enviar un mensaje
  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    try {
      const response = await api.post('/chat/messages', data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Marcar mensajes como leídos
  async markMessagesAsRead(roomId: string): Promise<void> {
    try {
      await api.put(`/chat/rooms/${roomId}/read`, {});
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Obtener usuarios disponibles para chat
  async getAvailableUsers(): Promise<ChatUser[]> {
    try {
      const response = await api.get('/chat/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  },

  // Subir archivo para chat
  async uploadFile(file: File): Promise<{ url: string; fileName: string; fileSize: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/chat/upload', formData, {
        headers: {
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
      const response = await api.get('/chat/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  },

  // Método unificado para contactar usuarios
  async contactUser(participants: string[], message: string, roomName?: string): Promise<{
    success: boolean;
    roomId: string;
    messageId: string | null;
    isNewRoom: boolean;
    message: string;
  }> {
    try {
      const response = await api.post('/chat/contact', {
        participants,
        message,
        roomName,
      });
      return response.data;
    } catch (error) {
      console.error('Error contacting user:', error);
      throw error;
    }
  },
};

export default chatService; 