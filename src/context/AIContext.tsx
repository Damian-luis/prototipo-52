"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AIRecommendation {
  id: string;
  type: 'freelancer' | 'job' | 'skill' | 'career' | 'pricing';
  title: string;
  description: string;
  confidence: number; // 0-100
  data: unknown;
  createdAt: string;
  userId: string;
}

export interface AIConsultation {
  id: string;
  userId: string;
  category: 'marketing_sales' | 'legal_fiscal' | 'career' | 'technical' | 'business';
  question: string;
  answer: string;
  helpful: boolean | null;
  createdAt: string;
}

export interface MotivationalMessage {
  id: string;
  message: string;
  author?: string;
  category: 'productivity' | 'success' | 'teamwork' | 'innovation' | 'perseverance';
}

interface AIContextType {
  recommendations: AIRecommendation[];
  consultations: AIConsultation[];
  generateFreelancerRecommendations: (jobRequirements: any) => Promise<AIRecommendation[]>;
  generateCareerAdvice: (userId: string, skills: string[], experience: number) => Promise<AIRecommendation>;
  generatePricingRecommendation: (skills: string[], experience: number, market: string) => Promise<AIRecommendation>;
  askAI: (userId: string, category: AIConsultation['category'], question: string) => Promise<AIConsultation>;
  rateConsultation: (consultationId: string, helpful: boolean) => Promise<{ success: boolean; message: string }>;
  getMotivationalMessage: () => MotivationalMessage;
  getRecommendationsByUser: (userId: string) => AIRecommendation[];
  getConsultationsByUser: (userId: string) => AIConsultation[];
}

const AIContext = createContext<AIContextType | undefined>(undefined);

