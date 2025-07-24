"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/context/NotificationContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Notification } from "@/types";

const EmpresaNotificacionesPage = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filtrar notificaciones del usuario actual
    const userNotifications = notifications.filter(n => n.user_id === user?.id);
    setFilteredNotifications(userNotifications);
  }, [notifications, user]);

  useEffect(() => {
    let filtered = notifications.filter(n => n.user_id === user?.id);
    
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== "all") {
      if (filter === "unread") {
        filtered = filtered.filter(n => !n.is_read);
      } else {
        filtered = filtered.filter(n => n.type === filter);
      }
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, user, searchTerm, filter]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    // deleteNotification(notificationId); // This function does not exist in useNotification
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'primary';
      case 'contract': return 'secondary';
      case 'payment': return 'success';
      case 'task': return 'warning';
      case 'consultation': return 'info';
      case 'system': return 'light';
      default: return 'light';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'project': return 'Proyecto';
      case 'contract': return 'Contrato';
      case 'payment': return 'Pago';
      case 'task': return 'Tarea';
      case 'consultation': return 'Asesoría';
      case 'system': return 'Sistema';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project': return '📋';
      case 'contract': return '📄';
      case 'payment': return '💰';
      case 'task': return '✅';
      case 'consultation': return '💬';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.is_read).length;

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Notificaciones" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros y acciones */}
        <ComponentCard title="Gestión de Notificaciones">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white max-w-xs"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todas las notificaciones</option>
                <option value="unread">No leídas</option>
                <option value="project">Proyectos</option>
                <option value="contract">Contratos</option>
                <option value="payment">Pagos</option>
                <option value="task">Tareas</option>
                <option value="consultation">Asesorías</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                >
                  Marcar todas como leídas
                </Button>
              )}
            </div>
          </div>
        </ComponentCard>

        {/* Resumen de notificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {filteredNotifications.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notificaciones
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="No Leídas">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {unreadCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sin leer
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Hoy">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {filteredNotifications.filter(n => {
                  const today = new Date().toDateString();
                  const notificationDate = new Date(n.created_at).toDateString();
                  return today === notificationDate;
                }).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                De hoy
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Esta Semana">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {filteredNotifications.filter(n => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(n.created_at) >= weekAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Últimos 7 días
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <ComponentCard title="Sin Notificaciones">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron notificaciones. {searchTerm || filter !== "all" ? "Intenta ajustar los filtros." : "No tienes notificaciones pendientes."}
                </p>
              </div>
            </ComponentCard>
          ) : (
            filteredNotifications.map((notification) => (
              <ComponentCard key={notification.id} title={notification.title}>
                <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                  !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            !notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge color={getTypeColor(notification.type)} size="sm">
                            {getTypeText(notification.type)}
                          </Badge>
                          {!notification.is_read && (
                            <Badge color="warning" size="sm">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          
                          <div className="flex gap-2">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs"
                              >
                                Marcar como leída
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            ))
          )}
        </div>

        {/* Paginación */}
        {filteredNotifications.length > 10 && (
          <ComponentCard title="Paginación">
            <div className="flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
                <Button variant="primary" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default EmpresaNotificacionesPage; 