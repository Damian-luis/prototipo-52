"use client";
import React, { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Job } from "@/services/jobs.service";

const EmpresaProyectosPage = () => {
  const { user } = useAuth();
  const { jobs, getJobsByCompany, updateJob } = useProject();
  const router = useRouter();
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [publishingJob, setPublishingJob] = useState<string | null>(null);

  useEffect(() => {
    // Cargar trabajos de la empresa
    const loadJobs = async () => {
      try {
        await getJobsByCompany();
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    loadJobs();
  }, [getJobsByCompany]);

  useEffect(() => {
    // Filtrar trabajos de la empresa actual
    const empresaJobs = jobs.filter((job: Job) => job.companyId === user?.id);
    setFilteredJobs(empresaJobs);
  }, [jobs, user]);

  useEffect(() => {
    let filtered = jobs.filter((job: Job) => job.companyId === user?.id);
    
    if (searchTerm) {
      filtered = filtered.filter((job: Job) => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((job: Job) => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  }, [jobs, user, searchTerm, statusFilter]);

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

  const handlePublishJob = async (jobId: string) => {
    setPublishingJob(jobId);
    try {
      const result = await updateJob(jobId, { status: 'ACTIVE' });
      if (result.success) {
        alert('Proyecto publicado exitosamente');
      } else {
        alert('Error al publicar el proyecto: ' + result.message);
      }
    } catch (error) {
      alert('Error al publicar el proyecto');
    } finally {
      setPublishingJob(null);
    }
  };

  const handleViewDetails = (jobId: string) => {
    router.push(`/empresa/proyectos/${jobId}`);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Gestión de Proyectos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros y botón crear */}
        <ComponentCard title="Filtros y Acciones">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar proyectos..."
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
                <option value="DRAFT">Borrador</option>
                <option value="ACTIVE">Activo</option>
                <option value="COMPLETED">Completado</option>
                <option value="PAUSED">Pausado</option>
                <option value="CLOSED">Cerrado</option>
              </select>
            </div>
            <Button
              onClick={() => router.push("/empresa/proyectos/nuevo")}
              variant="primary"
            >
              Crear Proyecto
            </Button>
          </div>
        </ComponentCard>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <ComponentCard key={job.id} title={job.title}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge color={getStatusColor(job.status)}>
                    {getStatusText(job.status)}
                  </Badge>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
                  {job.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Presupuesto:</span>
                    <span className="font-medium">
                      ${job.budget.min.toLocaleString()} - ${job.budget.max.toLocaleString()} {job.budget.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Habilidades:</span>
                    <span className="font-medium">{job.skills.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Requisitos:</span>
                    <span className="font-medium">{job.requirements.length}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/empresa/proyectos/${job.id}/editar`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(job.id)}
                  >
                    Ver Detalles
                  </Button>
                  {job.status === 'DRAFT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePublishJob(job.id)}
                      disabled={publishingJob === job.id}
                    >
                      {publishingJob === job.id ? 'Publicando...' : 'Publicar'}
                    </Button>
                  )}
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <ComponentCard title="Sin Proyectos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No tienes proyectos creados aún
              </p>
              <Button
                onClick={() => router.push("/empresa/proyectos/nuevo")}
                variant="primary"
              >
                Crear tu primer proyecto
              </Button>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default EmpresaProyectosPage; 