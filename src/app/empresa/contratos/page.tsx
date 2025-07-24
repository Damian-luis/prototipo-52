"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types";

const EmpresaContratosPage = () => {
  const { user } = useAuth();
  const { contracts, createContract, updateContract } = useContract();
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContract, setNewContract] = useState({
    project_id: "",
    project_title: "",
    professional_id: "",
    professional_name: "",
    type: 'fixed' as const,
    value: 0,
    currency: "USD",
    payment_terms: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    // Filtrar contratos de la empresa actual
    const empresaContracts = contracts.filter(c => c.company_id === user?.id);
    setFilteredContracts(empresaContracts);
  }, [contracts, user]);

  useEffect(() => {
    let filtered = contracts.filter(c => c.company_id === user?.id);
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.professional_name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleCreateContract = () => {
    if (newContract.project_title && newContract.professional_name && newContract.value > 0) {
      createContract({
        ...newContract,
        company_id: user?.id || "",
        company_name: user?.name || "",
        status: 'draft',
        signatures: [],
      });
      setNewContract({
        project_id: "",
        project_title: "",
        professional_id: "",
        professional_name: "",
        type: 'fixed',
        value: 0,
        currency: "USD",
        payment_terms: "",
        start_date: "",
        end_date: "",
      });
      setShowCreateModal(false);
    }
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

  const handleSignContract = (contract: Contract) => {
    // Implementar firma de contrato
    console.log('Firmar contrato:', contract.id);
  };

  const handleViewContract = (contract: Contract) => {
    // Implementar ver detalles del contrato
    console.log('Ver contrato:', contract.id);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Gestión de Contratos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros y botón crear */}
        <ComponentCard title="Filtros y Acciones">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar contratos..."
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
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              Crear Contrato
            </Button>
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
                    <span className="text-gray-500">Profesional:</span>
                    <span className="font-medium">{contract.professional_name}</span>
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
                  {contract.status === 'draft' && (
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
                No se encontraron contratos. {searchTerm || statusFilter !== "all" || typeFilter !== "all" ? "Intenta ajustar los filtros." : "Crea tu primer contrato."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal para crear contrato */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Contrato</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título del proyecto"
                value={newContract.project_title}
                onChange={(e) => setNewContract({...newContract, project_title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <input
                type="text"
                placeholder="Nombre del profesional"
                value={newContract.professional_name}
                onChange={(e) => setNewContract({...newContract, professional_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <select
                value={newContract.type}
                onChange={(e) => setNewContract({...newContract, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="fixed">Precio Fijo</option>
                <option value="hourly">Por Hora</option>
                <option value="milestone">Por Hitos</option>
              </select>
              
              <input
                type="number"
                placeholder="Valor del contrato"
                value={newContract.value}
                onChange={(e) => setNewContract({...newContract, value: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <textarea
                value={newContract.payment_terms}
                onChange={(e) => setNewContract({...newContract, payment_terms: e.target.value})}
                placeholder="Términos de pago"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newContract.start_date}
                  onChange={(e) => setNewContract({...newContract, start_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                
                <input
                  type="date"
                  value={newContract.end_date}
                  onChange={(e) => setNewContract({...newContract, end_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateContract}
                  variant="primary"
                >
                  Crear Contrato
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaContratosPage; 