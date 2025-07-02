'use client'
import React, { useState } from "react";

const mockContracts = [
  { id: 1, freelancer: "Laura Méndez", proyecto: "Landing corporativa", estado: "Pendiente de firma" },
  { id: 2, freelancer: "Pedro Torres", proyecto: "App móvil de ventas", estado: "Firmado" },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);

  const handleSign = (id: number) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, estado: "Firmado" } : c));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Contratos</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Freelancer</th>
            <th className="p-2 text-left">Proyecto</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id} className="border-t">
              <td className="p-2">{contract.freelancer}</td>
              <td className="p-2">{contract.proyecto}</td>
              <td className="p-2">{contract.estado}</td>
              <td className="p-2">
                {contract.estado === "Pendiente de firma" && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleSign(contract.id)}>
                    Firmar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 