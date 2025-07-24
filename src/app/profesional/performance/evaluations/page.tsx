"use client";
import React from "react";
import { useTalent } from "@/context/TalentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const EvaluationsPage = () => {
  const { evaluations } = useTalent();
  const { user } = useAuth();
  const myEvaluations = evaluations.filter(e => e.freelancerId === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mis Evaluaciones</h1>
      {myEvaluations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes evaluaciones aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myEvaluations.map(evaluation => (
            <ComponentCard key={evaluation.id} title={evaluation.type.charAt(0).toUpperCase() + evaluation.type.slice(1)}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{evaluation.type.charAt(0).toUpperCase() + evaluation.type.slice(1)}</div>
                  <div className="text-sm text-gray-500">Fecha: {new Date(evaluation.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-400 mt-1">Puntaje: {evaluation.overallScore}/5</div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded font-medium bg-blue-100 text-blue-800">{evaluation.evaluatorId}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {evaluation.comments}
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default EvaluationsPage; 