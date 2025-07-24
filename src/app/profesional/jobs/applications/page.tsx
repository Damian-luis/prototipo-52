"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface JobApplication {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  applied_date: string;
  cover_letter: string;
  proposed_budget?: number;
  estimated_duration?: string;
  response_date?: string;
  response_message?: string;
}

const FreelancerJobsApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simular datos de aplicaciones
    const mockApplications: JobApplication[] = [
      {
        id: "1",
        project_id: "proj1",
        project_title: "Desarrollo de Aplicación Web",
        company_name: "TechCorp",
        status: 'pending',
        applied_date: "2024-01-15",
        cover_letter: "Estoy muy interesado en este proyecto...",
        proposed_budget: 5000,
        estimated_duration: "3-4 semanas"
      },
      {
        id: "2",
        project_id: "proj2",
        project_title: "Diseño de UI/UX",
        company_name: "DesignStudio",
        status: 'reviewed',
        applied_date: "2024-01-10",
        cover_letter: "Tengo experiencia en diseño de interfaces...",
        proposed_budget: 3000,
        estimated_duration: "2-3 semanas",
        response_date: "2024-01-12",
        response_message: "Gracias por tu aplicación, estamos revisando..."
      },
      {
        id: "3",
        project_id: "proj3",
        project_title: "Consultoría de Marketing Digital",
        company_name: "MarketingPro",
        status: 'accepted',
        applied_date: "2024-01-05",
        cover_letter: "Especialista en estrategias digitales...",
        proposed_budget: 8000,
        estimated_duration: "6-8 semanas",
        response_date: "2024-01-08",
        response_message: "¡Felicitaciones! Has sido seleccionado para el proyecto."
      }
    ];
    
    setApplications(mockApplications);
  }, []);

  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const handleWithdrawApplication = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'withdrawn' as const } : app
    ));
  };

  const handleViewProject = (projectId: string) => {
    // Implementar ver proyecto
    console.log('Ver proyecto:', projectId);
  };

  const handleContactCompany = (companyName: string) => {
    // Implementar contacto con empresa
    console.log('Contactar empresa:', companyName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewed': return 'info';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'withdrawn': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'reviewed': return 'Revisada';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'withdrawn': return 'Retirada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'reviewed': return '👁️';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      case 'withdrawn': return '↩️';
      default: return '📋';
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Mis Aplicaciones" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Aplicaciones
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En revisión
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Aceptadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.accepted}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proyectos ganados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Rechazadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No seleccionadas
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
              <option value="pending">Pendientes</option>
              <option value="reviewed">Revisadas</option>
              <option value="accepted">Aceptadas</option>
              <option value="rejected">Rechazadas</option>
              <option value="withdrawn">Retiradas</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de aplicaciones */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <ComponentCard key={application.id} title={application.project_title}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {application.project_title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {application.company_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getStatusIcon(application.status)}</span>
                        <Badge color={getStatusColor(application.status)}>
                          {getStatusText(application.status)}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        Aplicado: {new Date(application.applied_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Presupuesto propuesto:</span>
                        <span className="font-medium">
                          ${application.proposed_budget?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duración estimada:</span>
                        <span className="font-medium">{application.estimated_duration || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {application.response_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Respuesta:</span>
                          <span className="font-medium">
                            {new Date(application.response_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Días transcurridos:</span>
                        <span className="font-medium">
                          {Math.floor((Date.now() - new Date(application.applied_date).getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carta de presentación:</span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {application.cover_letter.length > 200 
                        ? `${application.cover_letter.substring(0, 200)}...` 
                        : application.cover_letter}
                    </p>
                  </div>
                  
                  {application.response_message && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Respuesta de la empresa:</span>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {application.response_message}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    onClick={() => handleViewProject(application.project_id)}
                    className="w-full"
                  >
                    Ver Proyecto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactCompany(application.company_name)}
                    className="w-full"
                  >
                    Contactar Empresa
                  </Button>
                  {application.status === 'pending' && (
                    <Button
                      variant="ghost"
                      onClick={() => handleWithdrawApplication(application.id)}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Retirar Aplicación
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <ComponentCard title="Sin Aplicaciones">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron aplicaciones. {searchTerm || statusFilter !== "all" ? "Intenta ajustar los filtros." : "No has enviado aplicaciones aún."}
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

export default FreelancerJobsApplicationsPage; 