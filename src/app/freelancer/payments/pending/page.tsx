"use client";
import React from "react";
import { usePayment } from "@/context/PaymentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const PendingPaymentsPage = () => {
  const { payments } = usePayment();
  const { user } = useAuth();
  const pendingPayments = payments.filter(p => p.freelancerId === user?.id && p.status === 'pending');

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Pagos Pendientes</h1>
      {pendingPayments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes pagos pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPayments.map(payment => (
            <ComponentCard key={payment.id} title={payment.description}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{payment.description}</div>
                  <div className="text-sm text-gray-500">{payment.amount} {payment.currency}</div>
                  <div className="text-xs text-gray-400 mt-1">Programado: {new Date(payment.scheduledDate).toLocaleDateString()}</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingPaymentsPage; 