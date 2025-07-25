"use client";
import React, { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Application } from "@/services/applications.service";
import { 
  Eye, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  MessageSquare,
  ArrowLeft,
  Building
} from "lucide-react";

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const { getApplicationsByProfessional, getApplicationStats } = useProject();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [applicationsData, statsData] = await Promise.all([
          getApplicationsByProfessional(),
          getApplicationStats()
        ]);
        setApplications(applicationsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading applications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getApplicationsByProfessional, getApplicationStats]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'light';
      case 'REVIEWING': return 'warning';
      case 'INTERVIEWING': return 'primary';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      case 'WITHDRAWN': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'REVIEWING': return 'En Revisión';
      case 'INTERVIEWING': return 'Entrevistando';
      case 'ACCEPTED': return 'Aceptada';
      case 'REJECTED': return 'Rechazada';
      case 'WITHDRAWN': return 'Retirada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockIcon className="w-4 h-4" />;
      case 'REVIEWING': return <Eye className="w-4 h-4" />;
      case 'INTERVIEWING': return <MessageSquare className="w-4 h-4" />;
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'WITHDRAWN': return <ArrowLeft className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => 
    statusFilter === "all" || app.status === statusFilter
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Cargando..." />
        <ComponentCard title="Cargando aplicaciones">
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando tus aplicaciones...</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Mis Aplicaciones" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        {stats && (
          <ComponentCard title="Resumen de Aplicaciones">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalApplications}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingApplications}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pendientes</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.acceptedApplications}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Aceptadas</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.rejectedApplications}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rechazadas</div>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Filtros */}
        <ComponentCard title="Filtrar Aplicaciones">
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las aplicaciones ({applications.length})</option>
              <option value="PENDING">Pendientes ({applications.filter(a => a.status === 'PENDING').length})</option>
              <option value="REVIEWING">En Revisión ({applications.filter(a => a.status === 'REVIEWING').length})</option>
              <option value="INTERVIEWING">Entrevistando ({applications.filter(a => a.status === 'INTERVIEWING').length})</option>
              <option value="ACCEPTED">Aceptadas ({applications.filter(a => a.status === 'ACCEPTED').length})</option>
              <option value="REJECTED">Rechazadas ({applications.filter(a => a.status === 'REJECTED').length})</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de aplicaciones */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ComponentCard key={application.id} title={application.job?.title || 'Aplicación'}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {application.job?.title || 'Trabajo'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Building className="w-4 h-4" />
                        <span>Empresa</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Aplicaste el {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {application.isViewed && (
                        <Badge color="success" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Vista
                        </Badge>
                      )}
                      <Badge color={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{getStatusText(application.status)}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500">Presupuesto del trabajo:</span>
                      <span className="font-medium">
                        ${application.job?.budget?.min?.toLocaleString() || 0} - ${application.job?.budget?.max?.toLocaleString() || 0} {application.job?.budget?.currency || 'USD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">Tu propuesta:</span>
                      <span className="font-medium">${application.proposedRate?.toLocaleString() || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-500">Duración estimada:</span>
                      <span className="font-medium">{application.estimatedDuration || 'No especificada'}</span>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tu carta de presentación:</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {application.job?.skills && application.job.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Habilidades requeridas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.job.skills.slice(0, 5).map((skill: string, index: number) => (
                          <Badge key={index} color="light" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {application.job.skills.length > 5 && (
                          <Badge color="light" size="sm">
                            +{application.job.skills.length - 5} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/profesional/jobs/${application.jobId}`)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Trabajo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/empresa/${application.job?.companyId}`)}
                    className="w-full"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Ver Empresa
                  </Button>

                  {application.status === 'PENDING' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Implementar retirar aplicación
                        if (confirm('¿Estás seguro de que quieres retirar esta aplicación?')) {
                          // Llamar a withdrawApplication
                        }
                      }}
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
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
                {statusFilter === "all" 
                  ? "No has aplicado a ningún trabajo aún." 
                  : `No tienes aplicaciones con estado "${getStatusText(statusFilter)}".`
                }
              </p>
              {statusFilter === "all" && (
                <Button
                  onClick={() => router.push('/profesional/jobs/search')}
                  variant="primary"
                  className="mt-4"
                >
                  Buscar Trabajos
                </Button>
              )}
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage; 