"use client";

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChatRoom } from '@/services/chat.service';
import Avatar from '@/components/ui/avatar/Avatar';
import Badge from '@/components/ui/badge/Badge';

interface ChatSidebarProps {
  room: ChatRoom;
  isActive: boolean;
  unreadCount: number;
  onClick: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  room,
  isActive,
  unreadCount,
  onClick,
}) => {
  const getRoomName = () => {
    if (room.name) {
      return room.name;
    }
    // Si no hay nombre personalizado, mostrar nombres de participantes
    return room.participantNames.join(', ');
  };

  const getLastMessage = () => {
    if (!room.lastMessage) return 'No hay mensajes aún';
    
    const isOwnMessage = room.lastMessage.senderId === room.participants[0]; // Simplificado
    const prefix = isOwnMessage ? 'Tú: ' : '';
    
    if (room.lastMessage.type === 'file') {
      return `${prefix}📎 ${room.lastMessage.fileName || 'Archivo'}`;
    } else if (room.lastMessage.type === 'image') {
      return `${prefix}🖼️ Imagen`;
    } else {
      return `${prefix}${room.lastMessage.content}`;
    }
  };

  const getLastMessageTime = () => {
    if (!room.lastMessage) return '';
    
    const messageDate = new Date(room.lastMessage.timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(messageDate, 'HH:mm', { locale: es });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return format(messageDate, 'dd/MM', { locale: es });
    }
  };

  const getRoomAvatar = () => {
    // Si es una conversación grupal con nombre personalizado, usar el primer participante
    if (room.name && room.participantAvatars.length > 0) {
      return room.participantAvatars[0];
    }
    // Si es una conversación individual, usar el avatar del otro participante
    if (room.participantAvatars.length === 1) {
      return room.participantAvatars[0];
    }
    // Si es grupal sin nombre, usar un avatar por defecto
    return undefined;
  };

  const getRoomDisplayName = () => {
    if (room.name) {
      return room.name;
    }
    // Para conversaciones individuales, mostrar solo el nombre del otro participante
    if (room.participantNames.length === 1) {
      return room.participantNames[0];
    }
    // Para conversaciones grupales, mostrar todos los nombres
    return room.participantNames.join(', ');
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={getRoomAvatar()}
            alt={getRoomDisplayName()}
            size="md"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium truncate ${
              isActive
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-gray-900 dark:text-white'
            }`}>
              {getRoomDisplayName()}
            </h4>
            
            {/* Tiempo del último mensaje */}
            {room.lastMessage && (
              <span className={`text-xs ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {getLastMessageTime()}
              </span>
            )}
          </div>

          {/* Último mensaje */}
          <p className={`text-xs truncate mt-1 ${
            isActive
              ? 'text-primary-600 dark:text-primary-400'
              : unreadCount > 0
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-500 dark:text-gray-400'
          }`}>
            {getLastMessage()}
          </p>

          {/* Información adicional */}
          <div className="flex items-center justify-between mt-1">
            {/* Número de participantes para grupos */}
            {room.participants.length > 2 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {room.participants.length} participantes
              </span>
            )}
            
            {/* Contador de mensajes no leídos */}
            {unreadCount > 0 && (
              <Badge
                color="primary"
                className="text-xs px-2 py-1"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar; 