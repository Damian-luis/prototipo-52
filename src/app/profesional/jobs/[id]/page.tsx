"use client";
import React from "react";
import { useTalent } from "@/context/TalentContext";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";

const JobDetailPage = () => {
  const { id } = useParams();
  const { vacancies } = useTalent();
  const job = vacancies.find(v => v.id === id);

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Trabajo no encontrado</h1>
        <p className="text-gray-500 dark:text-gray-400">El trabajo solicitado no existe o ha sido eliminado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{job.title}</h1>
      <ComponentCard title="Detalles del Trabajo">
        <div className="mb-2 text-gray-700 dark:text-gray-300">{job.description}</div>
        <div className="mb-2 text-sm text-gray-500">Ubicación: {job.location} | Tipo: {job.type}</div>
        <div className="mb-2 text-sm text-gray-500">Salario: ${job.salaryRange.min} - ${job.salaryRange.max} {job.salaryRange.currency}</div>
        <div className="mb-2 text-sm text-gray-500">Experiencia requerida: {job.experienceRequired} años</div>
        <div className="mb-2 text-sm text-gray-500">Requisitos:</div>
        <ul className="list-disc ml-6 text-sm text-gray-700 dark:text-gray-300">
          {job.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
        </ul>
        <div className="mt-4">
          <span className="font-medium">Habilidades requeridas:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.skills.map(skill => (
              <span key={skill} className="px-3 py-1 text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 rounded-full">{skill}</span>
            ))}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default JobDetailPage; 