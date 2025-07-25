"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
  read: boolean;
  createdAt: string;
}

const EmpresaNotificacionesPage = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filtrar notificaciones del usuario actual
    setFilteredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    let filtered = notifications;
    
    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== "all") {
      if (filter === "unread") {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = filtered.filter(n => n.type === filter);
      }
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filter]);

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job_application': return 'primary';
      case 'new_job_posted': return 'secondary';
      case 'application_status_changed': return 'success';
      case 'new_message': return 'warning';
      case 'company_message': return 'info';
      case 'professional_message': return 'info';
      case 'contract_signed': return 'success';
      case 'payment_received': return 'success';
      case 'payment_sent': return 'success';
      case 'project_completed': return 'success';
      case 'evaluation_received': return 'info';
      default: return 'light';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'job_application': return 'Aplicación';
      case 'new_job_posted': return 'Nueva Oferta';
      case 'application_status_changed': return 'Estado Cambiado';
      case 'new_message': return 'Mensaje';
      case 'company_message': return 'Mensaje Empresa';
      case 'professional_message': return 'Mensaje Profesional';
      case 'contract_signed': return 'Contrato Firmado';
      case 'payment_received': return 'Pago Recibido';
      case 'payment_sent': return 'Pago Enviado';
      case 'project_completed': return 'Proyecto Completado';
      case 'evaluation_received': return 'Evaluación';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_application': return '📝';
      case 'new_job_posted': return '💼';
      case 'application_status_changed': return '🔄';
      case 'new_message': return '💬';
      case 'company_message': return '💬';
      case 'professional_message': return '💬';
      case 'contract_signed': return '📋';
      case 'payment_received': return '💰';
      case 'payment_sent': return '💰';
      case 'project_completed': return '✅';
      case 'evaluation_received': return '⭐';
      default: return '🔔';
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Notificaciones" />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

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
                <option value="job_application">Aplicaciones</option>
                <option value="new_job_posted">Nuevas Ofertas</option>
                <option value="application_status_changed">Cambios de Estado</option>
                <option value="new_message">Mensajes</option>
                <option value="contract_signed">Contratos</option>
                <option value="payment_received">Pagos</option>
                <option value="project_completed">Proyectos</option>
                <option value="evaluation_received">Evaluaciones</option>
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
                  const notificationDate = new Date(n.createdAt).toDateString();
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
                  return new Date(n.createdAt) >= weekAgo;
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
                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </h3>
                          <Badge color={getTypeColor(notification.type)} size="sm">
                            {getTypeText(notification.type)}
                          </Badge>
                          {!notification.read && (
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
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs"
                              >
                                Marcar como leída
                              </Button>
                            )}
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