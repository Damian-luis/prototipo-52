"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { paymentsService, Payment, CreatePaymentData, UpdatePaymentData } from '@/services/payments.service';

interface PaymentContextType {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  createPayment: (paymentData: CreatePaymentData) => Promise<{ success: boolean; message: string; paymentId?: string }>;
  updatePayment: (id: string, paymentData: UpdatePaymentData) => Promise<{ success: boolean; message: string }>;
  getPaymentById: (id: string) => Promise<Payment | null>;
  getPaymentsByProfessional: () => Promise<Payment[]>;
  getPaymentsByCompany: () => Promise<Payment[]>;
  getPaymentsByContract: (contractId: string) => Promise<Payment[]>;
  getProfessionalPaymentStats: () => Promise<any>;
  getPaymentStats: () => Promise<any>;
  updatePaymentStatus: (id: string, status: string) => Promise<{ success: boolean; message: string }>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (paymentData: CreatePaymentData): Promise<{ success: boolean; message: string; paymentId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const newPayment = await paymentsService.createPayment(paymentData);
      
      setPayments(prev => [newPayment, ...prev]);
      
      return { success: true, message: 'Pago creado exitosamente', paymentId: newPayment.id };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear pago';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(async (id: string, paymentData: UpdatePaymentData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedPayment = await paymentsService.updatePayment(id, paymentData);
      
      // Actualizar estado local
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
      
      if (currentPayment?.id === id) {
        setCurrentPayment(updatedPayment);
      }
      
      return { success: true, message: 'Pago actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar pago';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentPayment?.id]);

  const getPaymentById = useCallback(async (id: string): Promise<Payment | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const payment = await paymentsService.getPaymentById(id);
      setCurrentPayment(payment);
      return payment;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pago';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentsByProfessional = useCallback(async (): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const professionalPayments = await paymentsService.getPaymentsByProfessional();
      setPayments(professionalPayments);
      return professionalPayments;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pagos del profesional';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentsByCompany = useCallback(async (): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const companyPayments = await paymentsService.getPaymentsByCompany();
      setPayments(companyPayments);
      return companyPayments;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pagos de la empresa';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentsByContract = useCallback(async (contractId: string): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const contractPayments = await paymentsService.getPaymentsByContract(contractId);
      return contractPayments;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener pagos del contrato';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfessionalPaymentStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await paymentsService.getProfessionalPaymentStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de pagos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await paymentsService.getPaymentStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de pagos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (id: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedPayment = await paymentsService.updatePaymentStatus(id, status);
      
      // Actualizar estado local
      setPayments(prev => prev.map(payment => 
        payment.id === id ? updatedPayment : payment
      ));
      
      if (currentPayment?.id === id) {
        setCurrentPayment(updatedPayment);
      }
      
      return { success: true, message: 'Estado del pago actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar estado del pago';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentPayment?.id]);

  const value: PaymentContextType = {
    payments,
    currentPayment,
    loading,
    error,
    createPayment,
    updatePayment,
    getPaymentById,
    getPaymentsByProfessional,
    getPaymentsByCompany,
    getPaymentsByContract,
    getProfessionalPaymentStats,
    getPaymentStats,
    updatePaymentStatus,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 