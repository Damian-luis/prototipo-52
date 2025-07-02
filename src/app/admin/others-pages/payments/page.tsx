'use client'
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

const mockPayments = [
  { id: 1, freelancer: "Laura Méndez", monto: "$1,200", fecha: "2024-06-10", estado: "Pendiente" },
  { id: 2, freelancer: "Pedro Torres", monto: "$900", fecha: "2024-06-08", estado: "Pagado" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handlePay = (id: number) => {
    setPayments(payments.map(p => p.id === id ? { ...p, estado: "Pagado" } : p));
    handleCloseModal();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Pagos</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2 text-left">Freelancer</th>
            <th className="p-2 text-left">Monto</th>
            <th className="p-2 text-left">Fecha</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id} className="border-t">
              <td className="p-2">{payment.freelancer}</td>
              <td className="p-2">{payment.monto}</td>
              <td className="p-2">{payment.fecha}</td>
              <td className="p-2">{payment.estado}</td>
              <td className="p-2">
                {payment.estado === "Pendiente" && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleOpenModal(payment)}>
                    Marcar como pagado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-md p-6">
        {selectedPayment && (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirmar Pago</h2>
            <div className="mb-2"><span className="font-semibold">Freelancer:</span> {selectedPayment.freelancer}</div>
            <div className="mb-2"><span className="font-semibold">Monto:</span> {selectedPayment.monto}</div>
            <div className="mb-2"><span className="font-semibold">Fecha:</span> {selectedPayment.fecha}</div>
            <div className="mb-2"><span className="font-semibold">Estado:</span> {selectedPayment.estado}</div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={handleCloseModal}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => handlePay(selectedPayment.id)}>Confirmar pago</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 