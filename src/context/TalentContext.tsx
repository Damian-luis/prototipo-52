"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface JobVacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  experienceRequired: number; // años
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  status: 'open' | 'closed' | 'draft';
  createdAt: string;
  createdBy: string;
  applicationsCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerEmail: string;
  coverLetter: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  appliedAt: string;
  evaluationScore?: number;
  notes?: string;
}

export interface Evaluation {
  id: string;
  freelancerId: string;
  evaluatorId: string;
  type: 'initial' | 'periodic' | 'project';
  date: string;
  scores: {
    technical: number;
    communication: number;
    punctuality: number;
    quality: number;
    teamwork: number;
  };
  overallScore: number;
  comments: string;
  recommendations?: string;
}

export interface FreelancerProfile {
  userId: string;
  name: string;
  email: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: string;
  portfolio?: string;
  evaluations: Evaluation[];
  completedProjects: number;
  successRate: number;
}

interface TalentContextType {
  vacancies: JobVacancy[];
  applications: Application[];
  evaluations: Evaluation[];
  createVacancy: (vacancy: Omit<JobVacancy, 'id' | 'createdAt' | 'applicationsCount'>) => Promise<{ success: boolean; message: string }>;
  updateVacancy: (id: string, vacancy: Partial<JobVacancy>) => Promise<{ success: boolean; message: string }>;
  deleteVacancy: (id: string) => Promise<{ success: boolean; message: string }>;
  applyToJob: (application: Omit<Application, 'id' | 'appliedAt' | 'status'>) => Promise<{ success: boolean; message: string }>;
  updateApplicationStatus: (id: string, status: Application['status']) => Promise<{ success: boolean; message: string }>;
  createEvaluation: (evaluation: Omit<Evaluation, 'id' | 'date' | 'overallScore'>) => Promise<{ success: boolean; message: string }>;
  getRecommendedFreelancers: (jobId: string) => FreelancerProfile[];
  getApplicationsByJob: (jobId: string) => Application[];
  getApplicationsByFreelancer: (freelancerId: string) => Application[];
  getEvaluationsByFreelancer: (freelancerId: string) => Evaluation[];
}

const TalentContext = createContext<TalentContextType | undefined>(undefined);

