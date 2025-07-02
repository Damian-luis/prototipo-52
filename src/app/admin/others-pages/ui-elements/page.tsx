"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

const UIElementsPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">UI Elements</h1>
      <ComponentCard title="Componentes UI de ejemplo">
        <div className="text-gray-500 dark:text-gray-400">Aquí puedes mostrar ejemplos de botones, badges, inputs y otros componentes UI reutilizables.</div>
      </ComponentCard>
    </div>
  );
};

export default UIElementsPage; 