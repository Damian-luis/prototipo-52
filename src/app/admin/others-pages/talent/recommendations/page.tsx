import React from "react";

const mockFreelancers = [
  { id: 1, nombre: "Laura Méndez", habilidades: "React, Next.js", experiencia: "5 años" },
  { id: 2, nombre: "Pedro Torres", habilidades: "Python, FastAPI", experiencia: "3 años" },
];

export default function TalentRecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Freelancers Recomendados</h1>
      <ul>
        {mockFreelancers.map(freelancer => (
          <li key={freelancer.id} className="mb-4 p-4 border rounded flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{freelancer.nombre}</div>
              <div className="text-sm text-gray-500">{freelancer.habilidades}</div>
            </div>
            <div className="mt-2 md:mt-0 text-blue-600 font-bold">{freelancer.experiencia}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 