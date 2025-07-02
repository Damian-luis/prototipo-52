"use client";
import React, { useState, useEffect } from "react";
import { useAI } from "@/context/AIContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

const AIAssistantPage = () => {
  const { 
    askAI, 
    getConsultationsByUser, 
    rateConsultation,
    generateCareerAdvice,
    generatePricingRecommendation,
    getRecommendationsByUser
  } = useAI();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<any>("career");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setConsultations(getConsultationsByUser(user.id));
      setRecommendations(getRecommendationsByUser(user.id));
    }
  }, [user, getConsultationsByUser, getRecommendationsByUser]);

  const categories = [
    { id: "career", name: "Desarrollo Profesional", icon: "🚀", description: "Consejos para crecer en tu carrera" },
    { id: "marketing_sales", name: "Marketing y Ventas", icon: "📈", description: "Estrategias para conseguir más clientes" },
    { id: "legal_fiscal", name: "Legal y Fiscal", icon: "⚖️", description: "Aspectos legales y tributarios" },
    { id: "technical", name: "Técnico", icon: "💻", description: "Soluciones a problemas técnicos" },
    { id: "business", name: "Negocio", icon: "💼", description: "Gestión y estrategia empresarial" }
  ];

  const quickActions = [
    { 
      id: "career-advice", 
      label: "Obtener consejos de carrera", 
      action: async () => {
        if (!user) return;
        setLoading(true);
        try {
          await generateCareerAdvice(user.id, user.skills || [], 3);
          setRecommendations(getRecommendationsByUser(user.id));
        } catch (error) {
          alert("Error al generar consejos");
        } finally {
          setLoading(false);
        }
      }
    },
    { 
      id: "pricing", 
      label: "Calcular tarifas recomendadas", 
      action: async () => {
        if (!user) return;
        setLoading(true);
        try {
          await generatePricingRecommendation(user.skills || [], 3, "US");
          setRecommendations(getRecommendationsByUser(user.id));
        } catch (error) {
          alert("Error al calcular tarifas");
        } finally {
          setLoading(false);
        }
      }
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question.trim()) return;

    setLoading(true);
    try {
      await askAI(user.id, selectedCategory, question);
      setConsultations(getConsultationsByUser(user.id));
      setQuestion("");
    } catch (error) {
      alert("Error al procesar tu consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (consultationId: string, helpful: boolean) => {
    try {
      await rateConsultation(consultationId, helpful);
      setConsultations(getConsultationsByUser(user?.id || ""));
    } catch (error) {
      alert("Error al enviar tu calificación");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Asistente IA
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Tu consejero inteligente para crecer como freelancer
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de categorías */}
        <div className="lg:col-span-1">
          <ComponentCard title="Categorías de Consulta">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-300 dark:border-brand-700'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ComponentCard>

          {/* Acciones rápidas */}
          <ComponentCard title="Acciones Rápidas" className="mt-6">
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  disabled={loading}
                  className="w-full p-3 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Panel principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formulario de consulta */}
          <ComponentCard title="Haz tu consulta">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Tu pregunta</Label>
                <TextArea
                  placeholder="Escribe tu pregunta aquí..."
                  rows={4}
                  onChange={(value) => setQuestion(value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : "Enviar consulta"}
                </button>
              </div>
            </form>
          </ComponentCard>

          {/* Recomendaciones recientes */}
          {recommendations.length > 0 && (
            <ComponentCard title="Recomendaciones Personalizadas">
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="p-4 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                      <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                        {rec.confidence}% confianza
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {rec.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}

          {/* Historial de consultas */}
          {consultations.length > 0 && (
            <ComponentCard title="Historial de Consultas">
              <div className="space-y-4">
                {consultations.slice(0, 5).map((consultation) => (
                  <div key={consultation.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="mb-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {consultation.question}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {categories.find(c => c.id === consultation.category)?.name} • 
                        {new Date(consultation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {consultation.answer}
                      </p>
                    </div>
                    {consultation.helpful === null && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-500">¿Te fue útil?</span>
                        <button
                          onClick={() => handleRating(consultation.id, true)}
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded hover:bg-green-200"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => handleRating(consultation.id, false)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded hover:bg-red-200"
                        >
                          No
                        </button>
                      </div>
                    )}
                    {consultation.helpful !== null && (
                      <p className="mt-3 text-sm text-gray-500">
                        Gracias por tu retroalimentación
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage; 