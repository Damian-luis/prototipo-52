"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { consultationsService } from '@/services/consultations.service';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  Star,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  totalConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  averageRating: number;
  totalEarnings: number;
  activeConsultations: number;
}

export default function EspecialistaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    pendingConsultations: 0,
    completedConsultations: 0,
    averageRating: 0,
    totalEarnings: 0,
    activeConsultations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  const [pendingConsultations, setPendingConsultations] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de consultas
        const consultationStats = await consultationsService.getSpecialistStats();
        
        // Cargar consultas recientes
        const consultations = await consultationsService.getConsultationsBySpecialist();
        setRecentConsultations(consultations.slice(0, 5));
        
        // Cargar consultas pendientes
        const pending = await consultationsService.getPendingConsultations();
        setPendingConsultations(pending.slice(0, 5));

        // Combinar estadísticas
        setStats({
          totalConsultations: consultationStats?.totalConsultations || 0,
          pendingConsultations: consultationStats?.pendingConsultations || 0,
          completedConsultations: consultationStats?.completedConsultations || 0,
          averageRating: consultationStats?.averageRating || 4.8,
          totalEarnings: consultationStats?.totalEarnings || 0,
          activeConsultations: consultationStats?.activeConsultations || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Especialista</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user?.name}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MessageCircle className="w-4 h-4 mr-2" />
          Ver Consultas Pendientes
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Consultas</h3>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.totalConsultations}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Consultas Pendientes</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.pendingConsultations}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Calificación Promedio</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageRating >= 4.5 ? 'Excelente' : stats.averageRating >= 4.0 ? 'Muy bueno' : 'Bueno'}
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Ganancias Totales</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Consultations */}
        <Card>
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Consultas Pendientes</h3>
          </div>
          <div className="space-y-4">
            {pendingConsultations.map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{consultation.title}</h4>
                  <p className="text-sm text-gray-600">{consultation.professionalName}</p>
                  <p className="text-xs text-gray-500">{consultation.type}</p>
                </div>
                <Badge color="warning">
                  PENDIENTE
                </Badge>
              </div>
            ))}
            {pendingConsultations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay consultas pendientes
              </div>
            )}
          </div>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Consultas Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentConsultations.map((consultation) => (
              <div key={consultation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{consultation.title}</h4>
                  <p className="text-sm text-gray-600">{consultation.professionalName}</p>
                  <p className="text-xs text-gray-500">{consultation.type}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge color={consultation.status === 'COMPLETED' ? 'success' : consultation.status === 'IN_PROGRESS' ? 'warning' : 'light'}>
                    {consultation.status}
                  </Badge>
                  {consultation.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs">{consultation.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col">
            <Clock className="w-6 h-6 mb-2" />
            Ver Pendientes
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Calendar className="w-6 h-6 mb-2" />
            Programar Consulta
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <MessageCircle className="w-6 h-6 mb-2" />
            Historial
          </Button>
        </div>
      </Card>
    </div>
  );
} 