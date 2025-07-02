"use client";
import React, { useState } from "react";
import { useSupport } from "@/context/SupportContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

const AdminSupportPage = () => {
  const { tickets, createTicket, addMessage, updateTicketStatus } = useSupport();
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
  const [formKey, setFormKey] = useState(0);

  // Actualiza prioridad/categoría localmente y en localStorage
  const handleUpdateTicketField = (field: string, value: string) => {
    if (!selectedTicket) return;
    const updatedTickets = tickets.map(t =>
      t.id === selectedTicket.id ? { ...t, [field]: value, updatedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
    setSelectedTicket({ ...selectedTicket, [field]: value });
  };

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
        setFormData({ subject: "", category: "technical", priority: "medium", description: "" });
        setFormKey(prev => prev + 1);
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
            Centro de Soporte (Admin)
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona y responde los tickets de todos los usuarios
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
          <form onSubmit={handleCreateTicket} className="space-y-4" key={formKey}>
            <div>
              <Label>Asunto</Label>
              <Input
                type="text"
                placeholder="Describe brevemente el problema"
                defaultValue={formData.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, subject: e.target.value})}
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
                placeholder="Proporciona todos los detalles relevantes sobre el problema..."
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

      {/* Lista de tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map(ticket => (
          <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
            <ComponentCard
              title={ticket.subject}
              className="cursor-pointer hover:shadow-lg"
            >
              <div className="mb-2 text-gray-700 dark:text-gray-300">{ticket.description?.slice(0, 60) || "Sin descripción"}</div>
              <div className="mb-2 text-sm text-gray-500">Usuario: {ticket.userName}</div>
              <div className="mb-2 text-sm text-gray-500">Categoría: {ticket.category}</div>
              <div className="mb-2 text-sm text-gray-500">Prioridad: {getPriorityBadge(ticket.priority)}</div>
              <div className="mb-2 text-sm text-gray-500">Estado: {getStatusBadge(ticket.status)}</div>
            </ComponentCard>
          </div>
        ))}
      </div>

      {/* Detalle del ticket seleccionado */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setSelectedTicket(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedTicket.subject}</h2>
            <div className="mb-2 text-gray-700 dark:text-gray-300">{selectedTicket.description}</div>
            <div className="mb-2 text-sm text-gray-500">Usuario: {selectedTicket.userName} ({selectedTicket.userEmail})</div>
            <div className="mb-2 text-sm text-gray-500">Categoría: {selectedTicket.category}</div>
            <div className="mb-2 text-sm text-gray-500">Prioridad: {getPriorityBadge(selectedTicket.priority)}</div>
            <div className="mb-2 text-sm text-gray-500">Estado: {getStatusBadge(selectedTicket.status)}</div>
            {/* Cambiar estado/prioridad/categoría */}
            <div className="flex gap-2 mb-4">
              <select
                value={selectedTicket.status}
                onChange={e => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="open">Abierto</option>
                <option value="in-progress">En progreso</option>
                <option value="waiting-response">Esperando respuesta</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
              <select
                value={selectedTicket.priority}
                onChange={e => handleUpdateTicketField('priority', e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
              <select
                value={selectedTicket.category}
                onChange={e => handleUpdateTicketField('category', e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="technical">Técnico</option>
                <option value="billing">Facturación</option>
                <option value="account">Cuenta</option>
                <option value="contract">Contratos</option>
                <option value="other">Otro</option>
              </select>
            </div>
            {/* Mensajes del ticket */}
            <div className="mb-4 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded p-4">
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                selectedTicket.messages.map((msg: any, idx: number) => (
                  <div key={idx} className="mb-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {msg.userName} {msg.isInternal ? "(interno)" : ""} - {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 rounded p-2 border border-gray-200 dark:border-gray-700">
                      {msg.message}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No hay mensajes aún.</div>
              )}
            </div>
            {/* Enviar mensaje */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text"
                placeholder="Escribe una respuesta..."
                defaultValue={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupportPage; 