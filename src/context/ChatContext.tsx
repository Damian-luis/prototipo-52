"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import chatService, { ChatMessage, ChatRoom, ChatUser, CreateRoomRequest, SendMessageRequest } from '@/services/chat.service';

interface ChatContextType {
  // Estado
  isConnected: boolean;
  messages: ChatMessage[];
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  onlineUsers: ChatUser[];
  isLoading: boolean;
  error: string | null;

  // Funciones de conexión
  connect: () => void;
  disconnect: () => void;

  // Funciones de salas
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  createRoom: (participants: string[], name?: string) => Promise<ChatRoom>;
  setActiveRoom: (room: ChatRoom | null) => void;

  // Funciones de mensajes
  sendMessage: (content: string, roomId: string, type?: 'text' | 'file' | 'image') => Promise<void>;
  markAsRead: (roomId: string) => Promise<void>;
  getUnreadCount: (roomId: string) => number;
  getRoomMessages: (roomId: string) => Promise<ChatMessage[]>;

  // Funciones de usuarios
  getAvailableUsers: () => Promise<ChatUser[]>;
  uploadFile: (file: File) => Promise<{ url: string; fileName: string; fileSize: number }>;

  // Utilidades
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const clearError = () => setError(null);

  const connect = () => {
    if (!user || socketRef.current?.connected) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
        auth: {
          token,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Chat connected');
        setIsConnected(true);
        setError(null);
      });

      newSocket.on('disconnect', () => {
        console.log('Chat disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Chat connection error:', error);
        setError('Error de conexión con el chat');
        setIsConnected(false);
      });

      newSocket.on('message', (message: ChatMessage) => {
        setMessages(prev => {
          // Evitar duplicados
          if (prev.find(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Actualizar última mensaje en la sala
        setRooms(prev => prev.map(room => {
          if (room.id === message.roomId) {
            return {
              ...room,
              lastMessage: message,
              unreadCount: room.unreadCount + (message.senderId !== user.id ? 1 : 0),
              updatedAt: message.timestamp,
            };
          }
          return room;
        }));
      });

      newSocket.on('room_created', (room: ChatRoom) => {
        setRooms(prev => {
          // Evitar duplicados
          if (prev.find(r => r.id === room.id)) {
            return prev;
          }
          return [...prev, room];
        });
      });

      newSocket.on('room_joined', (room: ChatRoom) => {
        setRooms(prev => prev.map(r => r.id === room.id ? room : r));
      });

      newSocket.on('room_left', (roomId: string) => {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        if (activeRoom?.id === roomId) {
          setActiveRoom(null);
        }
      });

      newSocket.on('user_online', (userData: ChatUser) => {
        setOnlineUsers(prev => {
          const existing = prev.find(u => u.id === userData.id);
          if (existing) {
            return prev.map(u => u.id === userData.id ? { ...u, isOnline: true } : u);
          }
          return [...prev, userData];
        });
      });

      newSocket.on('user_offline', (userId: string) => {
        setOnlineUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isOnline: false, lastSeen: new Date().toISOString() } : u
        ));
      });

      newSocket.on('online_users', (users: ChatUser[]) => {
        setOnlineUsers(users);
      });

      newSocket.on('messages_read', (data: { roomId: string; userId: string }) => {
        setRooms(prev => prev.map(room => {
          if (room.id === data.roomId) {
            return {
              ...room,
              unreadCount: Math.max(0, room.unreadCount - 1),
            };
          }
          return room;
        }));
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (error) {
      console.error('Error connecting to chat:', error);
      setError('Error al conectar con el chat');
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
  };

  const joinRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_room', roomId);
    }
  };

  const createRoom = async (participants: string[], name?: string): Promise<ChatRoom> => {
    try {
      setIsLoading(true);
      const room = await chatService.createRoom({ participants, name });
      
      // Agregar la sala a la lista local
      setRooms(prev => [...prev, room]);
      
      // Unirse a la sala automáticamente
      joinRoom(room.id);
      
      return room;
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Error al crear la sala de chat');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, roomId: string, type: 'text' | 'file' | 'image' = 'text'): Promise<void> => {
    try {
      if (!content.trim()) return;

      const messageData: SendMessageRequest = {
        content: content.trim(),
        roomId,
        type,
      };

      const message = await chatService.sendMessage(messageData);
      
      // Agregar el mensaje localmente
      setMessages(prev => [...prev, message]);
      
      // Actualizar última mensaje en la sala
      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return {
            ...room,
            lastMessage: message,
            updatedAt: message.timestamp,
          };
        }
        return room;
      }));

      // Enviar por socket si está conectado
      if (socketRef.current && isConnected) {
        socketRef.current.emit('send_message', message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error al enviar el mensaje');
      throw error;
    }
  };

  const markAsRead = async (roomId: string): Promise<void> => {
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

      // Notificar por socket
      if (socketRef.current && isConnected) {
        socketRef.current.emit('mark_read', roomId);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      setError('Error al marcar mensajes como leídos');
    }
  };

  const getUnreadCount = (roomId: string): number => {
    const room = rooms.find(r => r.id === roomId);
    return room?.unreadCount || 0;
  };

  const getRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
    try {
      const messages = await chatService.getRoomMessages(roomId);
      setMessages(messages);
      return messages;
    } catch (error) {
      console.error('Error fetching room messages:', error);
      setError('Error al cargar los mensajes');
      throw error;
    }
  };

  const getAvailableUsers = async (): Promise<ChatUser[]> => {
    try {
      const users = await chatService.getAvailableUsers();
      setOnlineUsers(users);
      return users;
    } catch (error) {
      console.error('Error fetching available users:', error);
      setError('Error al cargar usuarios disponibles');
      throw error;
    }
  };

  const uploadFile = async (file: File): Promise<{ url: string; fileName: string; fileSize: number }> => {
    try {
      return await chatService.uploadFile(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error al subir el archivo');
      throw error;
    }
  };

  // Cargar salas al conectar
  useEffect(() => {
    if (isConnected && user) {
      const loadRooms = async () => {
        try {
          const userRooms = await chatService.getRooms();
          setRooms(userRooms);
        } catch (error) {
          console.error('Error loading rooms:', error);
        }
      };
      loadRooms();
    }
  }, [isConnected, user]);

  // Conectar/desconectar basado en el usuario
  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value: ChatContextType = {
    isConnected,
    messages,
    rooms,
    activeRoom,
    onlineUsers,
    isLoading,
    error,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    createRoom,
    setActiveRoom,
    sendMessage,
    markAsRead,
    getUnreadCount,
    getRoomMessages,
    getAvailableUsers,
    uploadFile,
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