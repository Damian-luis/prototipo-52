import React from "react";

const mockProcesses = [
  { id: 1, freelancer: "Laura Méndez", oferta: "Landing corporativa", estado: "Aprobado" },
  { id: 2, freelancer: "Pedro Torres", oferta: "App móvil de ventas", estado: "En prueba" },
];

export default function TalentTrackingPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Seguimiento de Procesos</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Freelancer</th>
            <th className="p-2 text-left">Oferta</th>
            <th className="p-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {mockProcesses.map(proc => (
            <tr key={proc.id} className="border-t">
              <td className="p-2">{proc.freelancer}</td>
              <td className="p-2">{proc.oferta}</td>
              <td className="p-2">{proc.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 