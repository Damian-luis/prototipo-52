"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { talentService } from '@/services/supabase';
import { useAuth } from './AuthContext';

export interface JobVacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience_required: number; // años
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  status: 'open' | 'closed' | 'draft';
  created_at: string;
  created_by: string;
  applications_count: number;
}

export interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_email: string;
  cover_letter: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  applied_at: string;
  evaluation_score?: number;
  notes?: string;
}

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  skills?: string[];
  experience?: number;
  hourly_rate?: number;
  availability?: string;
  portfolio?: string;
}

interface TalentContextType {
  vacancies: JobVacancy[];
  applications: Application[];
  evaluations: Evaluation[];
  loading: boolean;
  createVacancy: (vacancy: Omit<JobVacancy, 'id' | 'created_at' | 'applications_count'>) => Promise<{ success: boolean; message: string }>;
  updateVacancy: (id: string, vacancy: Partial<JobVacancy>) => Promise<{ success: boolean; message: string }>;
  deleteVacancy: (id: string) => Promise<{ success: boolean; message: string }>;
  applyToJob: (application: Omit<Application, 'id' | 'applied_at' | 'status'>) => Promise<{ success: boolean; message: string }>;
  updateApplicationStatus: (id: string, status: Application['status']) => Promise<{ success: boolean; message: string }>;
  createEvaluation: (evaluation: Omit<Evaluation, 'id' | 'date' | 'overall_score'>) => Promise<{ success: boolean; message: string }>;
  getRecommendedFreelancers: (jobId: string) => Promise<FreelancerProfile[]>;
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByFreelancer: (freelancerId: string) => Application[];
  getEvaluationsByFreelancer: (freelancerId: string) => Evaluation[];
  loadVacancies: () => Promise<void>;
  loadApplications: () => Promise<void>;
  loadEvaluations: () => Promise<void>;
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

export const TalentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar vacantes al iniciar
  const loadVacancies = async () => {
    try {
      setLoading(true);
      const result = await talentService.getAllVacancies();
      
      if (result.success && result.data) {
        setVacancies(result.data);
      } else {
        console.warn('No se pudieron cargar las vacantes:', result.error);
        setVacancies([]);
      }
    } catch (error) {
      console.error('Error loading vacancies:', error);
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar aplicaciones al iniciar
  const loadApplications = async () => {
    try {
      setLoading(true);
      let result;
      
      if (user?.role === 'empresa') {
        // Para empresas, cargar aplicaciones de sus vacantes
        const companyVacancies = await talentService.getVacanciesByCompany(user.id);
        if (companyVacancies.success && companyVacancies.data) {
          const allApplications = [];
          for (const vacancy of companyVacancies.data) {
            const applicationsResult = await talentService.getApplicationsByJob(vacancy.id);
            if (applicationsResult.success && applicationsResult.data) {
              allApplications.push(...applicationsResult.data);
            }
          }
          setApplications(allApplications);
        } else {
          setApplications([]);
        }
      } else {
        // Para freelancers, cargar sus aplicaciones
        result = await talentService.getApplicationsByFreelancer(user?.id || '');
        if (result.success && result.data) {
          setApplications(result.data);
        } else {
          console.warn('No se pudieron cargar las aplicaciones:', result.error);
          setApplications([]);
        }
      }
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
      const result = await talentService.getEvaluationsByFreelancer(user?.id || '');
      
      if (result.success && result.data) {
        setEvaluations(result.data);
      } else {
        console.warn('No se pudieron cargar las evaluaciones:', result.error);
        setEvaluations([]);
      }
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
      loadVacancies();
      loadApplications();
      loadEvaluations();
    } else {
      // Limpiar datos cuando no hay usuario
      setVacancies([]);
      setApplications([]);
      setEvaluations([]);
    }
  }, [user?.id]);

  const createVacancy = async (vacancyData: Omit<JobVacancy, 'id' | 'created_at' | 'applications_count'>): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await talentService.createVacancy({
        ...vacancyData,
        created_by: user?.id || ''
      });
      
      if (result.success && result.data) {
        setVacancies(prev => [result.data, ...prev]);
        return { success: true, message: 'Vacante creada exitosamente' };
      } else {
        return { success: false, message: 'Error al crear la vacante' };
      }
    } catch (error) {
      console.error('Error creating vacancy:', error);
      return { success: false, message: 'Error al crear la vacante' };
    }
  };

  const updateVacancy = async (id: string, vacancyData: Partial<JobVacancy>): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await talentService.updateVacancy(id, vacancyData);
      
      if (result.success && result.data) {
        setVacancies(prev => prev.map(vacancy => 
          vacancy.id === id ? { ...vacancy, ...result.data } : vacancy
        ));
        return { success: true, message: 'Vacante actualizada exitosamente' };
      } else {
        return { success: false, message: 'Error al actualizar la vacante' };
      }
    } catch (error) {
      console.error('Error updating vacancy:', error);
      return { success: false, message: 'Error al actualizar la vacante' };
    }
  };

  const deleteVacancy = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await talentService.deleteVacancy(id);
      
      if (result.success) {
        setVacancies(prev => prev.filter(vacancy => vacancy.id !== id));
        return { success: true, message: 'Vacante eliminada exitosamente' };
      } else {
        return { success: false, message: 'Error al eliminar la vacante' };
      }
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      return { success: false, message: 'Error al eliminar la vacante' };
    }
  };

  const applyToJob = async (applicationData: Omit<Application, 'id' | 'applied_at' | 'status'>): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await talentService.applyToJob({
        ...applicationData,
        freelancer_id: user?.id || '',
        freelancer_name: user?.name || '',
        freelancer_email: user?.email || ''
      });
      
      if (result.success && result.data) {
        setApplications(prev => [result.data, ...prev]);
        return { success: true, message: 'Aplicación enviada exitosamente' };
      } else {
        return { success: false, message: 'Error al enviar la aplicación' };
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      return { success: false, message: 'Error al enviar la aplicación' };
    }
  };

  const updateApplicationStatus = async (id: string, status: Application['status']): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await talentService.updateApplicationStatus(id, status);
      
      if (result.success && result.data) {
        setApplications(prev => prev.map(application => 
          application.id === id ? { ...application, status } : application
        ));
        return { success: true, message: 'Estado de aplicación actualizado' };
      } else {
        return { success: false, message: 'Error al actualizar el estado' };
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, message: 'Error al actualizar el estado' };
    }
  };

  const createEvaluation = async (evaluationData: Omit<Evaluation, 'id' | 'date' | 'overall_score'>): Promise<{ success: boolean; message: string }> => {
    try {
      // Calcular puntuación general
      const scores = evaluationData.scores;
      const overallScore = Math.round(
        (scores.technical + scores.communication + scores.punctuality + scores.quality + scores.teamwork) / 5
      );

      const result = await talentService.createEvaluation({
        ...evaluationData,
        evaluator_id: user?.id || '',
        overall_score: overallScore
      });
      
      if (result.success && result.data) {
        setEvaluations(prev => [result.data, ...prev]);
        return { success: true, message: 'Evaluación creada exitosamente' };
      } else {
        return { success: false, message: 'Error al crear la evaluación' };
      }
    } catch (error) {
      console.error('Error creating evaluation:', error);
      return { success: false, message: 'Error al crear la evaluación' };
    }
  };

  const getRecommendedFreelancers = async (jobId: string): Promise<FreelancerProfile[]> => {
    try {
      const result = await talentService.getRecommendedFreelancers(jobId);
      if (result.success && result.data) {
        return result.data.map(user => ({
          user_id: user.id,
          name: user.name,
          email: user.email,
          skills: user.skills || [],
          experience: user.experience || 0,
          hourly_rate: user.hourly_rate || 0,
          availability: user.availability || '',
          portfolio: user.portfolio,
          evaluations: [],
          completed_projects: 0,
          success_rate: 0
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting recommended freelancers:', error);
      return [];
    }
  };

  const getApplicationsByJob = (jobId: string) => 
    applications.filter(a => a.job_id === jobId);

  const getApplicationsByFreelancer = (freelancerId: string) => 
    applications.filter(a => a.freelancer_id === freelancerId);

  const getEvaluationsByFreelancer = (freelancerId: string) => 
    evaluations.filter(e => e.freelancer_id === freelancerId);

  const value: TalentContextType = {
    vacancies,
    applications,
    evaluations,
    loading,
    createVacancy,
    updateVacancy,
    deleteVacancy,
    applyToJob,
    updateApplicationStatus,
    createEvaluation,
    getRecommendedFreelancers,
    getApplicationsByJob,
    getApplicationsByFreelancer,
    getEvaluationsByFreelancer,
    loadVacancies,
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