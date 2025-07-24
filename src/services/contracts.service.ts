import api from '@/util/axios';

export interface Contract {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  startDate: string;
  endDate?: string;
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  terms?: any;
  smartContractAddress?: string;
  createdAt: string;
  updatedAt: string;
  jobId?: string;
  jobTitle?: string;
  professionalId: string;
  professionalName: string;
  companyId: string;
  companyName: string;
}

export interface CreateContractData {
  title: string;
  description?: string;
  value: number;
  currency: string;
  startDate: string;
  endDate?: string;
  terms?: any;
  jobId?: string;
  professionalId: string;
}

export interface UpdateContractData {
  title?: string;
  description?: string;
  value?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  status?: 'DRAFT' | 'PENDING_SIGNATURE' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  terms?: any;
  smartContractAddress?: string;
}

export const contractsService = {
  // Get all contracts
  async getAllContracts(): Promise<Contract[]> {
    const response = await api.get('/contracts');
    return response.data;
  },

  // Get contract by ID
  async getContractById(id: string): Promise<Contract> {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  // Create contract (company only)
  async createContract(data: CreateContractData): Promise<Contract> {
    const response = await api.post('/contracts', data);
    return response.data;
  },

  // Update contract
  async updateContract(id: string, data: UpdateContractData): Promise<Contract> {
    const response = await api.patch(`/contracts/${id}`, data);
    return response.data;
  },

  // Delete contract
  async deleteContract(id: string): Promise<void> {
    await api.delete(`/contracts/${id}`);
  },

  // Get contracts by professional
  async getContractsByProfessional(): Promise<Contract[]> {
    const response = await api.get('/contracts/professional');
    return response.data;
  },

  // Get contracts by company
  async getContractsByCompany(): Promise<Contract[]> {
    const response = await api.get('/contracts/company');
    return response.data;
  },

  // Get contract stats for professional
  async getProfessionalContractStats(): Promise<any> {
    const response = await api.get('/contracts/professional/stats');
    return response.data;
  },

  // Get contract stats for company
  async getContractStats(): Promise<any> {
    const response = await api.get('/contracts/company/stats');
    return response.data;
  },

  // Update contract status
  async updateContractStatus(id: string, status: string): Promise<Contract> {
    const response = await api.patch(`/contracts/${id}/status`, { status });
    return response.data;
  },
}; 