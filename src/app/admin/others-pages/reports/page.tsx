"use client";
import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTalent } from "@/context/TalentContext";
import { useContract } from "@/context/ContractContext";
import { usePayment } from "@/context/PaymentContext";
import ComponentCard from "@/components/common/ComponentCard";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChartOne from "@/components/charts/line/LineChartOne";

const AdminReportsPage = () => {
  const { users } = useAuth();
  const { vacancies, applications, evaluations } = useTalent();
  const { contracts } = useContract();
  const { payments } = usePayment();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Calcular métricas
  const metrics = useMemo(() => {
    const freelancers = users.filter(u => u.role === 'freelancer');
    const activeContracts = contracts.filter(c => c.status === 'active');
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.grossAmount, 0);
    const avgContractValue = contracts.length > 0 
      ? contracts.reduce((sum, c) => sum + c.value, 0) / contracts.length 
      : 0;

    return {
      totalFreelancers: freelancers.length,
      activeContracts: activeContracts.length,
      totalRevenue,
      avgContractValue,
      openVacancies: vacancies.filter(v => v.status === 'open').length,
      totalApplications: applications.length,
      avgEvaluation: evaluations.length > 0
        ? evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length
        : 0,
      conversionRate: vacancies.length > 0 
        ? (activeContracts.length / vacancies.length) * 100
        : 0
    };
  }, [users, contracts, payments, vacancies, applications, evaluations]);

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
    // Aquí iría la lógica real de exportación
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reportes y Analítica
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Métricas y análisis del rendimiento de la plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
            </select>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Exportar PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Exportar Excel
            </button>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Freelancers</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {metrics.totalFreelancers}
          </p>
          <p className="text-sm text-green-600 mt-2">+12% vs mes anterior</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Contratos Activos</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {metrics.activeContracts}
          </p>
          <p className="text-sm text-green-600 mt-2">+8% vs mes anterior</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos Totales</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            ${metrics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-2">+25% vs mes anterior</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Tasa de Conversión</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {metrics.conversionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-red-600 mt-2">-2% vs mes anterior</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ComponentCard title="Evolución de Ingresos">
          <LineChartOne />
        </ComponentCard>

        <ComponentCard title="Contratos por Mes">
          <BarChartOne />
        </ComponentCard>
      </div>

      {/* Distribución de habilidades */}
      <ComponentCard title="Distribución de Habilidades" className="mb-8">
        <BarChartOne />
      </ComponentCard>

      {/* Tabla de resumen */}
      <ComponentCard title="Resumen Detallado">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Métrica
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Valor Actual
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Mes Anterior
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                  Variación
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Vacantes Publicadas
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {metrics.openVacancies}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {Math.max(0, metrics.openVacancies - 3)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600">
                  +{Math.min(3, metrics.openVacancies)}
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Aplicaciones Recibidas
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {metrics.totalApplications}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {Math.max(0, metrics.totalApplications - 15)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600">
                  +{Math.min(15, metrics.totalApplications)}
                </td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Evaluación Promedio
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {metrics.avgEvaluation.toFixed(1)}/5.0
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  {Math.max(0, metrics.avgEvaluation - 0.2).toFixed(1)}/5.0
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600">
                  +0.2
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                  Valor Promedio de Contrato
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  ${metrics.avgContractValue.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                  ${Math.max(0, metrics.avgContractValue - 500).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-green-600">
                  +${Math.min(500, metrics.avgContractValue).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>
    </div>
  );
};

export default AdminReportsPage; 