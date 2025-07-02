'use client'
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

const mockContracts = [
  { id: 1, freelancer: "Laura Méndez", proyecto: "Landing corporativa", estado: "Pendiente de firma" },
  { id: 2, freelancer: "Pedro Torres", proyecto: "App móvil de ventas", estado: "Firmado" },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (contract: any) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const handleSign = (id: number) => {
    setContracts(contracts.map(c => c.id === id ? { ...c, estado: "Firmado" } : c));
    handleCloseModal();
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
                  <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleOpenModal(contract)}>
                    Firmar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} className="max-w-md p-6">
        {selectedContract && (
          <div>
            <h2 className="text-xl font-bold mb-4">Confirmar Firma de Contrato</h2>
            <div className="mb-2"><span className="font-semibold">Freelancer:</span> {selectedContract.freelancer}</div>
            <div className="mb-2"><span className="font-semibold">Proyecto:</span> {selectedContract.proyecto}</div>
            <div className="mb-2"><span className="font-semibold">Estado:</span> {selectedContract.estado}</div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={handleCloseModal}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => handleSign(selectedContract.id)}>Confirmar firma</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 