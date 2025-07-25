"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jobsService } from '@/services/jobs.service';
import { applicationsService } from '@/services/applications.service';
import { useAuth } from './AuthContext';
import { Project } from '@/types';

export interface Evaluation {
  id: string;
  freelancer_id: string;
  evaluator_id: string;
  type: 'initial' | 'periodic' | 'project';
  date: string;
  scores: {
    technical: number;
    communication: number;
    punctuality: number;
    quality: number;
    teamwork: number;
  };
  overall_score: number;
  comments: string;
  recommendations?: string;
}

export interface FreelancerProfile {
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  hourly_rate: number;
  availability: string;
  portfolio?: string;
  evaluations: Evaluation[];
  completed_projects: number;
  success_rate: number;
}

interface TalentContextType {
  projects: Project[];
  applications: any[];
  evaluations: Evaluation[];
  loading: boolean;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string }>;
  updateProject: (id: string, project: Partial<Project>) => Promise<{ success: boolean; message: string }>;
  deleteProject: (id: string) => Promise<{ success: boolean; message: string }>;
  applyToProject: (application: any) => Promise<{ success: boolean; message: string }>;
  updateApplicationStatus: (id: string, status: string) => Promise<{ success: boolean; message: string }>;
  getRecommendedFreelancers: (projectId: string) => Promise<FreelancerProfile[]>;
  getApplicationsByProject: (projectId: string) => any[];
  getApplicationsByProfessional: (professionalId: string) => any[];
  getEvaluationsByFreelancer: (freelancerId: string) => Evaluation[];
  loadProjects: () => Promise<void>;
  loadApplications: () => Promise<void>;
  loadEvaluations: () => Promise<void>;
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

export const TalentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar proyectos al iniciar
  const loadProjects = async () => {
    try {
      setLoading(true);
      const jobs = await jobsService.getAllJobs();
      
      // Convertir jobs a Project (simplificado)
      const projectList: Project[] = jobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        company_id: job.companyId || '',
        company_name: job.companyName || '',
        status: 'draft', // Usar un valor por defecto
        priority: 'medium',
        start_date: job.createdAt || new Date().toISOString(),
        budget: job.budget || { min: 0, max: 0, currency: 'USD' },
        skills: job.skills || [],
        requirements: job.requirements || [],
        tasks: [],
        professionals: [],
        contracts: [],
        created_at: job.createdAt || new Date().toISOString(),
        updated_at: job.updatedAt || new Date().toISOString(),
      }));
      
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar aplicaciones al iniciar
  const loadApplications = async () => {
    try {
      setLoading(true);
      let allApplications: any[] = [];
      
      if (user?.role === 'EMPRESA') {
        // Para empresas, cargar aplicaciones de sus proyectos
        const companyJobs = await jobsService.getJobsByCompany();
        for (const job of companyJobs) {
          const jobApplications = await applicationsService.getJobApplications(job.id);
          allApplications.push(...jobApplications);
        }
      } else {
        // Para freelancers, cargar sus aplicaciones
        const userApplications = await applicationsService.getMyApplications();
        allApplications = userApplications;
      }
      
      setApplications(allApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar evaluaciones al iniciar
  const loadEvaluations = async () => {
    try {
      setLoading(true);
      // Por ahora usamos un array vacío ya que no tenemos un servicio específico para evaluaciones
      setEvaluations([]);
    } catch (error) {
      console.error('Error loading evaluations:', error);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos cuando el usuario cambie
  useEffect(() => {
    if (user?.id) {
      loadProjects();
      loadApplications();
      loadEvaluations();
    } else {
      // Limpiar datos cuando no hay usuario
      setProjects([]);
      setApplications([]);
      setEvaluations([]);
    }
  }, [user?.id]);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; message: string }> => {
    try {
      const jobData = {
        title: projectData.title,
        description: projectData.description,
        company_id: user?.id || '',
        status: 'ACTIVE' as const, // Usar el valor correcto del backend
        budget: projectData.budget,
        skills: projectData.skills,
        requirements: projectData.requirements,
      };

      const newJob = await jobsService.createJob(jobData);
      
      const newProject: Project = {
        id: newJob.id,
        ...projectData,
        created_at: newJob.createdAt || new Date().toISOString(),
        updated_at: newJob.updatedAt || new Date().toISOString(),
      };
      
      setProjects(prev => [newProject, ...prev]);
      return { success: true, message: 'Proyecto creado exitosamente' };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, message: 'Error al crear el proyecto' };
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<{ success: boolean; message: string }> => {
    try {
      const jobData = {
        title: projectData.title,
        description: projectData.description,
        status: 'ACTIVE' as const, // Usar el valor correcto del backend
        budget: projectData.budget,
        skills: projectData.skills,
        requirements: projectData.requirements,
      };

      await jobsService.updateJob(id, jobData);
      
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));
      
      return { success: true, message: 'Proyecto actualizado exitosamente' };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, message: 'Error al actualizar el proyecto' };
    }
  };

  const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      await jobsService.deleteJob(id);
      
      setProjects(prev => prev.filter(project => project.id !== id));
      return { success: true, message: 'Proyecto eliminado exitosamente' };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, message: 'Error al eliminar el proyecto' };
    }
  };

  const applyToProject = async (applicationData: any): Promise<{ success: boolean; message: string }> => {
    try {
      const appData = {
        jobId: applicationData.job_id,
        professionalId: user?.id || '',
        professionalName: user?.name || '',
        professionalEmail: user?.email || '',
        coverLetter: applicationData.cover_letter,
        status: 'PENDING' as const,
      };

      const newApplication = await applicationsService.createApplication(appData);
      
      setApplications(prev => [newApplication, ...prev]);
      return { success: true, message: 'Aplicación enviada exitosamente' };
    } catch (error) {
      console.error('Error applying to project:', error);
      return { success: false, message: 'Error al enviar la aplicación' };
    }
  };

  const updateApplicationStatus = async (id: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      await applicationsService.updateApplication(id, { status: status as any });
      
      setApplications(prev => prev.map(application => 
        application.id === id ? { ...application, status } : application
      ));
      
      return { success: true, message: 'Estado de aplicación actualizado' };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, message: 'Error al actualizar el estado' };
    }
  };

  const getRecommendedFreelancers = async (projectId: string): Promise<FreelancerProfile[]> => {
    try {
      // Por ahora retornamos un array vacío ya que no tenemos recomendaciones implementadas
      return [];
    } catch (error) {
      console.error('Error getting recommended freelancers:', error);
      return [];
    }
  };

  const getApplicationsByProject = (projectId: string) => 
    applications.filter(a => a.jobId === projectId);

  const getApplicationsByProfessional = (professionalId: string) => 
    applications.filter(a => a.professionalId === professionalId);

  const getEvaluationsByFreelancer = (freelancerId: string) => 
    evaluations.filter(e => e.freelancer_id === freelancerId);

  const value: TalentContextType = {
    projects,
    applications,
    evaluations,
    loading,
    createProject,
    updateProject,
    deleteProject,
    applyToProject,
    updateApplicationStatus,
    getRecommendedFreelancers,
    getApplicationsByProject,
    getApplicationsByProfessional,
    getEvaluationsByFreelancer,
    loadProjects,
    loadApplications,
    loadEvaluations
  };

  return (
    <TalentContext.Provider value={value}>
      {children}
    </TalentContext.Provider>
  );
};

export const useTalent = () => {
  const context = useContext(TalentContext);
  if (context === undefined) {
    throw new Error('useTalent must be used within a TalentProvider');
  }
  return context;
}; 