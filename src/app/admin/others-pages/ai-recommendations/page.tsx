import React from "react";

const mockFreelancers = [
  { id: 1, nombre: "Juan Pérez", habilidades: "React, Node.js", score: 98 },
  { id: 2, nombre: "Ana López", habilidades: "Python, Machine Learning", score: 95 },
  { id: 3, nombre: "Carlos Ruiz", habilidades: "UI/UX, Figma", score: 92 },
];

export default function AIRecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Recomendaciones Inteligentes</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">Freelancers sugeridos por IA para la oferta &quot;Landing corporativa&quot;</p>
      <ul>
        {mockFreelancers.map(freelancer => (
          <li key={freelancer.id} className="mb-4 p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{freelancer.nombre}</div>
              <div className="text-sm text-gray-500">{freelancer.habilidades}</div>
            </div>
            <div className="mt-2 md:mt-0 text-blue-600 font-bold">Score IA: {freelancer.score}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 