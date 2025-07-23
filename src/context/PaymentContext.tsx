"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { paymentService } from '@/services/supabase';
import { Payment, PaymentMethod, Invoice, InvoiceItem } from '@/types';

export interface TaxDeduction {
  name: string;
  type: 'income_tax' | 'social_security' | 'health_insurance' | 'other';
  rate: number; // porcentaje
  amount: number;
  jurisdiction: string;
}

export interface PayrollBatch {
  id: string;
  name: string;
  scheduled_date: string;
  payments: string[]; // IDs de pagos
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  total_amount: number;
  currency: string;
  created_at: string;
  processed_at?: string;
}

interface PaymentContextType {
  payments: Payment[];
  payrollBatches: PayrollBatch[];
  createPayment: (payment: Omit<Payment, 'id' | 'created_at'>) => Promise<{ success: boolean; message: string; paymentId?: string }>;
  updatePaymentStatus: (id: string, status: Payment['status']) => Promise<{ success: boolean; message: string }>;
  processPayment: (id: string) => Promise<{ success: boolean; message: string }>;
  createPayrollBatch: (batch: Omit<PayrollBatch, 'id' | 'created_at' | 'status'>) => Promise<{ success: boolean; message: string }>;
  processPayrollBatch: (batchId: string) => Promise<{ success: boolean; message: string }>;
  calculateTaxes: (amount: number, jurisdiction: string) => TaxDeduction[];
  getPaymentsByProfessional: (professionalId: string) => Promise<Payment[]>;
  getPaymentsByContract: (contractId: string) => Promise<Payment[]>;
  generateInvoice: (paymentId: string) => Invoice;
  schedulePayment: (paymentId: string, date: string) => Promise<{ success: boolean; message: string }>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Configuración de impuestos por jurisdicción
const TAX_CONFIGURATIONS: Record<string, TaxDeduction[]> = {
  'US': [
    { name: 'Federal Income Tax', type: 'income_tax', rate: 22, amount: 0, jurisdiction: 'US' },
    { name: 'Social Security', type: 'social_security', rate: 6.2, amount: 0, jurisdiction: 'US' },
    { name: 'Medicare', type: 'health_insurance', rate: 1.45, amount: 0, jurisdiction: 'US' }
  ],
  'ES': [
    { name: 'IRPF', type: 'income_tax', rate: 19, amount: 0, jurisdiction: 'ES' },
    { name: 'Seguridad Social', type: 'social_security', rate: 6.35, amount: 0, jurisdiction: 'ES' }
  ],
  'MX': [
    { name: 'ISR', type: 'income_tax', rate: 15, amount: 0, jurisdiction: 'MX' },
    { name: 'IMSS', type: 'social_security', rate: 5, amount: 0, jurisdiction: 'MX' }
  ]
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payrollBatches, setPayrollBatches] = useState<PayrollBatch[]>([]);

