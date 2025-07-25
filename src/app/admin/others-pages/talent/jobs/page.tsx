"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTalent } from "@/context/TalentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { PlusIcon, Pencil } from "@/icons";
import type { JobVacancy } from "@/context/TalentContext";
import { Modal } from "@/components/ui/modal";
import { showError } from '@/util/notifications';

const AI_WEBHOOK_URL = "https://automation-biya.useteam.io/webhook/88eefc19-6ddb-47c9-840d-a96c7859dd96";

interface AIRelevanceFreelancer {
  id_freelancer: string;
  nombre_freelancer: string;
  puntaje_relevancia: number;
  justificacion_corta: string;
  avatarUrl?: string;
}

function useAIRecommendationsForJobs(vacancies: JobVacancy[]): Record<string, AIRelevanceFreelancer[]> {
  const [aiResults, setAIResults] = useState<Record<string, AIRelevanceFreelancer[]>>({});
  useEffect(() => {
    vacancies.forEach(async (vacancy) => {
      if (!vacancy || !vacancy.id) return;
      if (aiResults[vacancy.id]) return;
      const payload = {
        titulo: vacancy.title,
        descripcion: vacancy.description,
        habilidades_requeridas: vacancy.skills,
        presupuesto: `${vacancy.salaryRange.min}-${vacancy.salaryRange.max} ${vacancy.salaryRange.currency}`,
        plazo: Array.isArray(vacancy.requirements) ? vacancy.requirements.find((r: string) => r.toLowerCase().includes('semana') || r.toLowerCase().includes('mes')) || "N/A" : "N/A"
      };
      try {
        const res = await fetch(AI_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setAIResults(prev => ({ ...prev, [vacancy.id]: data.freelancers || [] }));
      } catch (e) {
        setAIResults(prev => ({ ...prev, [vacancy.id]: [] }));
      }
    });
    // eslint-disable-next-line
  }, [vacancies]);
  return aiResults;
}

const Loader = () => (
  <div className="flex flex-col items-center justify-center py-6">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-2"></div>
    <div className="text-purple-700 font-medium">Buscando recomendaciones con IA...</div>
  </div>
);

const AdminJobsPage = () => {
  const { vacancies, createVacancy, updateVacancy, deleteVacancy, applications, getApplicationsByJob, updateApplicationStatus } = useTalent();
  const { user, users } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    experienceRequired: 0,
    salaryRange: { min: 0, max: 0, currency: "USD" },
    location: "Remoto",
    type: "freelance",
    status: "open",
    createdBy: user?.id || "1"
  });
  const [showApplications, setShowApplications] = useState<string | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const aiResults = useAIRecommendationsForJobs(vacancies);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData = {
      ...formData,
      requirements: formData.requirements.split("\n").filter(r => r.trim()),
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
      type: formData.type as 'full-time' | 'part-time' | 'contract' | 'freelance',
      status: formData.status as 'open' | 'closed' | 'draft',
      experienceRequired: formData.experienceRequired,
      salaryRange: formData.salaryRange,
      location: formData.location,
      createdBy: user?.id || "1"
    };

    try {
      if (editingJob) {
        await updateVacancy(editingJob.id, jobData);
        showError('Vacante actualizada exitosamente');
      } else {
        await createVacancy(jobData);
        showError('Vacante creada exitosamente');
      }
      resetForm();
    } catch (error) {
      showError('Error al guardar la vacante');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      requirements: "",
      skills: "",
      experienceRequired: 0,
      salaryRange: { min: 0, max: 0, currency: "USD" },
      location: "Remoto",
      type: "freelance",
      status: "open",
      createdBy: user?.id || "1"
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
      salaryRange: job.salaryRange,
      location: job.location,
      type: job.type,
      status: job.status,
      createdBy: job.createdBy
    });
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta vacante?")) {
      try {
        await deleteVacancy(id);
        showError('Vacante eliminada exitosamente');
      } catch (error) {
        showError('Error al eliminar la vacante');
      }
    }
  };

  const getApplicationsCount = (jobId: string) => {
    return applications.filter(a => a.jobId === jobId).length;
  };

  const getFreelancerProfile = (freelancerId: string) => {
    return users.find(u => u.id === freelancerId);
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
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
                placeholder="Describe el puesto y las responsabilidades..."
                rows={4}
              />
            </div>

            <div>
              <Label>Requisitos (uno por línea)</Label>
              <Input
                type="text"
                defaultValue={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Ej: 3+ años de experiencia\nInglés intermedio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Habilidades (separadas por coma)</Label>
                <Input
                  type="text"
                  defaultValue={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
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
                  defaultValue={formData.salaryRange.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    salaryRange: { ...formData.salaryRange, min: parseInt(e.target.value) }
                  })}
                  min="0"
                />
              </div>
              <div>
                <Label>Salario máximo</Label>
                <Input
                  type="number"
                  defaultValue={formData.salaryRange.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    salaryRange: { ...formData.salaryRange, max: parseInt(e.target.value) }
                  })}
                  min="0"
                />
              </div>
              <div>
                <Label>Moneda</Label>
                <select
                  value={formData.salaryRange.currency}
                  onChange={(e) => setFormData({...formData, salaryRange: {...formData.salaryRange, currency: e.target.value}})}
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
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
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
        {vacancies.map((vacancy) => {
          const aiList = aiResults[vacancy.id] || [];
          const showAll = expanded[vacancy.id];
          const visibleFreelancers = showAll ? aiList : aiList.slice(0, 2);
          return (
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
                      onClick={() => setShowApplications(vacancy.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 border border-blue-200 rounded"
                    >
                      Ver postulaciones
                    </button>
                    <button
                      onClick={() => handleEdit(vacancy)}
                      className="p-2 text-gray-600 hover:text-brand-500"
                    >
                      <Pencil className="w-5 h-5" />
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
                {/* IA Recommendations */}
                <div className="mt-4">
                  <h4 className="font-semibold text-lg mb-2 text-purple-700">Freelancers recomendados por IA</h4>
                  {aiResults[vacancy.id] === undefined && (
                    <Loader />
                  )}
                  {aiResults[vacancy.id] && aiResults[vacancy.id].length === 0 && (
                    <div className="text-gray-400 italic">No se encontraron recomendaciones.</div>
                  )}
                  {aiResults[vacancy.id] && aiResults[vacancy.id].length > 0 && (
                    <>
                      <ul className="space-y-2">
                        {visibleFreelancers.map((freelancer) => {
                          // Buscar si el freelancer existe en la base de usuarios
                          const userProfile = users.find(u => u.name === freelancer.nombre_freelancer);
                          // Avatar: usar avatarUrl si existe, si no, inicial
                          const avatarUrl = freelancer.avatarUrl;
                          return (
                            <li key={freelancer.id_freelancer} className="p-3 border rounded-lg bg-purple-50 dark:bg-purple-900/10">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  {avatarUrl ? (
                                    <img src={avatarUrl} alt={freelancer.nombre_freelancer} className="w-10 h-10 rounded-full object-cover border-2 border-purple-300" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-lg font-bold text-purple-700 border-2 border-purple-300">
                                      {freelancer.nombre_freelancer.charAt(0)}
                                    </div>
                                  )}
                                  <span className="font-medium text-gray-900 dark:text-white">{freelancer.nombre_freelancer}</span>
                                </div>
                                <span className="text-xs text-purple-700 font-bold">Puntaje: {freelancer.puntaje_relevancia}</span>
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{freelancer.justificacion_corta}</div>
                              <div className="mt-2 flex gap-2">
                                {userProfile && (
                                  <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                                    onClick={() => setSelectedFreelancer(userProfile)}
                                  >
                                    Ver perfil
                                  </button>
                                )}
                                <button
                                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
                                  onClick={() => {navigator.clipboard.writeText(userProfile?.email || freelancer.nombre_freelancer); showError('Email copiado')}}
                                >
                                  Copiar email
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      {aiList.length > 2 && (
                        <div className="mt-2">
                          <button
                            className="text-sm text-purple-700 underline hover:text-purple-900"
                            onClick={() => setExpanded(prev => ({ ...prev, [vacancy.id]: !showAll }))}
                          >
                            {showAll ? 'Ver menos' : `Ver ${aiList.length - 2} más`}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* Modal de postulaciones */}
              <Modal isOpen={showApplications === vacancy.id} onClose={() => setShowApplications(null)} className="max-w-4xl p-8">
                <h3 className="text-2xl font-bold mb-6">Postulaciones a {vacancy.title}</h3>
                {getApplicationsByJob(vacancy.id).length === 0 ? (
                  <div className="text-gray-500">No hay postulaciones para esta vacante.</div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getApplicationsByJob(vacancy.id).map(app => (
                      <li key={app.id} className="py-5 flex flex-col gap-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="font-semibold text-lg">{app.freelancerName} ({app.freelancerEmail})</div>
                            <button
                              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-semibold shadow transition"
                              onClick={() => setSelectedFreelancer(getFreelancerProfile(app.freelancerId))}
                            >
                              Ver perfil
                            </button>
                          </div>
                          <div className="text-xs text-gray-500 mb-1">Estado: {app.status.charAt(0).toUpperCase() + app.status.slice(1)} | Aplicado: {new Date(app.appliedAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-base text-gray-700 dark:text-gray-300 mt-1 mb-2">{app.coverLetter}</div>
                        <div className="flex flex-row gap-3 justify-center mt-2">
                          <button
                            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${app.status === 'accepted' ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}
                            disabled={app.status === 'accepted'}
                            onClick={async () => await updateApplicationStatus(app.id, 'accepted')}
                          >
                            {app.status === 'accepted' ? 'Aceptado' : 'Aceptar'}
                          </button>
                          <button
                            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${app.status === 'rejected' ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'}`}
                            disabled={app.status === 'rejected'}
                            onClick={async () => await updateApplicationStatus(app.id, 'rejected')}
                          >
                            {app.status === 'rejected' ? 'Rechazado' : 'Rechazar'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal>
            </ComponentCard>
          );
        })}

        {vacancies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay vacantes creadas aún.
            </p>
          </div>
        )}
      </div>
      {/* Modal de perfil de freelancer */}
      <Modal isOpen={!!selectedFreelancer} onClose={() => setSelectedFreelancer(null)} className="max-w-2xl p-8">
        {selectedFreelancer && (
          <div>
            <h3 className="text-2xl font-bold mb-4">Perfil de {selectedFreelancer.name}</h3>
            <div className="mb-2 text-base text-gray-500">Email: {selectedFreelancer.email}</div>
            <div className="mb-2 text-base text-gray-500">Skills: {(selectedFreelancer.skills || []).join(", ")}</div>
            <div className="mb-2 text-base text-gray-500">Tarifa: {selectedFreelancer.hourlyRate ? `$${selectedFreelancer.hourlyRate}/h` : 'N/A'}</div>
            <div className="mb-2 text-base text-gray-500">Disponibilidad: {selectedFreelancer.availability || 'N/A'}</div>
            <div className="mb-2 text-base text-gray-500">Bio: {selectedFreelancer.bio || 'N/A'}</div>
            {selectedFreelancer.portfolio && (
              <div className="mb-2 text-base text-gray-500">Portfolio: <a href={selectedFreelancer.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Ver</a></div>
            )}
            <div className="mt-6 flex gap-4">
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-semibold shadow transition"
                onClick={() => window.open(`mailto:${selectedFreelancer.email}`)}
              >
                Contactar usuario
              </button>
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-base font-semibold shadow transition"
                onClick={() => {navigator.clipboard.writeText(selectedFreelancer.email); showError('Email copiado')}}
              >
                Copiar email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminJobsPage; 