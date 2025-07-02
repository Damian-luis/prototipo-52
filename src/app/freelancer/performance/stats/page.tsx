"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

const mockStats = [
  { label: "Proyectos Completados", value: 12 },
  { label: "Calificación Promedio", value: "4.7/5" },
  { label: "Clientes Satisfechos", value: 10 },
  { label: "Años de Experiencia", value: 3 },
];

const PerformanceStatsPage = () => {
  const stats = mockStats;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mis Estadísticas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <ComponentCard key={idx} title={stat.label}>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stat.value}</div>
          </ComponentCard>
        ))}
      </div>
    </div>
  );
};

export default PerformanceStatsPage; 