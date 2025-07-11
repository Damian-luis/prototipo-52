"use client";
import React, { useState, useRef } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { FaFirefox } from 'react-icons/fa';

export default function WalletConnect() {
  const {
    isConnected,
    account,
    currentNetwork,
    nativeBalance,
    connectWallet,
    disconnectWallet,
    formatBalance,
    isLoading,
    error
  } = useWeb3();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const METAMASK_ICON = 'https://cdn.jsdelivr.net/npm/@metamask/logo@2.2.0/logo.svg';

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  if (isConnected && account) {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Solo el botón de wallet con dropdown */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setDropdownOpen((v) => !v)}
          title="Ver detalles de wallet"
        >
          <FaFirefox className="w-4 h-4" />
          <span>{formatAddress(account)}</span>
          <svg className={`w-4 h-4 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">Wallet conectada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm break-all">{account}</span>
              <button onClick={handleCopy} className="text-gray-500 hover:text-brand-500 relative" title="Copiar dirección">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h8M8 13h8m-6 4v1a3 3 0 003 3h4a3 3 0 003-3V7a3 3 0 00-3-3h-4a3 3 0 00-3 3v1" />
                </svg>
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                    ¡Copiado!
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Red:</span> {currentNetwork?.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Balance:</span> {formatBalance(nativeBalance)} {currentNetwork?.nativeCurrency.symbol || 'ETH'}
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              onClick={() => { setDropdownOpen(false); disconnectWallet(); }}
              className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
            >
              Desconectar wallet
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-end gap-2">
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white rounded-lg font-medium transition-colors"
      >
        <FaFirefox className="w-5 h-5" />
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Conectando...</span>
          </>
        ) : (
          <span>Conectar Wallet</span>
        )}
      </button>
      {/* Mostrar error si existe */}
      {error && (
        <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg z-50">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
} 