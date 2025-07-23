"use client";
import React from "react";
import Card from "@/components/ui/card/Card";

export default function EspecialistaPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard de Especialista
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido al portal de especialistas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Asesorías Pendientes</h3>
            <p className="text-3xl font-bold text-primary-600">12</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Asesorías Completadas</h3>
            <p className="text-3xl font-bold text-success-600">45</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Calificación Promedio</h3>
            <p className="text-3xl font-bold text-warning-600">4.8</p>
          </div>
        </Card>
      </div>
    </div>
  );
} 