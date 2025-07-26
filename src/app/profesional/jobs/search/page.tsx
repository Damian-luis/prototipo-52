"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Job } from "@/services/jobs.service";
import { showError } from '@/util/notifications';

const FreelancerJobsSearchPage = () => {
  const { user } = useAuth();
  const { getAvailableJobs, saveJob, unsaveJob, createApplication } = useProject();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [savingJob, setSavingJob] = useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const availableJobs = await getAvailableJobs();
        // Filtrar solo trabajos donde NO se ha aplicado
        const jobsNotApplied = availableJobs.filter((job: Job) => !job.hasApplied);
        setJobs(jobsNotApplied);
        setFilteredJobs(jobsNotApplied);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [getAvailableJobs]);

  useEffect(() => {
    if (!jobs) return;
    
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter((job: Job) => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter((job: Job) => 
        job.skills && job.skills.some((skill: string) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    
    if (budgetFilter) {
      const minBudget = parseInt(budgetFilter);
      filtered = filtered.filter((job: Job) => job.budget && job.budget.min >= minBudget);
    }
    
    if (durationFilter) {
      // Implementar filtro por duración
    }
    
    if (experienceFilter) {
      const minExp = parseInt(experienceFilter);
      // Implementar filtro por experiencia requerida
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, skillFilter, budgetFilter, durationFilter, experienceFilter]);

  const handleApplyToJob = async (job: Job) => {
    setApplyingJob(job.id);
    try {
      const result = await createApplication({
        jobId: job.id,
        coverLetter: `Me interesa mucho este proyecto. Tengo experiencia en ${job.skills?.join(', ')} y creo que puedo aportar valor significativo.`,
        proposedRate: job.budget?.max || 0,
        estimatedDuration: job.duration || '2-4 semanas'
      });
      
      if (result.success) {
        showError('¡Aplicación enviada exitosamente!');
        // Actualizar el estado del trabajo para mostrar que ya se aplicó
        setJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, hasApplied: true } : j
        ));
      } else {
        showError('Error al enviar la aplicación: ' + result.message);
      }
    } catch (error) {
      showError('Error al enviar la aplicación');
    } finally {
      setApplyingJob(null);
    }
  };

  const handleSaveJob = async (job: Job) => {
    setSavingJob(job.id);
    try {
      if (job.isSaved) {
        const result = await unsaveJob(job.id);
        if (result.success) {
          showError('Trabajo eliminado de favoritos');
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, isSaved: false } : j
          ));
        } else {
          showError('Error al eliminar de favoritos: ' + result.message);
        }
      } else {
        const result = await saveJob(job.id);
        if (result.success) {
          showError('Trabajo guardado en favoritos');
          setJobs(prev => prev.map(j => 
            j.id === job.id ? { ...j, isSaved: true } : j
          ));
        } else {
          showError('Error al guardar trabajo: ' + result.message);
        }
      }
    } catch (error) {
      showError('Error al guardar trabajo');
    } finally {
      setSavingJob(null);
    }
  };

  const handleViewDetails = (job: Job) => {
    router.push(`/profesional/jobs/${job.id}`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Búsqueda de Trabajos" />
        <ComponentCard title="Cargando trabajos">
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando trabajos disponibles...</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Búsqueda de Trabajos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Filtros de búsqueda */}
        <ComponentCard title="Filtros de Búsqueda">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar trabajos, empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            
            <input
              type="text"
              placeholder="Filtrar por habilidad..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Cualquier presupuesto</option>
              <option value="1000">$1,000+</option>
              <option value="5000">$5,000+</option>
              <option value="10000">$10,000+</option>
              <option value="25000">$25,000+</option>
              <option value="50000">$50,000+</option>
            </select>
            
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Cualquier duración</option>
              <option value="1">Menos de 1 semana</option>
              <option value="2">1-2 semanas</option>
              <option value="4">1-4 semanas</option>
              <option value="12">1-3 meses</option>
              <option value="24">3-6 meses</option>
              <option value="25">Más de 6 meses</option>
            </select>
            
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Cualquier experiencia</option>
              <option value="1">Entry Level</option>
              <option value="3">Intermedio</option>
              <option value="5">Experto</option>
            </select>
          </div>
        </ComponentCard>

        {/* Resumen de resultados */}
        <ComponentCard title="Resultados">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Se encontraron {filteredJobs.length} trabajos disponibles
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Ordenar por: Relevancia
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Lista de trabajos */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <ComponentCard key={job.id} title={job.title}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={job.isUrgent ? 'error' : 'success'}>
                        {job.isUrgent ? 'Urgente' : 'Normal'}
                      </Badge>
                      {job.hasApplied && (
                        <Badge color="primary">
                          Ya aplicaste
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Empresa:</span>
                        <span className="font-medium">{job.companyName || 'Empresa'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Presupuesto:</span>
                        <span className="font-medium">
                          ${job.budget?.min?.toLocaleString() || 0} - ${job.budget?.max?.toLocaleString() || 0} {job.budget?.currency || 'USD'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duración estimada:</span>
                        <span className="font-medium">{job.duration || '2-4 semanas'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Aplicaciones:</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tipo:</span>
                        <span className="font-medium capitalize">Proyecto</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ubicación:</span>
                        <span className="font-medium">{job.location || 'Remoto'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Habilidades requeridas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {job.skills && job.skills.slice(0, 5).map((skill: string, index: number) => (
                        <Badge key={index} color="light" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills && job.skills.length > 5 && (
                        <Badge color="light" size="sm">
                          +{job.skills.length - 5} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="primary"
                    onClick={() => handleApplyToJob(job)}
                    disabled={applyingJob === job.id || job.hasApplied}
                    className="w-full"
                  >
                    {applyingJob === job.id ? 'Aplicando...' : job.hasApplied ? 'Ya Aplicaste' : 'Aplicar Ahora'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveJob(job)}
                    disabled={savingJob === job.id}
                    className="w-full"
                  >
                    {savingJob === job.id ? 'Guardando...' : job.isSaved ? 'Guardado' : 'Guardar'}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetails(job)}
                    className="w-full"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <ComponentCard title="Sin Trabajos Encontrados">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron trabajos que coincidan con tus criterios. {searchTerm || skillFilter || budgetFilter ? "Intenta ajustar los filtros." : "No hay trabajos disponibles en este momento."}
              </p>
            </div>
          </ComponentCard>
        )}

        {/* Paginación */}
        {filteredJobs.length > 10 && (
          <ComponentCard title="Paginación">
            <div className="flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
                <Button variant="primary" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default FreelancerJobsSearchPage; 