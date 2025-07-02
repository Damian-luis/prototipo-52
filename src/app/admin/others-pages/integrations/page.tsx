'use client'
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

const mockIntegrations = [
  { id: 1, nombre: "Upwork", conectado: true },
  { id: 2, nombre: "Fiverr", conectado: false },
  { id: 3, nombre: "LinkedIn", conectado: true },
  { id: 4, nombre: "ERP Empresarial", conectado: false },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [pendingIntegration, setPendingIntegration] = useState<{ id: number; action: 'connect' | 'disconnect'; nombre: string } | null>(null);

  const handleRequest = (id: number, action: 'connect' | 'disconnect', nombre: string) => {
    setPendingIntegration({ id, action, nombre });
  };

  const confirmAction = () => {
    if (!pendingIntegration) return;
    setIntegrations(integrations.map(i => i.id === pendingIntegration.id ? { ...i, conectado: pendingIntegration.action === 'connect' } : i));
    setPendingIntegration(null);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Integraciones</h1>
      <ul>
        {integrations.map(integration => (
          <li key={integration.id} className="mb-4 p-4 border rounded flex items-center justify-between">
            <span>{integration.nombre}</span>
            <button
              className={`px-4 py-2 rounded ${integration.conectado ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
              onClick={() => handleRequest(integration.id, integration.conectado ? 'disconnect' : 'connect', integration.nombre)}
            >
              {integration.conectado ? 'Desconectar' : 'Conectar'}
            </button>
          </li>
        ))}
      </ul>
      <Modal isOpen={!!pendingIntegration} onClose={() => setPendingIntegration(null)} className="max-w-md p-6">
        {pendingIntegration && (
          <div>
            <h2 className="text-xl font-bold mb-4">{pendingIntegration.action === 'connect' ? 'Conectar' : 'Desconectar'} integración</h2>
            <p className="mb-6">¿Estás seguro que deseas {pendingIntegration.action === 'connect' ? 'conectar' : 'desconectar'} <span className="font-semibold">{pendingIntegration.nombre}</span>?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setPendingIntegration(null)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Cancelar</button>
              <button onClick={confirmAction} className={`px-4 py-2 rounded text-white ${pendingIntegration.action === 'connect' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}>Confirmar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 