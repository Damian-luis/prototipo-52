"use client";
import React from "react";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Perfil de Administrador</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Perfil de Administrador
          </h2>
          <p className="text-gray-600 mb-8">
            Aquí podrás gestionar tu información personal, cambiar contraseña y configurar preferencias.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800">
              <strong>Funcionalidad en desarrollo:</strong> Esta sección estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 