// Base de mensajes motivacionales
const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  {
    id: '1',
    message: 'El éxito no es el final, el fracaso no es fatal: es el coraje de continuar lo que cuenta.',
    author: 'Winston Churchill',
    category: 'perseverance'
  },
  {
    id: '2',
    message: 'La innovación distingue a los líderes de los seguidores.',
    author: 'Steve Jobs',
    category: 'innovation'
  },
  {
    id: '3',
    message: 'El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos.',
    author: 'Michael Jordan',
    category: 'teamwork'
  },
  {
    id: '4',
    message: 'No mires el reloj; haz lo que él hace. Sigue adelante.',
    author: 'Sam Levenson',
    category: 'productivity'
  },
  {
    id: '5',
    message: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    author: 'Robert Collier',
    category: 'success'
  }
];

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [consultations, setConsultations] = useState<AIConsultation[]>([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedRecommendations = localStorage.getItem('aiRecommendations');
    const storedConsultations = localStorage.getItem('aiConsultations');
    
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }

    if (storedConsultations) {
      setConsultations(JSON.parse(storedConsultations));
    }
  }, []);

  const generateFreelancerRecommendations = async (jobRequirements: any): Promise<AIRecommendation[]> => {
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const freelancers = users.filter((u: any) => u.role === 'freelancer');

    // Simular puntuación y recomendaciones
    const recommendations = freelancers.map((freelancer: any) => {
      const skillMatch = jobRequirements.skills.filter((skill: string) => 
        freelancer.skills?.includes(skill)
      ).length;
      
      const confidence = Math.min(95, (skillMatch / jobRequirements.skills.length) * 100 + Math.random() * 20);

      return {
        id: Date.now().toString() + Math.random(),
        type: 'freelancer' as const,
        title: `Recomendación: ${freelancer.name}`,
        description: `${freelancer.name} tiene ${skillMatch} de ${jobRequirements.skills.length} habilidades requeridas. ${freelancer.bio || ''}`,
        confidence,
        data: freelancer,
        createdAt: new Date().toISOString(),
        userId: jobRequirements.userId || '1'
      };
    }).sort((a: any, b: any) => b.confidence - a.confidence).slice(0, 3);

    const updatedRecommendations = [...recommendations, ...recommendations];
    setRecommendations(updatedRecommendations);
    localStorage.setItem('aiRecommendations', JSON.stringify(updatedRecommendations));

    return recommendations;
  };

  const generateCareerAdvice = async (userId: string, skills: string[], experience: number): Promise<AIRecommendation> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const advice = {
      id: Date.now().toString(),
      type: 'career' as const,
      title: 'Recomendación de Desarrollo Profesional',
      description: experience < 2 
        ? 'Como profesional junior, enfócate en: 1) Construir un portfolio sólido con proyectos variados, 2) Obtener certificaciones en tus tecnologías principales, 3) Contribuir a proyectos open source, 4) Buscar mentorías y feedback constante.'
        : experience < 5
        ? 'Como profesional intermedio, considera: 1) Especializarte en un nicho específico, 2) Aumentar tus tarifas gradualmente, 3) Construir relaciones a largo plazo con clientes, 4) Compartir tu conocimiento mediante blogs o charlas.'
        : 'Como profesional senior, te recomendamos: 1) Posicionarte como consultor experto, 2) Crear productos digitales o cursos, 3) Construir un equipo o agencia, 4) Enfocarte en proyectos de alto valor.',
      confidence: 85 + Math.random() * 10,
      data: { skills, experience },
      createdAt: new Date().toISOString(),
      userId
    };

    const updatedRecommendations = [...recommendations, advice];
    setRecommendations(updatedRecommendations);
    localStorage.setItem('aiRecommendations', JSON.stringify(updatedRecommendations));

    return advice;
  };

  const generatePricingRecommendation = async (skills: string[], experience: number, market: string): Promise<AIRecommendation> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const baseRate = experience < 2 ? 25 : experience < 5 ? 50 : 80;
    const marketMultiplier = market === 'US' ? 1.5 : market === 'EU' ? 1.3 : 1;
    const skillBonus = skills.includes('React') || skills.includes('Node.js') ? 1.2 : 1;
    
    const recommendedRate = Math.round(baseRate * marketMultiplier * skillBonus);

    const recommendation = {
      id: Date.now().toString(),
      type: 'pricing' as const,
      title: 'Recomendación de Tarifas',
      description: `Basado en tu experiencia de ${experience} años y habilidades en ${skills.join(', ')}, recomendamos una tarifa de $${recommendedRate}-$${recommendedRate + 20} USD/hora para el mercado ${market}. Considera ajustar según la complejidad del proyecto.`,
      confidence: 75 + Math.random() * 15,
      data: { recommendedRate, skills, experience, market },
      createdAt: new Date().toISOString(),
      userId: '1'
    };

    const updatedRecommendations = [...recommendations, recommendation];
    setRecommendations(updatedRecommendations);
    localStorage.setItem('aiRecommendations', JSON.stringify(updatedRecommendations));

    return recommendation;
  };

  const askAI = async (userId: string, category: AIConsultation['category'], question: string): Promise<AIConsultation> => {
    // Intentar obtener respuesta markdown de n8n
    let answer = '';
    try {
      const res = await fetch('https://automation-biya.useteam.io/webhook/251e2883-46b7-4d3a-9fdf-97781cf6a116', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, topic: category })
      });
      const data = await res.json();
      // Si la respuesta viene en data.answer, úsala (puede venir con triple backtick, quitar si es necesario)
      if (data.answer) {
        answer = data.answer.replace(/^```markdown\n?|```$/g, '').trim();
      }
    } catch (e) {
      // Si falla el fetch, usar respuesta simulada
      answer = '';
    }
    // Si no hay respuesta de n8n, usar fallback genérico
    if (!answer) {
      answer = 'Lo siento, no tengo información específica sobre eso.';
    }

    const consultation: AIConsultation = {
      id: Date.now().toString(),
      userId,
      category,
      question,
      answer,
      helpful: null,
      createdAt: new Date().toISOString()
    };

    const updatedConsultations = [...consultations, consultation];
    setConsultations(updatedConsultations);
    localStorage.setItem('aiConsultations', JSON.stringify(updatedConsultations));

    return consultation;
  };

  const rateConsultation = async (consultationId: string, helpful: boolean): Promise<{ success: boolean; message: string }> => {
    const updatedConsultations = consultations.map(c => 
      c.id === consultationId ? { ...c, helpful } : c
    );
    setConsultations(updatedConsultations);
    localStorage.setItem('aiConsultations', JSON.stringify(updatedConsultations));

    return { success: true, message: 'Gracias por tu retroalimentación' };
  };

  const getMotivationalMessage = (): MotivationalMessage => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    return MOTIVATIONAL_MESSAGES[randomIndex];
  };

  const getRecommendationsByUser = (userId: string) => 
    recommendations.filter(r => r.userId === userId);

  const getConsultationsByUser = (userId: string) => 
    consultations.filter(c => c.userId === userId);

  return (
    <AIContext.Provider value={{
      recommendations,
      consultations,
      generateFreelancerRecommendations,
      generateCareerAdvice,
      generatePricingRecommendation,
      askAI,
      rateConsultation,
      getMotivationalMessage,
      getRecommendationsByUser,
      getConsultationsByUser
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI debe ser usado dentro de AIProvider');
  }
  return context;
}; 