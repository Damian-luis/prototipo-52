"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface PaymentHistory {
  id: string;
  contract_id: string;
  project_title: string;
  company_name: string;
  amount: number;
  currency: string;
  status: 'completed' | 'failed' | 'cancelled';
  payment_method: string;
  payment_date: string;
  description: string;
  transaction_id?: string;
  fees?: number;
  net_amount?: number;
  payment_type: 'milestone' | 'hourly' | 'final' | 'bonus';
}

const FreelancerPaymentsHistoryPage = () => {
  const { user } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  useEffect(() => {
    // Simular datos de historial de pagos
    const mockPaymentHistory: PaymentHistory[] = [
      {
        id: "1",
        contract_id: "contract1",
        project_title: "Desarrollo de E-commerce",
        company_name: "TechCorp",
        amount: 2000,
        currency: "USD",
        status: 'completed',
        payment_method: "Transferencia bancaria",
        payment_date: "2024-01-25",
        description: "Pago por hito 1 - Diseño de base de datos",
        transaction_id: "TXN123456789",
        fees: 20,
        net_amount: 1980,
        payment_type: 'milestone'
      },
      {
        id: "2",
        contract_id: "contract1",
        project_title: "Desarrollo de E-commerce",
        company_name: "TechCorp",
        amount: 3000,
        currency: "USD",
        status: 'completed',
        payment_method: "Transferencia bancaria",
        payment_date: "2024-02-15",
        description: "Pago por hito 2 - Desarrollo del backend",
        transaction_id: "TXN123456790",
        fees: 30,
        net_amount: 2970,
        payment_type: 'milestone'
      },
      {
        id: "3",
        contract_id: "contract2",
        project_title: "Diseño de UI/UX",
        company_name: "DesignStudio",
        amount: 1500,
        currency: "USD",
        status: 'completed',
        payment_method: "PayPal",
        payment_date: "2024-02-10",
        description: "Pago semanal - Semana 1",
        transaction_id: "TXN123456791",
        fees: 45,
        net_amount: 1455,
        payment_type: 'hourly'
      },
      {
        id: "4",
        contract_id: "contract3",
        project_title: "Consultoría de Marketing Digital",
        company_name: "MarketingPro",
        amount: 1000,
        currency: "USD",
        status: 'completed',
        payment_method: "Stripe",
        payment_date: "2024-01-30",
        description: "Pago por hito 1 - Auditoría SEO",
        transaction_id: "TXN123456792",
        fees: 29,
        net_amount: 971,
        payment_type: 'milestone'
      },
      {
        id: "5",
        contract_id: "contract4",
        project_title: "Desarrollo de API REST",
        company_name: "StartupXYZ",
        amount: 500,
        currency: "USD",
        status: 'failed',
        payment_method: "Transferencia bancaria",
        payment_date: "2024-02-20",
        description: "Pago por horas extra",
        payment_type: 'bonus'
      },
      {
        id: "6",
        contract_id: "contract5",
        project_title: "Mantenimiento de Sitio Web",
        company_name: "WebSolutions",
        amount: 800,
        currency: "USD",
        status: 'cancelled',
        payment_method: "PayPal",
        payment_date: "2024-02-18",
        description: "Pago mensual de mantenimiento",
        payment_type: 'final'
      }
    ];
    
    setPaymentHistory(mockPaymentHistory);
  }, []);

  useEffect(() => {
    let filtered = paymentHistory;
    
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
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(payment => payment.payment_type === typeFilter);
    }
    
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "7d":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          filterDate.setDate(now.getDate() - 90);
          break;
        case "1y":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(payment => 
        new Date(payment.payment_date) >= filterDate
      );
    }
    
    setFilteredPayments(filtered);
  }, [paymentHistory, searchTerm, statusFilter, typeFilter, dateFilter]);

  const handleViewDetails = (payment: PaymentHistory) => {
    // Implementar ver detalles del pago
    console.log('Ver detalles:', payment.id);
  };

  const handleDownloadReceipt = (payment: PaymentHistory) => {
    // Implementar descarga de recibo
    console.log('Descargar recibo:', payment.id);
  };

  const handleContactSupport = (payment: PaymentHistory) => {
    // Implementar contacto con soporte
    console.log('Contactar soporte:', payment.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'cancelled': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'failed': return 'Fallido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '📋';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'milestone': return 'Hito';
      case 'hourly': return 'Por Hora';
      case 'final': return 'Final';
      case 'bonus': return 'Bono';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'primary';
      case 'hourly': return 'info';
      case 'final': return 'success';
      case 'bonus': return 'warning';
      default: return 'light';
    }
  };

  const stats = {
    total: paymentHistory.length,
    completed: paymentHistory.filter(p => p.status === 'completed').length,
    totalAmount: paymentHistory.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalFees: paymentHistory.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.fees || 0), 0),
    totalNet: paymentHistory.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.net_amount || p.amount), 0),
    failed: paymentHistory.filter(p => p.status === 'failed').length,
    cancelled: paymentHistory.filter(p => p.status === 'cancelled').length
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Historial de Pagos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Pagos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transacciones
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Exitosos">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Completados
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
          
          <ComponentCard title="Monto Neto">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                ${stats.totalNet.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Después de comisiones
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Comisiones Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                ${stats.totalFees.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Comisiones pagadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Fallidos">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.failed}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transacciones fallidas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Cancelados">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.cancelled}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Transacciones canceladas
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
              <option value="completed">Completados</option>
              <option value="failed">Fallidos</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="milestone">Hitos</option>
              <option value="hourly">Por Hora</option>
              <option value="final">Final</option>
              <option value="bonus">Bonos</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las fechas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de pagos */}
        <div className="space-y-6">
          {filteredPayments.map((payment) => (
            <ComponentCard key={payment.id} title={payment.project_title}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
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
                      <Badge color={getTypeColor(payment.payment_type)} size="sm">
                        {getTypeText(payment.payment_type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Monto:</span>
                        <span className="font-medium">
                          ${payment.amount.toLocaleString()} {payment.currency}
                        </span>
                      </div>
                      {payment.fees && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Comisiones:</span>
                          <span className="font-medium text-red-600">
                            -${payment.fees.toLocaleString()} {payment.currency}
                          </span>
                        </div>
                      )}
                      {payment.net_amount && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Monto neto:</span>
                          <span className="font-medium text-green-600">
                            ${payment.net_amount.toLocaleString()} {payment.currency}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Método:</span>
                        <span className="font-medium">{payment.payment_method}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fecha:</span>
                        <span className="font-medium">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </div>
                      {payment.transaction_id && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">ID Transacción:</span>
                          <span className="font-medium text-xs">
                            {payment.transaction_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(payment)}
                    className="w-full"
                  >
                    Ver Detalles
                  </Button>
                  {payment.status === 'completed' && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadReceipt(payment)}
                      className="w-full"
                    >
                      Descargar Recibo
                    </Button>
                  )}
                  {(payment.status === 'failed' || payment.status === 'cancelled') && (
                    <Button
                      variant="outline"
                      onClick={() => handleContactSupport(payment)}
                      className="w-full"
                    >
                      Contactar Soporte
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <ComponentCard title="Sin Historial de Pagos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron pagos en el historial. {searchTerm || statusFilter !== "all" || typeFilter !== "all" || dateFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes pagos registrados aún."}
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

export default FreelancerPaymentsHistoryPage; 