"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

const ChartsPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Charts</h1>
      <ComponentCard title="Gráficos de ejemplo">
        <div className="text-gray-500 dark:text-gray-400">Aquí puedes mostrar gráficos de ejemplo o KPIs relevantes para admin.</div>
      </ComponentCard>
    </div>
  );
};

export default ChartsPage; 