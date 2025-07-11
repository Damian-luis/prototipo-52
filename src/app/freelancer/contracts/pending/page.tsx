"use client";
import React, { useState } from "react";
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { ethers } from "ethers";

const PendingContractsPage = () => {
  const { contracts, signContract } = useContract();
  const { user } = useAuth();
  const { isConnected, account, connectWallet } = useWeb3();
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  console.log("ABAJO")
  console.log(JSON.stringify(contracts,null,2))
  const pendingContracts = contracts.filter(c => c.freelancerId === user?.id && c.status === 'pending');
  const handleSignContract = async (contract: any) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!user) {
      alert('No hay usuario autenticado');
      return;
    }
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('No se detectó wallet/metamask');
      return;
    }
    setIsSigning(true);
    try {
      // Generar hash del contrato (puede ser el JSON.stringify)
      const contractHash = ethers.id(JSON.stringify({
        id: contract.id,
        title: contract.title,
        freelancerId: contract.freelancerId,
        clientId: contract.clientId,
        value: contract.value,
        currency: contract.currency,
        startDate: contract.startDate,
        endDate: contract.endDate,
        terms: contract.terms,
        deliverables: contract.deliverables
      }));
      // Firmar el hash con la wallet conectada
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [contractHash, account],
      });
      // Por ahora, pasa la firma como parte del nombre para testear
      const result = await signContract(
        contract.id,
        user.id,
        user.name,
        'freelancer',
        {
          wallet: account!,
          signature,
          contractHash,
        }
      );
      if (result.success) {
        alert("¡Contrato firmado exitosamente!");
        setIsModalOpen(false);
        setSelectedContract(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al firmar contrato:", error);
      alert("Error al firmar el contrato");
    } finally {
      setIsSigning(false);
    }
  };

  const openSignModal = (contract: any) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Contratos Pendientes de Firma</h1>
      
      {/* Aviso de conexión Web3 */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Para firmar contratos, necesitas conectar tu wallet primero.
          </p>
        </div>
      )}

      {pendingContracts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes contratos pendientes de firma.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingContracts.map(contract => (
            <ComponentCard key={contract.id} title={contract.title}>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cliente</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{contract.clientName}</div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Valor del contrato</div>
                        <div className="font-medium">${contract.value.toLocaleString()} {contract.currency}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Duración</div>
                        <div className="font-medium">
                          {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Descripción</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{contract.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                      Pendiente de firma
                    </span>
                    
                    {/* Estado de firmas */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      Firmas: {contract.signatures.length}/2
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => openSignModal(contract)}
                    className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
                  >
                    Revisar y Firmar
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}

      {/* Modal de firma */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-2xl">
        {selectedContract && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Revisar y Firmar Contrato</h2>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedContract.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Cliente:</span> {selectedContract.clientName}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Valor:</span> ${selectedContract.value.toLocaleString()} {selectedContract.currency}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Inicio:</span> {new Date(selectedContract.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Fin:</span> {new Date(selectedContract.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Términos y Condiciones</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedContract.terms}</p>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Entregables</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                  {selectedContract.deliverables.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Información de Web3 */}
              {isConnected && account && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Información de Firma Digital</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Wallet conectada: {account!.slice(0, 6)}...{account!.slice(-4)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Al firmar, se registrará esta dirección como tu firma digital en el contrato.
                  </p>
                  {/* Mostrar la firma si ya existe */}
                  {selectedContract.signatures && selectedContract.signatures.some((s: any) => s.userId === user?.id && s.wallet) && (
                    <div className="mt-2 text-xs text-blue-700 dark:text-blue-300 break-all">
                      <b>Tu firma:</b> {selectedContract.signatures.find((s: any) => s.userId === user?.id)?.signature}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSignContract(selectedContract)}
                disabled={isSigning || !isConnected}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {isSigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Firmando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{isConnected ? 'Firmar Contrato' : 'Conectar Wallet'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PendingContractsPage; 