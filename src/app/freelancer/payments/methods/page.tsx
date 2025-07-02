"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const PaymentMethodsPage = () => {
  const { user } = useAuth();
  const methods = user?.bankAccounts || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Métodos de Pago</h1>
      {methods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes métodos de pago registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map(method => (
            <ComponentCard key={method.id} title={method.bankName}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{method.bankName}</div>
                  <div className="text-sm text-gray-500">Cuenta: {method.accountNumber}</div>
                  <div className="text-xs text-gray-400 mt-1">Tipo: {method.accountType} | Moneda: {method.currency}</div>
                </div>
                {method.isDefault && <span className="px-2 py-1 rounded font-medium bg-green-100 text-green-800">Principal</span>}
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage; 