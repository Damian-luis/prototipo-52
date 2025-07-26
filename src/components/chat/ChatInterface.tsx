"use client";

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { MessageSquare, Search, MoreVertical, Phone, Video, X } from 'lucide-react';
import Button from '@/components/ui/button/Button';
import Avatar from '@/components/ui/avatar/Avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatInterfaceProps {
  onClose?: () => void;
  isModal?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose, isModal = false }) => {
  const { user } = useAuth();
  const { 
    rooms, 
    activeRoom, 
    setActiveRoom, 
    getRoomMessages, 
    markAsRead,
    loadRooms,
    isLoading 
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showRooms, setShowRooms] = useState(true);

  // Cargar salas al montar el componente
  useEffect(() => {
    console.log('ChatInterface mounted, loading rooms...');
    loadRooms();
  }, [loadRooms]);

  // Filtrar salas por búsqueda
  const filteredRooms = rooms.filter(room => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const participantNames = room.participantNames || [];
    
    return participantNames.some((name: string) => 
      name.toLowerCase().includes(searchLower)
    ) || room.name?.toLowerCase().includes(searchLower);
  });

  const handleRoomSelect = async (room: any) => {
    setActiveRoom(room);
    await getRoomMessages(room.id);
    await markAsRead(room.id);
    
    // En móvil, cerrar la lista de salas
    if (window.innerWidth < 768) {
      setShowRooms(false);
    }
  };

  const getLastMessagePreview = (room: any) => {
    if (!room.lastMessage) return 'Sin mensajes';
    
    const content = room.lastMessage.content;
    return content.length > 30 ? `${content.substring(0, 30)}...` : content;
  };

  const getLastMessageTime = (room: any) => {
    if (!room.lastMessage) return '';
    
    const date = new Date(room.lastMessage.timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return format(date, 'dd/MM');
    }
  };

  const getOtherParticipant = (room: any) => {
    if (!user || !room.participants || !Array.isArray(room.participants)) return null;
    
    const otherParticipantIndex = room.participants.findIndex((p: string) => p !== user.id);
    if (otherParticipantIndex === -1) return null;
    
    // Verificar que los arrays existan y tengan el índice válido
    const participantNames = room.participantNames || [];
    const participantAvatars = room.participantAvatars || [];
    
    // Verificar que el índice existe en los arrays
    const hasValidIndex = otherParticipantIndex >= 0 && 
                         otherParticipantIndex < participantNames.length &&
                         otherParticipantIndex < participantAvatars.length;
    
    return {
      id: room.participants[otherParticipantIndex],
      name: hasValidIndex ? participantNames[otherParticipantIndex] : 'Usuario',
      avatar: hasValidIndex ? participantAvatars[otherParticipantIndex] : null
    };
  };

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[700px] flex">
          <ChatInterfaceContent 
            filteredRooms={filteredRooms}
            activeRoom={activeRoom}
            onRoomSelect={handleRoomSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showRooms={showRooms}
            setShowRooms={setShowRooms}
            onClose={onClose}
            getLastMessagePreview={getLastMessagePreview}
            getLastMessageTime={getLastMessageTime}
            getOtherParticipant={getOtherParticipant}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-[600px] flex">
      <ChatInterfaceContent 
        filteredRooms={filteredRooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showRooms={showRooms}
        setShowRooms={setShowRooms}
        onClose={onClose}
        getLastMessagePreview={getLastMessagePreview}
        getLastMessageTime={getLastMessageTime}
        getOtherParticipant={getOtherParticipant}
        isLoading={isLoading}
      />
    </div>
  );
};

interface ChatInterfaceContentProps {
  filteredRooms: any[];
  activeRoom: any;
  onRoomSelect: (room: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showRooms: boolean;
  setShowRooms: (show: boolean) => void;
  onClose?: () => void;
  getLastMessagePreview: (room: any) => string;
  getLastMessageTime: (room: any) => string;
  getOtherParticipant: (room: any) => any;
  isLoading: boolean;
}

const ChatInterfaceContent: React.FC<ChatInterfaceContentProps> = ({
  filteredRooms,
  activeRoom,
  onRoomSelect,
  searchTerm,
  setSearchTerm,
  showRooms,
  setShowRooms,
  onClose,
  getLastMessagePreview,
  getLastMessageTime,
  getOtherParticipant,
  isLoading
}) => {
  return (
    <>
      {/* Lista de conversaciones */}
      <div className={`${showRooms ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversaciones
            </h2>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Lista de salas */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">Cargando conversaciones...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay conversaciones</p>
              <p className="text-sm text-gray-400">Inicia una conversación para comenzar</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRooms.map((room) => {
                const otherParticipant = getOtherParticipant(room);
                const isActive = activeRoom?.id === room.id;
                
                return (
                  <div
                    key={room.id}
                    onClick={() => onRoomSelect(room)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar
                        src={otherParticipant?.avatar}
                        fallbackText={otherParticipant?.name || 'Usuario'}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {otherParticipant?.name || room.name || 'Conversación'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {getLastMessageTime(room)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {getLastMessagePreview(room)}
                        </p>
                        {room.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">
                              {room.unreadCount} mensaje{room.unreadCount !== 1 ? 's' : ''} sin leer
                            </span>
                            <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {room.unreadCount > 9 ? '9+' : room.unreadCount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setShowRooms(!showRooms)}
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                
                {(() => {
                  const otherParticipant = getOtherParticipant(activeRoom);
                  return (
                    <>
                      <Avatar
                        src={otherParticipant?.avatar}
                        fallbackText={otherParticipant?.name || 'Usuario'}
                        size="md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {otherParticipant?.name || activeRoom.name || 'Conversación'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {activeRoom.participants.length === 2 ? 'Chat privado' : 'Grupo'}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1">
              <ChatMessages roomId={activeRoom.id} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <ChatInput roomId={activeRoom.id} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Selecciona una conversación
              </h3>
              <p className="text-gray-500">
                Elige una conversación de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInterface; 