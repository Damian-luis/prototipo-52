"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import chatService, { ChatMessage, ChatRoom, ChatUser, CreateRoomRequest, SendMessageRequest } from '@/services/chat.service';

interface ChatContextType {
  // Estado
  messages: ChatMessage[];
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  isLoading: boolean;
  error: string | null;

  // Funciones de salas
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  createRoom: (participants: string[], name?: string) => Promise<ChatRoom>;
  setActiveRoom: (room: ChatRoom | null) => void;
  loadRooms: () => Promise<void>;

  // Funciones de mensajes
  sendMessage: (content: string, roomId: string, type?: 'TEXT' | 'FILE' | 'IMAGE') => Promise<void>;
  markAsRead: (roomId: string) => Promise<void>;
  getUnreadCount: (roomId: string) => number;
  getRoomMessages: (roomId: string) => Promise<ChatMessage[]>;

  // Funciones de usuarios
  getAvailableUsers: () => Promise<ChatUser[]>;
  uploadFile: (file: File) => Promise<{ url: string; fileName: string; fileSize: number }>;
  contactUser: (participants: string[], message: string, roomName?: string) => Promise<{
    success: boolean;
    roomId: string;
    messageId: string | null;
    isNewRoom: boolean;
    message: string;
  }>;

  // Utilidades
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const joinRoom = useCallback((roomId: string) => {
    // Simplemente actualizar la sala activa
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setActiveRoom(room);
    }
  }, [rooms]);

  const leaveRoom = useCallback((roomId: string) => {
    if (activeRoom?.id === roomId) {
      setActiveRoom(null);
    }
  }, [activeRoom]);

  const createRoom = useCallback(async (participants: string[], name?: string): Promise<ChatRoom> => {
    try {
      setIsLoading(true);
      const room = await chatService.createRoom({ participants, name });
      
      // Agregar la sala a la lista local
      setRooms(prev => [...prev, room]);
      
      return room;
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Error al crear la sala de chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRooms = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userRooms = await chatService.getRooms();
      setRooms(userRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Error al cargar las conversaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRoomMessages = useCallback(async (roomId: string): Promise<ChatMessage[]> => {
    try {
      console.log('🔍 [CONTEXT] getRoomMessages called with roomId:', roomId);
      console.log('🔍 [CONTEXT] roomId type:', typeof roomId);
      
      const response = await chatService.getRoomMessages(roomId);
      console.log('🔍 [CONTEXT] getRoomMessages response:', response);
      
      const messages = response.messages;
      console.log('🔍 [CONTEXT] Extracted messages:', messages);
      console.log('🔍 [CONTEXT] Messages count:', messages.length);
      console.log('🔍 [CONTEXT] Messages details:', messages.map(m => ({
        id: m.id,
        content: m.content,
        type: m.type,
        roomId: m.roomId,
        senderName: m.senderName
      })));
      
      setMessages(messages);
      return messages;
    } catch (error) {
      console.error('Error fetching room messages:', error);
      setError('Error al cargar los mensajes');
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async (content: string, roomId: string, type: 'TEXT' | 'FILE' | 'IMAGE' = 'TEXT'): Promise<void> => {
    try {
      if (!content.trim()) return;

      console.log('📤 Sending message via HTTP:', { content, roomId, type });

      const messageData: SendMessageRequest = {
        content: content.trim(),
        roomId,
        type,
      };

      // Enviar mensaje por HTTP
      const message = await chatService.sendMessage(messageData);
      
      console.log('✅ Message sent successfully:', message);
      
      // Recargar mensajes después de enviar para actualizar la UI
      console.log('🔄 Reloading messages after sending...');
      await getRoomMessages(roomId);
      
      console.log('✅ Messages reloaded after sending');
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      setError('Error al enviar el mensaje');
      throw error;
    }
  }, [getRoomMessages]);

  const markAsRead = useCallback(async (roomId: string): Promise<void> => {
    try {
      await chatService.markMessagesAsRead(roomId);
      
      // Actualizar estado local
      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            unreadCount: 0,
          };
        }
        return room;
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
      setError('Error al marcar mensajes como leídos');
    }
  }, []);

  const getUnreadCount = useCallback((roomId: string): number => {
    const room = rooms.find(r => r.id === roomId);
    return room?.unreadCount || 0;
  }, [rooms]);

  const getAvailableUsers = useCallback(async (): Promise<ChatUser[]> => {
    try {
      const users = await chatService.getAvailableUsers();
      return users;
    } catch (error) {
      console.error('Error fetching available users:', error);
      setError('Error al cargar usuarios disponibles');
      throw error;
    }
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<{ url: string; fileName: string; fileSize: number }> => {
    try {
      return await chatService.uploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error al subir el archivo');
      throw error;
    }
  }, []);

  const contactUser = useCallback(async (participants: string[], message: string, roomName?: string) => {
    try {
      setIsLoading(true);
      const result = await chatService.contactUser(participants, message, roomName);
      
      // Si es una sala nueva, agregarla a la lista local
      if (result.isNewRoom) {
        // Aquí podrías agregar la sala a la lista local si es necesario
        console.log('🆕 Nueva sala creada:', result.roomId);
      }
      
      return result;
    } catch (error) {
      console.error('Error contacting user:', error);
      setError('Error al contactar usuario');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // No cargar salas automáticamente al montar el componente
  // useEffect(() => {
  //   if (user) {
  //     loadRooms();
  //   }
  // }, [user]);

  const value: ChatContextType = {
    messages,
    rooms,
    activeRoom,
    isLoading,
    error,
    joinRoom,
    leaveRoom,
    createRoom,
    setActiveRoom,
    loadRooms,
    sendMessage,
    markAsRead,
    getUnreadCount,
    getRoomMessages,
    getAvailableUsers,
    uploadFile,
    contactUser,
    clearError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 