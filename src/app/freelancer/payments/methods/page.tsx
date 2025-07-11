"use client";
import React from "react";
import PaymentMethodsManager from "@/components/payments/PaymentMethodsManager";

export default function PaymentMethodsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Métodos de Pago</h1>
      <PaymentMethodsManager />
    </div>
  );
}
