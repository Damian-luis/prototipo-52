"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useNotifications } from "@/hooks/useNotifications";
import { useProject } from "@/context/ProjectContext";
import { Application } from "@/services/applications.service";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

const FreelancerJobsApplicationsPage = () => {
  const { user } = useAuth();
  const { contactUser } = useChat();
  const { notify } = useNotifications();
  const { applications, loading, getApplicationsByProfessional, getApplicationStats } = useProject();
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    const loadApplications = async () => {
      try {
        // setLoading(true); // This line was removed from the new_code, so it's removed here.
        const applicationsData = await getApplicationsByProfessional();
        // setApplications(applicationsData); // This line was removed from the new_code, so it's removed here.
        
        // Cargar estadísticas
        const statsData = await getApplicationStats();
        if (statsData) {
          setStats({
            total: statsData.total || applicationsData.length,
            pending: statsData.pending || applicationsData.filter(app => app.status === 'PENDING').length,
            accepted: statsData.accepted || applicationsData.filter(app => app.status === 'ACCEPTED').length,
            rejected: statsData.rejected || applicationsData.filter(app => app.status === 'REJECTED').length
          });
        }
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        // setLoading(false); // This line was removed from the new_code, so it's removed here.
      }
    };
    
    if (user) {
      loadApplications();
    }
  }, [user, getApplicationsByProfessional, getApplicationStats]);

  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const handleWithdrawApplication = (applicationId: string) => {
    // setApplications(prev => prev.map(app =>  // This line was removed from the new_code, so it's removed here.
    //   app.id === applicationId ? { ...app, status: 'WITHDRAWN' as const } : app
    // ));
  };

  const handleViewProject = (projectId: string) => {
    // Implementar ver proyecto
    console.log('Ver proyecto:', projectId);
  };

  const handleContactCompany = async (application: Application) => {
    if (!user || !application.job?.companyId) {
      console.error('No se puede contactar a la empresa: datos faltantes');
      return;
    }

    const companyId = application.job.companyId;
    const professionalId = user.id;

    try {
      console.log('🆕 Abriendo chat con empresa...');
      
      // Buscar sala existente o crear nueva (sin enviar mensaje automático)
      const result = await contactUser(
        [professionalId, companyId],
        '', // Sin mensaje automático
        `Aplicación: ${application.job?.title}`
      );
      
      console.log('✅ Chat abierto:', result);
      
      // Redirigir a la página de chat
      window.location.href = '/profesional/chat';
      
    } catch (error) {
      console.error('❌ Error al abrir chat:', error);
      notify('Error al abrir el chat');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'REVIEWED': return 'info';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'WITHDRAWN': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'REVIEWED': return 'Revisada';
      case 'ACCEPTED': return 'Aceptada';
      case 'REJECTED': return 'Rechazada';
      case 'WITHDRAWN': return 'Retirada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'REVIEWED': return '👁️';
      case 'ACCEPTED': return '✅';
      case 'REJECTED': return '❌';
      case 'WITHDRAWN': return '↩️';
      default: return '📋';
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Mis Aplicaciones" />
      
      {loading ? (
        <ComponentCard title="Cargando aplicaciones">
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando tus aplicaciones...</p>
          </div>
        </ComponentCard>
      ) : (
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
              <option value="PENDING">Pendientes</option>
              <option value="REVIEWED">Revisadas</option>
              <option value="ACCEPTED">Aceptadas</option>
              <option value="REJECTED">Rechazadas</option>
              <option value="WITHDRAWN">Retiradas</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de aplicaciones */}
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <ComponentCard key={application.id} title={application.job?.title || 'Trabajo no encontrado'}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {application.job?.title || 'Trabajo no encontrado'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {application.job?.companyName || 'Empresa no especificada'}
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
                        Aplicado: {new Date(application.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Presupuesto propuesto:</span>
                        <span className="font-medium">
                          ${application.proposedRate?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duración estimada:</span>
                        <span className="font-medium">{application.estimatedDuration || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Días transcurridos:</span>
                        <span className="font-medium">
                          {Math.floor((Date.now() - new Date(application.appliedAt).getTime()) / (1000 * 60 * 60 * 24))} días
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Carta de presentación:</span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {application.coverLetter && application.coverLetter.length > 200 
                        ? `${application.coverLetter.substring(0, 200)}...` 
                        : application.coverLetter || 'No se proporcionó carta de presentación'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    onClick={() => handleViewProject(application.jobId)}
                    className="w-full"
                  >
                    Ver Proyecto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactCompany(application)}
                    className="w-full"
                  >
                    Abrir Chat
                  </Button>
                  {application.status === 'PENDING' && (
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
      )}
    </div>
  );
};

export default FreelancerJobsApplicationsPage; 