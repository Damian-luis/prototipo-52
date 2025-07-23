'use client'
import React, { useState, useEffect } from 'react';
import { useSupport } from '@/context/SupportContext';
import { useAuth } from '@/context/AuthContext';

export default function SupportPage() {
  const { tickets, updateTicketStatus, loading } = useSupport();
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  const handleStatusUpdate = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      const result = await updateTicketStatus(selectedTicket, newStatus as any);
      if (result.success) {
        setSelectedTicket(null);
        setNewStatus('');
        alert('Estado actualizado exitosamente');
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Panel de Soporte
      </h1>

      <div className="grid gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Por: {ticket.user_name} ({ticket.user_email})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Categoría: {ticket.category} | Prioridad: {ticket.priority}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  ticket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {ticket.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Creado: {new Date(ticket.created_at).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedTicket === ticket.id ? newStatus : ticket.status}
                  onChange={(e) => {
                    setSelectedTicket(ticket.id);
                    setNewStatus(e.target.value);
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="open">Abierto</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="waiting-response">Esperando Respuesta</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
                
                {selectedTicket === ticket.id && newStatus !== ticket.status && (
                  <button
                    onClick={handleStatusUpdate}
                    className="px-3 py-1 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600"
                  >
                    Actualizar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay tickets de soporte pendientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 