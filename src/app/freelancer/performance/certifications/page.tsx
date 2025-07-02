"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";

const mockCerts = [
  { id: 1, name: "Certificado React", issuer: "OpenBootcamp", date: "2023-01-15" },
  { id: 2, name: "AWS Cloud Practitioner", issuer: "Amazon", date: "2022-11-10" },
];

const CertificationsPage = () => {
  // Aquí podrías traer certificaciones reales si existieran
  const certifications = mockCerts;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mis Certificaciones</h1>
      {certifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes certificaciones registradas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map(cert => (
            <ComponentCard key={cert.id} title={cert.name}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-sm text-gray-500">Emisor: {cert.issuer}</div>
                  <div className="text-xs text-gray-400 mt-1">Fecha: {new Date(cert.date).toLocaleDateString()}</div>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationsPage; 