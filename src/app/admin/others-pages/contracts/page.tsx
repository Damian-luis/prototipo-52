'use client'
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import PaymentModal from "@/components/payments/PaymentModal";
import Link from "next/link";
import jsPDF from "jspdf";
import { ethers } from "ethers";

export default function ContractsPage() {
  const { contracts, signContract, createContract } = useContract();
  const { user, users } = useAuth();
  const { isConnected, account, connectWallet } = useWeb3();
  
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  
  // Formulario para nuevo contrato
  const [newContract, setNewContract] = useState({
    title: '',
    description: '',
    freelancerId: '',
    freelancerName: '',
    clientName: 'Empresa ABC',
    value: 0,
    currency: 'USD',
    paymentTerms: 'milestone' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: '',
    deliverables: ['']
  });

  // Filtrar freelancers
  const freelancers = users.filter(u => u.role === 'freelancer');
  const handleOpenSignModal = (contract: any) => {
    setSelectedContract(contract);
    setIsSignModalOpen(true);
  };

  const handleOpenPaymentModal = (contract: any) => {
    setSelectedContract(contract);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsSignModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedContract(null);
  };

  const handleSign = async (contract: any) => {
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
      // Guardar la firma y la dirección en el contrato
      const result = await signContract(
        contract.id,
        user.id,
        user.name,
        'client',
        {
          wallet: account!,
          signature,
          contractHash,
        }
      );
      if (result.success) {
        alert("¡Contrato firmado exitosamente!");
        handleCloseModals();
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

  const handleCreateContract = async () => {
    try {
      const result = await createContract({
        ...newContract,
        clientId: user?.id || '1',
        clientName: user?.name || 'Empresa ABC',
        deliverables: newContract.deliverables.filter(d => d.trim() !== '')
      });

      if (result.success) {
        alert("¡Contrato creado exitosamente!");
        setIsCreateModalOpen(false);
        // Resetear formulario
        setNewContract({
          title: '',
          description: '',
          freelancerId: '',
          freelancerName: '',
          clientName: 'Empresa ABC',
          value: 0,
          currency: 'USD',
          paymentTerms: 'milestone',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          terms: '',
          deliverables: ['']
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al crear contrato:", error);
      alert("Error al crear el contrato");
    }
  };

  const handlePaymentSuccess = (txHash: string) => {
    console.log("Pago exitoso:", txHash);
    alert(`¡Pago realizado exitosamente! Hash: ${txHash}`);
  };

  const handleDownloadPDF = (contract: any) => {
    if (!contract) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(contract.title, 10, 15);
    doc.setFontSize(12);
    doc.text(`Freelancer: ${contract.freelancerName}`, 10, 30);
    doc.text(`Cliente: ${contract.clientName}`, 10, 40);
    doc.text(`Valor: $${contract.value.toLocaleString()} ${contract.currency}`, 10, 50);
    doc.text(`Inicio: ${new Date(contract.startDate).toLocaleDateString()}`, 10, 60);
    doc.text(`Fin: ${new Date(contract.endDate).toLocaleDateString()}`, 10, 70);
    doc.text(`Estado: ${contract.status}`, 10, 80);
    doc.text("Términos:", 10, 90);
    doc.text(contract.terms || "", 10, 100, { maxWidth: 180 });
    doc.save(`Contrato_${contract.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Contratos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra contratos con freelancers
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
        >
          Crear Nuevo Contrato
        </button>
      </div>

      {/* Aviso de conexión Web3 */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Para firmar contratos y realizar pagos, necesitas conectar tu wallet primero.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contrato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Freelancer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Firmas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Blockchain
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {contracts.map(contract => (
              <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {contract.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {contract.freelancerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  ${contract.value.toLocaleString()} {contract.currency}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    contract.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    contract.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {contract.status === 'active' ? 'Activo' :
                     contract.status === 'pending' ? 'Pendiente' :
                     contract.status === 'draft' ? 'Borrador' :
                     'Completado'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{contract.signatures.length}/2</span>
                    {contract.signatures.length > 0 && (
                      <div className="flex -space-x-2">
                        {contract.signatures.map((sig, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-white"
                            title={`${sig.userName} (${sig.role})`}
                          >
                            {sig.userName.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {contract.blockchainHash ? (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contract.blockchainHash.slice(0, 8)}...
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      No registrado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/others-pages/contracts/${contract.id}`}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDownloadPDF(contract)}
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                      title="Descargar PDF"
                      type="button"
                    >
                      Descargar
                    </button>
                    {contract.status === 'pending' && (
                      <button 
                        onClick={() => handleOpenSignModal(contract)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Firmar
                      </button>
                    )}
                    {contract.status === 'active' && (
                      <button 
                        onClick={() => handleOpenPaymentModal(contract)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Pagar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de firma */}
      <Modal isOpen={isSignModalOpen} onClose={handleCloseModals} className="max-w-lg">
        {selectedContract && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Confirmar Firma de Contrato</h2>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Contrato:</span>
                <p className="font-semibold">{selectedContract.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Freelancer:</span>
                <p className="font-medium">{selectedContract.freelancerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Valor:</span>
                <p className="font-medium">${selectedContract.value.toLocaleString()} {selectedContract.currency}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Firmas actuales:</span>
                <p className="font-medium">{selectedContract.signatures.length}/2</p>
              </div>
            </div>

            {/* Información de Web3 */}
            {isConnected && account && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Información de Firma Digital</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Wallet conectada: {account!.slice(0, 6)}...{account!.slice(-4)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Al firmar, se registrará esta dirección como firma digital del cliente.
                </p>
                {/* Mostrar la firma si ya existe */}
                {selectedContract.signatures && selectedContract.signatures.some((s: any) => s.userId === user?.id && s.wallet) && (
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-300 break-all">
                    <b>Tu firma:</b> {selectedContract.signatures.find((s: any) => s.userId === user?.id)?.signature}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" 
                onClick={handleCloseModals}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2" 
                onClick={() => handleSign(selectedContract)}
                disabled={isSigning || !isConnected}
              >
                {isSigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Firmando...</span>
                  </>
                ) : (
                  <span>{isConnected ? 'Confirmar Firma' : 'Conectar Wallet'}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de pago */}
      {selectedContract && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleCloseModals}
          contractId={selectedContract.id}
          contractTitle={selectedContract.title}
          amount={selectedContract.value}
          currency={selectedContract.currency}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Modal de crear contrato */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModals} className="max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <h2 className="text-2xl font-bold mb-4 sm:mb-6">Crear Nuevo Contrato</h2>
          <form onSubmit={e => { e.preventDefault(); handleCreateContract(); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título del Contrato</label>
                <input type="text" value={newContract.title} onChange={e => setNewContract({ ...newContract, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Ej: Desarrollo de Aplicación Web" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea value={newContract.description} onChange={e => setNewContract({ ...newContract, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" rows={3} placeholder="Describe el proyecto..." />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seleccionar Freelancer</label>
                <select value={newContract.freelancerId} onChange={e => {
                  const selected = freelancers.find((f: any) => (f._id || f.id) === e.target.value);
                  setNewContract({ ...newContract, freelancerId: (selected as any)?._id || (selected as any)?.id || '', freelancerName: `${(selected as any)?.firstName || (selected as any)?.name || ''} ${(selected as any)?.lastName || ''}`.trim() });
                }} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="">Selecciona un freelancer...</option>
                  {freelancers.map((f: any) => (
                    <option key={f._id || f.id} value={f._id || f.id}>
                      {(f.firstName || f.lastName) ? `${f.firstName || ''} ${f.lastName || ''}`.trim() : f.name} ({f.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor</label>
                <input type="number" value={newContract.value} onChange={e => setNewContract({ ...newContract, value: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moneda</label>
                <select value={newContract.currency} onChange={e => setNewContract({ ...newContract, currency: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
                <input type="date" value={newContract.startDate} onChange={e => setNewContract({ ...newContract, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Fin</label>
                <input type="date" value={newContract.endDate} onChange={e => setNewContract({ ...newContract, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Términos y Condiciones</label>
                <textarea value={newContract.terms} onChange={e => setNewContract({ ...newContract, terms: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" rows={3} placeholder="Términos del contrato..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={handleCloseModals} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium">Crear Contrato</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
} 