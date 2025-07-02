"use client";
import React from "react";
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const PendingContractsPage = () => {
  const { contracts } = useContract();
  const { user } = useAuth();
  const pendingContracts = contracts.filter(c => c.freelancerId === user?.id && c.status === 'pending');

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Contratos Pendientes de Firma</h1>
      {pendingContracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes contratos pendientes de firma.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingContracts.map(contract => (
            <ComponentCard key={contract.id} title={contract.title}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{contract.title}</div>
                  <div className="text-sm text-gray-500">Cliente: {contract.clientName}</div>
                  <div className="text-xs text-gray-400 mt-1">Inicio: {new Date(contract.startDate).toLocaleDateString()}</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                </div>
              </div>
              <div className="mt-2">
                <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">Firmar Contrato</button>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingContractsPage; 