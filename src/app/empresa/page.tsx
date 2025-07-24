"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useContract } from '@/context/ContractContext';
import { usePayment } from '@/context/PaymentContext';
import { jobsService } from '@/services/jobs.service';
import { applicationsService } from '@/services/applications.service';
import { consultationsService } from '@/services/consultations.service';
import Card from '@/components/ui/card/Card';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  activeContracts: number;
  totalPayments: number;
  pendingApplications: number;
  completedProjects: number;
  totalRevenue: number;
}

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const { getContractStats } = useContract();
  const { getPaymentStats } = usePayment();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeContracts: 0,
    totalPayments: 0,
    pendingApplications: 0,
    completedProjects: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de trabajos
        const jobStats = await jobsService.getJobStats();
        
        // Cargar estadísticas de contratos
        const contractStats = await getContractStats();
        
        // Cargar estadísticas de pagos
        const paymentStats = await getPaymentStats();
        
        // Cargar trabajos recientes
        const jobs = await jobsService.getJobsByCompany();
        setRecentJobs(jobs.slice(0, 5));
        
        // Cargar aplicaciones recientes (para todos los trabajos de la empresa)
        const allApplications = await applicationsService.getAllApplications();
        const companyApplications = allApplications.filter(app => 
          jobs.some(job => job.id === app.jobId)
        );
        setRecentApplications(companyApplications.slice(0, 5));

        // Combinar estadísticas
        setStats({
          totalProjects: jobStats?.totalJobs || 0,
          activeContracts: contractStats?.activeContracts || 0,
          totalPayments: paymentStats?.totalPayments || 0,
          pendingApplications: companyApplications.filter(app => app.status === 'PENDING').length,
          completedProjects: contractStats?.completedContracts || 0,
          totalRevenue: paymentStats?.totalRevenue || 0,
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
  }, [user, getContractStats, getPaymentStats]);

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Empresa</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user?.name}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Briefcase className="w-4 h-4 mr-2" />
          Crear Nuevo Proyecto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Proyectos</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Contratos Activos</h3>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.activeContracts}</div>
            <p className="text-xs text-muted-foreground">
              +5% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pagos Procesados</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">${stats.totalPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Aplicaciones Pendientes</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Requieren revisión
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <div className="flex items-center mb-4">
            <Briefcase className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Trabajos Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{job.title}</h4>
                  <p className="text-sm text-gray-600">${job.budget.min} - ${job.budget.max}</p>
                </div>
                <Badge color={job.status === 'ACTIVE' ? 'success' : 'light'}>
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Applications */}
        <Card>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Aplicaciones Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{application.professionalName}</h4>
                  <p className="text-sm text-gray-600">{application.jobTitle}</p>
                </div>
                <Badge color={application.status === 'PENDING' ? 'error' : 'success'}>
                  {application.status}
                </Badge>
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
            <Briefcase className="w-6 h-6 mb-2" />
            Crear Trabajo
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <FileText className="w-6 h-6 mb-2" />
            Ver Contratos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <DollarSign className="w-6 h-6 mb-2" />
            Gestionar Pagos
          </Button>
        </div>
      </Card>
    </div>
  );
} 