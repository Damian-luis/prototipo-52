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

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cargar mensajes cuando se activa la sala
  useEffect(() => {
    if (roomId && activeRoom?.id === roomId) {
      getRoomMessages(roomId);
      markAsRead(roomId);
    }
  }, [roomId, activeRoom, getRoomMessages, markAsRead]);

  // Auto-scroll cuando llegan nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filtrar mensajes de esta sala
  const roomMessages = messages.filter(msg => msg.roomId === roomId);

  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof roomMessages } = {};
    roomMessages.forEach(message => {
      const date = new Date(message.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
                new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000 // 5 minutos
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