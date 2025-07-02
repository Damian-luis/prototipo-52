"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AIRecommendation {
  id: string;
  type: 'freelancer' | 'job' | 'skill' | 'career' | 'pricing';
  title: string;
  description: string;
  confidence: number; // 0-100
  data: any;
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

// Respuestas predefinidas para consultas de IA
const AI_RESPONSES: Record<string, any> = {
  marketing_sales: {
    default: 'Para mejorar tu estrategia de marketing como freelancer, considera: 1) Definir claramente tu propuesta de valor única, 2) Crear un portfolio online profesional, 3) Utilizar LinkedIn para networking, 4) Compartir contenido de valor en tu área de expertise, 5) Solicitar testimonios de clientes satisfechos.',
    pricing: 'Para establecer tus tarifas: 1) Investiga las tarifas del mercado en tu área, 2) Considera tu experiencia y especialización, 3) Calcula tus costos operativos, 4) Ofrece diferentes paquetes de servicios, 5) Ajusta gradualmente según la demanda.',
    clients: 'Para atraer más clientes: 1) Optimiza tu perfil en plataformas freelance, 2) Participa en comunidades de tu industria, 3) Ofrece una consulta inicial gratuita, 4) Crea casos de estudio de proyectos exitosos, 5) Pide referidos a clientes actuales.'
  },
  legal_fiscal: {
    default: 'Aspectos legales importantes: 1) Registra tu actividad como freelancer según las leyes locales, 2) Utiliza contratos claros para cada proyecto, 3) Mantén registros detallados de ingresos y gastos, 4) Separa las finanzas personales de las profesionales, 5) Consulta con un contador sobre deducciones fiscales.',
    taxes: 'Para la gestión fiscal: 1) Aparta un porcentaje de cada pago para impuestos (20-30%), 2) Mantén facturas y recibos organizados, 3) Considera contratar un contador especializado en freelancers, 4) Conoce las fechas límite de declaraciones, 5) Investiga beneficios fiscales para trabajadores independientes.',
    contracts: 'Elementos esenciales en contratos: 1) Alcance detallado del trabajo, 2) Plazos de entrega claros, 3) Condiciones de pago y penalizaciones, 4) Propiedad intelectual y confidencialidad, 5) Cláusulas de terminación y modificación.'
  },
  career: {
    default: 'Para desarrollar tu carrera freelance: 1) Especialízate en un nicho específico, 2) Invierte en formación continua, 3) Construye una marca personal sólida, 4) Diversifica tus fuentes de ingresos, 5) Establece metas a corto y largo plazo.',
    skills: 'Para mejorar tus habilidades: 1) Identifica las tendencias en tu industria, 2) Toma cursos online especializados, 3) Participa en proyectos que te desafíen, 4) Busca mentores en tu campo, 5) Practica y aplica lo aprendido en proyectos reales.',
    growth: 'Para crecer profesionalmente: 1) Aumenta gradualmente tus tarifas con la experiencia, 2) Busca proyectos más complejos, 3) Colabora con otros freelancers, 4) Considera crear productos digitales, 5) Construye relaciones a largo plazo con clientes.'
  },
  technical: {
    default: 'Para resolver problemas técnicos: 1) Documenta claramente el problema, 2) Busca en la documentación oficial, 3) Consulta en comunidades especializadas, 4) Considera contratar soporte especializado, 5) Mantén actualizadas tus herramientas de trabajo.'
  },
  business: {
    default: 'Para mejorar tu negocio freelance: 1) Define tu propuesta de valor única, 2) Establece procesos eficientes, 3) Automatiza tareas repetitivas, 4) Construye una red de colaboradores, 5) Reinvierte en tu desarrollo profesional.'
  }
};

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
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Buscar respuesta más relevante basada en palabras clave
    let answer = AI_RESPONSES[category]?.default || 'Lo siento, no tengo información específica sobre eso.';
    
    const lowerQuestion = question.toLowerCase();
    if (category === 'marketing_sales') {
      if (lowerQuestion.includes('precio') || lowerQuestion.includes('tarifa')) {
        answer = AI_RESPONSES.marketing_sales.pricing;
      } else if (lowerQuestion.includes('cliente')) {
        answer = AI_RESPONSES.marketing_sales.clients;
      }
    } else if (category === 'legal_fiscal') {
      if (lowerQuestion.includes('impuesto') || lowerQuestion.includes('fiscal')) {
        answer = AI_RESPONSES.legal_fiscal.taxes;
      } else if (lowerQuestion.includes('contrato')) {
        answer = AI_RESPONSES.legal_fiscal.contracts;
      }
    } else if (category === 'career') {
      if (lowerQuestion.includes('habilidad') || lowerQuestion.includes('aprender')) {
        answer = AI_RESPONSES.career.skills;
      } else if (lowerQuestion.includes('crecer') || lowerQuestion.includes('desarrollo')) {
        answer = AI_RESPONSES.career.growth;
      }
    } else if (category === 'technical') {
      if (lowerQuestion.includes('problema') || lowerQuestion.includes('resolver')) {
        answer = AI_RESPONSES.technical.default;
      }
    } else if (category === 'business') {
      if (lowerQuestion.includes('negocio') || lowerQuestion.includes('mejorar')) {
        answer = AI_RESPONSES.business.default;
      }
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