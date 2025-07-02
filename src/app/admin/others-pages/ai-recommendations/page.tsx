import React from "react";

const mockFreelancers = [
  {
    id: 1,
    nombre: "Juan Pérez",
    habilidades: "React, Node.js",
    score: 98,
    foto: "/images/user/user-02.jpg",
    cargoSugerido: "Desarrollador Frontend Senior",
    feedbackIA: "Excelente para proyectos SPA y migraciones a React. Alto compromiso y entregas a tiempo.",
    sugerencias: [
      "Cumplimiento legal: Verificar residencia fiscal para contratos internacionales.",
      "Marketing: Potenciar portafolio con casos de éxito en React.",
      "Estructura fiscal: Recomendada facturación como autónomo."],
  },
  {
    id: 2,
    nombre: "Ana López",
    habilidades: "Python, Machine Learning",
    score: 95,
    foto: "/images/user/user-03.jpg",
    cargoSugerido: "Data Scientist Freelance",
    feedbackIA: "Especialista en modelos predictivos. Ideal para análisis de datos y automatización.",
    sugerencias: [
      "Cumplimiento legal: NDA recomendado para proyectos con datos sensibles.",
      "Marketing: Publicar artículos técnicos en LinkedIn.",
      "Estructura fiscal: Puede facturar como persona física o empresa."],
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    habilidades: "UI/UX, Figma",
    score: 92,
    foto: "/images/user/user-04.jpg",
    cargoSugerido: "Diseñador UI/UX Senior",
    feedbackIA: "Gran experiencia en diseño de interfaces intuitivas. Buen manejo de herramientas colaborativas.",
    sugerencias: [
      "Cumplimiento legal: Incluir cláusula de propiedad intelectual en el contrato.",
      "Marketing: Mostrar prototipos interactivos en el portafolio.",
      "Estructura fiscal: Facturación internacional habilitada."],
  },
];

export default function AIRecommendationsPage() {
  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-10 shadow">
      <h1 className="text-3xl font-bold mb-6">Recomendaciones Inteligentes</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300 text-lg">Freelancers sugeridos por IA para la oferta &quot;Landing corporativa&quot;</p>
      <ul className="space-y-8">
        {mockFreelancers.map(freelancer => (
          <li key={freelancer.id} className="p-6 border rounded-xl flex flex-col md:flex-row gap-8 bg-white dark:bg-gray-900 shadow-sm">
            {/* Columna izquierda */}
            <div className="flex flex-col items-center md:items-start md:w-2/5 gap-4">
              <img src={freelancer.foto} alt={freelancer.nombre} className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
              <div>
                <div className="font-semibold text-2xl mb-1">{freelancer.nombre}</div>
                <div className="text-base text-gray-500 mb-1">{freelancer.habilidades}</div>
                <div className="text-sm text-blue-700 font-semibold mb-1">Cargo sugerido: {freelancer.cargoSugerido}</div>
              </div>
            </div>
            {/* Columna derecha */}
            <div className="flex-1 flex flex-col gap-2 justify-between">
              <div className="flex justify-end">
                <span className="text-blue-700 font-bold text-xl">Score IA: {freelancer.score}</span>
              </div>
              <div className="text-base text-gray-700 italic mb-2">Feedback IA: {freelancer.feedbackIA}</div>
              <ul className="list-disc ml-6 text-base text-gray-700 space-y-1">
                {freelancer.sugerencias.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 