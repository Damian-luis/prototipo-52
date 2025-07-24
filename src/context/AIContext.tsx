"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AIRecommendation } from '@/types';

interface AIContextType {
  recommendations: AIRecommendation[];
  loading: boolean;
  error: string | null;
  getRecommendations: (userId: string, type?: string) => Promise<AIRecommendation[]>;
  generateRecommendation: (data: any) => Promise<{ success: boolean; message: string; recommendation?: AIRecommendation }>;
  updateRecommendation: (id: string, data: Partial<AIRecommendation>) => Promise<{ success: boolean; message: string }>;
  deleteRecommendation: (id: string) => Promise<{ success: boolean; message: string }>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(async (userId: string, type?: string): Promise<AIRecommendation[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Por ahora, simulamos las recomendaciones ya que no hay un servicio específico de IA
      // En el futuro, esto se conectaría con el servicio de IA del backend
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'professional',
          title: 'Profesional recomendado para tu proyecto',
          description: 'Basado en las habilidades requeridas, te recomendamos este profesional con experiencia similar.',
          confidence: 85,
          data: { professionalId: 'prof-1', skills: ['React', 'Node.js'] },
          created_at: new Date().toISOString(),
          user_id: userId
        },
        {
          id: '2',
          type: 'project',
          title: 'Proyecto que coincide con tu perfil',
          description: 'Este proyecto se alinea perfectamente con tus habilidades y experiencia.',
          confidence: 92,
          data: { projectId: 'proj-1', matchedSkills: ['TypeScript', 'Next.js'] },
          created_at: new Date().toISOString(),
          user_id: userId
        }
      ];
      
      const filteredRecommendations = type 
        ? mockRecommendations.filter(rec => rec.type === type)
        : mockRecommendations;
      
      setRecommendations(filteredRecommendations);
      return filteredRecommendations;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al obtener recomendaciones';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const generateRecommendation = useCallback(async (data: any): Promise<{ success: boolean; message: string; recommendation?: AIRecommendation }> => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular generación de recomendación
      const newRecommendation: AIRecommendation = {
        id: Date.now().toString(),
        type: data.type || 'professional',
        title: data.title || 'Nueva recomendación',
        description: data.description || 'Recomendación generada por IA',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100
        data: data.data || {},
        created_at: new Date().toISOString(),
        user_id: data.userId
      };
      
      setRecommendations(prev => [newRecommendation, ...prev]);
      
      return { 
        success: true, 
        message: 'Recomendación generada exitosamente',
        recommendation: newRecommendation
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al generar recomendación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecommendation = useCallback(async (id: string, data: Partial<AIRecommendation>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      // Actualizar estado local
      setRecommendations(prev => prev.map(rec => 
        rec.id === id ? { ...rec, ...data } : rec
      ));
      
      return { success: true, message: 'Recomendación actualizada exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar recomendación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecommendation = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);
      
      // Eliminar del estado local
      setRecommendations(prev => prev.filter(rec => rec.id !== id));
      
      return { success: true, message: 'Recomendación eliminada exitosamente' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al eliminar recomendación';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AIContextType = {
    recommendations,
    loading,
    error,
    getRecommendations,
    generateRecommendation,
    updateRecommendation,
    deleteRecommendation,
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