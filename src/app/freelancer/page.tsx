"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import { usePayment } from "@/context/PaymentContext";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const { payments } = usePayment();

  const [motivationalMessage] = useState({
    message: "¡Tu talento es tu mayor activo! Sigue creciendo y desarrollándote profesionalmente.",
    author: "Sistema de Motivación"
  });

  // Calcular métricas
  const activeContracts = contracts.filter(c => c.professional_id === user?.id && c.status === 'active');
  const myPayments = payments.filter(p => p.professional_id === user?.id);
  const pendingPayments = myPayments.filter(p => p.status === 'pending');
  const completedPayments = myPayments.filter(p => p.status === 'completed');
  const totalEarnings = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const metrics = [
    {
      title: "Trabajos Activos",
      value: activeContracts.length.toString(),
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Ingresos del Mes",
      value: `$${totalEarnings.toLocaleString()}`,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Calificación Promedio",
      value: "4.8",
      change: "+0.2",
      changeType: "positive" as const,
    },
    {
      title: "Aplicaciones Activas",
      value: "3",
      change: "3 nuevas",
      changeType: "neutral" as const,
    }
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header con mensaje motivacional */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Hola, {user?.name}! 👋
        </h1>
        {motivationalMessage && (
          <div className="mt-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <p className="text-brand-700 dark:text-brand-300 italic">
              "{motivationalMessage.message}"
            </p>
            {motivationalMessage.author && (
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-2">
                - {motivationalMessage.author}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </p>
              </div>
              <div className={`flex items-center text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changeType === 'positive' && (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                )}
                {metric.changeType === 'negative' && (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {metric.changeType === 'neutral' && (
                  <span className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/freelancer/jobs" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">💼</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Buscar Trabajos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explora nuevas oportunidades de trabajo
            </p>
          </div>
        </Link>
        
        <Link href="/freelancer/contracts" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mis Contratos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tus contratos activos
            </p>
          </div>
        </Link>
        
        <Link href="/freelancer/payments" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pagos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Revisa tus pagos y facturas
            </p>
          </div>
        </Link>
      </div>

      {/* Contratos activos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Contratos Activos
          </h2>
          <Link 
            href="/freelancer/contracts"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        
        {activeContracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeContracts.slice(0, 3).map((contract) => (
              <div key={contract.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {contract.project_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Cliente: {contract.company_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valor: ${contract.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No tienes contratos activos en este momento.
            </p>
            <Link 
              href="/freelancer/jobs"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium mt-2 inline-block"
            >
              Buscar trabajos
            </Link>
          </div>
        )}
      </div>

      {/* Pagos recientes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pagos Recientes
          </h2>
          <Link 
            href="/freelancer/payments"
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        
        {completedPayments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedPayments.slice(0, 3).map((payment) => (
              <div key={payment.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  ${payment.amount.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {payment.description}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Completado
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No hay pagos recientes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard; 