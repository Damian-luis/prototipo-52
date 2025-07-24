"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Evaluacion {
  id: string;
  profesional_id: string;
  profesional_nombre: string;
  profesional_email: string;
  profesional_avatar?: string;
  especialidad: string;
  nivel_experiencia: 'junior' | 'mid' | 'senior' | 'expert';
  fecha_evaluacion: string;
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
  calificacion_tecnica?: number;
  calificacion_comunicacion?: number;
  calificacion_problema?: number;
  calificacion_promedio?: number;
  comentarios_tecnica?: string;
  comentarios_comunicacion?: string;
  comentarios_generales?: string;
  recomendacion: 'rechazar' | 'aprobado' | 'aprobado_condicional' | 'excelente';
  habilidades_evaluadas: string[];
  fortalezas: string[];
  areas_mejora: string[];
  tiempo_evaluacion_minutos?: number;
  proyecto_evaluado?: string;
  feedback_detallado?: string;
}

const EspecialistaEvaluacionesPage = () => {
  const { user } = useAuth();
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState<Evaluacion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [especialidadFilter, setEspecialidadFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [recomendacionFilter, setRecomendacionFilter] = useState<string>("all");
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<Evaluacion | null>(null);
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false);

  useEffect(() => {
    const mockEvaluaciones: Evaluacion[] = [
      {
        id: "1",
        profesional_id: "prof1",
        profesional_nombre: "Juan Carlos López",
        profesional_email: "juan.lopez@freelancer.com",
        profesional_avatar: "/images/user/avatar1.jpg",
        especialidad: "Frontend Development",
        nivel_experiencia: 'senior',
        fecha_evaluacion: "2024-01-15T14:00:00Z",
        estado: 'completada',
        calificacion_tecnica: 4.5,
        calificacion_comunicacion: 4.8,
        calificacion_problema: 4.7,
        calificacion_promedio: 4.7,
        comentarios_tecnica: "Excelente dominio de React y TypeScript. Código limpio y bien estructurado.",
        comentarios_comunicacion: "Comunicación clara y efectiva. Explica bien sus decisiones técnicas.",
        comentarios_generales: "Profesional muy competente con amplia experiencia en desarrollo frontend.",
        recomendacion: 'excelente',
        habilidades_evaluadas: ["React", "TypeScript", "CSS", "Git", "Testing"],
        fortalezas: ["Código limpio", "Buenas prácticas", "Comunicación efectiva"],
        areas_mejora: ["Performance optimization", "Advanced testing"],
        tiempo_evaluacion_minutos: 45,
        proyecto_evaluado: "E-commerce React App",
        feedback_detallado: "Juan demostró un excelente nivel técnico durante la evaluación..."
      },
      {
        id: "2",
        profesional_id: "prof2",
        profesional_nombre: "María Fernanda Silva",
        profesional_email: "maria.silva@dev.com",
        profesional_avatar: "/images/user/avatar2.jpg",
        especialidad: "Backend Development",
        nivel_experiencia: 'mid',
        fecha_evaluacion: "2024-01-16T10:00:00Z",
        estado: 'en_proceso',
        calificacion_tecnica: 3.8,
        calificacion_comunicacion: 4.2,
        calificacion_problema: 3.9,
        calificacion_promedio: 4.0,
        comentarios_tecnica: "Buen conocimiento de Node.js y Express. Algunas áreas de mejora en arquitectura.",
        comentarios_comunicacion: "Comunicación clara, pero podría ser más proactiva.",
        comentarios_generales: "Profesional con potencial, necesita más experiencia en proyectos complejos.",
        recomendacion: 'aprobado_condicional',
        habilidades_evaluadas: ["Node.js", "Express", "MongoDB", "REST APIs"],
        fortalezas: ["Lógica de programación", "Documentación"],
        areas_mejora: ["Arquitectura de software", "Testing", "Performance"],
        tiempo_evaluacion_minutos: 35,
        proyecto_evaluado: "API REST para gestión de usuarios"
      },
      {
        id: "3",
        profesional_id: "prof3",
        profesional_nombre: "Carlos Eduardo Ramírez",
        profesional_email: "carlos.ramirez@tech.com",
        profesional_avatar: "/images/user/avatar3.jpg",
        especialidad: "DevOps",
        nivel_experiencia: 'expert',
        fecha_evaluacion: "2024-01-14T16:00:00Z",
        estado: 'completada',
        calificacion_tecnica: 4.9,
        calificacion_comunicacion: 4.7,
        calificacion_problema: 4.8,
        calificacion_promedio: 4.8,
        comentarios_tecnica: "Experto en Docker, Kubernetes y CI/CD. Conocimientos avanzados en cloud.",
        comentarios_comunicacion: "Excelente capacidad de explicar conceptos complejos de manera simple.",
        comentarios_generales: "Profesional de alto nivel con experiencia en empresas tecnológicas importantes.",
        recomendacion: 'excelente',
        habilidades_evaluadas: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
        fortalezas: ["Automatización", "Escalabilidad", "Seguridad"],
        areas_mejora: ["Ninguna área crítica identificada"],
        tiempo_evaluacion_minutos: 60,
        proyecto_evaluado: "Infraestructura como código para startup",
        feedback_detallado: "Carlos demostró un dominio excepcional de las tecnologías DevOps..."
      },
      {
        id: "4",
        profesional_id: "prof4",
        profesional_nombre: "Ana Patricia Morales",
        profesional_email: "ana.morales@design.com",
        profesional_avatar: "/images/user/avatar4.jpg",
        especialidad: "UI/UX Design",
        nivel_experiencia: 'junior',
        fecha_evaluacion: "2024-01-17T11:00:00Z",
        estado: 'pendiente',
        calificacion_tecnica: 4.0,
        calificacion_comunicacion: 4.2,
        calificacion_problema: 4.1,
        calificacion_promedio: 4.1,
        comentarios_tecnica: "Buen conocimiento de Figma y Adobe XD. Necesita mejorar en prototipado y user research.",
        comentarios_comunicacion: "Comunicación clara, pero podría ser más proactiva en la investigación de usuarios.",
        comentarios_generales: "Profesional con potencial, necesita más experiencia en proyectos de diseño UX.",
        recomendacion: 'aprobado',
        habilidades_evaluadas: ["Figma", "Adobe XD", "Prototyping", "User Research"],
        fortalezas: ["Creatividad", "Atención al detalle"],
        areas_mejora: ["Experiencia en proyectos reales", "Metodologías ágiles"]
      },
      {
        id: "5",
        profesional_id: "prof5",
        profesional_nombre: "Roberto Alejandro Torres",
        profesional_email: "roberto.torres@mobile.com",
        profesional_avatar: "/images/user/avatar5.jpg",
        especialidad: "Mobile Development",
        nivel_experiencia: 'senior',
        fecha_evaluacion: "2024-01-13T09:00:00Z",
        estado: 'completada',
        calificacion_tecnica: 3.2,
        calificacion_comunicacion: 3.5,
        calificacion_problema: 3.0,
        calificacion_promedio: 3.2,
        comentarios_tecnica: "Conocimientos básicos de React Native. Necesita mejorar en arquitectura móvil.",
        comentarios_comunicacion: "Comunicación limitada. Dificultad para explicar decisiones técnicas.",
        comentarios_generales: "No cumple con los estándares requeridos para el nivel senior.",
        recomendacion: 'rechazar',
        habilidades_evaluadas: ["React Native", "JavaScript", "Mobile Development"],
        fortalezas: ["Conocimiento básico de React Native"],
        areas_mejora: ["Arquitectura móvil", "Performance", "Testing", "Comunicación"],
        tiempo_evaluacion_minutos: 40,
        proyecto_evaluado: "App móvil de delivery"
      }
    ];
    
    setEvaluaciones(mockEvaluaciones);
  }, []);

  useEffect(() => {
    let filtered = evaluaciones;
    
    if (searchTerm) {
      filtered = filtered.filter(evaluacion => 
        evaluacion.profesional_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluacion.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (especialidadFilter !== "all") {
      filtered = filtered.filter(evaluacion => evaluacion.especialidad === especialidadFilter);
    }
    
    if (estadoFilter !== "all") {
      filtered = filtered.filter(evaluacion => evaluacion.estado === estadoFilter);
    }
    
    if (recomendacionFilter !== "all") {
      filtered = filtered.filter(evaluacion => evaluacion.recomendacion === recomendacionFilter);
    }
    
    setFilteredEvaluaciones(filtered);
  }, [evaluaciones, searchTerm, especialidadFilter, estadoFilter, recomendacionFilter]);

  const handleIniciarEvaluacion = (evaluacion: Evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setShowEvaluacionModal(true);
  };

  const handleCompletarEvaluacion = (evaluacionId: string) => {
    const updatedEvaluaciones = evaluaciones.map(evaluacion => {
      if (evaluacion.id === evaluacionId) {
        return { ...evaluacion, estado: 'completada' as const };
      }
      return evaluacion;
    });
    setEvaluaciones(updatedEvaluaciones);
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'expert': return 'error';
      case 'senior': return 'warning';
      case 'mid': return 'info';
      case 'junior': return 'success';
      default: return 'light';
    }
  };

  const getNivelText = (nivel: string) => {
    switch (nivel) {
      case 'expert': return 'Experto';
      case 'senior': return 'Senior';
      case 'mid': return 'Mid-Level';
      case 'junior': return 'Junior';
      default: return nivel;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'info';
      case 'completada': return 'success';
      case 'cancelada': return 'error';
      default: return 'light';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const getRecomendacionColor = (recomendacion: string) => {
    switch (recomendacion) {
      case 'excelente': return 'success';
      case 'aprobado': return 'info';
      case 'aprobado_condicional': return 'warning';
      case 'rechazar': return 'error';
      default: return 'light';
    }
  };

  const getRecomendacionText = (recomendacion: string) => {
    switch (recomendacion) {
      case 'excelente': return 'Excelente';
      case 'aprobado': return 'Aprobado';
      case 'aprobado_condicional': return 'Aprobado Condicional';
      case 'rechazar': return 'Rechazar';
      default: return recomendacion;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: evaluaciones.length,
    pendientes: evaluaciones.filter(e => e.estado === 'pendiente').length,
    en_proceso: evaluaciones.filter(e => e.estado === 'en_proceso').length,
    completadas: evaluaciones.filter(e => e.estado === 'completada').length,
    excelentes: evaluaciones.filter(e => e.recomendacion === 'excelente').length,
    aprobados: evaluaciones.filter(e => e.recomendacion === 'aprobado').length,
    rechazados: evaluaciones.filter(e => e.recomendacion === 'rechazar').length,
    calificacion_promedio: evaluaciones.filter(e => e.calificacion_promedio).reduce((acc, e) => acc + (e.calificacion_promedio || 0), 0) / evaluaciones.filter(e => e.calificacion_promedio).length || 0
  };

  const especialidades = Array.from(new Set(evaluaciones.map(e => e.especialidad)));

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Evaluaciones de Profesionales" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Evaluaciones">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Evaluaciones realizadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.pendientes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren evaluación
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Calificación Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.calificacion_promedio.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ⭐⭐⭐⭐⭐
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Excelentes">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.excelentes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recomendaciones excelentes
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={especialidadFilter}
              onChange={(e) => setEspecialidadFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las especialidades</option>
              {especialidades.map(especialidad => (
                <option key={especialidad} value={especialidad}>{especialidad}</option>
              ))}
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
            <select
              value={recomendacionFilter}
              onChange={(e) => setRecomendacionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las recomendaciones</option>
              <option value="excelente">Excelente</option>
              <option value="aprobado">Aprobado</option>
              <option value="aprobado_condicional">Aprobado Condicional</option>
              <option value="rechazar">Rechazar</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de evaluaciones */}
        <div className="space-y-4">
          {filteredEvaluaciones.map((evaluacion) => (
            <ComponentCard key={evaluacion.id} title={evaluacion.profesional_nombre}>
              <div className="space-y-4">
                {/* Header de la evaluación */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {evaluacion.profesional_nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {evaluacion.profesional_email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(evaluacion.fecha_evaluacion)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge color={getNivelColor(evaluacion.nivel_experiencia)} size="sm">
                        {getNivelText(evaluacion.nivel_experiencia)}
                      </Badge>
                      <Badge color={getEstadoColor(evaluacion.estado)} size="sm">
                        {getEstadoText(evaluacion.estado)}
                      </Badge>
                    </div>
                    {evaluacion.recomendacion && (
                      <Badge color={getRecomendacionColor(evaluacion.recomendacion)} size="sm">
                        {getRecomendacionText(evaluacion.recomendacion)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Información de la evaluación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Especialidad:</span>
                    <p className="font-medium">{evaluacion.especialidad}</p>
                  </div>
                  {evaluacion.calificacion_promedio && (
                    <div>
                      <span className="text-gray-500">Calificación:</span>
                      <p className="font-medium">{"⭐".repeat(Math.round(evaluacion.calificacion_promedio))}</p>
                    </div>
                  )}
                  {evaluacion.tiempo_evaluacion_minutos && (
                    <div>
                      <span className="text-gray-500">Duración:</span>
                      <p className="font-medium">{evaluacion.tiempo_evaluacion_minutos} min</p>
                    </div>
                  )}
                </div>

                {/* Habilidades evaluadas */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habilidades evaluadas:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {evaluacion.habilidades_evaluadas.map((habilidad, index) => (
                      <Badge key={index} color="light" size="sm">
                        {habilidad}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Fortalezas y áreas de mejora */}
                {evaluacion.fortalezas && evaluacion.fortalezas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fortalezas:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {evaluacion.fortalezas.map((fortaleza, index) => (
                        <Badge key={index} color="success" size="sm">
                          ✅ {fortaleza}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {evaluacion.areas_mejora && evaluacion.areas_mejora.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Áreas de mejora:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {evaluacion.areas_mejora.map((area, index) => (
                        <Badge key={index} color="warning" size="sm">
                          ⚠️ {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comentarios */}
                {evaluacion.comentarios_generales && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comentarios generales:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {evaluacion.comentarios_generales}
                    </p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {evaluacion.estado === 'pendiente' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleIniciarEvaluacion(evaluacion)}
                    >
                      Iniciar Evaluación
                    </Button>
                  )}
                  
                  {evaluacion.estado === 'en_proceso' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCompletarEvaluacion(evaluacion.id)}
                    >
                      Completar Evaluación
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${evaluacion.profesional_email}?subject=Evaluación: ${evaluacion.especialidad}`)}
                  >
                    Contactar Profesional
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredEvaluaciones.length === 0 && (
          <ComponentCard title="Sin Evaluaciones">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron evaluaciones. {searchTerm || especialidadFilter !== "all" || estadoFilter !== "all" || recomendacionFilter !== "all" ? "Intenta ajustar los filtros." : "No hay evaluaciones pendientes."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal de evaluación */}
      {showEvaluacionModal && selectedEvaluacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                Evaluación de {selectedEvaluacion.profesional_nombre}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowEvaluacionModal(false);
                  setSelectedEvaluacion(null);
                }}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Información del Profesional</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Nombre:</span> {selectedEvaluacion.profesional_nombre}</div>
                    <div><span className="text-gray-500">Email:</span> {selectedEvaluacion.profesional_email}</div>
                    <div><span className="text-gray-500">Especialidad:</span> {selectedEvaluacion.especialidad}</div>
                    <div><span className="text-gray-500">Nivel:</span> {getNivelText(selectedEvaluacion.nivel_experiencia)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles de la Evaluación</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Fecha:</span> {formatDateTime(selectedEvaluacion.fecha_evaluacion)}</div>
                    <div><span className="text-gray-500">Estado:</span> {getEstadoText(selectedEvaluacion.estado)}</div>
                    {selectedEvaluacion.proyecto_evaluado && (
                      <div><span className="text-gray-500">Proyecto:</span> {selectedEvaluacion.proyecto_evaluado}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Habilidades Evaluadas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEvaluacion.habilidades_evaluadas.map((habilidad, index) => (
                    <Badge key={index} color="light" size="sm">
                      {habilidad}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowEvaluacionModal(false);
                    setSelectedEvaluacion(null);
                  }}
                >
                  Continuar Evaluación
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEvaluacionModal(false);
                    setSelectedEvaluacion(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspecialistaEvaluacionesPage; 