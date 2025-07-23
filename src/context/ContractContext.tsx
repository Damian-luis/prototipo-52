"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { contractService } from '@/services/supabase';
import { Contract, Milestone, Signature } from '@/types';

interface ContractContextType {
  contracts: Contract[];
  createContract: (contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string; contractId?: string }>;
  updateContract: (id: string, contract: Partial<Contract>) => Promise<{ success: boolean; message: string }>;
  signContract: (
    contractId: string,
    userId: string,
    userName: string,
    role: 'company' | 'professional',
    blockchainSignature?: { wallet: string; signature: string; contractHash: string }
  ) => Promise<{ success: boolean; message: string }>;
  getContractsByProfessional: (professionalId: string) => Promise<Contract[]>;
  getContractsByCompany: (companyId: string) => Promise<Contract[]>;
  getContractById: (id: string) => Promise<Contract | null>;
  generateBlockchainHash: (contract: Contract) => string;
  updateMilestoneStatus: (contractId: string, milestoneId: string, status: Milestone['status']) => Promise<{ success: boolean; message: string }>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  const createContract = useCallback(async (contract: Omit<Contract, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; message: string; contractId?: string }> => {
    try {
      const contractId = await contractService.createContract(contract);
      
      // Crear el objeto del contrato para el estado local
      const newContract: Contract = {
        id: contractId,
        ...contract,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setContracts(prev => [newContract, ...prev]);
      
      return { success: true, message: 'Contrato creado exitosamente', contractId };
    } catch (error) {
      console.error('Error creating contract:', error);
      return { success: false, message: 'Error al crear contrato' };
    }
  }, []);

  const updateContract = useCallback(async (id: string, contract: Partial<Contract>): Promise<{ success: boolean; message: string }> => {
    try {
      await contractService.updateContract(id, contract);
      
      // Actualizar estado local
      setContracts(prev => prev.map(c => 
        c.id === id 
          ? { ...c, ...contract, updated_at: new Date().toISOString() }
          : c
      ));
      
      return { success: true, message: 'Contrato actualizado exitosamente' };
    } catch (error) {
      console.error('Error updating contract:', error);
      return { success: false, message: 'Error al actualizar contrato' };
    }
  }, []);

  const signContract = useCallback(async (
    contractId: string,
    userId: string,
    userName: string,
    role: 'company' | 'professional',
    blockchainSignature?: { wallet: string; signature: string; contractHash: string }
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const signature: Signature = {
        user_id: userId,
        user_name: userName,
        role,
        signed_at: new Date().toISOString(),
        ip_address: '',
        signature: blockchainSignature?.signature || '',
        wallet: blockchainSignature?.wallet || ''
      };

      await contractService.signContract(contractId, signature);
      
      // Actualizar estado local
      setContracts(prev => prev.map(contract => {
        if (contract.id === contractId) {
          const updatedSignatures = [...contract.signatures, signature];
          const newStatus = updatedSignatures.length >= 2 ? 'active' : 'pending';
          return {
            ...contract,
            signatures: updatedSignatures,
            status: newStatus,
            updated_at: new Date().toISOString()
          };
        }
        return contract;
      }));
      
      return { success: true, message: 'Contrato firmado exitosamente' };
    } catch (error) {
      console.error('Error signing contract:', error);
      return { success: false, message: 'Error al firmar contrato' };
    }
  }, []);

  const generateBlockchainHash = useCallback((contract: Contract): string => {
    const contractData = {
      id: contract.id,
      projectId: contract.project_id,
      companyId: contract.company_id,
      professionalId: contract.professional_id,
      value: contract.value,
      startDate: contract.start_date,
      endDate: contract.end_date
    };
    
    return btoa(JSON.stringify(contractData));
  }, []);

  const updateMilestoneStatus = useCallback(async (contractId: string, milestoneId: string, status: Milestone['status']): Promise<{ success: boolean; message: string }> => {
    try {
      const contract = contracts.find(c => c.id === contractId);
      if (!contract) {
        return { success: false, message: 'Contrato no encontrado' };
      }
      
      const updatedMilestones = contract.milestones?.map(milestone => 
        milestone.id === milestoneId 
          ? { 
              ...milestone, 
              status,
              completed_date: status === 'completed' ? new Date().toISOString() : undefined
            }
          : milestone
      );
      
      await contractService.updateContract(contractId, { milestones: updatedMilestones });
      
      // Actualizar estado local
      setContracts(prev => prev.map(contract => 
        contract.id === contractId 
          ? { ...contract, milestones: updatedMilestones, updated_at: new Date().toISOString() }
          : contract
      ));
      
      return { success: true, message: 'Estado del hito actualizado exitosamente' };
    } catch (error) {
      console.error('Error updating milestone status:', error);
      return { success: false, message: 'Error al actualizar estado del hito' };
    }
  }, [contracts]);

  const getContractsByProfessional = useCallback(async (professionalId: string): Promise<Contract[]> => {
    try {
      const professionalContracts = await contractService.getContractsByProfessional(professionalId);
      return professionalContracts;
    } catch (error) {
      console.error('Error getting contracts by professional:', error);
      return [];
    }
  }, []);

  const getContractsByCompany = useCallback(async (companyId: string): Promise<Contract[]> => {
    try {
      const companyContracts = await contractService.getContractsByCompany(companyId);
      return companyContracts;
    } catch (error) {
      console.error('Error getting contracts by company:', error);
      return [];
    }
  }, []);

  const getContractById = useCallback(async (id: string): Promise<Contract | null> => {
    try {
      const contract = await contractService.getContractById(id);
      return contract;
    } catch (error) {
      console.error('Error getting contract by id:', error);
      return null;
    }
  }, []);

  const value: ContractContextType = {
    contracts,
    createContract,
    updateContract,
    signContract,
    getContractsByProfessional,
    getContractsByCompany,
    getContractById,
    generateBlockchainHash,
    updateMilestoneStatus
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}; 