export const TalentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedVacancies = localStorage.getItem('vacancies');
    const storedApplications = localStorage.getItem('applications');
    const storedEvaluations = localStorage.getItem('evaluations');

    if (storedVacancies) {
      setVacancies(JSON.parse(storedVacancies));
    } else {
      // Crear vacantes de ejemplo
      const defaultVacancies: JobVacancy[] = [
        {
          id: '1',
          title: 'Desarrollador Full Stack React/Node',
          description: 'Buscamos desarrollador con experiencia en React y Node.js para proyecto a largo plazo.',
          requirements: ['3+ años de experiencia', 'Inglés intermedio', 'Disponibilidad inmediata'],
          skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
          experienceRequired: 3,
          salaryRange: { min: 3000, max: 5000, currency: 'USD' },
          location: 'Remoto',
          type: 'contract',
          status: 'open',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          applicationsCount: 0
        },
        {
          id: '2',
          title: 'Diseñador UX/UI Senior',
          description: 'Necesitamos diseñador con experiencia en productos SaaS y mobile.',
          requirements: ['5+ años de experiencia', 'Portfolio actualizado', 'Conocimiento en Figma'],
          skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
          experienceRequired: 5,
          salaryRange: { min: 2500, max: 4000, currency: 'USD' },
          location: 'Remoto',
          type: 'freelance',
          status: 'open',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          applicationsCount: 0
        }
      ];
      localStorage.setItem('vacancies', JSON.stringify(defaultVacancies));
      setVacancies(defaultVacancies);
    }

    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }

    if (storedEvaluations) {
      setEvaluations(JSON.parse(storedEvaluations));
    }
  }, []);

  const createVacancy = async (vacancy: Omit<JobVacancy, 'id' | 'createdAt' | 'applicationsCount'>): Promise<{ success: boolean; message: string }> => {
    const newVacancy: JobVacancy = {
      ...vacancy,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applicationsCount: 0
    };

    const updatedVacancies = [...vacancies, newVacancy];
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));

    return { success: true, message: 'Vacante creada exitosamente' };
  };

  const updateVacancy = async (id: string, vacancy: Partial<JobVacancy>): Promise<{ success: boolean; message: string }> => {
    const updatedVacancies = vacancies.map(v => v.id === id ? { ...v, ...vacancy } : v);
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));

    return { success: true, message: 'Vacante actualizada exitosamente' };
  };

  const deleteVacancy = async (id: string): Promise<{ success: boolean; message: string }> => {
    const updatedVacancies = vacancies.filter(v => v.id !== id);
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));

    return { success: true, message: 'Vacante eliminada exitosamente' };
  };

  const applyToJob = async (application: Omit<Application, 'id' | 'appliedAt' | 'status'>): Promise<{ success: boolean; message: string }> => {
    // Verificar si ya aplicó
    const existingApplication = applications.find(
      a => a.jobId === application.jobId && a.freelancerId === application.freelancerId
    );

    if (existingApplication) {
      return { success: false, message: 'Ya has aplicado a esta vacante' };
    }

    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));

    // Actualizar contador de aplicaciones en la vacante
    const updatedVacancies = vacancies.map(v => 
      v.id === application.jobId 
        ? { ...v, applicationsCount: v.applicationsCount + 1 }
        : v
    );
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));

    return { success: true, message: 'Aplicación enviada exitosamente' };
  };

  const updateApplicationStatus = async (id: string, status: Application['status']): Promise<{ success: boolean; message: string }> => {
    const updatedApplications = applications.map(a => 
      a.id === id ? { ...a, status } : a
    );
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));

    return { success: true, message: 'Estado de aplicación actualizado' };
  };

  const createEvaluation = async (evaluation: Omit<Evaluation, 'id' | 'date' | 'overallScore'>): Promise<{ success: boolean; message: string }> => {
    const scores = evaluation.scores;
    const overallScore = (scores.technical + scores.communication + scores.punctuality + scores.quality + scores.teamwork) / 5;

    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      overallScore
    };

    const updatedEvaluations = [...evaluations, newEvaluation];
    setEvaluations(updatedEvaluations);
    localStorage.setItem('evaluations', JSON.stringify(updatedEvaluations));

    return { success: true, message: 'Evaluación creada exitosamente' };
  };

  // Algoritmo de similitud de coseno para recomendaciones
  const calculateCosineSimilarity = (skills1: string[], skills2: string[]): number => {
    const allSkills = [...new Set([...skills1, ...skills2])];
    const vector1 = allSkills.map(skill => skills1.includes(skill) ? 1 : 0);
    const vector2 = allSkills.map(skill => skills2.includes(skill) ? 1 : 0);

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += vector1[i] * vector1[i];
      magnitude2 += vector2[i] * vector2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  };

  const getRecommendedFreelancers = (jobId: string): FreelancerProfile[] => {
    const job = vacancies.find(v => v.id === jobId);
    if (!job) return [];

    // Obtener usuarios freelancers del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const freelancers = users.filter((u: unknown) => u.role === 'freelancer');

    // Calcular similitud y ordenar
    const recommendations = freelancers.map((freelancer: unknown) => {
      const similarity = calculateCosineSimilarity(job.skills, freelancer.skills || []);
      const freelancerEvaluations = evaluations.filter(e => e.freelancerId === freelancer.id);
      const avgScore = freelancerEvaluations.length > 0
        ? freelancerEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / freelancerEvaluations.length
        : 0;

      return {
        userId: freelancer.id,
        name: freelancer.name,
        email: freelancer.email,
        skills: freelancer.skills || [],
        experience: freelancer.experience || 0,
        hourlyRate: freelancer.hourlyRate || 0,
        availability: freelancer.availability || 'unavailable',
        portfolio: freelancer.portfolio,
        evaluations: freelancerEvaluations,
        completedProjects: Math.floor(Math.random() * 20), // Simulado
        successRate: 85 + Math.floor(Math.random() * 15), // Simulado 85-100%
        similarity
      };
    });

    return recommendations
      .sort((a: unknown, b: unknown) => b.similarity - a.similarity)
      .slice(0, 5); // Top 5 recomendaciones
  };

  const getApplicationsByJob = (jobId: string) => 
    applications.filter(a => a.jobId === jobId);

  const getApplicationsByFreelancer = (freelancerId: string) => 
    applications.filter(a => a.freelancerId === freelancerId);

  const getEvaluationsByFreelancer = (freelancerId: string) => 
    evaluations.filter(e => e.freelancerId === freelancerId);

  return (
    <TalentContext.Provider value={{
      vacancies,
      applications,
      evaluations,
      createVacancy,
      updateVacancy,
      deleteVacancy,
      applyToJob,
      updateApplicationStatus,
      createEvaluation,
      getRecommendedFreelancers,
      getApplicationsByJob,
      getApplicationsByFreelancer,
      getEvaluationsByFreelancer
    }}>
      {children}
    </TalentContext.Provider>
  );
};

export const useTalent = () => {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error('useTalent debe ser usado dentro de TalentProvider');
  }
  return context;
}; 