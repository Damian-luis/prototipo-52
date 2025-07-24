"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useContract } from "@/context/ContractContext";
import { usePayment } from "@/context/PaymentContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Project, Contract, Payment } from "@/types";

const EmpresaReportesPage = () => {
  const { user } = useAuth();
  const { projects } = useProject();
  const { contracts } = useContract();
  const { payments } = usePayment();
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  // Filtrar datos de la empresa
  const empresaProjects = projects.filter(p => p.company_id === user?.id);
  const empresaContracts = contracts.filter(c => c.company_id === user?.id);
  const empresaPayments = payments.filter(p => {
    // Aquí necesitarías verificar si el pago pertenece a un contrato de la empresa
    return true;
  });

  // Cálculos de métricas
  const totalProjects = empresaProjects.length;
  const activeProjects = empresaProjects.filter(p => p.status === 'active').length;
  const completedProjects = empresaProjects.filter(p => p.status === 'completed').length;
  
  const totalContracts = empresaContracts.length;
  const activeContracts = empresaContracts.filter(c => c.status === 'active').length;
  const pendingContracts = empresaContracts.filter(c => c.status === 'pending').length;
  
  const totalPayments = empresaPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = empresaPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = empresaPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const generateReport = () => {
    // Implementar generación de reporte
    console.log('Generando reporte...');
  };

  const exportReport = () => {
    // Implementar exportación de reporte
    console.log('Exportando reporte...');
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Reportes y Analytics" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Controles de reporte */}
        <ComponentCard title="Configuración de Reporte">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="overview">Vista General</option>
                <option value="projects">Reporte de Proyectos</option>
                <option value="contracts">Reporte de Contratos</option>
                <option value="payments">Reporte de Pagos</option>
                <option value="performance">Rendimiento</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
                <option value="365">Último año</option>
                <option value="all">Todo el tiempo</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={generateReport}
                variant="primary"
              >
                Generar Reporte
              </Button>
              <Button
                onClick={exportReport}
                variant="outline"
              >
                Exportar
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ComponentCard title="Proyectos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {totalProjects}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de proyectos
              </p>
              <div className="mt-2 flex justify-center space-x-2 text-xs">
                <span className="text-success-600">{activeProjects} activos</span>
                <span className="text-gray-400">|</span>
                <span className="text-primary-600">{completedProjects} completados</span>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Contratos">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                {totalContracts}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de contratos
              </p>
              <div className="mt-2 flex justify-center space-x-2 text-xs">
                <span className="text-success-600">{activeContracts} activos</span>
                <span className="text-gray-400">|</span>
                <span className="text-warning-600">{pendingContracts} pendientes</span>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                ${totalPayments.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total pagado
              </p>
              <div className="mt-2 flex justify-center space-x-2 text-xs">
                <span className="text-success-600">${completedPayments.toLocaleString()} completados</span>
                <span className="text-gray-400">|</span>
                <span className="text-warning-600">${pendingPayments.toLocaleString()} pendientes</span>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Tasa de Éxito">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proyectos completados
              </p>
              <div className="mt-2 flex justify-center space-x-2 text-xs">
                <span className="text-info-600">{completedProjects} de {totalProjects}</span>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Reporte detallado según tipo */}
        {reportType === "overview" && (
          <ComponentCard title="Vista General">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Resumen de Actividad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Proyectos Recientes</h4>
                    <ul className="space-y-1 text-sm">
                      {empresaProjects.slice(0, 5).map(project => (
                        <li key={project.id} className="flex justify-between">
                          <span>{project.title}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === 'active' ? 'bg-success-100 text-success-800' :
                            project.status === 'completed' ? 'bg-primary-100 text-primary-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Contratos Activos</h4>
                    <ul className="space-y-1 text-sm">
                      {empresaContracts.filter(c => c.status === 'active').slice(0, 5).map(contract => (
                        <li key={contract.id} className="flex justify-between">
                          <span>{contract.project_title}</span>
                          <span className="text-gray-600">${contract.value.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        )}

        {reportType === "projects" && (
          <ComponentCard title="Reporte de Proyectos">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Proyecto</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Presupuesto</th>
                    <th className="text-left py-2">Profesionales</th>
                    <th className="text-left py-2">Fecha Inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {empresaProjects.map(project => (
                    <tr key={project.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2">{project.title}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'active' ? 'bg-success-100 text-success-800' :
                          project.status === 'completed' ? 'bg-primary-100 text-primary-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="py-2">${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}</td>
                      <td className="py-2">{project.professionals.length}</td>
                      <td className="py-2">{new Date(project.start_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}

        {reportType === "contracts" && (
          <ComponentCard title="Reporte de Contratos">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Proyecto</th>
                    <th className="text-left py-2">Profesional</th>
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Firmas</th>
                  </tr>
                </thead>
                <tbody>
                  {empresaContracts.map(contract => (
                    <tr key={contract.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2">{contract.project_title}</td>
                      <td className="py-2">{contract.professional_name}</td>
                      <td className="py-2">{contract.type}</td>
                      <td className="py-2">${contract.value.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          contract.status === 'active' ? 'bg-success-100 text-success-800' :
                          contract.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="py-2">{contract.signatures.length}/2</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}

        {reportType === "payments" && (
          <ComponentCard title="Reporte de Pagos">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2">Profesional</th>
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-left py-2">Monto</th>
                    <th className="text-left py-2">Estado</th>
                    <th className="text-left py-2">Fecha Programada</th>
                    <th className="text-left py-2">Método</th>
                  </tr>
                </thead>
                <tbody>
                  {empresaPayments.map(payment => (
                    <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2">{payment.professional_name}</td>
                      <td className="py-2">{payment.type}</td>
                      <td className="py-2">${payment.amount.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'completed' ? 'bg-success-100 text-success-800' :
                          payment.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                          payment.status === 'failed' ? 'bg-error-100 text-error-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-2">{new Date(payment.scheduled_date).toLocaleDateString()}</td>
                      <td className="py-2">{payment.payment_method.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ComponentCard>
        )}

        {reportType === "performance" && (
          <ComponentCard title="Análisis de Rendimiento">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Métricas de Proyectos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tasa de finalización:</span>
                      <span className="font-medium">
                        {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proyectos activos:</span>
                      <span className="font-medium">{activeProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiempo promedio:</span>
                      <span className="font-medium">45 días</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Métricas Financieras</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Presupuesto total:</span>
                      <span className="font-medium">${empresaProjects.reduce((sum, p) => sum + p.budget.max, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagos realizados:</span>
                      <span className="font-medium">${completedPayments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pagos pendientes:</span>
                      <span className="font-medium">${pendingPayments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default EmpresaReportesPage; 