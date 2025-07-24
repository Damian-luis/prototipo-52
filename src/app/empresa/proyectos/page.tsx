"use client";
import React, { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Project } from "@/types";

const EmpresaProyectosPage = () => {
  const { user } = useAuth();
  const { projects, createProject, updateProject, deleteProject } = useProject();
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: { min: 0, max: 0, currency: "USD" },
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    // Filtrar proyectos de la empresa actual
    const empresaProjects = projects.filter(p => p.company_id === user?.id);
    setFilteredProjects(empresaProjects);
  }, [projects, user]);

  useEffect(() => {
    let filtered = projects.filter(p => p.company_id === user?.id);
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [projects, user, searchTerm, statusFilter]);

  const handleCreateProject = () => {
    if (newProject.title && newProject.description && newProject.budget.min > 0) {
      createProject({
        ...newProject,
        company_id: user?.id || "",
        company_name: user?.name || "",
        status: 'active',
        priority: 'medium',
        skills: [],
        requirements: [],
        tasks: [],
        professionals: [],
        contracts: [],
      });
      setNewProject({ 
        title: "", 
        description: "", 
        budget: { min: 0, max: 0, currency: "USD" }, 
        start_date: "", 
        end_date: "" 
      });
      setShowCreateModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'paused': return 'warning';
      case 'cancelled': return 'error';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      case 'paused': return 'Pausado';
      case 'cancelled': return 'Cancelado';
      case 'draft': return 'Borrador';
      default: return status;
    }
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
                <option value="active">Activo</option>
                <option value="completed">Completado</option>
                <option value="paused">Pausado</option>
                <option value="cancelled">Cancelado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              Crear Proyecto
            </Button>
          </div>
        </ComponentCard>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ComponentCard key={project.id} title={project.title}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <Badge color={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1">
                  {project.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Presupuesto:</span>
                    <span className="font-medium">
                      ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()} {project.budget.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Profesionales:</span>
                    <span className="font-medium">{project.professionals.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tareas:</span>
                    <span className="font-medium">{project.tasks.length}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Implementar editar */}}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Implementar ver detalles */}}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <ComponentCard title="Sin Proyectos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron proyectos. {searchTerm || statusFilter !== "all" ? "Intenta ajustar los filtros." : "Crea tu primer proyecto."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal para crear proyecto */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Proyecto</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título del proyecto"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Descripción del proyecto"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows={4}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Presupuesto mínimo"
                  value={newProject.budget.min}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    budget: {...newProject.budget, min: Number(e.target.value)}
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                
                <input
                  type="number"
                  placeholder="Presupuesto máximo"
                  value={newProject.budget.max}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    budget: {...newProject.budget, max: Number(e.target.value)}
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newProject.start_date}
                  onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                
                <input
                  type="date"
                  value={newProject.end_date}
                  onChange={(e) => setNewProject({...newProject, end_date: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateProject}
                  variant="primary"
                >
                  Crear Proyecto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresaProyectosPage; 