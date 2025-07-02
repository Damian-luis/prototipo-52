"use client";
import React from "react";
import { useTalent } from "@/context/TalentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const ApplicationsPage = () => {
  const { applications, vacancies } = useTalent();
  const { user } = useAuth();

  // Filtrar aplicaciones del usuario
  const myApplications = applications.filter(a => a.freelancerId === user?.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mis Aplicaciones</h1>
      {myApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No has aplicado a ningún trabajo aún.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map(app => {
            const job = vacancies.find(v => v.id === app.jobId);
            return (
              <ComponentCard key={app.id} title={job?.title || "Trabajo"}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="font-semibold">{job?.title || "Trabajo"}</div>
                    <div className="text-sm text-gray-500">{job?.location} • {job?.type}</div>
                    <div className="text-xs text-gray-400 mt-1">Aplicado: {new Date(app.appliedAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {app.coverLetter}
                </div>
              </ComponentCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage; 