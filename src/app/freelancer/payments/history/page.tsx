"use client";
import React from "react";
import { usePayment } from "@/context/PaymentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const PaymentsHistoryPage = () => {
  const { payments } = usePayment();
  const { user } = useAuth();
  const myPayments = payments.filter(p => p.freelancerId === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Pagos</h1>
      {myPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes pagos registrados aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myPayments.map(payment => (
            <ComponentCard key={payment.id} title={payment.description}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{payment.description}</div>
                  <div className="text-sm text-gray-500">{payment.amount} {payment.currency}</div>
                  <div className="text-xs text-gray-400 mt-1">Procesado: {payment.processedDate ? new Date(payment.processedDate).toLocaleDateString() : '-'}</div>
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded font-medium ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    payment.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsHistoryPage; 