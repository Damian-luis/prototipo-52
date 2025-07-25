"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { Application } from "@/services/applications.service";
import { Job } from "@/services/jobs.service";
import { showError } from '@/util/notifications';
import { 
  Eye, 
  User, 
  Calendar, 
  DollarSign, 
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  MessageSquare
} from "lucide-react";

const JobApplicationsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getJobById, getJobApplications, markApplicationAsViewed, updateApplicationStatus } = useProject();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const jobId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [jobData, applicationsData] = await Promise.all([
          getJobById(jobId),
          getJobApplications(jobId)
        ]);
        setJob(jobData);
        setApplications(applicationsData);
      } catch (error) {
        console.error('Error loading data:', error);
        showError('Error al cargar los datos');
        router.push('/empresa/proyectos');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadData();
    }
  }, [jobId, getJobById, getJobApplications, router]);

  const handleViewApplication = async (application: Application) => {
    try {
      await markApplicationAsViewed(application.id);
      // Actualizar el estado local para mostrar que fue vista
      setApplications(prev => prev.map(app => 
        app.id === application.id ? { ...app, isViewed: true, viewedAt: new Date().toISOString() } : app
      ));
    } catch (error) {
      console.error('Error marking as viewed:', error);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    try {
      const result = await updateApplicationStatus(applicationId, newStatus);
      if (result.success) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus as any } : app
        ));
        showError('Estado actualizado exitosamente');
      } else {
        showError('Error al actualizar estado: ' + result.message);
      }
    } catch (error) {
      showError('Error al actualizar estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

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
            <p className="text-gray-500">Cargando aplicaciones...</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Trabajo no encontrado" />
        <ComponentCard title="Trabajo no encontrado">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">El trabajo solicitado no existe</p>
            <Button onClick={() => router.push('/empresa/proyectos')}>
              Volver a proyectos
            </Button>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle={`Aplicaciones - ${job.title}`} />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Información del trabajo */}
        <ComponentCard title="Información del Trabajo">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {job.description}
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Presupuesto: ${job.budget.min.toLocaleString()} - ${job.budget.max.toLocaleString()} {job.budget.currency}</span>
                <span>•</span>
                <span>Duración: {job.duration || 'No especificada'}</span>
                <span>•</span>
                <span>Ubicación: {job.location || 'Remoto'}</span>
              </div>
            </div>
            <Badge color={job.status === 'ACTIVE' ? 'success' : 'light'}>
              {job.status === 'ACTIVE' ? 'Activo' : job.status}
            </Badge>
          </div>
        </ComponentCard>

        {/* Filtros y estadísticas */}
        <ComponentCard title="Aplicaciones Recibidas">
          <div className="flex justify-between items-center mb-6">
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
            <Button
              onClick={() => router.push(`/empresa/proyectos/${jobId}`)}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Proyecto
            </Button>
          </div>
        </ComponentCard>

        {/* Lista de aplicaciones */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ComponentCard key={application.id} title={`Aplicación de ${application.professional?.fullName || 'Profesional'}`}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={application.professional?.avatar}
                        alt={application.professional?.fullName || 'Profesional'}
                        size="lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {application.professional?.fullName || 'Profesional'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Aplicó el {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
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
                      <span className="text-sm text-gray-500">Tarifa propuesta:</span>
                      <span className="font-medium">${application.proposedRate?.toLocaleString() || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-500">Duración estimada:</span>
                      <span className="font-medium">{application.estimatedDuration || 'No especificada'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-500">Experiencia:</span>
                      <span className="font-medium">{application.professional?.experience || 'No especificada'} años</span>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Carta de Presentación:</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {application.professional?.skills && application.professional.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Habilidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.professional.skills.slice(0, 5).map((skill: string, index: number) => (
                          <Badge key={index} color="light" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {application.professional.skills.length > 5 && (
                          <Badge color="light" size="sm">
                            +{application.professional.skills.length - 5} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="outline"
                    onClick={() => handleViewApplication(application)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Perfil Completo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/profesional/${application.professionalId}`)}
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Ver Perfil
                  </Button>

                  <div className="border-t pt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cambiar Estado:</p>
                    <div className="space-y-1">
                      {['PENDING', 'REVIEWING', 'INTERVIEWING', 'ACCEPTED', 'REJECTED'].map((status) => (
                        <Button
                          key={status}
                          variant={application.status === status ? "primary" : "outline"}
                          size="sm"
                          onClick={() => handleUpdateStatus(application.id, status)}
                          disabled={updatingStatus === application.id}
                          className="w-full justify-start"
                        >
                          {getStatusIcon(status)}
                          <span className="ml-1">{getStatusText(status)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
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
                  ? "No hay aplicaciones para este trabajo aún." 
                  : `No hay aplicaciones con estado "${getStatusText(statusFilter)}".`
                }
              </p>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage; 