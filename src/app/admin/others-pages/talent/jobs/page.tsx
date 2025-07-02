"use client";
import React, { useState } from "react";
import { useTalent } from "@/context/TalentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { PlusIcon, PencilIcon } from "@/icons";

const AdminJobsPage = () => {
  const { vacancies, createVacancy, updateVacancy, deleteVacancy, applications } = useTalent();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    experienceRequired: 0,
    salaryMin: 0,
    salaryMax: 0,
    currency: "USD",
    location: "Remoto",
    type: "freelance" as const,
    status: "open" as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements.split("\n").filter(r => r.trim()),
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
      experienceRequired: formData.experienceRequired,
      salaryRange: {
        min: formData.salaryMin,
        max: formData.salaryMax,
        currency: formData.currency
      },
      location: formData.location,
      type: formData.type,
      status: formData.status,
      createdBy: user?.id || "1"
    };

    try {
      if (editingJob) {
        await updateVacancy(editingJob.id, jobData);
        alert("Vacante actualizada exitosamente");
      } else {
        await createVacancy(jobData);
        alert("Vacante creada exitosamente");
      }
      resetForm();
    } catch (error) {
      alert("Error al guardar la vacante");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      skills: "",
      experienceRequired: 0,
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      location: "Remoto",
      type: "freelance",
      status: "open"
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleEdit = (job: any) => {
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements.join("\n"),
      skills: job.skills.join(", "),
      experienceRequired: job.experienceRequired,
      salaryMin: job.salaryRange.min,
      salaryMax: job.salaryRange.max,
      currency: job.salaryRange.currency,
      location: job.location,
      type: job.type,
      status: job.status
    });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta vacante?")) {
      try {
        await deleteVacancy(id);
        alert("Vacante eliminada exitosamente");
      } catch (error) {
        alert("Error al eliminar la vacante");
      }
    }
  };

  const getApplicationsCount = (jobId: string) => {
    return applications.filter(a => a.jobId === jobId).length;
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Vacantes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra las ofertas de trabajo disponibles
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Vacante
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <ComponentCard 
          title={editingJob ? "Editar Vacante" : "Nueva Vacante"}
          className="mb-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Título del puesto</Label>
                <Input
                  type="text"
                  defaultValue={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ej: Desarrollador Full Stack"
                />
              </div>
              <div>
                <Label>Tipo de trabajo</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as unknown as const})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="full-time">Tiempo completo</option>
                  <option value="part-time">Medio tiempo</option>
                  <option value="contract">Contrato</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <TextArea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe el puesto y las responsabilidades..."
                rows={4}
              />
            </div>

            <div>
              <Label>Requisitos (uno por línea)</Label>
              <TextArea
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, requirements: e.target.value})}
                placeholder="Ej: 3+ años de experiencia&#10;Inglés intermedio"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Habilidades (separadas por coma)</Label>
                <Input
                  type="text"
                  defaultValue={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="React, Node.js, TypeScript"
                />
              </div>
              <div>
                <Label>Años de experiencia</Label>
                <Input
                  type="number"
                  defaultValue={formData.experienceRequired}
                  onChange={(e) => setFormData({...formData, experienceRequired: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Salario mínimo</Label>
                <Input
                  type="number"
                  defaultValue={formData.salaryMin}
                  onChange={(e) => setFormData({...formData, salaryMin: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
              <div>
                <Label>Salario máximo</Label>
                <Input
                  type="number"
                  defaultValue={formData.salaryMax}
                  onChange={(e) => setFormData({...formData, salaryMax: parseInt(e.target.value)})}
                  min="0"
                />
              </div>
              <div>
                <Label>Moneda</Label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ubicación</Label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                </select>
              </div>
              <div>
                <Label>Estado</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as unknown as const})}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
                >
                  <option value="open">Abierta</option>
                  <option value="closed">Cerrada</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
              >
                {editingJob ? "Actualizar" : "Crear"} Vacante
              </button>
            </div>
          </form>
        </ComponentCard>
      )}

      {/* Lista de vacantes */}
      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <ComponentCard key={vacancy.id} title={vacancy.title}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    vacancy.status === 'open' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : vacancy.status === 'closed'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {vacancy.status === 'open' ? 'Abierta' : vacancy.status === 'closed' ? 'Cerrada' : 'Borrador'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getApplicationsCount(vacancy.id)} aplicaciones
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(vacancy)}
                    className="p-2 text-gray-600 hover:text-brand-500"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(vacancy.id)}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                {vacancy.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💼</span>
                  <span>{vacancy.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💰</span>
                  <span>
                    ${vacancy.salaryRange.min} - ${vacancy.salaryRange.max} {vacancy.salaryRange.currency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅</span>
                  <span>{vacancy.experienceRequired} años de experiencia</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {vacancy.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ComponentCard>
        ))}

        {vacancies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay vacantes creadas aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobsPage; 