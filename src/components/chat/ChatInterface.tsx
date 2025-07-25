"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Search, Plus, Users, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import Input from '@/components/ui/input/Input';
import Badge from '@/components/ui/badge/Badge';
import { ChatRoom } from '@/services/chat.service';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const {
    rooms,
    activeRoom,
    onlineUsers,
    isConnected,
    isLoading,
    error,
    setActiveRoom,
    createRoom,
    getAvailableUsers,
    clearError,
  } = useChat();

  const [showSidebar, setShowSidebar] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newChatName, setNewChatName] = useState('');

  // Filtrar salas basado en el término de búsqueda
  const filteredRooms = rooms.filter(room => {
    const roomName = room.name || room.participantNames.join(', ');
    return roomName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Cargar usuarios disponibles al abrir el modal de nuevo chat
  useEffect(() => {
    if (showNewChat) {
      getAvailableUsers();
    }
  }, [showNewChat, getAvailableUsers]);

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const room = await createRoom(selectedUsers, newChatName || undefined);
      setActiveRoom(room);
      setShowNewChat(false);
      setSelectedUsers([]);
      setNewChatName('');
      setShowSidebar(false); // Ocultar sidebar en móvil después de crear chat
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRoomClick = (room: ChatRoom) => {
    setActiveRoom(room);
    setShowSidebar(false); // Ocultar sidebar en móvil
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Debes iniciar sesión para usar el chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h2>
            <div className="flex items-center space-x-2">
              <Badge 
                color={isConnected ? "success" : "error"}
                className="text-xs"
              >
                {isConnected ? "Conectado" : "Desconectado"}
              </Badge>
              <Button
                onClick={() => setShowNewChat(true)}
                size="sm"
                variant="outline"
                className="lg:hidden"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Botón nuevo chat */}
          <Button
            onClick={() => setShowNewChat(true)}
            className="w-full mt-3"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Conversación
          </Button>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No se encontraron conversaciones' : 'No tienes conversaciones aún'}
            </div>
          ) : (
            filteredRooms.map((room) => (
              <ChatSidebar
                key={room.id}
                room={room}
                isActive={activeRoom?.id === room.id}
                unreadCount={room.unreadCount}
                onClick={() => handleRoomClick(room)}
              />
            ))
          )}
        </div>
      </div>

      {/* Área principal del chat */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowSidebar(true)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                >
                  <Users className="w-4 h-4" />
                </Button>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {activeRoom.name || activeRoom.participantNames.join(', ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeRoom.participants.length} participantes
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-hidden">
              <ChatMessages roomId={activeRoom.id} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ChatInput roomId={activeRoom.id} />
            </div>
          </>
        ) : (
          /* Mensaje de bienvenida */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bienvenido al Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Selecciona una conversación o crea una nueva para comenzar
              </p>
              <Button onClick={() => setShowNewChat(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Conversación
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para nueva conversación */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Nueva Conversación
            </h3>

            {/* Nombre de la conversación (opcional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la conversación (opcional)
              </label>
              <Input
                type="text"
                placeholder="Ej: Proyecto Web"
                value={newChatName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChatName(e.target.value)}
              />
            </div>

            {/* Selección de participantes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar participantes
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                {onlineUsers
                  .filter(u => u.id !== user.id) // Excluir al usuario actual
                  .map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${
                        selectedUsers.includes(user.id)
                          ? 'bg-primary-100 dark:bg-primary-900'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.role}
                        </p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <div className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  setShowNewChat(false);
                  setSelectedUsers([]);
                  setNewChatName('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateChat}
                disabled={selectedUsers.length === 0}
                className="flex-1"
              >
                Crear Conversación
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={clearError} className="ml-2 hover:text-red-200">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 