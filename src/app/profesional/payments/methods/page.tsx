"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface PaymentMethod {
  id: string;
  type: 'bank_account' | 'paypal' | 'stripe' | 'crypto_wallet';
  name: string;
  account_number?: string;
  account_type?: string;
  bank_name?: string;
  email?: string;
  wallet_address?: string;
  currency: string;
  is_default: boolean;
  is_verified: boolean;
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  last_used?: string;
  fees_percentage?: number;
  processing_time?: string;
}

const FreelancerPaymentsMethodsPage = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<PaymentMethod[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    // Simular datos de métodos de pago
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: "1",
        type: 'bank_account',
        name: "Cuenta Bancaria Principal",
        account_number: "****1234",
        account_type: "Cuenta Corriente",
        bank_name: "Banco de América",
        currency: "USD",
        is_default: true,
        is_verified: true,
        status: 'active',
        created_at: "2023-01-15",
        last_used: "2024-02-20",
        fees_percentage: 1.5,
        processing_time: "2-3 días hábiles"
      },
      {
        id: "2",
        type: 'paypal',
        name: "PayPal Personal",
        email: "juan.perez@email.com",
        currency: "USD",
        is_default: false,
        is_verified: true,
        status: 'active',
        created_at: "2023-03-10",
        last_used: "2024-02-15",
        fees_percentage: 2.9,
        processing_time: "1-2 días"
      },
      {
        id: "3",
        type: 'stripe',
        name: "Stripe Connect",
        email: "juan.perez@email.com",
        currency: "USD",
        is_default: false,
        is_verified: true,
        status: 'active',
        created_at: "2023-06-20",
        last_used: "2024-02-10",
        fees_percentage: 2.9,
        processing_time: "1-3 días"
      },
      {
        id: "4",
        type: 'crypto_wallet',
        name: "Wallet Ethereum",
        wallet_address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        currency: "ETH",
        is_default: false,
        is_verified: false,
        status: 'pending',
        created_at: "2024-01-25",
        fees_percentage: 0.5,
        processing_time: "5-10 minutos"
      },
      {
        id: "5",
        type: 'bank_account',
        name: "Cuenta de Ahorros",
        account_number: "****5678",
        account_type: "Cuenta de Ahorros",
        bank_name: "Chase Bank",
        currency: "USD",
        is_default: false,
        is_verified: false,
        status: 'suspended',
        created_at: "2023-08-15",
        fees_percentage: 1.0,
        processing_time: "3-5 días hábiles"
      }
    ];
    
    setPaymentMethods(mockPaymentMethods);
  }, []);

  useEffect(() => {
    let filtered = paymentMethods;
    
    if (searchTerm) {
      filtered = filtered.filter(method => 
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(method => method.type === typeFilter);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(method => method.status === statusFilter);
    }
    
    setFilteredMethods(filtered);
  }, [paymentMethods, searchTerm, typeFilter, statusFilter]);

  const handleAddMethod = () => {
    setShowAddModal(true);
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowAddModal(true);
  };

  const handleDeleteMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev => prev.map(m => ({
      ...m,
      is_default: m.id === methodId
    })));
  };

  const handleVerifyMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, is_verified: true, status: 'active' as const } : m
    ));
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'bank_account': return 'Cuenta Bancaria';
      case 'paypal': return 'PayPal';
      case 'stripe': return 'Stripe';
      case 'crypto_wallet': return 'Wallet Crypto';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bank_account': return '🏦';
      case 'paypal': return '💳';
      case 'stripe': return '💳';
      case 'crypto_wallet': return '₿';
      default: return '💰';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'pending': return 'Pendiente';
      case 'suspended': return 'Suspendido';
      default: return status;
    }
  };

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'success' : 'warning';
  };

  const getVerificationText = (isVerified: boolean) => {
    return isVerified ? 'Verificado' : 'Pendiente';
  };

  const stats = {
    total: paymentMethods.length,
    active: paymentMethods.filter(m => m.status === 'active').length,
    verified: paymentMethods.filter(m => m.is_verified).length,
    default: paymentMethods.filter(m => m.is_default).length
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Métodos de Pago" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Métodos de Pago">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configurados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Activos">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.active}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Disponibles
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Verificados">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.verified}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cuentas verificadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Predeterminado">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.default}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Método principal
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Acciones principales */}
        <ComponentCard title="Acciones">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={handleAddMethod}
              className="w-full sm:w-auto"
            >
              + Agregar Método de Pago
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/payments/history'}
              className="w-full sm:w-auto"
            >
              Ver Historial de Pagos
            </Button>
          </div>
        </ComponentCard>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, banco o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="bank_account">Cuenta Bancaria</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="crypto_wallet">Wallet Crypto</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de métodos de pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMethods.map((method) => (
            <ComponentCard key={method.id} title={method.name}>
              <div className="flex flex-col h-full">
                {/* Header del método */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(method.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getTypeText(method.type)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {method.is_default && (
                      <Badge color="primary" size="sm">
                        Predeterminado
                      </Badge>
                    )}
                    <Badge color={getStatusColor(method.status)} size="sm">
                      {getStatusText(method.status)}
                    </Badge>
                  </div>
                </div>

                {/* Información del método */}
                <div className="space-y-3 mb-4">
                  {method.bank_name && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Banco:</span>
                      <span className="font-medium">{method.bank_name}</span>
                    </div>
                  )}
                  
                  {method.account_number && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cuenta:</span>
                      <span className="font-medium">{method.account_number}</span>
                    </div>
                  )}
                  
                  {method.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{method.email}</span>
                    </div>
                  )}
                  
                  {method.wallet_address && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Wallet:</span>
                      <span className="font-medium text-xs">
                        {method.wallet_address.slice(0, 8)}...{method.wallet_address.slice(-6)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Moneda:</span>
                    <span className="font-medium">{method.currency}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Comisión:</span>
                    <span className="font-medium">{method.fees_percentage}%</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiempo:</span>
                    <span className="font-medium">{method.processing_time}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Verificación:</span>
                    <Badge color={getVerificationColor(method.is_verified)} size="sm">
                      {getVerificationText(method.is_verified)}
                    </Badge>
                  </div>
                  
                  {method.last_used && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Último uso:</span>
                      <span className="font-medium">
                        {new Date(method.last_used).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 mt-auto">
                  {!method.is_default && method.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="w-full"
                    >
                      Establecer como Predeterminado
                    </Button>
                  )}
                  
                  {!method.is_verified && method.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerifyMethod(method.id)}
                      className="w-full"
                    >
                      Verificar Cuenta
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMethod(method)}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMethod(method.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredMethods.length === 0 && (
          <ComponentCard title="Sin Métodos de Pago">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron métodos de pago. {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes métodos de pago configurados."}
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={handleAddMethod}>
                  Agregar Primer Método
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Información adicional */}
        <ComponentCard title="Información Importante">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Comisiones por Método</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cuenta Bancaria:</span>
                  <span>1.0% - 1.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>PayPal:</span>
                  <span>2.9% + $0.30</span>
                </div>
                <div className="flex justify-between">
                  <span>Stripe:</span>
                  <span>2.9% + $0.30</span>
                </div>
                <div className="flex justify-between">
                  <span>Wallet Crypto:</span>
                  <span>0.5% - 1.0%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tiempos de Procesamiento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Cuenta Bancaria:</span>
                  <span>2-5 días hábiles</span>
                </div>
                <div className="flex justify-between">
                  <span>PayPal:</span>
                  <span>1-2 días</span>
                </div>
                <div className="flex justify-between">
                  <span>Stripe:</span>
                  <span>1-3 días</span>
                </div>
                <div className="flex justify-between">
                  <span>Wallet Crypto:</span>
                  <span>5-10 minutos</span>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default FreelancerPaymentsMethodsPage;
