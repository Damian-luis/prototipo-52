import api from '@/util/axios';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  method: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO' | 'PLATFORM_WALLET';
  transactionHash?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  contractId: string;
  contractTitle: string;
  professionalId: string;
  professionalName: string;
  companyId: string;
  companyName: string;
}

export interface CreatePaymentData {
  amount: number;
  currency: string;
  description: string;
  method: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO' | 'PLATFORM_WALLET';
  dueDate?: string;
  contractId: string;
  professionalId: string;
}

export interface UpdatePaymentData {
  amount?: number;
  currency?: string;
  description?: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  method?: 'PAYPAL' | 'BANK_TRANSFER' | 'CRYPTO' | 'PLATFORM_WALLET';
  transactionHash?: string;
  dueDate?: string;
  paidAt?: string;
}

export const paymentsService = {
  // Get all payments
  async getAllPayments(): Promise<Payment[]> {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get payment by ID
  async getPaymentById(id: string): Promise<Payment> {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Create payment (company only)
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await api.post('/payments', data);
    return response.data;
  },

  // Update payment
  async updatePayment(id: string, data: UpdatePaymentData): Promise<Payment> {
    const response = await api.patch(`/payments/${id}`, data);
    return response.data;
  },

  // Get payments by professional
  async getPaymentsByProfessional(): Promise<Payment[]> {
    const response = await api.get('/payments/professional');
    return response.data;
  },

  // Get payments by company
  async getPaymentsByCompany(): Promise<Payment[]> {
    const response = await api.get('/payments/company');
    return response.data;
  },

  // Get payments by contract
  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    const response = await api.get(`/payments/contract/${contractId}`);
    return response.data;
  },

  // Get payment stats for professional
  async getProfessionalPaymentStats(): Promise<any> {
    const response = await api.get('/payments/professional/stats');
    return response.data;
  },

  // Get payment stats for company
  async getPaymentStats(): Promise<any> {
    const response = await api.get('/payments/company/stats');
    return response.data;
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: string): Promise<Payment> {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data;
  },
}; 