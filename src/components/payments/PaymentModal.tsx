"use client";
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { useWeb3, SUPPORTED_NETWORKS } from '@/context/Web3Context';
import { FaEthereum } from 'react-icons/fa';
import { SiBinance, SiPolygon } from 'react-icons/si';
import { Listbox } from '@headlessui/react';

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

const NETWORK_OPTIONS = [
  { value: 'Ethereum', chainId: '0x1', label: 'Ethereum Mainnet', icon: <FaEthereum className="text-indigo-500 text-xl mr-2" /> },
  { value: 'BNB Smart Chain', chainId: '0x38', label: 'BNB Smart Chain', icon: <SiBinance className="text-yellow-500 text-xl mr-2" /> },
  { value: 'Polygon', chainId: '0x89', label: 'Polygon Mainnet', icon: <SiPolygon className="text-purple-500 text-xl mr-2" /> },
  { value: 'Sepolia', chainId: '0xAA36A7', label: 'Sepolia Testnet', icon: <FaEthereum className="text-gray-400 text-xl mr-2" /> },
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
    account,
    currentNetwork,
    nativeBalance,
    usdcBalance,
    connectWallet,
    switchNetwork,
    sendNativeToContract,
    sendUSDCToContract,
    approveUSDC,
    checkUSDCAllowance,
    formatBalance,
    isLoading,
    error
  } = useWeb3();

  const [selectedNetwork, setSelectedNetwork] = useState<typeof SUPPORTED_NETWORKS[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'native' | 'usdc'>('native');
  const [paymentAmount, setPaymentAmount] = useState(amount.toString());
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Dirección del contrato de escrow (usar la del network seleccionado o actual)
  const escrowAddress = recipientAddress || selectedNetwork?.escrowContractAddress || currentNetwork?.escrowContractAddress || '';

  useEffect(() => {
    if (currentNetwork) {
      setSelectedNetwork(currentNetwork);
    }
  }, [currentNetwork]);

  useEffect(() => {
    // Verificar si necesita aprobación cuando cambia el método de pago o la cantidad
    const checkApproval = async () => {
      if (paymentMethod === 'usdc' && account && selectedNetwork && escrowAddress) {
        const allowance = await checkUSDCAllowance(account, escrowAddress);
        setNeedsApproval(parseFloat(allowance) < parseFloat(paymentAmount));
      }
    };

    if (isConnected) {
      checkApproval();
    }
  }, [paymentMethod, paymentAmount, account, selectedNetwork, escrowAddress, checkUSDCAllowance, isConnected]);

  const handleNetworkChange = async (network: typeof SUPPORTED_NETWORKS[0]) => {
    setSelectedNetwork(network);
    if (currentNetwork?.chainId !== network.chainId) {
      await switchNetwork(network.chainId);
    }
  };

  const handleApprove = async () => {
    if (!escrowAddress) {
      alert("Dirección del contrato no configurada");
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
      alert("La dirección del contrato de escrow no está configurada. Por favor, contacta al administrador.");
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
          alert("Primero debes aprobar el uso de USDC");
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
      return `${formatBalance(nativeBalance)} ${currentNetwork?.nativeCurrency.symbol || 'ETH'}`;
    } else {
      return `${formatBalance(usdcBalance)} USDC`;
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
                    {NETWORK_OPTIONS.find(opt => String(opt.chainId) === String(selectedNetwork?.chainId || ''))?.icon}
                  </span>
                  <span className="ml-7">
                    {NETWORK_OPTIONS.find(opt => String(opt.chainId) === String(selectedNetwork?.chainId || ''))?.label || 'Selecciona una red'}
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {SUPPORTED_NETWORKS.map(network => {
                    const option = NETWORK_OPTIONS.find(opt => String(opt.chainId) === String(network.chainId)) || { label: network.name, icon: null };
                    return (
                      <Listbox.Option
                        key={network.chainId}
                        value={network.chainId}
                        className={({ active }) =>
                          `cursor-pointer select-none relative px-4 py-2 flex items-center gap-2 ${active ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`
                        }
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.label}</span>
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
                href={`${selectedNetwork.blockExplorerUrl}/tx/${txHash}`}
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
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          
          {paymentMethod === 'usdc' && needsApproval && (
            <button
              onClick={handleApprove}
              disabled={isApproving || !isConnected}
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isApproving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Aprobando...</span>
                </>
              ) : (
                <span>Aprobar USDC</span>
              )}
            </button>
          )}
          
          <button
            onClick={handlePayment}
            disabled={
              isPaying || 
              isLoading || 
              !isConnected || 
              hasInsufficientBalance() || 
              (paymentMethod === 'usdc' && needsApproval) ||
              !escrowAddress ||
              escrowAddress === "0x0000000000000000000000000000000000000000"
            }
            className="flex-1 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
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
          </button>
        </div>
      </div>
    </Modal>
  );
} 