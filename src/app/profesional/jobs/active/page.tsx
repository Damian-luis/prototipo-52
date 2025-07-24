"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Project } from "@/types";

interface ActiveJob {
  id: string;
  project_id: string;
  project_title: string;
  company_name: string;
  status: 'active' | 'in_progress' | 'review' | 'completed';
  start_date: string;
  end_date?: string;
  progress: number;
  budget: {
    total: number;
    paid: number;
    pending: number;
    currency: string;
  };
  tasks: {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    due_date: string;
  }[];
  milestones: {
    id: string;
    title: string;
    status: 'pending' | 'completed';
    due_date: string;
    amount: number;
  }[];
}

const FreelancerJobsActivePage = () => {
  const { user } = useAuth();
  const { projects } = useProject();
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<ActiveJob[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simular datos de trabajos activos
    const mockActiveJobs: ActiveJob[] = [
      {
        id: "1",
        project_id: "proj1",
        project_title: "Desarrollo de Aplicación Web",
        company_name: "TechCorp",
        status: 'in_progress',
        start_date: "2024-01-15",
        end_date: "2024-02-15",
        progress: 65,
        budget: {
          total: 5000,
          paid: 2000,
          pending: 3000,
          currency: "USD"
        },
        tasks: [
          { id: "1", title: "Diseño de base de datos", status: 'completed', due_date: "2024-01-20" },
          { id: "2", title: "Desarrollo del backend", status: 'in_progress', due_date: "2024-01-30" },
          { id: "3", title: "Desarrollo del frontend", status: 'pending', due_date: "2024-02-05" },
          { id: "4", title: "Testing y debugging", status: 'pending', due_date: "2024-02-10" }
        ],
        milestones: [
          { id: "1", title: "Diseño completado", status: 'completed', due_date: "2024-01-20", amount: 1000 },
          { id: "2", title: "Backend completado", status: 'pending', due_date: "2024-01-30", amount: 2000 },
          { id: "3", title: "Frontend completado", status: 'pending', due_date: "2024-02-05", amount: 1500 },
          { id: "4", title: "Proyecto finalizado", status: 'pending', due_date: "2024-02-15", amount: 500 }
        ]
      },
      {
        id: "2",
        project_id: "proj2",
        project_title: "Diseño de UI/UX",
        company_name: "DesignStudio",
        status: 'active',
        start_date: "2024-01-20",
        end_date: "2024-02-20",
        progress: 30,
        budget: {
          total: 3000,
          paid: 0,
          pending: 3000,
          currency: "USD"
        },
        tasks: [
          { id: "1", title: "Research y análisis", status: 'completed', due_date: "2024-01-25" },
          { id: "2", title: "Wireframes", status: 'in_progress', due_date: "2024-02-05" },
          { id: "3", title: "Diseño visual", status: 'pending', due_date: "2024-02-15" },
          { id: "4", title: "Prototipado", status: 'pending', due_date: "2024-02-20" }
        ],
        milestones: [
          { id: "1", title: "Research completado", status: 'completed', due_date: "2024-01-25", amount: 500 },
          { id: "2", title: "Wireframes completados", status: 'pending', due_date: "2024-02-05", amount: 1000 },
          { id: "3", title: "Diseño visual completado", status: 'pending', due_date: "2024-02-15", amount: 1000 },
          { id: "4", title: "Prototipo finalizado", status: 'pending', due_date: "2024-02-20", amount: 500 }
        ]
      }
    ];
    
    setActiveJobs(mockActiveJobs);
  }, []);

  useEffect(() => {
    let filtered = activeJobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }
    
    setFilteredJobs(filtered);
  }, [activeJobs, searchTerm, statusFilter]);

  const handleUpdateProgress = (jobId: string, taskId: string, newStatus: string) => {
    setActiveJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedTasks = job.tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus as any } : task
        );
        const completedTasks = updatedTasks.filter(task => task.status === 'completed').length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        return { ...job, tasks: updatedTasks, progress };
      }
      return job;
    }));
  };

  const handleCompleteMilestone = (jobId: string, milestoneId: string) => {
    setActiveJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        const updatedMilestones = job.milestones.map(milestone => 
          milestone.id === milestoneId ? { ...milestone, status: 'completed' as const } : milestone
        );
        const completedMilestones = updatedMilestones.filter(m => m.status === 'completed');
        const paid = completedMilestones.reduce((sum, m) => sum + m.amount, 0);
        const pending = job.budget.total - paid;
        return { 
          ...job, 
          milestones: updatedMilestones,
          budget: { ...job.budget, paid, pending }
        };
      }
      return job;
    }));
  };

  const handleViewProject = (projectId: string) => {
    // Implementar ver proyecto
    console.log('Ver proyecto:', projectId);
  };

  const handleContactClient = (companyName: string) => {
    // Implementar contacto con cliente
    console.log('Contactar cliente:', companyName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'in_progress': return 'warning';
      case 'review': return 'info';
      case 'completed': return 'success';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'in_progress': return 'En Progreso';
      case 'review': return 'En Revisión';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'light';
      default: return 'light';
    }
  };

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const stats = {
    total: activeJobs.length,
    inProgress: activeJobs.filter(job => job.status === 'in_progress').length,
    completed: activeJobs.filter(job => job.status === 'completed').length,
    totalEarnings: activeJobs.reduce((sum, job) => sum + job.budget.total, 0)
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Trabajos Activos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Trabajos Activos">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proyectos en curso
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="En Progreso">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.inProgress}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trabajando actualmente
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Completados">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Proyectos finalizados
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Ganancias Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                ${stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Valor de proyectos
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
              <option value="active">Activo</option>
              <option value="in_progress">En Progreso</option>
              <option value="review">En Revisión</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de trabajos activos */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <ComponentCard key={job.id} title={job.project_title}>
              <div className="space-y-6">
                {/* Header del trabajo */}
                <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {job.project_title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {job.company_name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Inicio: {new Date(job.start_date).toLocaleDateString()}</span>
                      {job.end_date && (
                        <span>Fin: {new Date(job.end_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge color={getStatusColor(job.status)}>
                      {getStatusText(job.status)}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {job.progress}%
                      </p>
                      <p className="text-sm text-gray-500">Progreso</p>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>

                {/* Información financiera */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Presupuesto Total</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${job.budget.total.toLocaleString()} {job.budget.currency}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Pagado</h4>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${job.budget.paid.toLocaleString()} {job.budget.currency}
                    </p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">Pendiente</h4>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      ${job.budget.pending.toLocaleString()} {job.budget.currency}
                    </p>
                  </div>
                </div>

                {/* Tareas */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tareas</h4>
                  <div className="space-y-2">
                    {job.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge color={getTaskStatusColor(task.status)} size="sm">
                            {getTaskStatusText(task.status)}
                          </Badge>
                          <span className="text-gray-900 dark:text-white">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                          {task.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateProgress(job.id, task.id, 'in_progress')}
                            >
                              Iniciar
                            </Button>
                          )}
                          {task.status === 'in_progress' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateProgress(job.id, task.id, 'completed')}
                            >
                              Completar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hitos */}
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Hitos de Pago</h4>
                  <div className="space-y-2">
                    {job.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge color={milestone.status === 'completed' ? 'success' : 'light'} size="sm">
                            {milestone.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </Badge>
                          <div>
                            <span className="text-gray-900 dark:text-white">{milestone.title}</span>
                            <p className="text-sm text-gray-500">
                              ${milestone.amount.toLocaleString()} {job.budget.currency}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {new Date(milestone.due_date).toLocaleDateString()}
                          </span>
                          {milestone.status === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCompleteMilestone(job.id, milestone.id)}
                            >
                              Marcar Completado
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => handleViewProject(job.project_id)}
                  >
                    Ver Proyecto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleContactClient(job.company_name)}
                  >
                    Contactar Cliente
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <ComponentCard title="Sin Trabajos Activos">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron trabajos activos. {searchTerm || statusFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes trabajos en curso."}
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

export default FreelancerJobsActivePage; 