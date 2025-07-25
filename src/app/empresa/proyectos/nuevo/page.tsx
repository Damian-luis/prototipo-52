"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProject } from "@/context/ProjectContext";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import Badge from "@/components/ui/badge/Badge";
import { 
  Plus, 
  X, 
  Eye, 
  EyeOff, 
  Save, 
  Send,
  DollarSign,
  Calendar,
  MapPin,
  Users,
  Clock,
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

const CreateJobPage = () => {
  const { user } = useAuth();
  const { createJob } = useProject();
  const router = useRouter();
  
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: [],
    skills: [],
    budget: {
      min: 0,
      max: 0,
      currency: "USD"
    },
    duration: "",
    location: "Remoto",
    experienceLevel: "intermediate",
    projectType: "freelance",
    isUrgent: false,
    maxApplicants: 10
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Guardar como borrador
  const saveDraft = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const jobData = {
        ...formData,
        status: 'DRAFT' as const,
        companyId: user?.id || "",
        companyName: user?.name || "",
      };

      const result = await createJob(jobData);
      
      if (result.success) {
        alert("Borrador guardado exitosamente");
        router.push("/empresa/proyectos");
      } else {
        alert("Error al guardar el borrador: " + result.message);
      }
    } catch (error) {
      alert("Error al guardar el borrador");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Publicar oferta
  const publishJob = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const jobData = {
        ...formData,
        status: 'ACTIVE' as const,
        companyId: user?.id || "",
        companyName: user?.name || "",
      };

      const result = await createJob(jobData);
      
      if (result.success) {
        alert("Oferta publicada exitosamente");
        router.push("/empresa/proyectos");
      } else {
        alert("Error al publicar la oferta: " + result.message);
      }
    } catch (error) {
      alert("Error al publicar la oferta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageBreadcrumb pageTitle="Crear Nueva Oferta" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
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
                <p className="text-gray-500 text-sm mt-1">
                  {formData.description.length}/1000 caracteres
                </p>
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
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budget.min}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, min: parseFloat(e.target.value) || 0 }
                      }))}
                      className={`pl-10 ${errors.budgetMin ? "border-red-500" : ""}`}
                    />
                  </div>
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
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.budget.max}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        budget: { ...prev.budget, max: parseFloat(e.target.value) || 0 }
                      }))}
                      className={`pl-10 ${errors.budgetMax ? "border-red-500" : ""}`}
                    />
                  </div>
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
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Remoto, Bogotá, México DF..."
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
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

          {/* Configuración Adicional */}
          <ComponentCard title="Configuración Adicional">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Proyecto Urgente
                  </label>
                  <p className="text-sm text-gray-500">
                    Marca si necesitas que el proyecto se complete con prioridad
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Máximo de Aplicantes
                </label>
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.maxApplicants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxApplicants: parseInt(e.target.value) || 10 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Número máximo de profesionales que pueden aplicar
                </p>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Vista Previa */}
          <ComponentCard title="Vista Previa">
            <div className="space-y-4">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="w-full"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Ocultar Vista Previa
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Vista Previa
                  </>
                )}
              </Button>

              {showPreview && (
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-lg mb-2">{formData.title || "Título del Proyecto"}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formData.description || "Descripción del proyecto..."}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Presupuesto:</span>
                      <span className="font-medium">
                        ${formData.budget.min.toLocaleString()} - ${formData.budget.max.toLocaleString()} {formData.budget.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duración:</span>
                      <span className="font-medium">{formData.duration || "No especificada"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ubicación:</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experiencia:</span>
                      <span className="font-medium capitalize">{formData.experienceLevel}</span>
                    </div>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-2">Habilidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} color="light" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ComponentCard>

          {/* Acciones */}
          <ComponentCard title="Acciones">
            <div className="space-y-3">
              <Button
                onClick={saveDraft}
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>

              <Button
                onClick={publishJob}
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Publicar Oferta
              </Button>

              <Button
                onClick={() => router.push("/empresa/proyectos")}
                variant="ghost"
                className="w-full"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </ComponentCard>

          {/* Consejos */}
          <ComponentCard title="Consejos para una Buena Oferta">
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Describe claramente el proyecto y sus objetivos</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Especifica el presupuesto realista</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Lista las habilidades específicas requeridas</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Define la duración y cronograma</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Menciona si es remoto o presencial</p>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage; 