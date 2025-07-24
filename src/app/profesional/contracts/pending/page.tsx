"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types";

interface PendingContract extends Contract {
  days_pending: number;
  deadline?: string;
  urgency_level: 'low' | 'medium' | 'high';
  client_contact: {
    name: string;
    email: string;
    phone?: string;
  };
  terms_summary: string;
}

const FreelancerContractsPendingPage = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const [pendingContracts, setPendingContracts] = useState<PendingContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<PendingContract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    // Simular datos de contratos pendientes
    const mockPendingContracts: PendingContract[] = [
      {
        id: "1",
        project_id: "proj1",
        project_title: "Desarrollo de API REST",
        company_id: "comp1",
        company_name: "TechCorp",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'fixed',
        value: 6000,
        currency: "USD",
        status: 'pending',
        start_date: "2024-02-01",
        end_date: "2024-03-15",
        payment_terms: "Pago por hitos",
        signatures: [
          { user_id: "comp1", user_name: "TechCorp", role: "company", signed_at: "2024-01-25", ip_address: "192.168.1.1", signature: "signature1" }
        ],
        created_at: "2024-01-25",
        updated_at: "2024-01-25",
        days_pending: 5,
        deadline: "2024-02-05",
        urgency_level: 'high',
        client_contact: {
          name: "María González",
          email: "maria@techcorp.com",
          phone: "+1-555-0123"
        },
        terms_summary: "Desarrollo de API REST con Node.js y Express, documentación completa, testing unitario y de integración."
      },
      {
        id: "2",
        project_id: "proj2",
        project_title: "Diseño de Landing Page",
        company_id: "comp2",
        company_name: "DesignStudio",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'hourly',
        value: 2500,
        currency: "USD",
        status: 'pending',
        start_date: "2024-02-10",
        end_date: "2024-02-28",
        payment_terms: "Pago semanal",
        signatures: [
          { user_id: "comp2", user_name: "DesignStudio", role: "company", signed_at: "2024-01-28", ip_address: "192.168.1.2", signature: "signature2" }
        ],
        created_at: "2024-01-28",
        updated_at: "2024-01-28",
        days_pending: 2,
        deadline: "2024-02-10",
        urgency_level: 'medium',
        client_contact: {
          name: "Carlos Ruiz",
          email: "carlos@designstudio.com"
        },
        terms_summary: "Diseño de landing page responsive con HTML5, CSS3 y JavaScript, optimizada para conversión."
      },
      {
        id: "3",
        project_id: "proj3",
        project_title: "Consultoría de SEO",
        company_id: "comp3",
        company_name: "MarketingPro",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'milestone',
        value: 4000,
        currency: "USD",
        status: 'pending',
        start_date: "2024-02-15",
        end_date: "2024-04-15",
        payment_terms: "Pago por hitos",
        signatures: [
          { user_id: "comp3", user_name: "MarketingPro", role: "company", signed_at: "2024-01-30", ip_address: "192.168.1.3", signature: "signature3" }
        ],
        created_at: "2024-01-30",
        updated_at: "2024-01-30",
        days_pending: 1,
        deadline: "2024-02-15",
        urgency_level: 'low',
        client_contact: {
          name: "Ana Martínez",
          email: "ana@marketingpro.com",
          phone: "+1-555-0456"
        },
        terms_summary: "Auditoría completa de SEO, optimización on-page y off-page, reportes mensuales de rendimiento."
      }
    ];
    
    setPendingContracts(mockPendingContracts);
  }, [user]);

  useEffect(() => {
    let filtered = pendingContracts;
    
    if (searchTerm) {
      filtered = filtered.filter(contract => 
        contract.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (urgencyFilter !== "all") {
      filtered = filtered.filter(contract => contract.urgency_level === urgencyFilter);
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(contract => contract.type === typeFilter);
    }
    
    setFilteredContracts(filtered);
  }, [pendingContracts, searchTerm, urgencyFilter, typeFilter]);

  const handleSignContract = (contract: PendingContract) => {
    // Implementar firma de contrato
    console.log('Firmar contrato:', contract.id);
  };

  const handleViewContract = (contract: PendingContract) => {
    // Implementar ver detalles del contrato
    console.log('Ver contrato:', contract.id);
  };

  const handleContactClient = (clientContact: PendingContract['client_contact']) => {
    // Implementar contacto con cliente
    console.log('Contactar cliente:', clientContact.email);
  };

  const handleRequestExtension = (contract: PendingContract) => {
    // Implementar solicitud de extensión
    console.log('Solicitar extensión:', contract.id);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hourly': return 'Por Hora';
      case 'fixed': return 'Precio Fijo';
      case 'milestone': return 'Por Hitos';
      default: return type;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'light';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return urgency;
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '✅';
      default: return '📋';
    }
  };

  const stats = {
    total: pendingContracts.length,
    highUrgency: pendingContracts.filter(c => c.urgency_level === 'high').length,
    totalValue: pendingContracts.reduce((sum, c) => sum + c.value, 0),
    averageDaysPending: pendingContracts.reduce((sum, c) => sum + c.days_pending, 0) / pendingContracts.length
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Contratos Pendientes" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Contratos Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Por firmar
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Alta Urgencia">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.highUrgency}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren atención
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
          
          <ComponentCard title="Días Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.averageDaysPending.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Días pendientes
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
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las urgencias</option>
              <option value="high">Alta urgencia</option>
              <option value="medium">Media urgencia</option>
              <option value="low">Baja urgencia</option>
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

        {/* Lista de contratos pendientes */}
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
                      <span>Fin: {new Date(contract.end_date || contract.start_date).toLocaleDateString()}</span>
                      <span>Días pendientes: {contract.days_pending}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getUrgencyIcon(contract.urgency_level)}</span>
                      <Badge color={getUrgencyColor(contract.urgency_level)}>
                        {getUrgencyText(contract.urgency_level)}
                      </Badge>
                    </div>
                    <Badge color="light" size="sm">
                      {getTypeText(contract.type)}
                    </Badge>
                    {contract.deadline && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Fecha límite
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(contract.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información financiera */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Valor del Contrato</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${contract.value.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Términos de Pago</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {contract.payment_terms}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Estado de Firmas</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {contract.signatures.length}/2 firmas
                    </p>
                  </div>
                </div>

                {/* Resumen de términos */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Resumen de Términos</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contract.terms_summary}
                  </p>
                </div>

                {/* Información de contacto */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-3">Contacto del Cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Nombre:</span> {contract.client_contact.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Email:</span> {contract.client_contact.email}
                      </p>
                      {contract.client_contact.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Teléfono:</span> {contract.client_contact.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactClient(contract.client_contact)}
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    onClick={() => handleSignContract(contract)}
                    className="flex-1"
                  >
                    Firmar Contrato
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleViewContract(contract)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRequestExtension(contract)}
                  >
                    Solicitar Extensión
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredContracts.length === 0 && (
          <ComponentCard title="Sin Contratos Pendientes">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron contratos pendientes. {searchTerm || urgencyFilter !== "all" || typeFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes contratos pendientes de firma."}
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

export default FreelancerContractsPendingPage; 