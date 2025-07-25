"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { reportsService, CompanyReportMetrics } from "@/services/reports.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EmpresaReportesPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<CompanyReportMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReports();
  }, [user, dateRange]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await reportsService.getCompanyReports(dateRange);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: 'pdf' | 'excel') => {
    try {
      const blob = await reportsService.exportReport(type, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reportes-empresa-${type}-${new Date().toISOString().split('T')[0]}.${type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Reportes" />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Reportes" />
        <div className="text-center py-8">
          <p className="text-gray-500">No se pudieron cargar los reportes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Reportes" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros y exportación */}
        <ComponentCard title="Gestión de Reportes">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('excel')}>
                Exportar Excel
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                Exportar PDF
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ComponentCard title="Total de Proyectos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {metrics.totalProjects}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metrics.activeProjects} activos, {metrics.completedProjects} completados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Aplicaciones">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {metrics.totalApplications}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metrics.pendingApplications} pendientes, {metrics.acceptedApplications} aceptadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Contratos">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {metrics.totalContracts}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {metrics.activeContracts} activos, {metrics.completedContracts} completados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Inversión Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {formatCurrency(metrics.totalSpent)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rating promedio: {metrics.averageRating}⭐
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estadísticas mensuales */}
          <ComponentCard title="Estadísticas Mensuales">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'earnings' ? formatCurrency(Number(value)) : value,
                  name === 'projects' ? 'Proyectos' : 
                  name === 'applications' ? 'Aplicaciones' : 
                  name === 'contracts' ? 'Contratos' : 'Ganancias'
                ]} />
                <Legend />
                <Line type="monotone" dataKey="projects" stroke="#8884d8" name="Proyectos" />
                <Line type="monotone" dataKey="applications" stroke="#82ca9d" name="Aplicaciones" />
                <Line type="monotone" dataKey="contracts" stroke="#ffc658" name="Contratos" />
                <Line type="monotone" dataKey="earnings" stroke="#ff7300" name="Ganancias" />
              </LineChart>
            </ResponsiveContainer>
          </ComponentCard>

          {/* Distribución de estados de proyectos */}
          <ComponentCard title="Estado de Proyectos">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.projectStatusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.projectStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ComponentCard>
        </div>

        {/* Habilidades más demandadas */}
        <ComponentCard title="Habilidades Más Demandadas">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.topSkills}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </ComponentCard>

        {/* Trabajos con mejor rendimiento */}
        <ComponentCard title="Trabajos con Mejor Rendimiento">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trabajo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Aplicaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Visualizaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tasa de Conversión
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.topPerformingJobs.map((job) => (
                  <tr key={job.jobId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.applications}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {((job.applications / job.views) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default EmpresaReportesPage; 