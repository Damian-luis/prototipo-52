"use client";
import React, { useState } from "react";
import { useSupport } from "@/context/SupportContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

const FreelancerSupportPage = () => {
  const { tickets, createTicket, addMessage, getTicketsByUser } = useSupport();
  const { user } = useAuth();
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "technical" as const,
    priority: "medium" as const,
    description: ""
  });

  // Obtener tickets del usuario
  const userTickets = getTicketsByUser(user?.id || "");

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const result = await createTicket({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      });

      if (result.success) {
        alert("Ticket creado exitosamente");
        setFormData({
          subject: "",
          category: "technical",
          priority: "medium",
          description: ""
        });
        setShowNewTicket(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al crear el ticket");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedTicket || !newMessage.trim()) return;

    try {
      const result = await addMessage(selectedTicket.id, {
        userId: user.id,
        userName: user.name,
        message: newMessage,
        isInternal: false
      });

      if (result.success) {
        setNewMessage("");
        // Actualizar el ticket seleccionado
        const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
        setSelectedTicket(updatedTicket);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al enviar el mensaje");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-800 dark:text-blue-400', label: 'Abierto' },
      'in-progress': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-400', label: 'En progreso' },
      'waiting-response': { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-400', label: 'Esperando respuesta' },
      resolved: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-800 dark:text-green-400', label: 'Resuelto' },
      closed: { bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-400', label: 'Cerrado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'text-gray-600', label: 'Baja' },
      medium: { color: 'text-yellow-600', label: 'Media' },
      high: { color: 'text-orange-600', label: 'Alta' },
      urgent: { color: 'text-red-600', label: 'Urgente' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    
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
              <Label>Asunto</Label>
              <Input
                type="text"
                placeholder="Describe brevemente tu problema"
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Categoría</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="technical">Técnico</option>
                  <option value="billing">Facturación</option>
                  <option value="account">Cuenta</option>
                  <option value="contract">Contratos</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <Label>Prioridad</Label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <TextArea
                placeholder="Proporciona todos los detalles relevantes sobre tu problema..."
                rows={5}
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
                        {ticket.subject}
                      </h4>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {getPriorityBadge(ticket.priority)}
                    </div>
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
                    {selectedTicket.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {selectedTicket.description}
                  </p>
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
                </div>

                {/* Mensajes */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((message: any) => (
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
                          {message.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formulario de respuesta */}
                {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                  <form onSubmit={handleSendMessage} className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <TextArea
                      placeholder="Escribe tu mensaje..."
                      rows={3}
                      onChange={(value) => setNewMessage(value)}
                    />
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                      >
                        Enviar mensaje
                      </button>
                    </div>
                  </form>
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