"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useContract } from "@/context/ContractContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types";

interface HistoricalContract extends Contract {
  completion_date: string;
  final_value: number;
  rating?: number;
  review?: string;
  total_hours?: number;
  performance_score?: number;
}

const FreelancerContractsHistoryPage = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const [historicalContracts, setHistoricalContracts] = useState<HistoricalContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<HistoricalContract[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  useEffect(() => {
    // Simular datos de contratos históricos
    const mockHistoricalContracts: HistoricalContract[] = [
      {
        id: "1",
        project_id: "proj1",
        project_title: "Desarrollo de E-commerce",
        company_id: "comp1",
        company_name: "TechCorp",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'fixed',
        value: 8000,
        currency: "USD",
        status: 'completed',
        start_date: "2023-10-01",
        end_date: "2023-12-15",
        completion_date: "2023-12-15",
        final_value: 8000,
        payment_terms: "Pago por hitos",
        signatures: [
          { user_id: "user1", user_name: "Juan Pérez", role: "professional", signed_at: "2023-10-01", ip_address: "192.168.1.1", signature: "signature1" },
          { user_id: "comp1", user_name: "TechCorp", role: "company", signed_at: "2023-10-01", ip_address: "192.168.1.2", signature: "signature2" }
        ],
        created_at: "2023-10-01",
        updated_at: "2023-12-15",
        rating: 5,
        review: "Excelente trabajo, muy profesional y cumplió con todos los plazos.",
        total_hours: 240,
        performance_score: 95
      },
      {
        id: "2",
        project_id: "proj2",
        project_title: "Diseño de Aplicación Móvil",
        company_id: "comp2",
        company_name: "DesignStudio",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'hourly',
        value: 5000,
        currency: "USD",
        status: 'completed',
        start_date: "2023-08-15",
        end_date: "2023-10-30",
        completion_date: "2023-10-30",
        final_value: 5200,
        payment_terms: "Pago semanal",
        signatures: [
          { user_id: "user1", user_name: "Juan Pérez", role: "professional", signed_at: "2023-08-15", ip_address: "192.168.1.3", signature: "signature3" },
          { user_id: "comp2", user_name: "DesignStudio", role: "company", signed_at: "2023-08-15", ip_address: "192.168.1.4", signature: "signature4" }
        ],
        created_at: "2023-08-15",
        updated_at: "2023-10-30",
        rating: 4,
        review: "Buen trabajo, algunas revisiones menores necesarias.",
        total_hours: 180,
        performance_score: 88
      },
      {
        id: "3",
        project_id: "proj3",
        project_title: "Consultoría de Marketing Digital",
        company_id: "comp3",
        company_name: "MarketingPro",
        professional_id: user?.id || "",
        professional_name: user?.name || "",
        type: 'milestone',
        value: 3000,
        currency: "USD",
        status: 'completed',
        start_date: "2023-06-01",
        end_date: "2023-07-31",
        completion_date: "2023-07-31",
        final_value: 3000,
        payment_terms: "Pago por hitos",
        signatures: [
          { user_id: "user1", user_name: "Juan Pérez", role: "professional", signed_at: "2023-06-01", ip_address: "192.168.1.5", signature: "signature5" },
          { user_id: "comp3", user_name: "MarketingPro", role: "company", signed_at: "2023-06-01", ip_address: "192.168.1.6", signature: "signature6" }
        ],
        created_at: "2023-06-01",
        updated_at: "2023-07-31",
        rating: 5,
        review: "Resultados excepcionales, superó las expectativas.",
        total_hours: 120,
        performance_score: 98
      }
    ];
    
    setHistoricalContracts(mockHistoricalContracts);
  }, [user]);

  useEffect(() => {
    let filtered = historicalContracts;
    
    if (searchTerm) {
      filtered = filtered.filter(contract => 
        contract.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (yearFilter !== "all") {
      const year = parseInt(yearFilter);
      filtered = filtered.filter(contract => 
        new Date(contract.completion_date || contract.end_date || contract.start_date).getFullYear() === year
      );
    }
    
    if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(contract => contract.rating === rating);
    }
    
    setFilteredContracts(filtered);
  }, [historicalContracts, searchTerm, yearFilter, ratingFilter]);

  const handleViewContract = (contract: HistoricalContract) => {
    // Implementar ver detalles del contrato
    console.log('Ver contrato:', contract.id);
  };

  const handleDownloadContract = (contract: HistoricalContract) => {
    // Implementar descarga de contrato
    console.log('Descargar contrato:', contract.id);
  };

  const handleContactClient = (companyName: string) => {
    // Implementar contacto con cliente
    console.log('Contactar cliente:', companyName);
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hourly': return 'Por Hora';
      case 'fixed': return 'Precio Fijo';
      case 'milestone': return 'Por Hitos';
      default: return type;
    }
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'warning';
    return 'error';
  };

  const stats = {
    total: historicalContracts.length,
    totalValue: historicalContracts.reduce((sum, c) => sum + c.final_value, 0),
    averageRating: historicalContracts.reduce((sum, c) => sum + (c.rating || 0), 0) / historicalContracts.length,
    totalHours: historicalContracts.reduce((sum, c) => sum + (c.total_hours || 0), 0),
    averagePerformance: historicalContracts.reduce((sum, c) => sum + (c.performance_score || 0), 0) / historicalContracts.length
  };

  const years = Array.from(new Set(historicalContracts.map(c => 
    new Date(c.completion_date || c.end_date || c.start_date).getFullYear()
  ))).sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Historial de Contratos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ComponentCard title="Contratos Completados">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proyectos finalizados
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
          
          <ComponentCard title="Calificación Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.averageRating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Estrellas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Horas Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.totalHours}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Horas trabajadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Performance Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.averagePerformance.toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Puntuación
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
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los años</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las calificaciones</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de contratos históricos */}
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
                      <span>Completado: {new Date(contract.completion_date || contract.end_date || contract.start_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge color="primary">
                      {getTypeText(contract.type)}
                    </Badge>
                    {contract.rating && (
                      <div className="text-center">
                        <p className="text-lg text-warning-600 dark:text-warning-400">
                          {getRatingStars(contract.rating)}
                        </p>
                        <p className="text-sm text-gray-500">{contract.rating}/5</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información financiera y métricas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Final</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${contract.final_value.toLocaleString()} {contract.currency}
                    </p>
                  </div>
                  
                  {contract.total_hours && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Horas Trabajadas</h4>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {contract.total_hours}h
                      </p>
                    </div>
                  )}
                  
                  {contract.performance_score && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Performance</h4>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {contract.performance_score}%
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Duración</h4>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.ceil((new Date(contract.end_date || contract.start_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24))} días
                    </p>
                  </div>
                </div>

                {/* Reseña del cliente */}
                {contract.review && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Reseña del Cliente</h4>
                    <div className="flex items-start gap-3">
                      {contract.rating && (
                        <div className="text-lg text-warning-600 dark:text-warning-400">
                          {getRatingStars(contract.rating)}
                        </div>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 italic">
                        "{contract.review}"
                      </p>
                    </div>
                  </div>
                )}

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
                    onClick={() => handleDownloadContract(contract)}
                  >
                    Descargar
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
          <ComponentCard title="Sin Contratos en Historial">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron contratos en el historial. {searchTerm || yearFilter !== "all" || ratingFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes contratos completados aún."}
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

export default FreelancerContractsHistoryPage; 