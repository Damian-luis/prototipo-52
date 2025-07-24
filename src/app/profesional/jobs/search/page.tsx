"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Project } from "@/types";

const FreelancerJobsSearchPage = () => {
  const { user } = useAuth();
  const { projects } = useProject();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    // Filtrar proyectos disponibles (no del usuario actual)
    const availableProjects = projects.filter(p => p.company_id !== user?.id && p.status === 'active');
    setFilteredProjects(availableProjects);
  }, [projects, user]);

  useEffect(() => {
    let filtered = projects.filter(p => p.company_id !== user?.id && p.status === 'active');
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter(p => 
        p.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    
    if (budgetFilter) {
      const minBudget = parseInt(budgetFilter);
      filtered = filtered.filter(p => p.budget.min >= minBudget);
    }
    
    if (durationFilter) {
      // Implementar filtro por duración
    }
    
    if (experienceFilter) {
      const minExp = parseInt(experienceFilter);
      // Implementar filtro por experiencia requerida
    }
    
    setFilteredProjects(filtered);
  }, [projects, user, searchTerm, skillFilter, budgetFilter, durationFilter, experienceFilter]);

  const handleApplyToJob = (project: Project) => {
    // Implementar aplicación a trabajo
    console.log('Aplicar a trabajo:', project.id);
  };

  const handleSaveJob = (project: Project) => {
    // Implementar guardar trabajo
    console.log('Guardar trabajo:', project.id);
  };

  const handleViewDetails = (project: Project) => {
    // Implementar ver detalles
    console.log('Ver detalles:', project.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'light';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

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
              Se encontraron {filteredProjects.length} trabajos disponibles
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
          {filteredProjects.map((project) => (
            <ComponentCard key={project.id} title={project.title}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={getPriorityColor(project.priority)}>
                        {getPriorityText(project.priority)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Empresa:</span>
                        <span className="font-medium">{project.company_name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Presupuesto:</span>
                        <span className="font-medium">
                          ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()} {project.budget.currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duración estimada:</span>
                        <span className="font-medium">2-4 semanas</span>
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
                        <span className="font-medium">Remoto</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Habilidades requeridas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} color="light" size="sm">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 5 && (
                        <Badge color="light" size="sm">
                          +{project.skills.length - 5} más
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="primary"
                    onClick={() => handleApplyToJob(project)}
                    className="w-full"
                  >
                    Aplicar Ahora
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSaveJob(project)}
                    className="w-full"
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleViewDetails(project)}
                    className="w-full"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <ComponentCard title="Sin Trabajos Encontrados">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron trabajos que coincidan con tus criterios. {searchTerm || skillFilter || budgetFilter ? "Intenta ajustar los filtros." : "No hay trabajos disponibles en este momento."}
              </p>
            </div>
          </ComponentCard>
        )}

        {/* Paginación */}
        {filteredProjects.length > 10 && (
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