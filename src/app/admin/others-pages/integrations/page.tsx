'use client'
import React, { useState } from "react";

const mockIntegrations = [
  { id: 1, nombre: "Upwork", conectado: true },
  { id: 2, nombre: "Fiverr", conectado: false },
  { id: 3, nombre: "LinkedIn", conectado: true },
  { id: 4, nombre: "ERP Empresarial", conectado: false },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, conectado: !i.conectado } : i));
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
              onClick={() => toggleIntegration(integration.id)}
            >
              {integration.conectado ? 'Desconectar' : 'Conectar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 