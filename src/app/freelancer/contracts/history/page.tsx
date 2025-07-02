"use client";
import React from "react";
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const ContractsHistoryPage = () => {
  const { contracts } = useContract();
  const { user } = useAuth();
  const myContracts = contracts.filter(c => c.freelancerId === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Contratos</h1>
      {myContracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes contratos finalizados aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myContracts.map(contract => (
            <ComponentCard key={contract.id} title={contract.title}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{contract.title}</div>
                  <div className="text-sm text-gray-500">Cliente: {contract.clientName}</div>
                  <div className="text-xs text-gray-400 mt-1">Inicio: {new Date(contract.startDate).toLocaleDateString()} | Fin: {new Date(contract.endDate).toLocaleDateString()}</div>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded font-medium ${
                    contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                    contract.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractsHistoryPage; 