"use client";
import React from "react";

export default function ExportReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Exportar Reportes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Exporta reportes y datos en diferentes formatos
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Exportación de Reportes
          </h2>
          <p className="text-gray-600 mb-8">
            Aquí podrás exportar reportes en diferentes formatos como PDF, Excel, CSV, etc.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-orange-800">
              <strong>Funcionalidad en desarrollo:</strong> Esta sección estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 