"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types";

interface ActiveContract extends Contract {
  progress: number;
  hours_worked?: number;
  hours_billed?: number;
  next_milestone?: {
    title: string;
    due_date: string;
    amount: number;
  };
  recent_activities: {
    id: string;
    type: string;
    description: string;
    date: string;
  }[];
}

const FreelancerContractsActivePage = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const [activeContracts, setActiveContracts] = useState<ActiveContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ActiveContract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    // Simular datos de contratos activos
    const mockActiveContracts: ActiveContract[] = [
      {
        id: "1",
        project_id: "proj1",
        project_title: "Desarrollo de Aplicación Web",
        company_id: "comp1",
        company_name: "TechCorp",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'fixed',
        value: 5000,
        currency: "USD",
        status: 'active',
        start_date: "2024-01-15",
        end_date: "2024-02-15",
        payment_terms: "Pago por hitos",
        signatures: [
          { user_id: "user1", user_name: "Juan Pérez", role: "professional", signed_at: "2024-01-15", ip_address: "192.168.1.1", signature: "signature1" },
          { user_id: "comp1", user_name: "TechCorp", role: "company", signed_at: "2024-01-15", ip_address: "192.168.1.2", signature: "signature2" }
        ],
        created_at: "2024-01-15",
        updated_at: "2024-01-25",
        progress: 65,
        hours_worked: 120,
        hours_billed: 100,
        next_milestone: {
          title: "Desarrollo del frontend",
          due_date: "2024-01-30",
          amount: 2000
        },
        recent_activities: [
          { id: "1", type: "milestone", description: "Backend completado", date: "2024-01-25" },
          { id: "2", type: "payment", description: "Pago recibido por hito 1", date: "2024-01-20" },
          { id: "3", type: "update", description: "Actualización de progreso", date: "2024-01-18" }
        ]
      },
      {
        id: "2",
        project_id: "proj2",
        project_title: "Diseño de UI/UX",
        company_id: "comp2",
        company_name: "DesignStudio",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'hourly',
        value: 3000,
        currency: "USD",
        status: 'active',
        start_date: "2024-01-20",
        end_date: "2024-02-20",
        payment_terms: "Pago semanal",
        signatures: [
          { user_id: "user1", user_name: "Juan Pérez", role: "professional", signed_at: "2024-01-20", ip_address: "192.168.1.3", signature: "signature3" },
          { user_id: "comp2", user_name: "DesignStudio", role: "company", signed_at: "2024-01-20", ip_address: "192.168.1.4", signature: "signature4" }
        ],
        created_at: "2024-01-20",
        updated_at: "2024-01-22",
        progress: 30,
        hours_worked: 45,
        hours_billed: 45,
        next_milestone: {
          title: "Wireframes completados",
          due_date: "2024-02-05",
          amount: 1000
        },
        recent_activities: [
          { id: "1", type: "milestone", description: "Research completado", date: "2024-01-25" },
          { id: "2", type: "payment", description: "Pago semanal recibido", date: "2024-01-22" },
          { id: "3", type: "update", description: "Inicio de wireframes", date: "2024-01-21" }
        ]
      }
    ];
    
    setActiveContracts(mockActiveContracts);
  }, [user]);

  useEffect(() => {
    let filtered = activeContracts;
    
    if (searchTerm) {
      filtered = filtered.filter(contract => 
        contract.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.type === typeFilter);
    }
    
    setFilteredContracts(filtered);
  }, [activeContracts, searchTerm, typeFilter]);

  const handleUpdateProgress = (contractId: string) => {
    // Implementar actualización de progreso
    console.log('Actualizar progreso:', contractId);
  };

  const handleSubmitMilestone = (contractId: string) => {
    // Implementar envío de hito
    console.log('Enviar hito:', contractId);
  };

  const handleContactClient = (companyName: string) => {
    // Implementar contacto con cliente
    console.log('Contactar cliente:', companyName);
  };

  const handleViewContract = (contract: ActiveContract) => {
    // Implementar ver detalles del contrato
    console.log('Ver contrato:', contract.id);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hourly': return 'Por Hora';
      case 'fixed': return 'Precio Fijo';
      case 'milestone': return 'Por Hitos';
      default: return type;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'payment': return '💰';
      case 'update': return '📝';
      default: return '📋';
    }
  };

  const stats = {
    total: activeContracts.length,
    totalValue: activeContracts.reduce((sum, c) => sum + c.value, 0),
    totalHours: activeContracts.reduce((sum, c) => sum + (c.hours_worked || 0), 0),
    totalBilled: activeContracts.reduce((sum, c) => sum + (c.hours_billed || 0), 0)
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Contratos Activos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Contratos Activos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En curso
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
          
          <ComponentCard title="Horas Trabajadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.totalHours}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Horas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Horas Facturadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.totalBilled}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Horas
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

        {/* Lista de contratos activos */}
        <div className="space-y-6">
          {filteredContracts.map((contract) => (
            <ComponentCard key={contract.id} title={contract.project_title}>
              <div className="space-y-6">
                {/* Header del contrato */}
                <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {contract.project_title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {contract.company_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Inicio: {new Date(contract.start_date).toLocaleDateString()}</span>
                      {contract.end_date && (
                        <span>Fin: {new Date(contract.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge color="success">
                      {getTypeText(contract.type)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {contract.progress}%
                      </p>
                      <p className="text-sm text-gray-500">Progreso</p>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${contract.progress}%` }}
                  ></div>
                </div>

                {/* Información financiera y horas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Valor del Contrato</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${contract.value.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                  
                  {contract.hours_worked !== undefined && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Horas Trabajadas</h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {contract.hours_worked}h
                      </p>
                    </div>
                  )}
                  
                  {contract.hours_billed !== undefined && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Horas Facturadas</h4>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {contract.hours_billed}h
                      </p>
                    </div>
                  )}
                  
                  {contract.next_milestone && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Próximo Hito</h4>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {contract.next_milestone.title}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ${contract.next_milestone.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Próximo hito */}
                {contract.next_milestone && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-3">Próximo Hito</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {contract.next_milestone.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Vence: {new Date(contract.next_milestone.due_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Valor: ${contract.next_milestone.amount.toLocaleString()} {contract.currency}
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => handleSubmitMilestone(contract.id)}
                      >
                        Enviar Hito
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actividad reciente */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Actividad Reciente</h4>
                  <div className="space-y-2">
                    {contract.recent_activities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => handleViewContract(contract)}
                  >
                    Ver Contrato
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress(contract.id)}
                  >
                    Actualizar Progreso
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactClient(contract.company_name)}
                  >
                    Contactar Cliente
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <ComponentCard title="Sin Contratos Activos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron contratos activos. {searchTerm || typeFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes contratos en curso."}
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={() => window.location.href = '/profesional/jobs/search'}>
                  Buscar Trabajos
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default FreelancerContractsActivePage; 