"use client";
import React from "react";
import { usePayment } from "@/context/PaymentContext";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";

const PaymentDetailAdminPage = () => {
  const { id } = useParams();
  const paymentId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
  const { payments } = usePayment();
  const payment = payments.find(p => String(p.id) === paymentId);

  if (!payment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Pago no encontrado</h1>
        <p className="text-gray-500 dark:text-gray-400">El pago solicitado no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Detalle de Pago</h1>
      <ComponentCard title="Información del Pago">
        <div className="mb-2 text-gray-700 dark:text-gray-300">Freelancer: {payment.freelancerName}</div>
        <div className="mb-2 text-sm text-gray-500">Monto bruto: ${payment.grossAmount} {payment.currency}</div>
        <div className="mb-2 text-sm text-gray-500">Monto neto: ${payment.netAmount} {payment.currency}</div>
        <div className="mb-2 text-sm text-gray-500">Estado: {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</div>
        <div className="mb-2 text-sm text-gray-500">Tipo: {payment.type}</div>
        <div className="mb-2 text-sm text-gray-500">Método: {payment.paymentMethod.type}</div>
        <div className="mb-2 text-sm text-gray-500">Programado para: {new Date(payment.scheduledDate).toLocaleDateString()}</div>
        {payment.processedDate && <div className="mb-2 text-sm text-gray-500">Procesado el: {new Date(payment.processedDate).toLocaleDateString()}</div>}
        <div className="mb-2 text-sm text-gray-500">Descripción: {payment.description}</div>
        <div className="mb-2 text-sm text-gray-500">Contrato asociado: {payment.contractId}</div>
        <div className="mb-2 text-sm text-gray-500">Creado: {new Date(payment.createdAt).toLocaleDateString()}</div>
        <div className="mb-2 text-sm text-gray-500">Actualizado: {new Date(payment.updatedAt).toLocaleDateString()}</div>
        {payment.invoice && (
          <div className="mt-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <span className="text-xs text-gray-500">Factura:</span>
            <div className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all">{payment.invoice.number} ({payment.invoice.status})</div>
          </div>
        )}
        {payment.taxes && payment.taxes.length > 0 && (
          <div className="mt-4">
            <span className="font-medium">Deducciones de impuestos:</span>
            <ul className="list-disc ml-6 text-xs text-gray-700 dark:text-gray-300">
              {payment.taxes.map((tax, idx) => (
                <li key={idx}>{tax.name}: -${tax.amount.toFixed(2)} ({tax.rate}%)</li>
              ))}
            </ul>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default PaymentDetailAdminPage; 