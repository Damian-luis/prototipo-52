"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Contract {
  id: string;
  title: string;
  description: string;
  freelancerId: string;
  freelancerName: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  paymentTerms: 'hourly' | 'fixed' | 'milestone';
  milestones?: Milestone[];
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';
  signatures: Signature[];
  blockchainHash?: string; // Simulación de smart contract
  createdAt: string;
  updatedAt: string;
  terms: string;
  deliverables: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved';
  completedDate?: string;
}

export interface Signature {
  userId: string;
  userName: string;
  role: 'freelancer' | 'client';
  signedAt: string;
  ipAddress: string;
  signature: string; // Hash simulado
}

interface ContractContextType {
  contracts: Contract[];
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'signatures' | 'status'>) => Promise<{ success: boolean; message: string; contractId?: string }>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<{ success: boolean; message: string }>;
  signContract: (contractId: string, userId: string, userName: string, role: 'freelancer' | 'client') => Promise<{ success: boolean; message: string }>;
  getContractsByFreelancer: (freelancerId: string) => Contract[];
  getContractsByClient: (clientId: string) => Contract[];
  getContractById: (id: string) => Contract | undefined;
  generateBlockchainHash: (contract: Contract) => string;
  updateMilestoneStatus: (contractId: string, milestoneId: string, status: Milestone['status']) => Promise<{ success: boolean; message: string }>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Cargar contratos del localStorage al iniciar
  useEffect(() => {
    const storedContracts = localStorage.getItem('contracts');
    
    if (storedContracts) {
      setContracts(JSON.parse(storedContracts));
    } else {
      // Crear contratos de ejemplo
      const defaultContracts: Contract[] = [
        {
          id: '1',
          title: 'Desarrollo de Aplicación Web',
          description: 'Desarrollo completo de aplicación web con React y Node.js',
          freelancerId: '2',
          freelancerName: 'Juan Pérez',
          clientId: '1',
          clientName: 'Empresa ABC',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 días
          value: 15000,
          currency: 'USD',
          paymentTerms: 'milestone',
          milestones: [
            {
              id: '1',
              name: 'Diseño y Prototipo',
              description: 'Diseño completo de la interfaz y prototipo funcional',
              amount: 5000,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed',
              completedDate: new Date().toISOString()
            },
            {
              id: '2',
              name: 'Desarrollo Frontend',
              description: 'Implementación completa del frontend',
              amount: 5000,
              dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'in-progress'
            },
            {
              id: '3',
              name: 'Backend y Despliegue',
              description: 'Desarrollo del backend y despliegue en producción',
              amount: 5000,
              dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending'
            }
          ],
          status: 'active',
          signatures: [
            {
              userId: '1',
              userName: 'Empresa ABC',
              role: 'client',
              signedAt: new Date().toISOString(),
              ipAddress: '192.168.1.1',
              signature: 'hash_simulado_cliente_123'
            },
            {
              userId: '2',
              userName: 'Juan Pérez',
              role: 'freelancer',
              signedAt: new Date().toISOString(),
              ipAddress: '192.168.1.2',
              signature: 'hash_simulado_freelancer_456'
            }
          ],
          blockchainHash: '0x' + Math.random().toString(36).substring(2, 15),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          terms: 'Términos y condiciones estándar del contrato...',
          deliverables: ['Código fuente', 'Documentación', 'Manual de usuario']
        }
      ];
      localStorage.setItem('contracts', JSON.stringify(defaultContracts));
      setContracts(defaultContracts);
    }
  }, []);

  const generateBlockchainHash = (contract: Contract): string => {
    // Simulación de hash blockchain
    const data = `${contract.id}${contract.freelancerId}${contract.clientId}${contract.value}${Date.now()}`;
    return '0x' + btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
  };

  const createContract = async (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'signatures' | 'status'>): Promise<{ success: boolean; message: string; contractId?: string }> => {
    const newContract: Contract = {
      ...contractData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signatures: [],
      status: 'draft'
    };

    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));

    return { 
      success: true, 
      message: 'Contrato creado exitosamente', 
      contractId: newContract.id 
    };
  };

  const updateContract = async (id: string, contractData: Partial<Contract>): Promise<{ success: boolean; message: string }> => {
    const updatedContracts = contracts.map(c => 
      c.id === id 
        ? { ...c, ...contractData, updatedAt: new Date().toISOString() }
        : c
    );
    setContracts(updatedContracts);
    localStorage.setItem('contracts', JSON.stringify(updatedContracts));

    return { success: true, message: 'Contrato actualizado exitosamente' };
  };

  const signContract = async (contractId: string, userId: string, userName: string, role: 'freelancer' | 'client'): Promise<{ success: boolean; message: string }> => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) {
      return { success: false, message: 'Contrato no encontrado' };
    }

    // Verificar si ya firmó
    const alreadySigned = contract.signatures.some(s => s.userId === userId);
    if (alreadySigned) {
      return { success: false, message: 'Ya has firmado este contrato' };
    }

    const newSignature: Signature = {
      userId,
      userName,
      role,
      signedAt: new Date().toISOString(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
      signature: 'sig_' + Math.random().toString(36).substring(2, 15)
    };

    const updatedContract = {
      ...contract,
      signatures: [...contract.signatures, newSignature],
      updatedAt: new Date().toISOString()
    };

    // Si ambas partes firmaron, activar el contrato y generar hash blockchain
    if (updatedContract.signatures.length === 2) {
      updatedContract.status = 'active';
      updatedContract.blockchainHash = generateBlockchainHash(updatedContract);
    } else {
      updatedContract.status = 'pending';
    }

    return updateContract(contractId, updatedContract);
  };

  const updateMilestoneStatus = async (contractId: string, milestoneId: string, status: Milestone['status']): Promise<{ success: boolean; message: string }> => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || !contract.milestones) {
      return { success: false, message: 'Contrato o hito no encontrado' };
    }

    const updatedMilestones = contract.milestones.map(m => 
      m.id === milestoneId 
        ? { 
            ...m, 
            status,
            completedDate: status === 'completed' ? new Date().toISOString() : m.completedDate
          }
        : m
    );

    return updateContract(contractId, { milestones: updatedMilestones });
  };

  const getContractsByFreelancer = (freelancerId: string) => 
    contracts.filter(c => c.freelancerId === freelancerId);

  const getContractsByClient = (clientId: string) => 
    contracts.filter(c => c.clientId === clientId);

  const getContractById = (id: string) => 
    contracts.find(c => c.id === id);

  return (
    <ContractContext.Provider value={{
      contracts,
      createContract,
      updateContract,
      signContract,
      getContractsByFreelancer,
      getContractsByClient,
      getContractById,
      generateBlockchainHash,
      updateMilestoneStatus
    }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract debe ser usado dentro de ContractProvider');
  }
  return context;
}; 