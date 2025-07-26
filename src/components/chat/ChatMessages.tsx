"use client";

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import ChatMessage from './ChatMessage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatMessagesProps {
  roomId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { messages, getRoomMessages, markAsRead, activeRoom } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verificar que messages sea un array
  const safeMessages = Array.isArray(messages) ? messages : [];

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cargar mensajes cuando se activa la sala
  useEffect(() => {
    console.log('🔍 ChatMessages - useEffect triggered:', { roomId, activeRoomId: activeRoom?.id });
    if (roomId) {
      console.log('📥 ChatMessages - Loading messages for room:', roomId);
      getRoomMessages(roomId);
      markAsRead(roomId);
    }
  }, [roomId, getRoomMessages, markAsRead]);

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [safeMessages]);

  // Filtrar mensajes de esta sala
  const roomMessages = safeMessages.filter(msg => msg.roomId === roomId);
  
  console.log('🔍 ChatMessages - Messages loaded:', {
    totalMessages: safeMessages.length,
    roomMessages: roomMessages.length,
    roomId,
    allMessages: safeMessages.map(m => ({ 
      id: m.id, 
      content: m.content ? m.content.substring(0, 30) : 'Sin contenido', 
      sender: m.senderName,
      roomId: m.roomId
    })),
    filteredMessages: roomMessages.map(m => ({ 
      id: m.id, 
      content: m.content ? m.content.substring(0, 30) : 'Sin contenido', 
      sender: m.senderName,
      roomId: m.roomId
    }))
  });

  // Si no hay mensajes, mostrar mensaje de carga
  if (roomMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No hay mensajes en esta conversación
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            ¡Sé el primero en enviar un mensaje!
          </p>
        </div>
      </div>
    );
  }

  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof roomMessages } = {};
    roomMessages.forEach(message => {
      try {
        const date = new Date(message.timestamp);
        
        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) {
          console.warn('⚠️ Invalid date for message:', message.id, message.timestamp);
          return; // Saltar este mensaje
        }
        
        const dateKey = format(date, 'yyyy-MM-dd');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      } catch (error) {
        console.error('❌ Error processing message date:', message.id, message.timestamp, error);
      }
    });
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs.sort((a, b) => {
        try {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateA.getTime() - dateB.getTime();
        } catch (error) {
          console.error('❌ Error sorting messages by date:', error);
          return 0;
        }
      })
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Verificar que la fecha sea válida
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date in formatDate:', dateString);
        return 'Fecha inválida';
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Hoy';
      } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
        return 'Ayer';
      } else {
        return format(date, 'EEEE, d \'de\' MMMM', { locale: es });
      }
    } catch (error) {
      console.error('❌ Error formatting date:', dateString, error);
      return 'Fecha inválida';
    }
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {roomMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p>No hay mensajes aún</p>
            <p className="text-sm">¡Sé el primero en escribir!</p>
          </div>
        </div>
      ) : (
        messageGroups.map(({ date, messages }) => (
          <div key={date} className="space-y-4">
            {/* Separador de fecha */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(date)}
                </span>
              </div>
            </div>

            {/* Mensajes del día */}
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === user?.id;
              const showAvatar = !isOwnMessage;
              const showName = !isOwnMessage && (
                index === 0 || 
                messages[index - 1]?.senderId !== message.senderId ||
                (() => {
                  try {
                    const currentTime = new Date(message.timestamp).getTime();
                    const previousTime = new Date(messages[index - 1].timestamp).getTime();
                    return currentTime - previousTime > 300000; // 5 minutos
                  } catch (error) {
                    console.error('❌ Error comparing timestamps:', error);
                    return true; // Mostrar nombre por defecto
                  }
                })()
              );

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  showAvatar={showAvatar}
                  showName={showName}
                />
              );
            })}
          </div>
        ))
      )}
      
      {/* Referencia para auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages; 