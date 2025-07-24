"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePayment } from "@/context/PaymentContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Payment } from "@/types";

const EmpresaPagosPage = () => {
  const { user } = useAuth();
  const { payments, createPayment } = usePayment();
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    contract_id: "",
    professional_id: "",
    professional_name: "",
    amount: 0,
    currency: "USD",
    type: 'milestone' as const,
    description: "",
    scheduled_date: "",
  });

  useEffect(() => {
    // Filtrar pagos de la empresa actual (a través de contratos)
    const empresaPayments = payments.filter(p => {
      // Aquí necesitarías verificar si el contrato pertenece a la empresa
      // Por ahora asumimos que todos los pagos son de la empresa
      return true;
    });
    setFilteredPayments(empresaPayments);
  }, [payments, user]);

  useEffect(() => {
    let filtered = payments;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.professional_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(p => p.type === typeFilter);
    }
    
    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, typeFilter]);

  const handleCreatePayment = () => {
    if (newPayment.professional_name && newPayment.amount > 0) {
      createPayment({
        ...newPayment,
        status: 'pending',
        payment_method: {
          id: "",
          type: 'bank_transfer',
          details: {},
          is_default: true
        }
      });
      setNewPayment({
        contract_id: "",
        professional_id: "",
        professional_name: "",
        amount: 0,
        currency: "USD",
        type: 'milestone',
        description: "",
        scheduled_date: "",
      });
      setShowCreateModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'pending': return 'light';
      case 'failed': return 'error';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'processing': return 'Procesando';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'milestone': return 'Hito';
      case 'hourly': return 'Por Hora';
      case 'bonus': return 'Bono';
      default: return type;
    }
  };

  const handleProcessPayment = (payment: Payment) => {
    // Implementar procesamiento de pago
    console.log('Procesar pago:', payment.id);
  };

  const handleViewPayment = (payment: Payment) => {
    // Implementar ver detalles del pago
    console.log('Ver pago:', payment.id);
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Gestión de Pagos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Resumen de pagos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Total de Pagos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                ${totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPayments.length} pagos
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                ${pendingAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPayments.filter(p => p.status === 'pending').length} pendientes
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pagos Completados">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                ${filteredPayments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPayments.filter(p => p.status === 'completed').length} completados
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Header con filtros y botón crear */}
        <ComponentCard title="Filtros y Acciones">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar pagos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white max-w-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="completed">Completado</option>
                <option value="failed">Fallido</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="milestone">Hito</option>
                <option value="hourly">Por Hora</option>
                <option value="bonus">Bono</option>
              </select>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              Crear Pago
            </Button>
          </div>
        </ComponentCard>

        {/* Lista de pagos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPayments.map((payment) => (
            <ComponentCard key={payment.id} title={`Pago a ${payment.professional_name}`}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge color={getStatusColor(payment.status)}>
                    {getStatusText(payment.status)}
                  </Badge>
                  <Badge color="light" size="sm">
                    {getTypeText(payment.type)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monto:</span>
                    <span className="font-medium">
                      ${payment.amount.toLocaleString()} {payment.currency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha programada:</span>
                    <span className="font-medium">
                      {new Date(payment.scheduled_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {payment.processed_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fecha procesado:</span>
                      <span className="font-medium">
                        {new Date(payment.processed_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Método:</span>
                    <span className="font-medium capitalize">
                      {payment.payment_method.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                {payment.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {payment.description}
                  </p>
                )}
                
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewPayment(payment)}
                  >
                    Ver Detalles
                  </Button>
                  {payment.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleProcessPayment(payment)}
                    >
                      Procesar
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredPayments.length === 0 && (
          <ComponentCard title="Sin Pagos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron pagos. {searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "Intenta ajustar los filtros." : "Crea tu primer pago."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal para crear pago */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Pago</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del profesional"
                value={newPayment.professional_name}
                onChange={(e) => setNewPayment({...newPayment, professional_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <select
                value={newPayment.type}
                onChange={(e) => setNewPayment({...newPayment, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="milestone">Hito</option>
                <option value="hourly">Por Hora</option>
                <option value="bonus">Bono</option>
              </select>
              
              <input
                type="number"
                placeholder="Monto del pago"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <textarea
                value={newPayment.description}
                onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                placeholder="Descripción del pago"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows={3}
              />
              
              <input
                type="date"
                value={newPayment.scheduled_date}
                onChange={(e) => setNewPayment({...newPayment, scheduled_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  variant="primary"
                >
                  Crear Pago
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaPagosPage; 