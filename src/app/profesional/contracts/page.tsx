"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types";

const FreelancerContractsPage = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    // Filtrar contratos del freelancer actual
    const freelancerContracts = contracts.filter(c => c.professional_id === user?.id);
    setFilteredContracts(freelancerContracts);
  }, [contracts, user]);

  useEffect(() => {
    let filtered = contracts.filter(c => c.professional_id === user?.id);
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(c => c.type === typeFilter);
    }
    
    setFilteredContracts(filtered);
  }, [contracts, user, searchTerm, statusFilter, typeFilter]);

  const handleViewContract = (contract: Contract) => {
    // Implementar ver detalles del contrato
    console.log('Ver contrato:', contract.id);
  };

  const handleSignContract = (contract: Contract) => {
    // Implementar firma de contrato
    console.log('Firmar contrato:', contract.id);
  };

  const handleDownloadContract = (contract: Contract) => {
    // Implementar descarga de contrato
    console.log('Descargar contrato:', contract.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'draft': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelado';
      case 'draft': return 'Borrador';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hourly': return 'Por Hora';
      case 'fixed': return 'Precio Fijo';
      case 'milestone': return 'Por Hitos';
      default: return type;
    }
  };

  const stats = {
    total: filteredContracts.length,
    active: filteredContracts.filter(c => c.status === 'active').length,
    pending: filteredContracts.filter(c => c.status === 'pending').length,
    completed: filteredContracts.filter(c => c.status === 'completed').length,
    totalValue: filteredContracts.reduce((sum, c) => sum + c.value, 0)
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Mis Contratos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ComponentCard title="Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Contratos
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Activos">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.active}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En curso
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Por firmar
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Completados">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Finalizados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Valor Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                ${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                USD
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por proyecto o empresa..."
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
              <option value="draft">Borrador</option>
              <option value="pending">Pendiente</option>
              <option value="active">Activo</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="hourly">Por Hora</option>
              <option value="fixed">Precio Fijo</option>
              <option value="milestone">Por Hitos</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de contratos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ComponentCard key={contract.id} title={contract.project_title}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge color={getStatusColor(contract.status)}>
                    {getStatusText(contract.status)}
                  </Badge>
                  <Badge color="light" size="sm">
                    {getTypeText(contract.type)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Empresa:</span>
                    <span className="font-medium">{contract.company_name}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Valor:</span>
                    <span className="font-medium">
                      ${contract.value.toLocaleString()} {contract.currency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Inicio:</span>
                    <span className="font-medium">
                      {new Date(contract.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {contract.end_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fin:</span>
                      <span className="font-medium">
                        {new Date(contract.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Firmas:</span>
                    <span className="font-medium">{contract.signatures.length}/2</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContract(contract)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadContract(contract)}
                  >
                    Descargar
                  </Button>
                  {contract.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSignContract(contract)}
                    >
                      Firmar
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <ComponentCard title="Sin Contratos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron contratos. {searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes contratos aún."}
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={() => window.location.href = '/profesional/jobs/search'}>
                  Buscar Trabajos
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Acciones rápidas */}
        <ComponentCard title="Acciones Rápidas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/contracts/active'}
              className="w-full"
            >
              Ver Contratos Activos
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/contracts/pending'}
              className="w-full"
            >
              Ver Contratos Pendientes
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/contracts/history'}
              className="w-full"
            >
              Ver Historial
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default FreelancerContractsPage; 