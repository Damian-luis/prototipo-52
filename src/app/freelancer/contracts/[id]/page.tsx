"use client";
import React from "react";
import { useContract } from "@/context/ContractContext";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";

const ContractDetailPage = () => {
  const { id } = useParams();
  const { contracts } = useContract();
  const contract = contracts.find(c => c.id === id);

  if (!contract) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Contrato no encontrado</h1>
        <p className="text-gray-500 dark:text-gray-400">El contrato solicitado no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{contract.title}</h1>
      <ComponentCard title="Detalles del Contrato">
        <div className="mb-2 text-gray-700 dark:text-gray-300">{contract.description}</div>
        <div className="mb-2 text-sm text-gray-500">Cliente: {contract.clientName}</div>
        <div className="mb-2 text-sm text-gray-500">Valor: ${contract.value} {contract.currency}</div>
        <div className="mb-2 text-sm text-gray-500">Inicio: {new Date(contract.startDate).toLocaleDateString()} | Fin: {new Date(contract.endDate).toLocaleDateString()}</div>
        <div className="mb-2 text-sm text-gray-500">Estado: {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}</div>
        <div className="mb-2 text-sm text-gray-500">Términos: {contract.terms}</div>
        <div className="mb-2 text-sm text-gray-500">Entregables:</div>
        <ul className="list-disc ml-6 text-sm text-gray-700 dark:text-gray-300">
          {contract.deliverables.map((d, idx) => <li key={idx}>{d}</li>)}
        </ul>
        {contract.blockchainHash && (
          <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="text-xs text-gray-500">Hash Blockchain:</span>
            <div className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{contract.blockchainHash}</div>
          </div>
        )}
      </ComponentCard>
      {contract.milestones && contract.milestones.length > 0 && (
        <ComponentCard title="Hitos del Proyecto" className="mt-6">
          <ul className="space-y-2">
            {contract.milestones.map(milestone => (
              <li key={milestone.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{milestone.name}</div>
                  <div className="text-sm text-gray-500">{milestone.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Valor: ${milestone.amount} | Vence: {new Date(milestone.dueDate).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-1 rounded font-medium ${
                  milestone.status === 'completed' || milestone.status === 'approved' ? 'bg-green-100 text-green-800' :
                  milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </ComponentCard>
      )}
    </div>
  );
};

export default ContractDetailPage; 