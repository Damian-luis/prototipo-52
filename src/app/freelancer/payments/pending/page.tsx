"use client";
import React, { useState } from "react";
import { usePayment } from "@/context/PaymentContext";
import { useAuth } from "@/context/AuthContext";
import { useWeb3 } from "@/context/Web3Context";
import ComponentCard from "@/components/common/ComponentCard";
import { Modal } from "@/components/ui/modal";

const PendingPaymentsPage = () => {
  const { payments } = usePayment();
  const { user } = useAuth();
  const { isConnected, account, currentNetwork, connectWallet } = useWeb3();
  
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Filtrar pagos pendientes del freelancer
  const pendingPayments = payments.filter(
    p => p.freelancerId === user?.id && (p.status === 'pending' || p.status === 'processing')
  );

  // Agrupar pagos por estado
  const groupedPayments = {
    pending: pendingPayments.filter(p => p.status === 'pending'),
    processing: pendingPayments.filter(p => p.status === 'processing')
  };

  const handleClaimPayment = async (payment: any) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsClaiming(true);
    try {
      // Simulación de reclamación de pago
      // En un caso real, aquí se interactuaría con el smart contract
      console.log("Reclamando pago:", payment.id);
      console.log("Wallet destino:", account);
      
      // Simular transacción
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`¡Pago reclamado exitosamente! Se enviará ${payment.netAmount} ${payment.currency} a tu wallet.`);
      setIsClaimModalOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error("Error al reclamar pago:", error);
      alert("Error al reclamar el pago");
    } finally {
      setIsClaiming(false);
    }
  };

  const openClaimModal = (payment: any) => {
    setSelectedPayment(payment);
    setIsClaimModalOpen(true);
  };

  const getTotalPending = () => {
    return pendingPayments.reduce((total, payment) => total + payment.netAmount, 0);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pagos Pendientes
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Revisa y reclama tus pagos pendientes
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pendiente</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            ${getTotalPending().toLocaleString()}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            en {pendingPayments.length} pagos
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Por Reclamar</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {groupedPayments.pending.length}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            pagos listos para reclamar
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">En Proceso</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {groupedPayments.processing.length}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            pagos procesándose
          </p>
        </div>
      </div>

      {/* Aviso de Web3 */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Para reclamar pagos, necesitas conectar tu wallet primero.
          </p>
        </div>
      )}

      {/* Lista de pagos pendientes */}
      {pendingPayments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No tienes pagos pendientes en este momento
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pagos por reclamar */}
          {groupedPayments.pending.length > 0 && (
            <ComponentCard title="Listos para Reclamar">
              <div className="space-y-4">
                {groupedPayments.pending.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {payment.description}
                      </h4>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Contrato: #{payment.contractId}</span>
                        <span>Programado: {new Date(payment.scheduledDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Monto bruto: </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${payment.grossAmount.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">→ Neto: </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          ${payment.netAmount.toLocaleString()} {payment.currency}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => openClaimModal(payment)}
                      className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium"
                    >
                      Reclamar Pago
                    </button>
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}

          {/* Pagos en proceso */}
          {groupedPayments.processing.length > 0 && (
            <ComponentCard title="En Proceso">
              <div className="space-y-4">
                {groupedPayments.processing.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-75"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {payment.description}
                      </h4>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Contrato: #{payment.contractId}</span>
                        <span>Procesando desde: {payment.processedDate ? new Date(payment.processedDate).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          ${payment.netAmount.toLocaleString()} {payment.currency}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Procesando...</span>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}
        </div>
      )}

      {/* Modal de reclamación */}
      <Modal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} className="max-w-lg">
        {selectedPayment && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Reclamar Pago</h2>
            
            <div className="space-y-4 mb-6">
              {/* Detalles del pago */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">{selectedPayment.description}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Monto bruto:</span>
                    <span>${selectedPayment.grossAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Deducciones:</span>
                    <span className="text-red-600 dark:text-red-400">
                      -${(selectedPayment.grossAmount - selectedPayment.netAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Monto neto:</span>
                    <span className="text-green-600 dark:text-green-400">
                      ${selectedPayment.netAmount.toLocaleString()} {selectedPayment.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de la wallet */}
              {isConnected && account && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">
                    Información de Recepción
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Wallet: {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Red: {currentNetwork?.name || 'No conectada'}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    Los fondos se enviarán a esta dirección en la red seleccionada.
                  </p>
                </div>
              )}

              {/* Aviso */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Importante:</strong> Una vez reclamado, el pago se procesará en la blockchain. 
                  Este proceso puede tomar algunos minutos.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleClaimPayment(selectedPayment)}
                disabled={isClaiming || !isConnected}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                {isClaiming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Reclamando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{isConnected ? 'Reclamar Pago' : 'Conectar Wallet'}</span>
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

export default PendingPaymentsPage; 