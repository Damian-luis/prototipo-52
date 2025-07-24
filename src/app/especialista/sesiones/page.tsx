"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Sesion {
  id: string;
  cliente_nombre: string;
  cliente_email: string;
  titulo: string;
  descripcion: string;
  tipo: 'consulta' | 'mentoria' | 'revision' | 'workshop';
  estado: 'programada' | 'en_curso' | 'completada' | 'cancelada';
  fecha_inicio: string;
  fecha_fin: string;
  duracion_minutos: number;
  plataforma: 'zoom' | 'teams' | 'meet';
  link_reunion?: string;
  precio: number;
  especialidad: string;
  calificacion?: number;
}

const EspecialistaSesionesPage = () => {
  const { user } = useAuth();
  const [sesiones, setSesiones] = useState<Sesion[]>([]);
  const [filteredSesiones, setFilteredSesiones] = useState<Sesion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [estadoFilter, setEstadoFilter] = useState<string>("all");

  useEffect(() => {
    const mockSesiones: Sesion[] = [
      {
        id: "1",
        cliente_nombre: "María González",
        cliente_email: "maria.gonzalez@empresa.com",
        titulo: "Revisión de Arquitectura de Microservicios",
        descripcion: "Sesión para revisar la arquitectura actual y proponer mejoras.",
        tipo: 'revision',
        estado: 'programada',
        fecha_inicio: "2024-01-20T10:00:00Z",
        fecha_fin: "2024-01-20T11:30:00Z",
        duracion_minutos: 90,
        plataforma: 'zoom',
        link_reunion: "https://zoom.us/j/123456789",
        precio: 150,
        especialidad: "Arquitectura"
      },
      {
        id: "2",
        cliente_nombre: "Carlos Rodríguez",
        cliente_email: "carlos.rodriguez@startup.com",
        titulo: "Mentoría: Optimización de React",
        descripcion: "Sesión de mentoría para optimizar el rendimiento de React.",
        tipo: 'mentoria',
        estado: 'en_curso',
        fecha_inicio: "2024-01-19T14:00:00Z",
        fecha_fin: "2024-01-19T15:00:00Z",
        duracion_minutos: 60,
        plataforma: 'teams',
        precio: 120,
        especialidad: "Frontend"
      },
      {
        id: "3",
        cliente_nombre: "Ana Martínez",
        cliente_email: "ana.martinez@consultora.com",
        titulo: "Workshop: CI/CD con GitHub Actions",
        descripcion: "Workshop práctico para implementar pipelines de CI/CD.",
        tipo: 'workshop',
        estado: 'completada',
        fecha_inicio: "2024-01-18T09:00:00Z",
        fecha_fin: "2024-01-18T12:00:00Z",
        duracion_minutos: 180,
        plataforma: 'meet',
        precio: 200,
        especialidad: "DevOps",
        calificacion: 5
      }
    ];
    
    setSesiones(mockSesiones);
  }, []);

  useEffect(() => {
    let filtered = sesiones;
    
    if (searchTerm) {
      filtered = filtered.filter(sesion => 
        sesion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sesion.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (tipoFilter !== "all") {
      filtered = filtered.filter(sesion => sesion.tipo === tipoFilter);
    }
    
    if (estadoFilter !== "all") {
      filtered = filtered.filter(sesion => sesion.estado === estadoFilter);
    }
    
    setFilteredSesiones(filtered);
  }, [sesiones, searchTerm, tipoFilter, estadoFilter]);

  const handleIniciarSesion = (sesionId: string) => {
    const updatedSesiones = sesiones.map(sesion => {
      if (sesion.id === sesionId) {
        return { ...sesion, estado: 'en_curso' as const };
      }
      return sesion;
    });
    setSesiones(updatedSesiones);
  };

  const handleCompletarSesion = (sesionId: string) => {
    const updatedSesiones = sesiones.map(sesion => {
      if (sesion.id === sesionId) {
        return { ...sesion, estado: 'completada' as const };
      }
      return sesion;
    });
    setSesiones(updatedSesiones);
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'consulta': return 'info';
      case 'mentoria': return 'primary';
      case 'revision': return 'warning';
      case 'workshop': return 'success';
      default: return 'light';
    }
  };

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'consulta': return 'Consulta';
      case 'mentoria': return 'Mentoría';
      case 'revision': return 'Revisión';
      case 'workshop': return 'Workshop';
      default: return tipo;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programada': return 'info';
      case 'en_curso': return 'warning';
      case 'completada': return 'success';
      case 'cancelada': return 'error';
      default: return 'light';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'programada': return 'Programada';
      case 'en_curso': return 'En Curso';
      case 'completada': return 'Completada';
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
    total: sesiones.length,
    programadas: sesiones.filter(s => s.estado === 'programada').length,
    en_curso: sesiones.filter(s => s.estado === 'en_curso').length,
    completadas: sesiones.filter(s => s.estado === 'completada').length,
    ingresos_totales: sesiones.reduce((acc, s) => acc + s.precio, 0)
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Sesiones Programadas" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Sesiones">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sesiones programadas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Programadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.programadas}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pendientes
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="En Curso">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.en_curso}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Activas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Ingresos Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(stats.ingresos_totales)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ingresos generados
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por título o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los tipos</option>
              <option value="consulta">Consulta</option>
              <option value="mentoria">Mentoría</option>
              <option value="revision">Revisión</option>
              <option value="workshop">Workshop</option>
            </select>
            <select
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="programada">Programada</option>
              <option value="en_curso">En Curso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de sesiones */}
        <div className="space-y-4">
          {filteredSesiones.map((sesion) => (
            <ComponentCard key={sesion.id} title={sesion.titulo}>
              <div className="space-y-4">
                {/* Header de la sesión */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {sesion.cliente_nombre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {sesion.cliente_email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDateTime(sesion.fecha_inicio)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge color={getTipoColor(sesion.tipo)} size="sm">
                        {getTipoText(sesion.tipo)}
                      </Badge>
                      <Badge color={getEstadoColor(sesion.estado)} size="sm">
                        {getEstadoText(sesion.estado)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {sesion.duracion_minutos} min • {formatCurrency(sesion.precio)}
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {sesion.descripcion}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Plataforma:</span>
                    <p className="font-medium capitalize">{sesion.plataforma}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Especialidad:</span>
                    <p className="font-medium">{sesion.especialidad}</p>
                  </div>
                  {sesion.calificacion && (
                    <div>
                      <span className="text-gray-500">Calificación:</span>
                      <p className="font-medium">{"⭐".repeat(sesion.calificacion)}</p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {sesion.estado === 'programada' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleIniciarSesion(sesion.id)}
                    >
                      Iniciar Sesión
                    </Button>
                  )}
                  
                  {sesion.estado === 'en_curso' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCompletarSesion(sesion.id)}
                    >
                      Completar Sesión
                    </Button>
                  )}
                  
                  {sesion.link_reunion && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(sesion.link_reunion, '_blank')}
                    >
                      Unirse
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`mailto:${sesion.cliente_email}?subject=Sesión: ${sesion.titulo}`)}
                  >
                    Contactar
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredSesiones.length === 0 && (
          <ComponentCard title="Sin Sesiones">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron sesiones. {searchTerm || tipoFilter !== "all" || estadoFilter !== "all" ? "Intenta ajustar los filtros." : "No hay sesiones programadas."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default EspecialistaSesionesPage; 