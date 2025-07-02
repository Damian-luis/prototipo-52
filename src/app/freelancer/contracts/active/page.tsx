"use client";
import React, { useState } from "react";
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";

const ActiveContractsPage = () => {
  const { contracts, updateMilestoneStatus } = useContract();
  const { user } = useAuth();
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  // Filtrar contratos activos del freelancer
  const activeContracts = contracts.filter(
    c => c.freelancerId === user?.id && c.status === 'active'
  );

  const handleMilestoneUpdate = async (
    contractId: string,
    milestoneId: string,
    newStatus: 'pending' | 'in-progress' | 'completed' | 'approved'
  ) => {
    try {
      const result = await updateMilestoneStatus(contractId, milestoneId, newStatus);
      if (result.success) {
        alert("Estado del hito actualizado exitosamente");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al actualizar el hito");
    }
  };

  const calculateProgress = (contract: any) => {
    if (!contract.milestones || contract.milestones.length === 0) return 0;
    const completed = contract.milestones.filter((m: any) => m.status === 'completed' || m.status === 'approved').length;
    return Math.round((completed / contract.milestones.length) * 100);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Contratos Activos
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gestiona tus proyectos en curso
        </p>
      </div>

      {activeContracts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No tienes contratos activos en este momento
          </p>
          <Link
            href="/freelancer/jobs/search"
            className="text-brand-500 hover:text-brand-600"
          >
            Buscar nuevos trabajos →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeContracts.map((contract) => (
            <ComponentCard key={contract.id} title={contract.title}>
              <div className="space-y-4">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="font-medium text-gray-900 dark:text-white">{contract.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor del contrato</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${contract.value.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de inicio</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de fin</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(contract.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Progreso general */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progreso general
                    </p>
                    <span className="text-sm text-gray-500">
                      {calculateProgress(contract)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-brand-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(contract)}%` }}
                    />
                  </div>
                </div>

                {/* Hash del contrato */}
                {contract.blockchainHash && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hash Blockchain</p>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                      {contract.blockchainHash}
                    </p>
                  </div>
                )}

                {/* Botón para expandir/contraer hitos */}
                {contract.milestones && contract.milestones.length > 0 && (
                  <button
                    onClick={() => setExpandedContract(
                      expandedContract === contract.id ? null : contract.id
                    )}
                    className="w-full text-left text-sm text-brand-500 hover:text-brand-600"
                  >
                    {expandedContract === contract.id ? "Ocultar" : "Ver"} hitos del proyecto
                    {expandedContract === contract.id ? " ↑" : " ↓"}
                  </button>
                )}

                {/* Lista de hitos */}
                {expandedContract === contract.id && contract.milestones && (
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Hitos del proyecto
                    </h4>
                    {contract.milestones.map((milestone: any) => (
                      <div
                        key={milestone.id}
                        className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {milestone.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {milestone.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-500">
                                Valor: ${milestone.amount.toLocaleString()}
                              </span>
                              <span className="text-gray-500">
                                Vence: {new Date(milestone.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <select
                              value={milestone.status}
                              onChange={(e) => handleMilestoneUpdate(
                                contract.id,
                                milestone.id,
                                e.target.value as 'pending' | 'in-progress' | 'completed' | 'approved'
                              )}
                              className={`px-3 py-1 text-xs rounded-full ${
                                milestone.status === 'completed' || milestone.status === 'approved'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : milestone.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                              }`}
                              disabled={milestone.status === 'approved'}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="in-progress">En progreso</option>
                              <option value="completed">Completado</option>
                              {milestone.status === 'approved' && (
                                <option value="approved">Aprobado</option>
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/freelancer/contracts/${contract.id}`}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Ver detalles completos
                  </Link>
                  <button className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600">
                    Descargar contrato
                  </button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveContractsPage; 