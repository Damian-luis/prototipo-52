"use client";

import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChatMessage as ChatMessageType } from '@/services/chat.service';
import Avatar from '@/components/ui/avatar/Avatar';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  showAvatar: boolean;
  showName: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwnMessage,
  showAvatar,
  showName,
}) => {
  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: es });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'zip':
      case 'rar':
        return '📦';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'FILE':
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-2xl">{getFileIcon(message.fileName || '')}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {message.fileName || 'Archivo'}
              </p>
              {message.fileSize && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            {message.fileUrl && (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Descargar
              </a>
            )}
          </div>
        );

      case 'IMAGE':
        return (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {message.content}
              </p>
            )}
            {message.fileUrl && (
              <div className="relative">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || 'Imagen'}
                  className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.fileUrl, '_blank')}
                />
                {message.fileName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {message.fileName}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'TEXT':
      default:
        return (
          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {showAvatar && (
          <div className="flex-shrink-0">
            <Avatar
              src={message.senderAvatar}
              alt={message.senderName}
              size="sm"
            />
          </div>
        )}

        {/* Mensaje */}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          {/* Nombre del remitente */}
          {showName && !isOwnMessage && (
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {message.senderName}
            </p>
          )}

          {/* Contenido del mensaje */}
          <div
            className={`px-4 py-2 rounded-lg ${
              isOwnMessage
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {renderMessageContent()}
          </div>

          {/* Hora */}
          <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {isOwnMessage && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {message.isRead ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 