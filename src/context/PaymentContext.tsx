"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Payment {
  id: string;
  contractId: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  currency: string;
  type: 'salary' | 'milestone' | 'bonus' | 'reimbursement';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: PaymentMethod;
  scheduledDate: string;
  processedDate?: string;
  description: string;
  invoice?: Invoice;
  taxes: TaxDeduction[];
  netAmount: number;
  grossAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'paypal' | 'crypto' | 'wire';
  details: {
    accountNumber?: string;
    bankName?: string;
    email?: string;
    walletAddress?: string;
  };
  isDefault: boolean;
}

export interface TaxDeduction {
  name: string;
  type: 'income_tax' | 'social_security' | 'health_insurance' | 'other';
  rate: number; // porcentaje
  amount: number;
  jurisdiction: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PayrollBatch {
  id: string;
  name: string;
  scheduledDate: string;
  payments: string[]; // IDs de pagos
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  totalAmount: number;
  currency: string;
  createdAt: string;
  processedAt?: string;
}

interface PaymentContextType {
  payments: Payment[];
  payrollBatches: PayrollBatch[];
  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'netAmount'>) => Promise<{ success: boolean; message: string; paymentId?: string }>;
  updatePaymentStatus: (id: string, status: Payment['status']) => Promise<{ success: boolean; message: string }>;
  processPayment: (id: string) => Promise<{ success: boolean; message: string }>;
  createPayrollBatch: (batch: Omit<PayrollBatch, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; message: string }>;
  processPayrollBatch: (batchId: string) => Promise<{ success: boolean; message: string }>;
  calculateTaxes: (amount: number, jurisdiction: string) => TaxDeduction[];
  getPaymentsByFreelancer: (freelancerId: string) => Payment[];
  getPaymentsByContract: (contractId: string) => Payment[];
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
    { name: 'ISR', type: 'income_tax', rate: 30, amount: 0, jurisdiction: 'MX' },
    { name: 'IMSS', type: 'social_security', rate: 3.15, amount: 0, jurisdiction: 'MX' }
  ]
};

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payrollBatches, setPayrollBatches] = useState<PayrollBatch[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedPayments = localStorage.getItem('payments');
    const storedBatches = localStorage.getItem('payrollBatches');
    
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    } else {
      // Crear pagos de ejemplo
      const defaultPayments: Payment[] = [
        {
          id: '1',
          contractId: '1',
          freelancerId: '2',
          freelancerName: 'Juan Pérez',
          amount: 5000,
          currency: 'USD',
          type: 'milestone',
          status: 'completed',
          paymentMethod: {
            id: '1',
            type: 'bank_transfer',
            details: {
              accountNumber: '****1234',
              bankName: 'Bank of America'
            },
            isDefault: true
          },
          scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          processedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Pago por completar hito: Diseño y Prototipo',
          taxes: calculateTaxes(5000, 'US'),
          netAmount: 0, // Se calculará
          grossAmount: 5000,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      // Calcular montos netos
      defaultPayments.forEach(payment => {
        const totalTaxAmount = payment.taxes.reduce((sum, tax) => sum + tax.amount, 0);
        payment.netAmount = payment.grossAmount - totalTaxAmount;
      });
      
      localStorage.setItem('payments', JSON.stringify(defaultPayments));
      setPayments(defaultPayments);
    }

    if (storedBatches) {
      setPayrollBatches(JSON.parse(storedBatches));
    }
  }, []);

  function calculateTaxes(amount: number, jurisdiction: string): TaxDeduction[] {
    const taxes = TAX_CONFIGURATIONS[jurisdiction] || TAX_CONFIGURATIONS['US'];
    return taxes.map(tax => ({
      ...tax,
      amount: amount * (tax.rate / 100)
    }));
  }

  const createPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'netAmount'>): Promise<{ success: boolean; message: string; paymentId?: string }> => {
    const totalTaxAmount = paymentData.taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const netAmount = paymentData.grossAmount - totalTaxAmount;

    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
      netAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));

    // Simular notificación
    console.log(`Notificación: Nuevo pago programado para ${paymentData.freelancerName}`);

    return { 
      success: true, 
      message: 'Pago creado exitosamente', 
      paymentId: newPayment.id 
    };
  };

  const updatePaymentStatus = async (id: string, status: Payment['status']): Promise<{ success: boolean; message: string }> => {
    const updatedPayments = payments.map(p => 
      p.id === id 
        ? { 
            ...p, 
            status,
            processedDate: status === 'completed' ? new Date().toISOString() : p.processedDate,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));

    // Simular notificación
    const payment = payments.find(p => p.id === id);
    if (payment) {
      console.log(`Notificación: Estado de pago actualizado a ${status} para ${payment.freelancerName}`);
    }

    return { success: true, message: 'Estado de pago actualizado' };
  };

  const processPayment = async (id: string): Promise<{ success: boolean; message: string }> => {
    const payment = payments.find(p => p.id === id);
    if (!payment) {
      return { success: false, message: 'Pago no encontrado' };
    }

    if (payment.status !== 'pending') {
      return { success: false, message: 'El pago no está pendiente' };
    }

    // Simular procesamiento de pago
    await updatePaymentStatus(id, 'processing');
    
    // Simular demora de procesamiento
    setTimeout(async () => {
      await updatePaymentStatus(id, 'completed');
    }, 2000);

    return { success: true, message: 'Pago en proceso' };
  };

  const createPayrollBatch = async (batchData: Omit<PayrollBatch, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
    const newBatch: PayrollBatch = {
      ...batchData,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    const updatedBatches = [...payrollBatches, newBatch];
    setPayrollBatches(updatedBatches);
    localStorage.setItem('payrollBatches', JSON.stringify(updatedBatches));

    return { success: true, message: 'Lote de nómina creado exitosamente' };
  };

  const processPayrollBatch = async (batchId: string): Promise<{ success: boolean; message: string }> => {
    const batch = payrollBatches.find(b => b.id === batchId);
    if (!batch) {
      return { success: false, message: 'Lote no encontrado' };
    }

    // Actualizar estado del lote
    const updatedBatches = payrollBatches.map(b => 
      b.id === batchId 
        ? { ...b, status: 'processing' as const, processedAt: new Date().toISOString() }
        : b
    );
    setPayrollBatches(updatedBatches);
    localStorage.setItem('payrollBatches', JSON.stringify(updatedBatches));

    // Procesar todos los pagos del lote
    for (const paymentId of batch.payments) {
      await processPayment(paymentId);
    }

    // Marcar lote como completado
    const finalBatches = updatedBatches.map(b => 
      b.id === batchId 
        ? { ...b, status: 'completed' as const }
        : b
    );
    setPayrollBatches(finalBatches);
    localStorage.setItem('payrollBatches', JSON.stringify(finalBatches));

    return { success: true, message: 'Lote de nómina procesado exitosamente' };
  };

  const getPaymentsByFreelancer = (freelancerId: string) => 
    payments.filter(p => p.freelancerId === freelancerId);

  const getPaymentsByContract = (contractId: string) => 
    payments.filter(p => p.contractId === contractId);

  const generateInvoice = (paymentId: string): Invoice => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) {
      throw new Error('Pago no encontrado');
    }

    return {
      id: Date.now().toString(),
      number: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          description: payment.description,
          quantity: 1,
          rate: payment.grossAmount,
          amount: payment.grossAmount
        }
      ],
      total: payment.grossAmount,
      status: payment.status === 'completed' ? 'paid' : 'sent'
    };
  };

  const schedulePayment = async (paymentId: string, date: string): Promise<{ success: boolean; message: string }> => {
    const updatedPayments = payments.map(p => 
      p.id === paymentId 
        ? { ...p, scheduledDate: date, updatedAt: new Date().toISOString() }
        : p
    );
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));

    return { success: true, message: 'Pago programado exitosamente' };
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      payrollBatches,
      createPayment,
      updatePaymentStatus,
      processPayment,
      createPayrollBatch,
      processPayrollBatch,
      calculateTaxes,
      getPaymentsByFreelancer,
      getPaymentsByContract,
      generateInvoice,
      schedulePayment
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment debe ser usado dentro de PaymentProvider');
  }
  return context;
}; 