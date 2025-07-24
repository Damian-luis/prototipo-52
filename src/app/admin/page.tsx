"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/users.service';
import { jobsService } from '@/services/jobs.service';
import { contractsService } from '@/services/contracts.service';
import { paymentsService } from '@/services/payments.service';
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
  AlertCircle,
  BarChart3,
  Settings
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeJobs: number;
  totalContracts: number;
  totalRevenue: number;
  pendingApplications: number;
  activeConsultations: number;
  newUsersThisMonth: number;
  totalPayments: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeJobs: 0,
    totalContracts: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    activeConsultations: 0,
    newUsersThisMonth: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar todos los usuarios
        const users = await usersService.getAllUsers();
        setRecentUsers(users.slice(0, 5));
        
        // Cargar todos los trabajos
        const jobs = await jobsService.getAllJobs();
        setRecentJobs(jobs.slice(0, 5));
        
        // Cargar todos los pagos
        const payments = await paymentsService.getAllPayments();
        setRecentPayments(payments.slice(0, 5));

        // Calcular estadísticas
        const activeJobs = jobs.filter(job => job.status === 'ACTIVE').length;
        const totalRevenue = payments
          .filter(payment => payment.status === 'COMPLETED')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        const newUsersThisMonth = users.filter(user => {
          const userDate = new Date(user.created_at);
          const now = new Date();
          return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length;

        setStats({
          totalUsers: users.length,
          activeJobs,
          totalContracts: 0, // Se calcularía con el servicio de contratos
          totalRevenue,
          pendingApplications: 0, // Se calcularía con el servicio de aplicaciones
          activeConsultations: 0, // Se calcularía con el servicio de consultas
          newUsersThisMonth,
          totalPayments: payments.length,
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administrador</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user?.name}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="w-4 h-4 mr-2" />
          Configuración del Sistema
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Usuarios</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersThisMonth} este mes
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Trabajos Activos</h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              +5% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Ingresos Totales</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pagos Procesados</h3>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card>
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Usuarios Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <Badge color={user.is_active ? 'success' : 'error'}>
                  {user.is_active ? 'ACTIVO' : 'INACTIVO'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

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
                  <p className="text-sm text-gray-600">{job.companyName}</p>
                  <p className="text-xs text-gray-500">${job.budget.min} - ${job.budget.max}</p>
                </div>
                <Badge color={job.status === 'ACTIVE' ? 'success' : 'light'}>
                  {job.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Pagos Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">${payment.amount}</h4>
                  <p className="text-sm text-gray-600">{payment.description}</p>
                  <p className="text-xs text-gray-500">{payment.professionalName}</p>
                </div>
                <Badge color={payment.status === 'COMPLETED' ? 'success' : payment.status === 'PENDING' ? 'warning' : 'error'}>
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Acciones de Administración</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col">
            <Users className="w-6 h-6 mb-2" />
            Gestionar Usuarios
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Briefcase className="w-6 h-6 mb-2" />
            Ver Trabajos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <DollarSign className="w-6 h-6 mb-2" />
            Reportes Financieros
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <BarChart3 className="w-6 h-6 mb-2" />
            Estadísticas
          </Button>
        </div>
      </Card>
    </div>
  );
}
