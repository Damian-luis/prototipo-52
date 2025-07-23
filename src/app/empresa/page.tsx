"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useContract } from "@/context/ContractContext";
import { usePayment } from "@/context/PaymentContext";
import { useAI } from "@/context/AIContext";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

const EmpresaDashboard = () => {
  const { user } = useAuth();
  const { projects, getProjectsByCompany } = useProject();
  const { contracts, getContractsByCompany } = useContract();
  const { payments, getPaymentsByContract } = usePayment();
  const { recommendations } = useAI();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await Promise.all([
          getProjectsByCompany(user.id),
          getContractsByCompany(user.id)
        ]);
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]); // Removemos getProjectsByCompany y getContractsByCompany del array de dependencias

  // Calcular métricas
  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const activeContracts = contracts.filter(c => c.status === 'active');
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const metrics = [
    {
      title: "Proyectos Activos",
      value: activeProjects.length.toString(),
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Contratos Activos",
      value: activeContracts.length.toString(),
      change: "+1",
      changeType: "positive" as const,
    },
    {
      title: "Total Gastado",
      value: `$${totalSpent.toLocaleString()}`,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Pagos Pendientes",
      value: `$${totalPending.toLocaleString()}`,
      change: "3 pagos",
      changeType: "neutral" as const,
    }
  ] as const;

  // Proyectos recientes
  const recentProjects = projects.slice(0, 5);

  // Recomendaciones de IA
  const aiRecommendations = recommendations.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          ¡Hola, {user?.name}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
          Aquí tienes un resumen de tu actividad empresarial
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{metric.value}</h4>
              </div>
              <div className={`flex items-center text-sm ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : metric.changeType === 'negative' ? (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                ) : null}
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Proyectos recientes */}
        <div className="lg:col-span-2">
          <ComponentCard title="Proyectos Recientes" className="h-full">
            <div className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{project.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.description.substring(0, 100)}...
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Link 
                      href={`/empresa/proyectos/${project.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No hay proyectos aún</p>
                  <Link 
                    href="/empresa/proyectos/nuevo"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Crear Proyecto
                  </Link>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>

        {/* Recomendaciones de IA */}
        <div className="lg:col-span-1">
          <ComponentCard title="Recomendaciones IA" className="h-full">
            <div className="space-y-4">
              {aiRecommendations.length > 0 ? (
                aiRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{recommendation.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {recommendation.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Confianza: {recommendation.confidence}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No hay recomendaciones disponibles</p>
                </div>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8">
        <ComponentCard title="Acciones Rápidas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/empresa/proyectos/nuevo"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">Crear Proyecto</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Inicia un nuevo proyecto de outsourcing
              </p>
            </Link>
            <Link 
              href="/empresa/profesionales"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">Buscar Profesionales</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Encuentra el talento que necesitas
              </p>
            </Link>
            <Link 
              href="/empresa/reportes"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white">Ver Reportes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Analiza el rendimiento de tus proyectos
              </p>
            </Link>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default EmpresaDashboard; 