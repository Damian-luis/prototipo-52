"use client";
import React, { useState } from "react";
import { useSupport } from "@/context/SupportContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { showError, showSuccess } from '@/util/notifications';
import { CreateTicketData } from "@/services/support.service";

const FreelancerSupportPage = () => {
  const { tickets, createTicket, getTicketsByUser } = useSupport();
  const { user } = useAuth();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [formData, setFormData] = useState<CreateTicketData>({
    title: "",
    description: "",
    priority: "MEDIUM",
    projectName: ""
  });

  // Obtener tickets del usuario
  const userTickets = getTicketsByUser(user?.id || "");

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const result = await createTicket(formData);

      if (result.success) {
        showSuccess('Ticket creado exitosamente');
        setFormData({
          title: "",
          description: "",
          priority: "MEDIUM",
          projectName: ""
        });
        setShowNewTicket(false);
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Error al crear el ticket');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'Abierto' },
      IN_PROGRESS: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'En progreso' },
      PENDING: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-400', label: 'Pendiente' },
      CLOSED: { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400', label: 'Cerrado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOWEST: { color: 'text-gray-600', label: 'Mínima' },
      LOW: { color: 'text-blue-600', label: 'Baja' },
      MEDIUM: { color: 'text-yellow-600', label: 'Media' },
      HIGH: { color: 'text-orange-600', label: 'Alta' },
      HIGHEST: { color: 'text-red-600', label: 'Máxima' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
    
    return <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Centro de Soporte
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Obtén ayuda cuando la necesites
          </p>
        </div>
        <button
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
        >
          Nuevo Ticket
        </button>
      </div>

      {/* Formulario de nuevo ticket */}
      {showNewTicket && (
        <ComponentCard title="Crear Nuevo Ticket" className="mb-6">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                type="text"
                placeholder="Describe brevemente tu problema"
                defaultValue={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prioridad</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="LOWEST">Mínima</option>
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="HIGHEST">Máxima</option>
                </select>
              </div>
              <div>
                <Label>Proyecto (Opcional)</Label>
                <Input
                  type="text"
                  placeholder="Nombre del proyecto relacionado"
                  defaultValue={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <TextArea
                placeholder="Proporciona todos los detalles relevantes sobre tu problema..."
                rows={5}
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowNewTicket(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Enviar Ticket
              </button>
            </div>
          </form>
        </ComponentCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de tickets */}
        <div className="lg:col-span-1">
          <ComponentCard title="Mis Tickets">
            {userTickets.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No tienes tickets abiertos
              </p>
            ) : (
              <div className="space-y-3">
                {userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-300 dark:border-brand-700'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                        {ticket.title}
                      </h4>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    {ticket.key && (
                      <div className="text-xs text-gray-400 mt-1">
                        {ticket.key}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Detalle del ticket */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <ComponentCard title="Conversación">
              <div className="space-y-4">
                {/* Información del ticket */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedTicket.title}
                  </h3>
                  {selectedTicket.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {selectedTicket.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Estado:</span>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Prioridad:</span>
                      {getPriorityBadge(selectedTicket.priority)}
                    </div>
                  </div>
                  {selectedTicket.key && (
                    <div className="text-xs text-gray-400 mt-2">
                      Ticket: {selectedTicket.key}
                    </div>
                  )}
                </div>

                {/* Mensajes */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.userId === user?.id
                            ? 'bg-brand-50 dark:bg-brand-900/20 ml-8'
                            : 'bg-gray-50 dark:bg-gray-800 mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {message.user?.fullName || 'Usuario'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {message.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No hay mensajes en este ticket
                    </p>
                  )}
                </div>

                {/* Nota sobre mensajes */}
                {selectedTicket.status !== 'CLOSED' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      <strong>Nota:</strong> Los mensajes se pueden agregar desde el panel de administración. 
                      Si necesitas agregar información adicional, contacta al equipo de soporte.
                    </p>
                  </div>
                )}
              </div>
            </ComponentCard>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Selecciona un ticket para ver la conversación
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerSupportPage; 