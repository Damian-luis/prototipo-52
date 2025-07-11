"use client";

import React, { useEffect, useState } from "react";

interface Freelancer {
  nombre_freelancer: string;
  habilidades_freelancer: string[];
  cargo_sugerido: string;
  score_ia: number;
  feedback_ia: string;
  cumplimiento_legal: string;
  marketing: string;
  estructura_fiscal: string;
  avatarUrl?: string;
}

export default function AIRecommendationsPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/ai-recommendations");
        const data = await res.json();
        if (data.analyzed_freelancers) {
          setFreelancers(data.analyzed_freelancers);
        } else {
          setError("No se encontraron recomendaciones.");
        }
      } catch (e) {
        setError("Error al obtener recomendaciones de IA.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Loader animado
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
      <div className="text-purple-700 font-medium">Buscando recomendaciones con IA...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-10 shadow">
      <h1 className="text-3xl font-bold mb-6">Recomendaciones Inteligentes</h1>
      {loading && <Loader />}
      {error && <div className="text-center py-12 text-lg text-red-600">{error}</div>}
      {!loading && !error && (
        <ul className="space-y-8">
          {freelancers.map((freelancer, idx) => (
            <li key={idx} className="p-6 border rounded-xl flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 shadow-sm">
              {/* Columna izquierda */}
              <div className="flex flex-col items-center md:items-start md:w-2/5 gap-4">
                {freelancer.avatarUrl ? (
                  <img src={freelancer.avatarUrl} alt={freelancer.nombre_freelancer} className="w-20 h-20 rounded-full object-cover border-2 border-purple-300" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 border-2 border-gray-200">
                    {freelancer.nombre_freelancer.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-2xl mb-1">{freelancer.nombre_freelancer}</div>
                  <div className="text-base text-gray-500 mb-1">{freelancer.habilidades_freelancer.join(", ")}</div>
                  <div className="text-sm text-blue-700 font-semibold mb-1">Cargo sugerido: {freelancer.cargo_sugerido}</div>
                </div>
              </div>
              {/* Columna derecha */}
              <div className="flex-1 flex flex-col gap-2 justify-between">
                <div className="flex justify-end">
                  <span className="text-blue-700 font-bold text-xl">Score IA: {freelancer.score_ia}</span>
                </div>
                <div className="text-base text-gray-700 italic mb-2">Feedback IA: {freelancer.feedback_ia}</div>
                <ul className="list-disc ml-6 text-base text-gray-700 space-y-1">
                  <li><b>Cumplimiento legal:</b> {freelancer.cumplimiento_legal}</li>
                  <li><b>Marketing:</b> {freelancer.marketing}</li>
                  <li><b>Estructura fiscal:</b> {freelancer.estructura_fiscal}</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 