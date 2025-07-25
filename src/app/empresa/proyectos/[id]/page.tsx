"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Job } from "@/services/jobs.service";
import { showError } from '@/util/notifications';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle,
  Edit,
  ArrowLeft
} from "lucide-react";

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getJobById, updateJob } = useProject();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const jobId = params.id as string;

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const jobData = await getJobById(jobId);
        setJob(jobData);
      } catch (error) {
        console.error('Error loading job:', error);
        showError('Error al cargar el proyecto');
        router.push('/empresa/proyectos');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId, getJobById, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'primary';
      case 'PAUSED': return 'warning';
      case 'CLOSED': return 'error';
      case 'DRAFT': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Activo';
      case 'COMPLETED': return 'Completado';
      case 'PAUSED': return 'Pausado';
      case 'CLOSED': return 'Cerrado';
      case 'DRAFT': return 'Borrador';
      default: return status;
    }
  };

  const handlePublish = async () => {
    if (!job) return;
    
    setPublishing(true);
    try {
      const result = await updateJob(job.id, { status: 'ACTIVE' });
      if (result.success) {
        showError('Proyecto publicado exitosamente');
        setJob({ ...job, status: 'ACTIVE' });
      } else {
        showError('Error al publicar el proyecto: ' + result.message);
      }
    } catch (error) {
      showError('Error al publicar el proyecto');
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageBreadcrumb pageTitle="Cargando..." />
        <ComponentCard title="Cargando proyecto">
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando detalles del proyecto...</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageBreadcrumb pageTitle="Proyecto no encontrado" />
        <ComponentCard title="Proyecto no encontrado">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">El proyecto solicitado no existe</p>
            <Button onClick={() => router.push('/empresa/proyectos')}>
              Volver a proyectos
            </Button>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageBreadcrumb pageTitle={job.title} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <ComponentCard title="Información del Proyecto">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {job.title}
                </h1>
                <Badge color={getStatusColor(job.status)}>
                  {getStatusText(job.status)}
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {job.description}
              </p>
            </div>
          </ComponentCard>

          <ComponentCard title="Requerimientos">
            <div className="space-y-3">
              {job.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{requirement}</p>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="Habilidades Requeridas">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} color="primary" variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          <ComponentCard title="Detalles del Proyecto">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Presupuesto</p>
                  <p className="font-semibold">
                    ${job.budget.min.toLocaleString()} - ${job.budget.max.toLocaleString()} {job.budget.currency}
                  </p>
                </div>
              </div>

              {job.duration && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Duración</p>
                    <p className="font-semibold">{job.duration}</p>
                  </div>
                </div>
              )}

              {job.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-semibold">{job.location}</p>
                  </div>
                </div>
              )}

              {job.experienceLevel && (
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-500">Nivel de Experiencia</p>
                    <p className="font-semibold capitalize">{job.experienceLevel}</p>
                  </div>
                </div>
              )}

              {job.projectType && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tipo de Proyecto</p>
                    <p className="font-semibold capitalize">{job.projectType}</p>
                  </div>
                </div>
              )}

              {job.isUrgent && (
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="font-semibold text-red-500">Urgente</p>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>

          <ComponentCard title="Acciones">
            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/empresa/proyectos/${job.id}/editar`)}
                variant="outline"
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Proyecto
              </Button>
              
              <Button
                onClick={() => router.push(`/empresa/proyectos/${job.id}/applications`)}
                variant="outline"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Ver Aplicaciones
              </Button>
              
              {job.status === 'DRAFT' && (
                <Button
                  onClick={handlePublish}
                  variant="primary"
                  className="w-full"
                  disabled={publishing}
                >
                  {publishing ? 'Publicando...' : 'Publicar Proyecto'}
                </Button>
              )}
              
              <Button
                onClick={() => router.push('/empresa/proyectos')}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Proyectos
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 