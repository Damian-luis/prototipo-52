"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface PendingPayment {
  id: string;
  contract_id: string;
  project_title: string;
  company_name: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  payment_method: string;
  expected_date: string;
  description: string;
  milestone_title?: string;
  hours_worked?: number;
  hourly_rate?: number;
  days_overdue?: number;
  priority: 'low' | 'medium' | 'high';
  client_contact: {
    name: string;
    email: string;
    phone?: string;
  };
}

const FreelancerPaymentsPendingPage = () => {
  const { user } = useAuth();
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PendingPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    // Simular datos de pagos pendientes
    const mockPendingPayments: PendingPayment[] = [
      {
        id: "1",
        contract_id: "contract1",
        project_title: "Desarrollo de E-commerce",
        company_name: "TechCorp",
        amount: 2000,
        currency: "USD",
        status: 'pending',
        payment_method: "Transferencia bancaria",
        expected_date: "2024-02-25",
        description: "Pago por hito 2 - Desarrollo del frontend",
        milestone_title: "Frontend completado",
        days_overdue: 3,
        priority: 'high',
        client_contact: {
          name: "María González",
          email: "maria@techcorp.com",
          phone: "+1-555-0123"
        }
      },
      {
        id: "2",
        contract_id: "contract2",
        project_title: "Diseño de UI/UX",
        company_name: "DesignStudio",
        amount: 1500,
        currency: "USD",
        status: 'processing',
        payment_method: "PayPal",
        expected_date: "2024-02-28",
        description: "Pago semanal - Semana 2",
        hours_worked: 40,
        hourly_rate: 37.5,
        days_overdue: 0,
        priority: 'medium',
        client_contact: {
          name: "Carlos Ruiz",
          email: "carlos@designstudio.com"
        }
      },
      {
        id: "3",
        contract_id: "contract3",
        project_title: "Consultoría de Marketing Digital",
        company_name: "MarketingPro",
        amount: 1000,
        currency: "USD",
        status: 'approved',
        payment_method: "Stripe",
        expected_date: "2024-03-01",
        description: "Pago por hito 1 - Auditoría SEO",
        milestone_title: "Auditoría completada",
        days_overdue: -2,
        priority: 'low',
        client_contact: {
          name: "Ana Martínez",
          email: "ana@marketingpro.com",
          phone: "+1-555-0456"
        }
      },
      {
        id: "4",
        contract_id: "contract4",
        project_title: "Desarrollo de API REST",
        company_name: "StartupXYZ",
        amount: 3000,
        currency: "USD",
        status: 'rejected',
        payment_method: "Transferencia bancaria",
        expected_date: "2024-02-20",
        description: "Pago por hito 1 - Diseño de API",
        milestone_title: "API diseñada",
        days_overdue: 8,
        priority: 'high',
        client_contact: {
          name: "Luis Pérez",
          email: "luis@startupxyz.com"
        }
      },
      {
        id: "5",
        contract_id: "contract5",
        project_title: "Mantenimiento de Sitio Web",
        company_name: "WebSolutions",
        amount: 800,
        currency: "USD",
        status: 'pending',
        payment_method: "PayPal",
        expected_date: "2024-03-05",
        description: "Pago mensual de mantenimiento",
        days_overdue: -5,
        priority: 'low',
        client_contact: {
          name: "Sofia García",
          email: "sofia@websolutions.com",
          phone: "+1-555-0789"
        }
      }
    ];
    
    setPendingPayments(mockPendingPayments);
  }, []);

  useEffect(() => {
    let filtered = pendingPayments;
    
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    if (priorityFilter !== "all") {
      filtered = filtered.filter(payment => payment.priority === priorityFilter);
    }
    
    setFilteredPayments(filtered);
  }, [pendingPayments, searchTerm, statusFilter, priorityFilter]);

  const handleContactClient = (clientContact: PendingPayment['client_contact']) => {
    // Implementar contacto con cliente
    console.log('Contactar cliente:', clientContact.email);
  };

  const handleViewDetails = (payment: PendingPayment) => {
    // Implementar ver detalles del pago
    console.log('Ver detalles:', payment.id);
  };

  const handleRequestPayment = (payment: PendingPayment) => {
    // Implementar solicitud de pago
    console.log('Solicitar pago:', payment.id);
  };

  const handleDisputePayment = (payment: PendingPayment) => {
    // Implementar disputa de pago
    console.log('Disputar pago:', payment.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'light';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '✅';
      default: return '📋';
    }
  };

  const getOverdueText = (days: number) => {
    if (days > 0) return `${days} días de retraso`;
    if (days < 0) return `${Math.abs(days)} días antes`;
    return "A tiempo";
  };

  const getOverdueColor = (days: number) => {
    if (days > 7) return 'error';
    if (days > 3) return 'warning';
    if (days < 0) return 'success';
    return 'info';
  };

  const stats = {
    total: pendingPayments.length,
    totalAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
    overdue: pendingPayments.filter(p => (p.days_overdue || 0) > 0).length,
    highPriority: pendingPayments.filter(p => p.priority === 'high').length,
    approved: pendingPayments.filter(p => p.status === 'approved').length,
    rejected: pendingPayments.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Pagos Pendientes" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Pagos Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En proceso
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Monto Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                ${stats.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                USD
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Con Retraso">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.overdue}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pagos atrasados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Alta Prioridad">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.highPriority}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren atención
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentCard title="Pagos Aprobados">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.approved}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En camino
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Rechazados">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren acción
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por proyecto, empresa o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta prioridad</option>
              <option value="medium">Media prioridad</option>
              <option value="low">Baja prioridad</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de pagos pendientes */}
        <div className="space-y-6">
          {filteredPayments.map((payment) => (
            <ComponentCard key={payment.id} title={payment.project_title}>
              <div className="space-y-6">
                {/* Header del pago */}
                <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {payment.project_title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {payment.company_name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {payment.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStatusIcon(payment.status)}</span>
                      <Badge color={getStatusColor(payment.status)}>
                        {getStatusText(payment.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPriorityIcon(payment.priority)}</span>
                      <Badge color={getPriorityColor(payment.priority)} size="sm">
                        {getPriorityText(payment.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información financiera */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Monto</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${payment.amount.toLocaleString()} {payment.currency}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Método de Pago</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {payment.payment_method}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Fecha Esperada</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {new Date(payment.expected_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {payment.milestone_title && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hito:</span>
                        <span className="font-medium">{payment.milestone_title}</span>
                      </div>
                    )}
                    {payment.hours_worked && payment.hourly_rate && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Horas trabajadas:</span>
                          <span className="font-medium">{payment.hours_worked}h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tarifa por hora:</span>
                          <span className="font-medium">${payment.hourly_rate}/h</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Estado de pago:</span>
                      <Badge color={getOverdueColor(payment.days_overdue || 0)} size="sm">
                        {getOverdueText(payment.days_overdue || 0)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Prioridad:</span>
                      <Badge color={getPriorityColor(payment.priority)} size="sm">
                        {getPriorityText(payment.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Contacto del Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Nombre:</span> {payment.client_contact.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Email:</span> {payment.client_contact.email}
                      </p>
                      {payment.client_contact.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Teléfono:</span> {payment.client_contact.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactClient(payment.client_contact)}
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(payment)}
                  >
                    Ver Detalles
                  </Button>
                  {payment.status === 'pending' && (
                    <Button
                      variant="primary"
                      onClick={() => handleRequestPayment(payment)}
                    >
                      Solicitar Pago
                    </Button>
                  )}
                  {payment.status === 'rejected' && (
                    <Button
                      variant="outline"
                      onClick={() => handleDisputePayment(payment)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Disputar Pago
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <ComponentCard title="Sin Pagos Pendientes">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron pagos pendientes. {searchTerm || statusFilter !== "all" || priorityFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes pagos pendientes."}
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={() => window.location.href = '/profesional/contracts'}>
                  Ver Contratos
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default FreelancerPaymentsPendingPage; 