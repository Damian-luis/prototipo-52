"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { jobsService, Job, CreateJobData, UpdateJobData } from '@/services/jobs.service';
import { applicationsService, Application, CreateApplicationData, ApplicationView } from '@/services/applications.service';

interface ProjectContextType {
  jobs: Job[];
  currentJob: Job | null;
  applications: Application[];
  savedJobs: Job[];
  loading: boolean;
  error: string | null;
  createJob: (jobData: CreateJobData) => Promise<{ success: boolean; message: string; jobId?: string }>;
  updateJob: (id: string, jobData: UpdateJobData) => Promise<{ success: boolean; message: string }>;
  deleteJob: (id: string) => Promise<{ success: boolean; message: string }>;
  getJobById: (id: string) => Promise<Job | null>;
  getAllJobs: (filters?: any) => Promise<Job[]>;
  searchJobs: (query: string, filters?: any) => Promise<Job[]>;
  getJobsByCompany: () => Promise<Job[]>;
  getJobStats: () => Promise<any>;
  getAvailableJobs: () => Promise<Job[]>;
  saveJob: (jobId: string) => Promise<{ success: boolean; message: string }>;
  unsaveJob: (jobId: string) => Promise<{ success: boolean; message: string }>;
  getSavedJobs: () => Promise<Job[]>;
  getApplicationsByJob: (jobId: string) => Promise<Application[]>;
  createApplication: (applicationData: CreateApplicationData) => Promise<{ success: boolean; message: string; applicationId?: string }>;
  getApplicationsByProfessional: () => Promise<Application[]>;
  getApplicationStats: () => Promise<any>;
  // Company methods
  getJobApplications: (jobId: string) => Promise<Application[]>;
  markApplicationAsViewed: (applicationId: string) => Promise<{ success: boolean; message: string }>;
  getApplicationViews: (applicationId: string) => Promise<ApplicationView[]>;
  updateApplicationStatus: (applicationId: string, status: string) => Promise<{ success: boolean; message: string }>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = useCallback(async (jobData: CreateJobData): Promise<{ success: boolean; message: string; jobId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const newJob = await jobsService.createJob(jobData);
      
      setJobs(prev => [newJob, ...prev]);
      
      return { success: true, message: 'Trabajo creado exitosamente', jobId: newJob.id };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear trabajo';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateJob = useCallback(async (id: string, jobData: UpdateJobData): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedJob = await jobsService.updateJob(id, jobData);
      
      // Actualizar estado local
      setJobs(prev => prev.map(job => 
        job.id === id ? updatedJob : job
      ));
      
      if (currentJob?.id === id) {
        setCurrentJob(updatedJob);
      }
      
      return { success: true, message: 'Trabajo actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar trabajo';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentJob?.id]);

  const deleteJob = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await jobsService.deleteJob(id);
      
      setJobs(prev => prev.filter(job => job.id !== id));
      
      if (currentJob?.id === id) {
        setCurrentJob(null);
      }
      
      return { success: true, message: 'Trabajo eliminado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar trabajo';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [currentJob?.id]);

  const getJobById = useCallback(async (id: string): Promise<Job | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const job = await jobsService.getJobById(id);
      setCurrentJob(job);
      return job;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener trabajo';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllJobs = useCallback(async (filters?: any): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const allJobs = await jobsService.getAllJobs(filters);
      setJobs(allJobs);
      return allJobs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener trabajos';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchJobs = useCallback(async (query: string, filters?: any): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await jobsService.searchJobs(query, filters);
      return searchResults;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al buscar trabajos';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobsByCompany = useCallback(async (): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const companyJobs = await jobsService.getJobsByCompany();
      setJobs(companyJobs);
      return companyJobs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener trabajos de la empresa';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await jobsService.getJobStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de trabajos';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAvailableJobs = useCallback(async (): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const availableJobs = await jobsService.getAvailableJobs();
      setJobs(availableJobs);
      return availableJobs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener trabajos disponibles';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveJob = useCallback(async (jobId: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jobsService.saveJob(jobId);
      setSavedJobs(prev => [...prev, response.data]);
      return { success: true, message: 'Trabajo guardado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar trabajo';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const unsaveJob = useCallback(async (jobId: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await jobsService.unsaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      return { success: true, message: 'Trabajo eliminado de favoritos' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar trabajo de favoritos';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getSavedJobs = useCallback(async (): Promise<Job[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const savedJobs = await jobsService.getSavedJobs();
      setSavedJobs(savedJobs);
      return savedJobs;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener trabajos guardados';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByJob = useCallback(async (jobId: string): Promise<Application[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const applications = await applicationsService.getMyApplications();
      const jobApplications = applications.filter(app => app.jobId === jobId);
      return jobApplications;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener aplicaciones del trabajo';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (applicationData: CreateApplicationData): Promise<{ success: boolean; message: string; applicationId?: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const newApplication = await applicationsService.createApplication(applicationData);
      
      setApplications(prev => [newApplication, ...prev]);
      
      return { success: true, message: 'Aplicación enviada exitosamente', applicationId: newApplication.id };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al enviar aplicación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationsByProfessional = useCallback(async (): Promise<Application[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const applications = await applicationsService.getMyApplications();
      setApplications(applications);
      return applications;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener aplicaciones del profesional';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await applicationsService.getApplicationStats();
      return stats;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener estadísticas de aplicaciones';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobApplications = useCallback(async (jobId: string): Promise<Application[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const jobApplications = await applicationsService.getJobApplications(jobId);
      return jobApplications;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener aplicaciones del trabajo';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const markApplicationAsViewed = useCallback(async (applicationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await applicationsService.markApplicationAsViewed(applicationId);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al marcar aplicación como vista';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getApplicationViews = useCallback(async (applicationId: string): Promise<ApplicationView[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const views = await applicationsService.getApplicationViews(applicationId);
      return views;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener vistas de la aplicación';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplicationStatus = useCallback(async (applicationId: string, status: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      await applicationsService.updateApplicationStatus(applicationId, status);
      return { success: true, message: 'Estado de la aplicación actualizado exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar estado de la aplicación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ProjectContextType = {
    jobs,
    currentJob,
    applications,
    savedJobs,
    loading,
    error,
    createJob,
    updateJob,
    deleteJob,
    getJobById,
    getAllJobs,
    searchJobs,
    getJobsByCompany,
    getJobStats,
    getAvailableJobs,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getApplicationsByJob,
    createApplication,
    getApplicationsByProfessional,
    getApplicationStats,
    getJobApplications,
    markApplicationAsViewed,
    getApplicationViews,
    updateApplicationStatus,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 