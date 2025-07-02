'use client'
import React, { useState } from "react";

const mockTickets = [
  { id: 1, asunto: "No puedo acceder a mi cuenta", estado: "Abierto" },
  { id: 2, asunto: "Error en el pago", estado: "En proceso" },
];

export default function SupportPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [nuevoAsunto, setNuevoAsunto] = useState("");

  const handleAddTicket = () => {
    if (nuevoAsunto.trim()) {
      setTickets([...tickets, { id: tickets.length + 1, asunto: nuevoAsunto, estado: "Abierto" }]);
      setNuevoAsunto("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Soporte Técnico</h1>
      <ul className="mb-6">
        {tickets.map(ticket => (
          <li key={ticket.id} className="mb-2 p-3 border rounded flex justify-between items-center">
            <span>{ticket.asunto}</span>
            <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">{ticket.estado}</span>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Nuevo asunto..."
          value={nuevoAsunto}
          onChange={e => setNuevoAsunto(e.target.value)}
        />
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddTicket}>
          Crear Ticket
        </button>
      </div>
    </div>
  );
} 