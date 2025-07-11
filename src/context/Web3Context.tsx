"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// Configuración de redes soportadas
export const SUPPORTED_NETWORKS = [
  {
    chainId: "0x1", // Ethereum Mainnet
    chainIdDecimal: 1,
    name: "Ethereum Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrl: "https://ethereum.publicnode.com",
    blockExplorerUrl: "https://etherscan.io",
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    escrowContractAddress: "0x0000000000000000000000000000000000000000" // Placeholder
  },
  {
    chainId: "0x38", // BNB Smart Chain Mainnet
    chainIdDecimal: 56,
    name: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrl: "https://bsc-dataseed.bnbchain.org",
    blockExplorerUrl: "https://bscscan.com",
    usdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // BSC USDC
    escrowContractAddress: "0x0000000000000000000000000000000000000000" // Placeholder
  },
  {
    chainId: "0x89", // Polygon Mainnet
    chainIdDecimal: 137,
    name: "Polygon Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrl: "https://polygon-rpc.com",
    blockExplorerUrl: "https://polygonscan.com",
    usdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Polygon USDC
    escrowContractAddress: "0x0000000000000000000000000000000000000000" // Placeholder
  },
  {
    chainId: "0xAA36A7", // Sepolia Testnet
    chainIdDecimal: 11155111,
    name: "Sepolia Testnet",
    nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
    rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
    escrowContractAddress: "0x0000000000000000000000000000000000000000" // Placeholder
  }
];

// ABI mínimo para interactuar con tokens ERC20 (USDC)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

// ABI mínimo para el contrato de escrow
const ESCROW_ABI = [
  "function deposit() payable",
  "function depositToken(address token, uint256 amount)",
  "function release(address payee)",
  "function getBalance() view returns (uint256)"
];

interface Web3ContextType {
  // Estado de conexión
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  
  // Balances
  nativeBalance: string;
  usdcBalance: string;
  
  // Red actual
  currentNetwork: typeof SUPPORTED_NETWORKS[0] | null;
  
  // Funciones
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  
  // Funciones de pago
  sendNativeToContract: (contractAddress: string, amount: string) => Promise<string>;
  sendUSDCToContract: (contractAddress: string, amount: string) => Promise<string>;
  approveUSDC: (spenderAddress: string, amount: string) => Promise<string>;
  checkUSDCAllowance: (ownerAddress: string, spenderAddress: string) => Promise<string>;
  