  function calculateTaxes(amount: number, jurisdiction: string): TaxDeduction[] {
    const config = TAX_CONFIGURATIONS[jurisdiction] || TAX_CONFIGURATIONS['US'];
    return config.map(tax => ({
      ...tax,
      amount: (amount * tax.rate) / 100
    }));
  }

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'created_at'>): Promise<{ success: boolean; message: string; paymentId?: string }> => {
    try {
      const paymentId = await paymentService.createPayment(paymentData);
      
      // Actualizar estado local
      const newPayment: Payment = {
        id: paymentId,
        ...paymentData,
        created_at: new Date().toISOString()
      };
      
      setPayments(prev => [newPayment, ...prev]);
      
      return { success: true, message: 'Pago creado exitosamente', paymentId };
    } catch (error) {
      console.error('Error creating payment:', error);
      return { success: false, message: 'Error al crear pago' };
    }
  };

  const updatePaymentStatus = async (id: string, status: Payment['status']): Promise<{ success: boolean; message: string }> => {
    try {
      await paymentService.updatePaymentStatus(id, status);
      
      // Actualizar estado local
      setPayments(prev => prev.map(payment => 
        payment.id === id 
          ? { 
              ...payment, 
              status,
              processed_date: status === 'completed' ? new Date().toISOString() : payment.processed_date
            }
          : payment
      ));
      
      return { success: true, message: 'Estado del pago actualizado exitosamente' };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return { success: false, message: 'Error al actualizar estado del pago' };
    }
  };

  const processPayment = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const payment = payments.find(p => p.id === id);
      if (!payment) {
        return { success: false, message: 'Pago no encontrado' };
      }

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updatePaymentStatus(id, 'completed');
      
      return { success: true, message: 'Pago procesado exitosamente' };
    } catch (error) {
      console.error('Error processing payment:', error);
      return { success: false, message: 'Error al procesar pago' };
    }
  };

  const createPayrollBatch = async (batchData: Omit<PayrollBatch, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; message: string }> => {
    try {
      const newBatch: PayrollBatch = {
        id: Date.now().toString(),
        ...batchData,
        status: 'scheduled',
        created_at: new Date().toISOString()
      };
      
      setPayrollBatches(prev => [newBatch, ...prev]);
      
      return { success: true, message: 'Lote de nómina creado exitosamente' };
    } catch (error) {
      console.error('Error creating payroll batch:', error);
      return { success: false, message: 'Error al crear lote de nómina' };
    }
  };

  const processPayrollBatch = async (batchId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const batch = payrollBatches.find(b => b.id === batchId);
      if (!batch) {
        return { success: false, message: 'Lote de nómina no encontrado' };
      }

      // Actualizar estado del lote
      setPayrollBatches(prev => prev.map(b => 
        b.id === batchId 
          ? { ...b, status: 'processing' }
          : b
      ));

      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Procesar cada pago en el lote
      for (const paymentId of batch.payments) {
        await processPayment(paymentId);
      }

      // Marcar como completado
      setPayrollBatches(prev => prev.map(b => 
        b.id === batchId 
          ? { 
              ...b, 
              status: 'completed',
              processed_at: new Date().toISOString()
            }
          : b
      ));

      return { success: true, message: 'Lote de nómina procesado exitosamente' };
    } catch (error) {
      console.error('Error processing payroll batch:', error);
      return { success: false, message: 'Error al procesar lote de nómina' };
    }
  };

  const getPaymentsByProfessional = async (professionalId: string): Promise<Payment[]> => {
    try {
      const professionalPayments = await paymentService.getPaymentsByProfessional(professionalId);
      return professionalPayments;
    } catch (error) {
      console.error('Error getting payments by professional:', error);
      return [];
    }
  };

  const getPaymentsByContract = async (contractId: string): Promise<Payment[]> => {
    try {
      const contractPayments = await paymentService.getPaymentsByContract(contractId);
      return contractPayments;
    } catch (error) {
      console.error('Error getting payments by contract:', error);
      return [];
    }
  };

  const generateInvoice = (paymentId: string): Invoice => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    const invoice: Invoice = {
      id: `INV-${paymentId}`,
      number: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      items: [
        {
          description: payment.description,
          quantity: 1,
          rate: payment.amount,
          amount: payment.amount
        }
      ],
      total: payment.amount,
      status: 'draft'
    };

    return invoice;
  };

  const schedulePayment = async (paymentId: string, date: string): Promise<{ success: boolean; message: string }> => {
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        return { success: false, message: 'Pago no encontrado' };
      }

      await paymentService.updatePaymentStatus(paymentId, 'pending');
      
      // Actualizar estado local
      setPayments(prev => prev.map(p => 
        p.id === paymentId 
          ? { ...p, scheduled_date: date, status: 'pending' }
          : p
      ));
      
      return { success: true, message: 'Pago programado exitosamente' };
    } catch (error) {
      console.error('Error scheduling payment:', error);
      return { success: false, message: 'Error al programar pago' };
    }
  };

  const value: PaymentContextType = {
    payments,
    payrollBatches,
    createPayment,
    updatePaymentStatus,
    processPayment,
    createPayrollBatch,
    processPayrollBatch,
    calculateTaxes,
    getPaymentsByProfessional,
    getPaymentsByContract,
    generateInvoice,
    schedulePayment
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