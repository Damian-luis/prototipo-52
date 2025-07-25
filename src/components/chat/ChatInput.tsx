"use client";

import React, { useState, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import Button from '@/components/ui/button/Button';

interface ChatInputProps {
  roomId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { sendMessage, uploadFile, isConnected, isLoading } = useChat();
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !isConnected || isLoading) return;

    try {
      await sendMessage(message.trim(), roomId, 'text');
      setMessage('');
      setIsTyping(false);
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
        'file'
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
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadFile(file);
      
      // Enviar mensaje con imagen
      await sendMessage(
        `Imagen: ${result.fileName}`,
        roomId,
        'image'
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

  return (
    <div className="space-y-3">
      {/* Indicador de estado de conexión */}
      {!isConnected && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg">
          Conectando al chat...
        </div>
      )}

      {/* Input principal */}
      <div className="flex items-end space-x-3">
        {/* Botones de adjuntar */}
        <div className="flex space-x-1">
          <Button
            onClick={triggerFileUpload}
            variant="ghost"
            size="sm"
            disabled={!isConnected || isUploading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            onClick={triggerImageUpload}
            variant="ghost"
            size="sm"
            disabled={!isConnected || isUploading}
          >
            <Image className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!isConnected}
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
            placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
            disabled={!isConnected || isUploading}
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
          disabled={!message.trim() || !isConnected || isUploading}
          variant="primary"
          size="sm"
          className="px-4 py-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Indicador de carga */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
          <span>Subiendo archivo...</span>
        </div>
      )}

      {/* Inputs ocultos para archivos */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xlsx,.xls,.ppt,.pptx"
      />
      <input
        ref={imageInputRef}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Información de ayuda */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• Presiona Enter para enviar, Shift+Enter para nueva línea</p>
        <p>• Puedes adjuntar archivos (máx. 10MB) e imágenes</p>
        <p>• Los archivos se guardan de forma segura en la nube</p>
      </div>
    </div>
  );
};

export default ChatInput; 