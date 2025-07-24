"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Consulta {
  id: string;
  cliente_id: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_avatar?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  estado: 'pendiente' | 'en_proceso' | 'resuelta' | 'cancelada';
  fecha_creacion: string;
  fecha_respuesta?: string;
  fecha_cierre?: string;
  tiempo_respuesta_horas?: number;
  calificacion?: number;
  comentarios: string[];
  archivos_adjuntos: string[];
  especialidad_requerida: string;
  presupuesto_estimado?: number;
  duracion_estimada_horas?: number;
}

const EspecialistaConsultasPage = () => {
  const { user } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<Consulta[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all");
  const [prioridadFilter, setPrioridadFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    // Simular datos de consultas
    const mockConsultas: Consulta[] = [
      {
        id: "1",
        cliente_id: "cliente1",
        cliente_nombre: "María González",
        cliente_email: "maria.gonzalez@empresa.com",
        cliente_avatar: "/images/user/avatar1.jpg",
        titulo: "Optimización de base de datos PostgreSQL",
        descripcion: "Necesito ayuda para optimizar el rendimiento de mi base de datos PostgreSQL que maneja más de 1M de registros. Los tiempos de consulta se han vuelto muy lentos.",
        categoria: "Base de Datos",
        prioridad: 'alta',
        estado: 'pendiente',
        fecha_creacion: "2024-01-15T10:30:00Z",
        especialidad_requerida: "PostgreSQL",
        presupuesto_estimado: 500,
        duracion_estimada_horas: 4,
        comentarios: [],
        archivos_adjuntos: ["esquema_bd.sql", "query_slow.png"]
      },
      {
        id: "2",
        cliente_id: "cliente2",
        cliente_nombre: "Carlos Rodríguez",
        cliente_email: "carlos.rodriguez@startup.com",
        cliente_avatar: "/images/user/avatar2.jpg",
        titulo: "Arquitectura de microservicios con Docker",
        descripcion: "Estoy migrando mi aplicación monolítica a microservicios. Necesito asesoría sobre la mejor arquitectura y estrategia de implementación.",
        categoria: "Arquitectura",
        prioridad: 'media',
        estado: 'en_proceso',
        fecha_creacion: "2024-01-14T14:20:00Z",
        fecha_respuesta: "2024-01-15T09:15:00Z",
        tiempo_respuesta_horas: 18.9,
        especialidad_requerida: "Microservicios",
        presupuesto_estimado: 800,
        duracion_estimada_horas: 6,
        comentarios: [
          "Hola Carlos, he revisado tu caso. Te recomiendo empezar con una estrategia de strangler fig pattern..."
        ],
        archivos_adjuntos: ["arquitectura_actual.pdf"]
      },
      {
        id: "3",
        cliente_id: "cliente3",
        cliente_nombre: "Ana Martínez",
        cliente_email: "ana.martinez@consultora.com",
        cliente_avatar: "/images/user/avatar3.jpg",
        titulo: "Implementación de CI/CD con GitHub Actions",
        descripcion: "Quiero automatizar el despliegue de mi aplicación React/Node.js. ¿Puedes ayudarme a configurar un pipeline de CI/CD?",
        categoria: "DevOps",
        prioridad: 'baja',
        estado: 'resuelta',
        fecha_creacion: "2024-01-13T16:45:00Z",
        fecha_respuesta: "2024-01-14T10:30:00Z",
        fecha_cierre: "2024-01-15T11:20:00Z",
        tiempo_respuesta_horas: 17.8,
        calificacion: 5,
        especialidad_requerida: "CI/CD",
        presupuesto_estimado: 300,
        duracion_estimada_horas: 2,
        comentarios: [
          "Perfecto, te ayudo con la configuración. Primero necesitamos crear el workflow de GitHub Actions...",
          "Excelente, ya está funcionando perfectamente. ¡Muchas gracias!"
        ],
        archivos_adjuntos: ["workflow.yml", "deployment_guide.md"]
      },
      {
        id: "4",
        cliente_id: "cliente4",
        cliente_nombre: "Luis Pérez",
        cliente_email: "luis.perez@fintech.com",
        cliente_avatar: "/images/user/avatar4.jpg",
        titulo: "Seguridad en APIs REST",
        descripcion: "URGENTE: Detecté una vulnerabilidad en mi API. Necesito asesoría inmediata sobre mejores prácticas de seguridad.",
        categoria: "Seguridad",
        prioridad: 'urgente',
        estado: 'pendiente',
        fecha_creacion: "2024-01-15T08:15:00Z",
        especialidad_requerida: "API Security",
        presupuesto_estimado: 1000,
        duracion_estimada_horas: 3,
        comentarios: [],
        archivos_adjuntos: ["api_endpoints.txt", "security_scan.pdf"]
      },
      {
        id: "5",
        cliente_id: "cliente5",
        cliente_nombre: "Sofia Herrera",
        cliente_email: "sofia.herrera@ecommerce.com",
        cliente_avatar: "/images/user/avatar5.jpg",
        titulo: "Optimización de React con TypeScript",
        descripcion: "Mi aplicación React se ha vuelto lenta. Necesito consejos sobre optimización de rendimiento y mejores prácticas.",
        categoria: "Frontend",
        prioridad: 'media',
        estado: 'en_proceso',
        fecha_creacion: "2024-01-14T11:00:00Z",
        fecha_respuesta: "2024-01-14T15:30:00Z",
        tiempo_respuesta_horas: 4.5,
        especialidad_requerida: "React",
        presupuesto_estimado: 400,
        duracion_estimada_horas: 3,
        comentarios: [
          "Hola Sofia, he analizado tu código. El problema principal está en el re-renderizado innecesario..."
        ],
        archivos_adjuntos: ["performance_profile.json"]
      }
    ];
    
    setConsultas(mockConsultas);
  }, []);

  useEffect(() => {
    let filtered = consultas;
    
    if (searchTerm) {
      filtered = filtered.filter(consulta => 
        consulta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consulta.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consulta.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoriaFilter !== "all") {
      filtered = filtered.filter(consulta => consulta.categoria === categoriaFilter);
    }
    
    if (prioridadFilter !== "all") {
      filtered = filtered.filter(consulta => consulta.prioridad === prioridadFilter);
    }
    
    if (estadoFilter !== "all") {
      filtered = filtered.filter(consulta => consulta.estado === estadoFilter);
    }
    
    setFilteredConsultas(filtered);
  }, [consultas, searchTerm, categoriaFilter, prioridadFilter, estadoFilter]);

  const handleResponderConsulta = (consulta: Consulta) => {
    setSelectedConsulta(consulta);
    setShowResponseModal(true);
  };

  const handleEnviarRespuesta = () => {
    if (selectedConsulta && responseText.trim()) {
      // Simular envío de respuesta
      const updatedConsultas = consultas.map(consulta => {
        if (consulta.id === selectedConsulta.id) {
          return {
            ...consulta,
            estado: 'en_proceso' as const,
            fecha_respuesta: new Date().toISOString(),
            tiempo_respuesta_horas: Math.round((new Date().getTime() - new Date(consulta.fecha_creacion).getTime()) / (1000 * 60 * 60) * 10) / 10,
            comentarios: [...consulta.comentarios, responseText]
          };
        }
        return consulta;
      });
      
      setConsultas(updatedConsultas);
      setShowResponseModal(false);
      setResponseText("");
      setSelectedConsulta(null);
    }
  };

  const handleCerrarConsulta = (consultaId: string) => {
    const updatedConsultas = consultas.map(consulta => {
      if (consulta.id === consultaId) {
        return {
          ...consulta,
          estado: 'resuelta' as const,
          fecha_cierre: new Date().toISOString()
        };
      }
      return consulta;
    });
    
    setConsultas(updatedConsultas);
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'error';
      case 'alta': return 'warning';
      case 'media': return 'info';
      case 'baja': return 'success';
      default: return 'light';
    }
  };

  const getPrioridadText = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return prioridad;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'info';
      case 'resuelta': return 'success';
      case 'cancelada': return 'error';
      default: return 'light';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'resuelta': return 'Resuelta';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = {
    total: consultas.length,
    pendientes: consultas.filter(c => c.estado === 'pendiente').length,
    en_proceso: consultas.filter(c => c.estado === 'en_proceso').length,
    resueltas: consultas.filter(c => c.estado === 'resuelta').length,
    urgentes: consultas.filter(c => c.prioridad === 'urgente').length,
    calificacion_promedio: consultas.filter(c => c.calificacion).reduce((acc, c) => acc + (c.calificacion || 0), 0) / consultas.filter(c => c.calificacion).length || 0
  };

  const categorias = Array.from(new Set(consultas.map(c => c.categoria)));

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Gestión de Consultas" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Consultas">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Consultas recibidas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Pendientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.pendientes}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren respuesta
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="En Proceso">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.en_proceso}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En seguimiento
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
        </div>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por título, cliente o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            <select
              value={prioridadFilter}
              onChange={(e) => setPrioridadFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las prioridades</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="resuelta">Resuelta</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de consultas */}
        <div className="space-y-4">
          {filteredConsultas.map((consulta) => (
            <ComponentCard key={consulta.id} title={consulta.titulo}>
              <div className="space-y-4">
                {/* Header de la consulta */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      {consulta.cliente_avatar ? (
                        <img 
                          src={consulta.cliente_avatar} 
                          alt={consulta.cliente_nombre}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                          {consulta.cliente_nombre.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {consulta.cliente_nombre}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {consulta.cliente_email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(consulta.fecha_creacion).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge color={getPrioridadColor(consulta.prioridad)} size="sm">
                        {getPrioridadText(consulta.prioridad)}
                      </Badge>
                      <Badge color={getEstadoColor(consulta.estado)} size="sm">
                        {getEstadoText(consulta.estado)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {consulta.categoria}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {consulta.descripcion}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Especialidad:</span>
                    <p className="font-medium">{consulta.especialidad_requerida}</p>
                  </div>
                  {consulta.presupuesto_estimado && (
                    <div>
                      <span className="text-gray-500">Presupuesto:</span>
                      <p className="font-medium">{formatCurrency(consulta.presupuesto_estimado)}</p>
                    </div>
                  )}
                  {consulta.duracion_estimada_horas && (
                    <div>
                      <span className="text-gray-500">Duración estimada:</span>
                      <p className="font-medium">{consulta.duracion_estimada_horas}h</p>
                    </div>
                  )}
                </div>

                {/* Archivos adjuntos */}
                {consulta.archivos_adjuntos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Archivos adjuntos:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {consulta.archivos_adjuntos.map((archivo, index) => (
                        <Badge key={index} color="light" size="sm">
                          📎 {archivo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comentarios */}
                {consulta.comentarios.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Respuestas:
                    </h4>
                    <div className="space-y-2">
                      {consulta.comentarios.map((comentario, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {comentario}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Métricas */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {consulta.tiempo_respuesta_horas && (
                    <span>Tiempo de respuesta: {consulta.tiempo_respuesta_horas}h</span>
                  )}
                  {consulta.calificacion && (
                    <span>Calificación: {"⭐".repeat(consulta.calificacion)}</span>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {consulta.estado === 'pendiente' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResponderConsulta(consulta)}
                    >
                      Responder
                    </Button>
                  )}
                  
                  {consulta.estado === 'en_proceso' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCerrarConsulta(consulta.id)}
                    >
                      Marcar como Resuelta
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${consulta.cliente_email}?subject=Consulta: ${consulta.titulo}`)}
                  >
                    Contactar por Email
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredConsultas.length === 0 && (
          <ComponentCard title="Sin Consultas">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron consultas. {searchTerm || categoriaFilter !== "all" || prioridadFilter !== "all" || estadoFilter !== "all" ? "Intenta ajustar los filtros." : "No hay consultas pendientes."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal de respuesta */}
      {showResponseModal && selectedConsulta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Responder a: {selectedConsulta.titulo}
            </h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex gap-2 mt-4">
              <Button
                variant="primary"
                onClick={handleEnviarRespuesta}
                disabled={!responseText.trim()}
              >
                Enviar Respuesta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResponseModal(false);
                  setResponseText("");
                  setSelectedConsulta(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EspecialistaConsultasPage; 