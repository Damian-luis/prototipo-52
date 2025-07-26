"use client";

import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/button/Button';
import { Paperclip, Image, Smile, Send } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { showError } from '@/util/notifications';

interface ChatInputProps {
  roomId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { sendMessage, uploadFile } = useChat();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message, roomId);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadFile(file);
      
      // Enviar mensaje con archivo
      await sendMessage(
        `Archivo: ${result.fileName}`,
        roomId,
        'FILE'
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      showError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadFile(file);
      
      // Enviar mensaje con imagen
      await sendMessage(
        `Imagen: ${result.fileName}`,
        roomId,
        'IMAGE'
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Indicador de estado de conexión */}
      {/* The isConnected check was removed as per the edit hint. */}
      {/* {!isConnected && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
          Conectando al chat...
        </div>
      )} */}

      {/* Input principal */}
      <div className="flex items-end space-x-3">
        {/* Botones de adjuntar */}
        <div className="flex space-x-1">
          <Button
            onClick={triggerFileUpload}
            variant="ghost"
            size="sm"
            disabled={isUploading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            onClick={triggerImageUpload}
            variant="ghost"
            size="sm"
            disabled={isUploading}
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={false}
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* Área de texto */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..." // Removed isConnected check
            disabled={isUploading}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {/* Indicador de escritura */}
          {isTyping && (
            <div className="absolute -top-2 left-4 bg-white dark:bg-gray-800 px-2 text-xs text-gray-500">
              Escribiendo...
            </div>
          )}
        </div>

        {/* Botón enviar */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isUploading}
          size="md"
          className="px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Inputs ocultos para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
      />
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Indicador de carga */}
      {isUploading && (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Subiendo archivo...
        </div>
      )}
    </div>
  );
};

export default ChatInput; 