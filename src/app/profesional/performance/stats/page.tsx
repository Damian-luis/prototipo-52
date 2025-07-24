"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface PerformanceStats {
  // Métricas generales
  total_earnings: number;
  total_projects: number;
  total_hours: number;
  average_rating: number;
  completion_rate: number;
  
  // Métricas de tiempo
  average_project_duration: number;
  on_time_delivery_rate: number;
  response_time_hours: number;
  
  // Métricas financieras
  hourly_rate_average: number;
  monthly_earnings: number[];
  earnings_growth: number;
  
  // Métricas de calidad
  client_satisfaction: number;
  repeat_client_rate: number;
  dispute_rate: number;
  
  // Métricas de actividad
  active_projects: number;
  proposals_sent: number;
  proposal_acceptance_rate: number;
  
  // Tendencias
  monthly_projects: number[];
  monthly_ratings: number[];
  skill_ratings: {
    [key: string]: number;
  };
}

const FreelancerPerformanceStatsPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular datos de estadísticas de performance
    const mockStats: PerformanceStats = {
      total_earnings: 45000,
      total_projects: 28,
      total_hours: 1200,
      average_rating: 4.7,
      completion_rate: 96.4,
      
      average_project_duration: 18,
      on_time_delivery_rate: 94.2,
      response_time_hours: 2.3,
      
      hourly_rate_average: 45,
      monthly_earnings: [3200, 3800, 4200, 3900, 4500, 4800],
      earnings_growth: 15.2,
      
      client_satisfaction: 4.8,
      repeat_client_rate: 78.5,
      dispute_rate: 2.1,
      
      active_projects: 3,
      proposals_sent: 45,
      proposal_acceptance_rate: 62.2,
      
      monthly_projects: [4, 5, 6, 4, 7, 5],
      monthly_ratings: [4.5, 4.6, 4.7, 4.8, 4.7, 4.9],
      skill_ratings: {
        "React": 4.8,
        "Node.js": 4.6,
        "AWS": 4.9,
        "MongoDB": 4.5,
        "Docker": 4.7,
        "TypeScript": 4.4
      }
    };
    
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'success';
    if (growth < 0) return 'error';
    return 'light';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '➡️';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 4.0) return 'warning';
    return 'error';
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

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

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Estadísticas de Performance" />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Estadísticas de Performance" />
        <div className="text-center py-12">
          <p className="text-gray-500">No se pudieron cargar las estadísticas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Estadísticas de Performance" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Filtros de tiempo */}
        <ComponentCard title="Período de Análisis">
          <div className="flex flex-wrap gap-2">
            {[
              { value: "1m", label: "1 Mes" },
              { value: "3m", label: "3 Meses" },
              { value: "6m", label: "6 Meses" },
              { value: "1y", label: "1 Año" },
              { value: "all", label: "Todo el tiempo" }
            ].map((period) => (
              <Button
                key={period.value}
                variant={timeRange === period.value ? "primary" : "outline"}
                size="sm"
                onClick={() => setTimeRange(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </ComponentCard>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Ingresos Totales">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {formatCurrency(stats.total_earnings)}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-lg">{getGrowthIcon(stats.earnings_growth)}</span>
                <Badge color={getGrowthColor(stats.earnings_growth)} size="sm">
                  {stats.earnings_growth > 0 ? '+' : ''}{stats.earnings_growth.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Crecimiento vs período anterior
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Proyectos Completados">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total_projects}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {stats.active_projects} proyectos activos
              </p>
              <div className="mt-2">
                <Badge color="success" size="sm">
                  {formatPercentage(stats.completion_rate)} tasa de finalización
                </Badge>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Calificación Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.average_rating.toFixed(1)}
              </p>
              <p className="text-lg text-warning-600 dark:text-warning-400 mt-1">
                {getRatingStars(stats.average_rating)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Basado en {stats.total_projects} evaluaciones
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Horas Trabajadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-info-600 dark:text-info-400">
                {stats.total_hours.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formatCurrency(stats.hourly_rate_average)}/hora promedio
              </p>
              <div className="mt-2">
                <Badge color="info" size="sm">
                  {stats.average_project_duration} días/proyecto
                </Badge>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Métricas de calidad y satisfacción */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard title="Satisfacción del Cliente">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.client_satisfaction.toFixed(1)}
              </p>
              <p className="text-lg text-warning-600 dark:text-warning-400 mt-1">
                {getRatingStars(stats.client_satisfaction)}
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Clientes recurrentes:</span>
                  <span className="font-medium">{formatPercentage(stats.repeat_client_rate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tasa de disputas:</span>
                  <span className="font-medium text-red-600">{formatPercentage(stats.dispute_rate)}</span>
                </div>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Puntualidad y Respuesta">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {formatPercentage(stats.on_time_delivery_rate)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Entregas a tiempo
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tiempo de respuesta:</span>
                  <span className="font-medium">{stats.response_time_hours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Duración promedio:</span>
                  <span className="font-medium">{stats.average_project_duration} días</span>
                </div>
              </div>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Aceptación de Propuestas">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {formatPercentage(stats.proposal_acceptance_rate)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Tasa de aceptación
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Propuestas enviadas:</span>
                  <span className="font-medium">{stats.proposals_sent}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Proyectos activos:</span>
                  <span className="font-medium">{stats.active_projects}</span>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Calificaciones por habilidad */}
        <ComponentCard title="Calificaciones por Habilidad">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.skill_ratings).map(([skill, rating]) => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{skill}</p>
                  <p className="text-sm text-gray-500">{getRatingStars(rating)}</p>
                </div>
                <Badge color={getRatingColor(rating)}>
                  {rating.toFixed(1)}
                </Badge>
              </div>
            ))}
          </div>
        </ComponentCard>

        {/* Tendencias mensuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentCard title="Ingresos Mensuales">
            <div className="space-y-3">
              {stats.monthly_earnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Mes {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-primary-600 rounded h-4"
                      style={{ width: `${(earning / Math.max(...stats.monthly_earnings)) * 200}px` }}
                    ></div>
                    <span className="text-sm font-medium">
                      {formatCurrency(earning)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
          
          <ComponentCard title="Proyectos por Mes">
            <div className="space-y-3">
              {stats.monthly_projects.map((projects, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Mes {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-success-600 rounded h-4"
                      style={{ width: `${(projects / Math.max(...stats.monthly_projects)) * 200}px` }}
                    ></div>
                    <span className="text-sm font-medium">
                      {projects} proyectos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>

        {/* Comparación con el mercado */}
        <ComponentCard title="Comparación con el Mercado">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tu Tarifa Promedio</h4>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(stats.hourly_rate_average)}/h
              </p>
              <p className="text-sm text-gray-500 mt-1">Promedio del mercado: $35/h</p>
              <Badge color="success" className="mt-2">
                +28.6% sobre el promedio
              </Badge>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tu Calificación</h4>
              <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                {stats.average_rating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Promedio del mercado: 4.2</p>
              <Badge color="success" className="mt-2">
                +11.9% sobre el promedio
              </Badge>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Tasa de Finalización</h4>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {formatPercentage(stats.completion_rate)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Promedio del mercado: 89%</p>
              <Badge color="success" className="mt-2">
                +8.3% sobre el promedio
              </Badge>
            </div>
          </div>
        </ComponentCard>

        {/* Recomendaciones */}
        <ComponentCard title="Recomendaciones para Mejorar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Fortalezas</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Excelente calificación promedio (4.7/5)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Alta tasa de finalización (96.4%)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Tarifa por hora superior al mercado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✅</span>
                  Buena tasa de clientes recurrentes (78.5%)
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Áreas de Mejora</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Reducir tiempo de respuesta (actual: 2.3h)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Mejorar calificación en TypeScript (4.4/5)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Aumentar tasa de aceptación de propuestas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  Considerar certificaciones adicionales
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
              onClick={() => window.location.href = '/profesional/performance/certifications'}
              className="w-full sm:w-auto"
            >
              Ver Certificaciones
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/performance/evaluations'}
              className="w-full sm:w-auto"
            >
              Ver Evaluaciones
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/jobs/search'}
              className="w-full sm:w-auto"
            >
              Buscar Nuevos Proyectos
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default FreelancerPerformanceStatsPage; 