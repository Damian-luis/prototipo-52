"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface ReporteAsesoria {
  id: string;
  periodo: string;
  total_consultas: number;
  total_sesiones: number;
  total_evaluaciones: number;
  consultas_resueltas: number;
  sesiones_completadas: number;
  evaluaciones_completadas: number;
  calificacion_promedio: number;
  tiempo_respuesta_promedio_horas: number;
  ingresos_totales: number;
  especialidades_mas_solicitadas: {
    especialidad: string;
    cantidad: number;
    porcentaje: number;
  }[];
  clientes_mas_activos: {
    cliente: string;
    consultas: number;
    sesiones: number;
  }[];
  tendencias_mensuales: {
    mes: string;
    consultas: number;
    sesiones: number;
    evaluaciones: number;
    ingresos: number;
  }[];
  metricas_rendimiento: {
    tasa_resolucion: number;
    satisfaccion_cliente: number;
    eficiencia_tiempo: number;
    retencion_clientes: number;
  };
}

const EspecialistaReportesPage = () => {
  const { user } = useAuth();
  const [reporte, setReporte] = useState<ReporteAsesoria | null>(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("mes_actual");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de reporte
    const mockReporte: ReporteAsesoria = {
      id: "1",
      periodo: "Enero 2024",
      total_consultas: 45,
      total_sesiones: 28,
      total_evaluaciones: 15,
      consultas_resueltas: 42,
      sesiones_completadas: 25,
      evaluaciones_completadas: 12,
      calificacion_promedio: 4.7,
      tiempo_respuesta_promedio_horas: 3.2,
      ingresos_totales: 8500,
      especialidades_mas_solicitadas: [
        { especialidad: "Frontend Development", cantidad: 12, porcentaje: 26.7 },
        { especialidad: "Backend Development", cantidad: 10, porcentaje: 22.2 },
        { especialidad: "DevOps", cantidad: 8, porcentaje: 17.8 },
        { especialidad: "Mobile Development", cantidad: 7, porcentaje: 15.6 },
        { especialidad: "UI/UX Design", cantidad: 5, porcentaje: 11.1 },
        { especialidad: "Data Science", cantidad: 3, porcentaje: 6.7 }
      ],
      clientes_mas_activos: [
        { cliente: "TechCorp Solutions", consultas: 8, sesiones: 5 },
        { cliente: "StartupXYZ", consultas: 6, sesiones: 4 },
        { cliente: "Digital Innovations", consultas: 5, sesiones: 3 },
        { cliente: "Cloud Systems Inc", consultas: 4, sesiones: 2 },
        { cliente: "Mobile Apps Co", consultas: 3, sesiones: 2 }
      ],
      tendencias_mensuales: [
        { mes: "Enero", consultas: 45, sesiones: 28, evaluaciones: 15, ingresos: 8500 },
        { mes: "Diciembre", consultas: 38, sesiones: 22, evaluaciones: 12, ingresos: 7200 },
        { mes: "Noviembre", consultas: 42, sesiones: 25, evaluaciones: 14, ingresos: 7800 },
        { mes: "Octubre", consultas: 35, sesiones: 20, evaluaciones: 10, ingresos: 6500 },
        { mes: "Septiembre", consultas: 40, sesiones: 24, evaluaciones: 13, ingresos: 7500 },
        { mes: "Agosto", consultas: 32, sesiones: 18, evaluaciones: 9, ingresos: 6000 }
      ],
      metricas_rendimiento: {
        tasa_resolucion: 93.3,
        satisfaccion_cliente: 4.7,
        eficiencia_tiempo: 89.2,
        retencion_clientes: 78.5
      }
    };
    
    setReporte(mockReporte);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (current: number, previous: number) => {
    if (current > previous) return 'success';
    if (current < previous) return 'error';
    return 'light';
  };

  const getGrowthIcon = (current: number, previous: number) => {
    if (current > previous) return '📈';
    if (current < previous) return '📉';
    return '➡️';
  };

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.8) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Reportes de Asesoría" />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Reportes de Asesoría" />
        <div className="text-center py-12">
          <p className="text-gray-500">No se pudieron cargar los reportes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Reportes de Asesoría" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Filtros de período */}
        <ComponentCard title="Período de Análisis">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "mes_actual", label: "Mes Actual" },
              { value: "trimestre", label: "Último Trimestre" },
              { value: "semestre", label: "Último Semestre" },
              { value: "anio", label: "Último Año" },
              { value: "personalizado", label: "Personalizado" }
            ].map((periodo) => (
              <Button
                key={periodo.value}
                variant={periodoSeleccionado === periodo.value ? "primary" : "outline"}
                size="sm"
                onClick={() => setPeriodoSeleccionado(periodo.value)}
              >
                {periodo.label}
              </Button>
            ))}
          </div>
        </ComponentCard>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Consultas">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {reporte.total_consultas}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-lg">{getGrowthIcon(reporte.total_consultas, 38)}</span>
                <Badge color={getGrowthColor(reporte.total_consultas, 38)} size="sm">
                  +18.4%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {reporte.consultas_resueltas} resueltas ({formatPercentage(reporte.consultas_resueltas / reporte.total_consultas * 100)})
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Sesiones Realizadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {reporte.total_sesiones}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-lg">{getGrowthIcon(reporte.total_sesiones, 22)}</span>
                <Badge color={getGrowthColor(reporte.total_sesiones, 22)} size="sm">
                  +27.3%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {reporte.sesiones_completadas} completadas ({formatPercentage(reporte.sesiones_completadas / reporte.total_sesiones * 100)})
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Evaluaciones Completadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {reporte.total_evaluaciones}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-lg">{getGrowthIcon(reporte.total_evaluaciones, 12)}</span>
                <Badge color={getGrowthColor(reporte.total_evaluaciones, 12)} size="sm">
                  +25.0%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {reporte.evaluaciones_completadas} completadas ({formatPercentage(reporte.evaluaciones_completadas / reporte.total_evaluaciones * 100)})
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Ingresos Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {formatCurrency(reporte.ingresos_totales)}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-lg">{getGrowthIcon(reporte.ingresos_totales, 7200)}</span>
                <Badge color={getGrowthColor(reporte.ingresos_totales, 7200)} size="sm">
                  +18.1%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Promedio: {formatCurrency(reporte.ingresos_totales / (reporte.total_consultas + reporte.total_sesiones + reporte.total_evaluaciones))}/servicio
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Métricas de rendimiento */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Tasa de Resolución">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {formatPercentage(reporte.metricas_rendimiento.tasa_resolucion)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Consultas resueltas exitosamente
              </p>
              <Badge color={getMetricColor(reporte.metricas_rendimiento.tasa_resolucion, 90)} className="mt-2">
                {reporte.metricas_rendimiento.tasa_resolucion >= 90 ? 'Excelente' : 'Buena'}
              </Badge>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Satisfacción del Cliente">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {reporte.metricas_rendimiento.satisfaccion_cliente.toFixed(1)}
              </p>
              <p className="text-lg text-warning-600 dark:text-warning-400 mt-1">
                {"⭐".repeat(Math.floor(reporte.metricas_rendimiento.satisfaccion_cliente))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Calificación promedio
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Eficiencia de Tiempo">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {formatPercentage(reporte.metricas_rendimiento.eficiencia_tiempo)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Tiempo promedio: {reporte.tiempo_respuesta_promedio_horas}h
              </p>
              <Badge color={getMetricColor(reporte.metricas_rendimiento.eficiencia_tiempo, 85)} className="mt-2">
                {reporte.metricas_rendimiento.eficiencia_tiempo >= 85 ? 'Óptimo' : 'Mejorable'}
              </Badge>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Retención de Clientes">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(reporte.metricas_rendimiento.retencion_clientes)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Clientes que regresan
              </p>
              <Badge color={getMetricColor(reporte.metricas_rendimiento.retencion_clientes, 75)} className="mt-2">
                {reporte.metricas_rendimiento.retencion_clientes >= 75 ? 'Alta' : 'Media'}
              </Badge>
            </div>
          </ComponentCard>
        </div>

        {/* Especialidades más solicitadas */}
        <ComponentCard title="Especialidades Más Solicitadas">
          <div className="space-y-4">
            {reporte.especialidades_mas_solicitadas.map((especialidad, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {especialidad.especialidad}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-primary-600 rounded h-3"
                      style={{ width: `${(especialidad.cantidad / Math.max(...reporte.especialidades_mas_solicitadas.map(e => e.cantidad))) * 200}px` }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {especialidad.cantidad}
                    </span>
                  </div>
                  <Badge color="light" size="sm">
                    {formatPercentage(especialidad.porcentaje)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Clientes más activos */}
        <ComponentCard title="Clientes Más Activos">
          <div className="space-y-4">
            {reporte.clientes_mas_activos.map((cliente, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}.
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {cliente.cliente}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {cliente.consultas}
                    </p>
                    <p className="text-xs text-gray-500">Consultas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {cliente.sesiones}
                    </p>
                    <p className="text-xs text-gray-500">Sesiones</p>
                  </div>
                  <Badge color="primary" size="sm">
                    Total: {cliente.consultas + cliente.sesiones}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Tendencias mensuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentCard title="Tendencias de Actividad">
            <div className="space-y-3">
              {reporte.tendencias_mensuales.slice(-6).map((tendencia, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tendencia.mes}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Consultas</p>
                      <p className="text-sm font-medium">{tendencia.consultas}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Sesiones</p>
                      <p className="text-sm font-medium">{tendencia.sesiones}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Evaluaciones</p>
                      <p className="text-sm font-medium">{tendencia.evaluaciones}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
          
          <ComponentCard title="Tendencias de Ingresos">
            <div className="space-y-3">
              {reporte.tendencias_mensuales.slice(-6).map((tendencia, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {tendencia.mes}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-success-600 rounded h-4"
                      style={{ width: `${(tendencia.ingresos / Math.max(...reporte.tendencias_mensuales.map(t => t.ingresos))) * 200}px` }}
                    ></div>
                    <span className="text-sm font-medium">
                      {formatCurrency(tendencia.ingresos)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Análisis y recomendaciones */}
        <ComponentCard title="Análisis y Recomendaciones">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Fortalezas</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Alta tasa de resolución (93.3%)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Excelente satisfacción del cliente (4.7/5)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Crecimiento sostenido en ingresos (+18.1%)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Buena retención de clientes (78.5%)
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Áreas de Mejora</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Reducir tiempo de respuesta (actual: 3.2h)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Aumentar tasa de finalización de evaluaciones
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Diversificar especialidades menos solicitadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Mejorar eficiencia en sesiones de mentoría
                </li>
              </ul>
            </div>
          </div>
        </ComponentCard>

        {/* Acciones */}
        <ComponentCard title="Acciones Rápidas">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={() => window.location.href = '/especialista/consultas'}
              className="w-full sm:w-auto"
            >
              Ver Consultas
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/especialista/sesiones'}
              className="w-full sm:w-auto"
            >
              Ver Sesiones
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/especialista/evaluaciones'}
              className="w-full sm:w-auto"
            >
              Ver Evaluaciones
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Simular exportación de reporte
                console.log('Exportando reporte...');
              }}
              className="w-full sm:w-auto"
            >
              Exportar Reporte
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default EspecialistaReportesPage; 