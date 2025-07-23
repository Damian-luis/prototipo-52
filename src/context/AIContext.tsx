"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aiService, webhookService } from '@/services/supabase';
import { AIRecommendation, Interest, AIWebhookPayload } from '@/types';

interface AIContextType {
  recommendations: AIRecommendation[];
  interests: Interest[];
  loading: boolean;
  error: string | null;
  generateProfessionalRecommendations: (projectRequirements: any) => Promise<AIRecommendation[]>;
  analyzeProfessional: (professionalId: string, projectRequirements: any) => Promise<void>;
  createInterest: (interestData: Omit<Interest, 'id' | 'created_at'>) => Promise<{ success: boolean; message: string }>;
  getRecommendationsByUser: (userId: string) => Promise<AIRecommendation[]>;
  getInterestsByProfessional: (professionalId: string) => Promise<Interest[]>;
  sendToAIWebhook: (payload: AIWebhookPayload) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProfessionalRecommendations = async (projectRequirements: any): Promise<AIRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      // Enviar datos al webhook de IA para análisis
      const payload: AIWebhookPayload = {
        type: 'professional_matching',
        data: {
          projectRequirements,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      await webhookService.sendToWebhook('https://your-n8n-webhook-url.com', payload);

      // Simular recomendaciones basadas en el análisis
      const mockRecommendations: AIRecommendation[] = [
        {
          id: Date.now().toString(),
          type: 'professional',
          title: 'Profesional Recomendado #1',
          description: 'Perfil que coincide con los requerimientos del proyecto',
          confidence: 85,
          data: {
            professional_id: 'prof1',
            matched_skills: ['React', 'Node.js', 'TypeScript'],
            score: 85
          },
          created_at: new Date().toISOString(),
          user_id: 'current-user'
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'professional',
          title: 'Profesional Recomendado #2',
          description: 'Segunda opción con buena compatibilidad',
          confidence: 72,
          data: {
            professional_id: 'prof2',
            matched_skills: ['React', 'JavaScript'],
            score: 72
          },
          created_at: new Date().toISOString(),
          user_id: 'current-user'
        }
      ];

      // Guardar recomendaciones en Supabase
      for (const recommendation of mockRecommendations) {
        await aiService.createAIRecommendation(recommendation);
      }

      setRecommendations(prev => [...mockRecommendations, ...prev]);
      return mockRecommendations;
    } catch (error) {
      const message = 'Error al generar recomendaciones';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const analyzeProfessional = async (professionalId: string, projectRequirements: any): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Enviar análisis al webhook
      const payload: AIWebhookPayload = {
        type: 'professional_matching',
        data: {
          professionalId,
          projectRequirements,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      await webhookService.sendToWebhook('https://your-n8n-webhook-url.com', payload);

      // Crear interés basado en el análisis
      const interestData: Omit<Interest, 'id' | 'created_at'> = {
        professional_id: professionalId,
        project_id: projectRequirements.projectId,
        score: Math.floor(Math.random() * 40) + 60, // Score entre 60-100
        matched_skills: projectRequirements.skills || [],
        ai_recommendation: true
      };

      await aiService.createInterest(interestData);
    } catch (error) {
      const message = 'Error al analizar profesional';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createInterest = async (interestData: Omit<Interest, 'id' | 'created_at'>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      const interestId = await aiService.createInterest(interestData);

      // Actualizar estado local
      const newInterest: Interest = {
        id: interestId,
        ...interestData,
        created_at: new Date().toISOString()
      };

      setInterests(prev => [newInterest, ...prev]);

      return { success: true, message: 'Interés creado exitosamente' };
    } catch (error) {
      const message = 'Error al crear interés';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationsByUser = async (userId: string): Promise<AIRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);

      const userRecommendations = await aiService.getAIRecommendations(userId);
      setRecommendations(userRecommendations);

      return userRecommendations;
    } catch (error) {
      const message = 'Error al obtener recomendaciones';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getInterestsByProfessional = async (professionalId: string): Promise<Interest[]> => {
    try {
      setLoading(true);
      setError(null);

      const professionalInterests = await aiService.getInterestsByProfessional(professionalId);
      setInterests(professionalInterests);

      return professionalInterests;
    } catch (error) {
      const message = 'Error al obtener intereses';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const sendToAIWebhook = async (payload: AIWebhookPayload): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await webhookService.sendToWebhook('https://your-n8n-webhook-url.com', payload);
    } catch (error) {
      const message = 'Error al enviar datos al webhook de IA';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AIContextType = {
    recommendations,
    interests,
    loading,
    error,
    generateProfessionalRecommendations,
    analyzeProfessional,
    createInterest,
    getRecommendationsByUser,
    getInterestsByProfessional,
    sendToAIWebhook
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}; 