"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Badge from "@/components/ui/badge/Badge";
import { showError } from '@/util/notifications';
import { 
  Plus, 
  X, 
  Save,
  ArrowLeft,
  AlertCircle
} from "lucide-react";

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: string;
  location: string;
  experienceLevel: string;
  projectType: string;
  isUrgent: boolean;
  maxApplicants: number;
}

const EditJobPage = () => {
  const { user } = useAuth();
  const { getJobById, updateJob } = useProject();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: [],
    skills: [],
    budget: { min: 0, max: 0, currency: "USD" },
    duration: "",
    location: "Remoto",
    experienceLevel: "intermediate",
    projectType: "freelance",
    isUrgent: false,
    maxApplicants: 10
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del trabajo
  useEffect(() => {
    const loadJob = async () => {
      try {
        setIsLoading(true);
        const job = await getJobById(jobId);
        
        if (job) {
          setFormData({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements || [],
            skills: job.skills || [],
            budget: job.budget || { min: 0, max: 0, currency: "USD" },
            duration: job.duration || "",
            location: job.location || "Remoto",
            experienceLevel: "intermediate", // Valor por defecto
            projectType: "freelance", // Valor por defecto
            isUrgent: job.isUrgent || false,
            maxApplicants: 10 // Valor por defecto
          });
        } else {
          showError('No se encontró el trabajo especificado');
          router.push("/empresa/proyectos");
        }
      } catch (error) {
        console.error("Error loading job:", error);
        showError('Error al cargar el trabajo');
        router.push("/empresa/proyectos");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId, getJobById, router]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }

    if (formData.description.length < 50) {
      newErrors.description = "La descripción debe tener al menos 50 caracteres";
    }

    if (formData.requirements.length === 0) {
      newErrors.requirements = "Debe agregar al menos un requisito";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Debe agregar al menos una habilidad";
    }

    if (formData.budget.min <= 0) {
      newErrors.budgetMin = "El presupuesto mínimo debe ser mayor a 0";
    }

    if (formData.budget.max <= formData.budget.min) {
      newErrors.budgetMax = "El presupuesto máximo debe ser mayor al mínimo";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "La duración es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Agregar requisito
  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  // Remover requisito
  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Agregar habilidad
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  // Remover habilidad
  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Actualizar trabajo
  const updateJobData = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        skills: formData.skills,
        budget: formData.budget,
        duration: formData.duration,
        location: formData.location,
        experienceLevel: formData.experienceLevel,
        projectType: formData.projectType,
        isUrgent: formData.isUrgent,
        maxApplicants: formData.maxApplicants,
      };

      const result = await updateJob(jobId, jobData);
      
      if (result.success) {
        showError('Oferta actualizada exitosamente');
        router.push("/empresa/proyectos");
      } else {
        showError("Error al actualizar la oferta: " + result.message);
      }
    } catch (error) {
      showError('Error al actualizar la oferta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageBreadcrumb pageTitle="Editando Oferta" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando oferta...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageBreadcrumb pageTitle="Editar Oferta" />
      
      <div className="space-y-6">
        {/* Información Básica */}
        <ComponentCard title="Información Básica">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título del Proyecto *
              </label>
              <Input
                type="text"
                placeholder="Ej: Desarrollador Full Stack para E-commerce"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción del Proyecto *
              </label>
              <textarea
                placeholder="Describe detalladamente el proyecto, objetivos, alcance y expectativas..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white min-h-[120px] resize-vertical ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Proyecto
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="freelance">Freelance</option>
                  <option value="contract">Contrato</option>
                  <option value="part-time">Tiempo Parcial</option>
                  <option value="full-time">Tiempo Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nivel de Experiencia
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="entry">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Experto</option>
                </select>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Presupuesto y Duración */}
        <ComponentCard title="Presupuesto y Duración">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Presupuesto Mínimo *
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.budget.min}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    budget: { ...prev.budget, min: parseFloat(e.target.value) || 0 }
                  }))}
                  className={errors.budgetMin ? "border-red-500" : ""}
                />
                {errors.budgetMin && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.budgetMin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Presupuesto Máximo *
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.budget.max}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    budget: { ...prev.budget, max: parseFloat(e.target.value) || 0 }
                  }))}
                  className={errors.budgetMax ? "border-red-500" : ""}
                />
                {errors.budgetMax && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.budgetMax}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Moneda
                </label>
                <select
                  value={formData.budget.currency}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    budget: { ...prev.budget, currency: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="COP">COP</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duración Estimada *
                </label>
                <Input
                  type="text"
                  placeholder="Ej: 2-3 semanas, 1 mes, 6 meses"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className={errors.duration ? "border-red-500" : ""}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.duration}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ubicación
                </label>
                <Input
                  type="text"
                  placeholder="Remoto, Bogotá, México DF..."
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Requisitos */}
        <ComponentCard title="Requisitos del Proyecto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agregar Requisito
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Experiencia mínima de 3 años en React"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <Button
                  onClick={addRequirement}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {formData.requirements.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requisitos Agregados ({formData.requirements.length})
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">{req}</span>
                      <Button
                        onClick={() => removeRequirement(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.requirements && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.requirements}
              </p>
            )}
          </div>
        </ComponentCard>

        {/* Habilidades */}
        <ComponentCard title="Habilidades Requeridas">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agregar Habilidad
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: React, Node.js, MongoDB"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <Button
                  onClick={addSkill}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {formData.skills.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilidades Agregadas ({formData.skills.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} color="primary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeSkill(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.skills && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.skills}
              </p>
            )}
          </div>
        </ComponentCard>

        {/* Acciones */}
        <ComponentCard title="Acciones">
          <div className="flex gap-3">
            <Button
              onClick={updateJobData}
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              Actualizar Oferta
            </Button>

            <Button
              onClick={() => router.push("/empresa/proyectos")}
              variant="outline"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default EditJobPage; 