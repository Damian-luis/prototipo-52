"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTalent } from "@/context/TalentContext";
import { useContract } from "@/context/ContractContext";
import { usePayment } from "@/context/PaymentContext";
import { useAI } from "@/context/AIContext";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const { applications, vacancies, evaluations } = useTalent();
  const { contracts } = useContract();
  const { payments } = usePayment();
  const { getMotivationalMessage } = useAI();

  const [motivationalMessage, setMotivationalMessage] = useState<unknown>(null);

  useEffect(() => {
    setMotivationalMessage(getMotivationalMessage());
  }, [getMotivationalMessage]);

  // Calcular métricas
  const myApplications = applications.filter(a => a.freelancerId === user?.id);
  const activeContracts = contracts.filter(c => c.freelancerId === user?.id && c.status === 'active');
  const myPayments = payments.filter(p => p.freelancerId === user?.id);
  const pendingPayments = myPayments.filter(p => p.status === 'pending');
  const completedPayments = myPayments.filter(p => p.status === 'completed');
  const totalEarnings = completedPayments.reduce((sum, p) => sum + p.netAmount, 0);
  const myEvaluations = evaluations.filter(e => e.freelancerId === user?.id);
  const avgRating = myEvaluations.length > 0
    ? myEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / myEvaluations.length
    : 0;

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
      value: avgRating.toFixed(1),
      change: "+0.2",
      changeType: "positive" as const,
    },
    {
      title: "Aplicaciones Activas",
      value: myApplications.filter(a => a.status === 'pending').length.toString(),
      change: "3 nuevas",
      changeType: "neutral" as const,
    }
  ] as const;

  // Trabajos recomendados
  const recommendedJobs = vacancies
    .filter(v => v.status === 'open')
    .filter(v => {
      // Filtrar por habilidades del usuario
      const userSkills = user?.skills || [];
      return v.skills.some(skill => userSkills.includes(skill));
    })
    .slice(0, 3);

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
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-2xl dark:text-white/90">
                  {metric.value}
                </h4>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changeType === 'positive' && <ArrowUpIcon className="w-4 h-4" />}
                {metric.changeType === 'negative' && <ArrowDownIcon className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trabajos Recomendados */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Trabajos Recomendados para Ti
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Basados en tus habilidades
              </p>
            </div>
            <Link href="/freelancer/jobs/search" className="text-brand-500 hover:text-brand-600 text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.location} • {job.type}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      ${job.salaryRange.min} - ${job.salaryRange.max} {job.salaryRange.currency}
                    </span>
                    <Link
                      href={`/freelancer/jobs/${job.id}`}
                      className="text-sm text-brand-500 hover:text-brand-600"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
              {recommendedJobs.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay trabajos recomendados en este momento
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                Pagos Pendientes
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Próximos pagos programados
              </p>
            </div>
            <Link href="/freelancer/payments/pending" className="text-brand-500 hover:text-brand-600 text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
            <div className="space-y-4">
              {pendingPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{payment.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Programado: {new Date(payment.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ${payment.netAmount.toLocaleString()}
                  </span>
                </div>
              ))}
              {pendingPayments.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay pagos pendientes
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contratos Activos */}
        <ComponentCard
          title="Contratos Activos"
          desc="Tus proyectos en curso"
        >
          <div className="flex justify-end -mt-8 mb-4">
            <Link href="/freelancer/contracts/active" className="text-brand-500 hover:text-brand-600 text-sm">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {activeContracts.slice(0, 3).map((contract) => (
              <div key={contract.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h4 className="font-semibold text-gray-900 dark:text-white">{contract.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Cliente: {contract.clientName}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Vence: {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
                    Activo
                  </span>
                </div>
              </div>
            ))}
            {activeContracts.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No hay contratos activos
              </p>
            )}
          </div>
        </ComponentCard>

        {/* Estadísticas Rápidas */}
        <ComponentCard
          title="Tu Desempeño"
          desc="Resumen de tu actividad"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myApplications.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aplicaciones Totales</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myEvaluations.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Evaluaciones</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {contracts.filter(c => c.freelancerId === user?.id && c.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Proyectos Completados</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.skills?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Habilidades</p>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Acciones Rápidas */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/freelancer/jobs/search"
          className="flex items-center justify-center p-4 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
        >
          <span className="font-medium">Buscar Nuevos Trabajos</span>
        </Link>
        <Link
          href="/freelancer/profile"
          className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium">Actualizar Perfil</span>
        </Link>
        <Link
          href="/freelancer/ai-assistant"
          className="flex items-center justify-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <span className="font-medium">Consultar IA</span>
        </Link>
        <Link
          href="/freelancer/support"
          className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium">Obtener Soporte</span>
        </Link>
      </div>
    </div>
  );
};

export default FreelancerDashboard; 