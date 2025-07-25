"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal/Modal';
import Button from '@/components/ui/button/Button';
import { Listbox } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { useWeb3 } from '@/context/Web3Context';
import { showError, showWarning } from '@/util/notifications';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
  contractTitle: string;
  amount: number;
  currency: string;
  recipientAddress?: string;
  onPaymentSuccess?: (txHash: string) => void;
}

const SUPPORTED_NETWORKS = [
  {
    name: 'Ethereum',
    chainId: '0x1',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  {
    name: 'Polygon',
    chainId: '0x89',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  {
    name: 'BSC',
    chainId: '0x38',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
];

export default function PaymentModal({
  isOpen,
  onClose,
  contractId,
  contractTitle,
  amount,
  currency,
  recipientAddress,
  onPaymentSuccess
}: PaymentModalProps) {
  const {
    isConnected,
    connectWallet,
    currentNetwork,
    switchNetwork,
    nativeBalance,
    usdcBalance,
    approveUSDC,
    sendNativeToContract,
    sendUSDCToContract,
    escrowAddress,
  } = useWeb3();

  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'native' | 'usdc'>('native');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const paymentAmount = amount.toString();

  useEffect(() => {
    if (isConnected && escrowAddress) {
      checkApproval();
    }
  }, [isConnected, escrowAddress, paymentAmount]);

  const checkApproval = async () => {
    if (paymentMethod === 'usdc' && escrowAddress) {
      try {
        // Aquí deberías verificar si el usuario ya aprobó el gasto de USDC
        // Por ahora, asumimos que necesita aprobación
        setNeedsApproval(true);
      } catch (error) {
        console.error('Error checking approval:', error);
      }
    }
  };

  const handleNetworkChange = async (network: typeof SUPPORTED_NETWORKS[0]) => {
    setSelectedNetwork(network);
    if (currentNetwork?.chainId !== network.chainId) {
      await switchNetwork(network.chainId);
    }
  };

  const handleApprove = async () => {
    if (!escrowAddress) {
      showError("Dirección del contrato no configurada");
      return;
    }

    setIsApproving(true);
    try {
      const txHash = await approveUSDC(escrowAddress, paymentAmount);
      console.log("Aprobación exitosa:", txHash);
      setNeedsApproval(false);
    } catch (error) {
      console.error("Error al aprobar:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const handlePayment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!escrowAddress || escrowAddress === "0x0000000000000000000000000000000000000000") {
      showError("La dirección del contrato de escrow no está configurada. Por favor, contacta al administrador.");
      return;
    }

    setIsPaying(true);
    setTxHash(null);

    try {
      let hash: string;
      
      if (paymentMethod === 'native') {
        hash = await sendNativeToContract(escrowAddress, paymentAmount);
      } else {
        if (needsApproval) {
          showWarning("Primero debes aprobar el uso de USDC");
          setIsPaying(false);
          return;
        }
        hash = await sendUSDCToContract(escrowAddress, paymentAmount);
      }

      setTxHash(hash);
      if (onPaymentSuccess) {
        onPaymentSuccess(hash);
      }

      // Cerrar el modal después de 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error en el pago:", error);
    } finally {
      setIsPaying(false);
    }
  };

  const getBalance = () => {
    if (paymentMethod === 'native') {
      return `${nativeBalance} ${currentNetwork?.nativeCurrency.symbol || 'ETH'}`;
    } else {
      return `${usdcBalance} USDC`;
    }
  };

  const hasInsufficientBalance = () => {
    const balance = paymentMethod === 'native' ? parseFloat(nativeBalance) : parseFloat(usdcBalance);
    return balance < parseFloat(paymentAmount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Realizar Pago</h2>

        {/* Información del contrato */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Contrato</h3>
          <p className="text-gray-900 dark:text-white">{contractTitle}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {contractId}</p>
        </div>

        {/* Selección de red */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Red de pago
          </label>
          <Listbox
            value={selectedNetwork?.chainId || ''}
            onChange={chainId => {
              const network = SUPPORTED_NETWORKS.find(n => n.chainId === chainId);
              if (network) handleNetworkChange(network);
            }}
          >
            {({ open }) => (
              <div className="relative">
                <Listbox.Button className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {SUPPORTED_NETWORKS.find(opt => String(opt.chainId) === String(selectedNetwork?.chainId || ''))?.nativeCurrency.symbol}
                  </span>
                  <span className="ml-7">
                    {SUPPORTED_NETWORKS.find(opt => String(opt.chainId) === String(selectedNetwork?.chainId || ''))?.name || 'Selecciona una red'}
                  </span>
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {SUPPORTED_NETWORKS.map(network => {
                    const isSelected = String(network.chainId) === String(selectedNetwork?.chainId || '');
                    return (
                      <Listbox.Option
                        key={network.chainId}
                        value={network.chainId}
                        className={({ active }) =>
                          `cursor-pointer select-none relative px-4 py-2 flex items-center gap-2 ${active ? 'bg-brand-50 dark:bg-brand-900/20' : ''} ${isSelected ? 'bg-brand-100 dark:bg-brand-800' : ''}`
                        }
                      >
                        {isSelected && <CheckIcon className="h-5 w-5 text-brand-500" />}
                        <span>{network.name}</span>
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </div>
            )}
          </Listbox>
        </div>

        {/* Método de pago */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Método de pago
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('native')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'native'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">{selectedNetwork?.nativeCurrency.symbol || 'ETH'}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Moneda nativa</div>
            </button>
            <button
              onClick={() => setPaymentMethod('usdc')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                paymentMethod === 'usdc'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="font-medium">USDC</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stablecoin</div>
            </button>
          </div>
        </div>

        {/* Cantidad */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cantidad a pagar
          </label>
          <div className="relative">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 pr-16 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              placeholder="0.0"
              step="0.01"
              min="0"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {paymentMethod === 'native' ? selectedNetwork?.nativeCurrency.symbol : 'USDC'}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Balance disponible: {getBalance()}
          </div>
          {hasInsufficientBalance() && (
            <div className="mt-2 text-sm text-red-500">
              Balance insuficiente
            </div>
          )}
        </div>

        {/* Dirección del contrato */}
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dirección del contrato de escrow:</p>
          <p className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
            {escrowAddress || 'No configurada'}
          </p>
        </div>

        {/* Estado de la transacción */}
        {txHash && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
              ¡Pago enviado exitosamente!
            </p>
            <p className="font-mono text-xs text-green-700 dark:text-green-300 break-all">
              Hash: {txHash}
            </p>
            {selectedNetwork && (
              <a
                href={`${selectedNetwork.blockExplorerUrls[0]}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1 inline-block"
              >
                Ver en explorador →
              </a>
            )}
          </div>
        )}

        {/* Error */}
        {/* The original code had an 'error' state, but the new_code doesn't.
            Assuming the 'error' state is no longer relevant or will be handled differently.
            For now, removing the error display as it's not in the new_code. */}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          
          {paymentMethod === 'usdc' && needsApproval && (
            <Button
              onClick={handleApprove}
              disabled={isApproving || !isConnected}
              variant="warning"
            >
              {isApproving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Aprobando...</span>
                </>
              ) : (
                <span>Aprobar USDC</span>
              )}
            </Button>
          )}
          
          <Button
            onClick={handlePayment}
            disabled={
              isPaying || 
              // isLoading is not in the new_code, so removing it.
              // !isConnected || 
              hasInsufficientBalance() || 
              (paymentMethod === 'usdc' && needsApproval) ||
              !escrowAddress ||
              escrowAddress === "0x0000000000000000000000000000000000000000"
            }
            variant="primary"
          >
            {isPaying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </>
            ) : !isConnected ? (
              <span>Conectar Wallet</span>
            ) : (
              <span>Realizar Pago</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 