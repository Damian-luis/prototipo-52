"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { contractsService, Contract, CreateContractData, UpdateContractData } from '@/services/contracts.service';

interface ContractContextType {
  contracts: Contract[];
  currentContract: Contract | null;
  loading: boolean;
  error: string | null;
  createContract: (contractData: CreateContractData) => Promise<{ success: boolean; message: string; contractId?: string }>;
  updateContract: (id: string, contractData: UpdateContractData) => Promise<{ success: boolean; message: string }>;
  deleteContract: (id: string) => Promise<{ success: boolean; message: string }>;
  getContractById: (id: string) => Promise<Contract | null>;
  getContractsByProfessional: () => Promise<Contract[]>;
  getContractsByCompany: () => Promise<Contract[]>;
  getProfessionalContractStats: () => Promise<any>;
  getContractStats: () => Promise<any>;
  updateContractStatus: (id: string, status: string) => Promise<{ success: boolean; message: string }>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [currentContract, setCurrentContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContract = useCallback(async (contractData: CreateContractData): Promise<{ success: boolean; message: string; contractId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const newContract = await contractsService.createContract(contractData);
      
      setContracts(prev => [newContract, ...prev]);
      
      return { success: true, message: 'Contrato creado exitosamente', contractId: newContract.id };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear contrato';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContract = useCallback(async (id: string, contractData: UpdateContractData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedContract = await contractsService.updateContract(id, contractData);
      
      // Actualizar estado local
      setContracts(prev => prev.map(contract => 
        contract.id === id ? updatedContract : contract
      ));
      
      if (currentContract?.id === id) {
        setCurrentContract(updatedContract);
      }
      
      return { success: true, message: 'Contrato actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar contrato';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentContract?.id]);

  const deleteContract = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await contractsService.deleteContract(id);
      
      setContracts(prev => prev.filter(contract => contract.id !== id));
      
      if (currentContract?.id === id) {
        setCurrentContract(null);
      }
      
      return { success: true, message: 'Contrato eliminado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar contrato';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentContract?.id]);

  const getContractById = useCallback(async (id: string): Promise<Contract | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await contractsService.getContractById(id);
      setCurrentContract(contract);
      return contract;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener contrato';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getContractsByProfessional = useCallback(async (): Promise<Contract[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const professionalContracts = await contractsService.getContractsByProfessional();
      setContracts(professionalContracts);
      return professionalContracts;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener contratos del profesional';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getContractsByCompany = useCallback(async (): Promise<Contract[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const companyContracts = await contractsService.getContractsByCompany();
      setContracts(companyContracts);
      return companyContracts;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener contratos de la empresa';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfessionalContractStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await contractsService.getProfessionalContractStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de contratos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getContractStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await contractsService.getContractStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de contratos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContractStatus = useCallback(async (id: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedContract = await contractsService.updateContractStatus(id, status);
      
      // Actualizar estado local
      setContracts(prev => prev.map(contract => 
        contract.id === id ? updatedContract : contract
      ));
      
      if (currentContract?.id === id) {
        setCurrentContract(updatedContract);
      }
      
      return { success: true, message: 'Estado del contrato actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar estado del contrato';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentContract?.id]);

  const value: ContractContextType = {
    contracts,
    currentContract,
    loading,
    error,
    createContract,
    updateContract,
    deleteContract,
    getContractById,
    getContractsByProfessional,
    getContractsByCompany,
    getProfessionalContractStats,
    getContractStats,
    updateContractStatus,
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