  // Utils
  formatBalance: (balance: string, decimals?: number) => string;
  isLoading: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [nativeBalance, setNativeBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [currentNetwork, setCurrentNetwork] = useState<typeof SUPPORTED_NETWORKS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detectar red actual
  useEffect(() => {
    if (chainId) {
      const network = SUPPORTED_NETWORKS.find(n => n.chainIdDecimal === chainId);
      setCurrentNetwork(network || null);
    }
  }, [chainId]);

  // Actualizar balances cuando cambie la cuenta o red
  useEffect(() => {
    if (account && provider && currentNetwork) {
      updateBalances();
    }
  }, [account, chainId, provider, currentNetwork]);

  // Verificar si MetaMask está instalado
  const checkMetaMask = () => {
    if (typeof window === 'undefined') return false;
    return typeof window.ethereum !== 'undefined';
  };

  // Actualizar balances
  const updateBalances = async () => {
    if (!account || !provider || !currentNetwork) return;

    try {
      // Balance nativo
      const nativeBalance = await provider.getBalance(account);
      setNativeBalance(ethers.formatEther(nativeBalance));

      // Balance USDC
      if (currentNetwork.usdcAddress !== "0x0000000000000000000000000000000000000000") {
        const usdcContract = new ethers.Contract(
          currentNetwork.usdcAddress,
          ERC20_ABI,
          provider
        );
        const usdcBalance = await usdcContract.balanceOf(account);
        const decimals = await usdcContract.decimals();
        setUsdcBalance(ethers.formatUnits(usdcBalance, decimals));
      }
    } catch (error) {
      console.error("Error updating balances:", error);
    }
  };

  // Conectar wallet
  const connectWallet = async () => {
    if (!checkMetaMask()) {
      setError("MetaMask no está instalado. Por favor, instálalo para continuar.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ethereum = window.ethereum as any;
      
      // Solicitar cuentas
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error("No se encontraron cuentas");
      }

      // Crear provider y signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setAccount(accounts[0]);
      setChainId(Number(network.chainId));
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);

      // Escuchar cambios de cuenta
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      // Escuchar cambios de red
      ethereum.on('chainChanged', (chainId: string) => {
        window.location.reload();
      });

    } catch (error: any) {
      setError(error.message || "Error al conectar la wallet");
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setProvider(null);
    setSigner(null);
    setNativeBalance("0");
    setUsdcBalance("0");
    setCurrentNetwork(null);
    setError(null);
  };

  // Cambiar de red
  const switchNetwork = async (chainId: string) => {
    if (!checkMetaMask()) {
      setError("MetaMask no está instalado");
      return;
    }

    const ethereum = window.ethereum as any;
    
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error: any) {
      // Si la red no está agregada, intentar agregarla
      if (error.code === 4902) {
        const network = SUPPORTED_NETWORKS.find(n => n.chainId === chainId);
        if (network) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: network.chainId,
                chainName: network.name,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorerUrl],
              }],
            });
          } catch (addError) {
            setError("Error al agregar la red");
            console.error("Error adding network:", addError);
          }
        }
      } else {
        setError("Error al cambiar de red");
        console.error("Error switching network:", error);
      }
    }
  };

  // Enviar moneda nativa al contrato
  const sendNativeToContract = async (contractAddress: string, amount: string): Promise<string> => {
    if (!signer) throw new Error("Wallet no conectada");

    setIsLoading(true);
    setError(null);

    try {
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(amount)
      });

      await tx.wait();
      await updateBalances();
      
      return tx.hash;
    } catch (error: any) {
      setError(error.message || "Error al enviar transacción");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Aprobar USDC
  const approveUSDC = async (spenderAddress: string, amount: string): Promise<string> => {
    if (!signer || !currentNetwork) throw new Error("Wallet no conectada");

    setIsLoading(true);
    setError(null);

    try {
      const usdcContract = new ethers.Contract(
        currentNetwork.usdcAddress,
        ERC20_ABI,
        signer
      );

      const decimals = await usdcContract.decimals();
      const tx = await usdcContract.approve(spenderAddress, ethers.parseUnits(amount, decimals));
      await tx.wait();

      return tx.hash;
    } catch (error: any) {
      setError(error.message || "Error al aprobar USDC");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar allowance de USDC
  const checkUSDCAllowance = async (ownerAddress: string, spenderAddress: string): Promise<string> => {
    if (!provider || !currentNetwork) throw new Error("Provider no disponible");

    try {
      const usdcContract = new ethers.Contract(
        currentNetwork.usdcAddress,
        ERC20_ABI,
        provider
      );

      const allowance = await usdcContract.allowance(ownerAddress, spenderAddress);
      const decimals = await usdcContract.decimals();
      
      return ethers.formatUnits(allowance, decimals);
    } catch (error: any) {
      console.error("Error checking allowance:", error);
      return "0";
    }
  };

  // Enviar USDC al contrato
  const sendUSDCToContract = async (contractAddress: string, amount: string): Promise<string> => {
    if (!signer || !currentNetwork) throw new Error("Wallet no conectada");

    setIsLoading(true);
    setError(null);

    try {
      const usdcContract = new ethers.Contract(
        currentNetwork.usdcAddress,
        ERC20_ABI,
        signer
      );

      const decimals = await usdcContract.decimals();
      const tx = await usdcContract.transfer(contractAddress, ethers.parseUnits(amount, decimals));
      await tx.wait();
      await updateBalances();

      return tx.hash;
    } catch (error: any) {
      setError(error.message || "Error al enviar USDC");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear balance
  const formatBalance = (balance: string, decimals: number = 4): string => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (num < 0.0001) return "< 0.0001";
    return num.toFixed(decimals);
  };

  return (
    <Web3Context.Provider value={{
      isConnected,
      account,
      chainId,
      provider,
      signer,
      nativeBalance,
      usdcBalance,
      currentNetwork,
      connectWallet,
      disconnectWallet,
      switchNetwork,
      sendNativeToContract,
      sendUSDCToContract,
      approveUSDC,
      checkUSDCAllowance,
      formatBalance,
      isLoading,
      error
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 debe ser usado dentro de Web3Provider');
  }
  return context;
}; 