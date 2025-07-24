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
  AlertCircle,
  Star
} from 'lucide-react';

interface DashboardStats {
  totalApplications: number;
  activeContracts: number;
  totalEarnings: number;
  completedProjects: number;
  averageRating: number;
  pendingPayments: number;
}

export default function ProfesionalDashboard() {
  const { user } = useAuth();
  const { getProfessionalContractStats, getContractsByProfessional } = useContract();
  const { getProfessionalPaymentStats, getPaymentsByProfessional } = usePayment();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    activeContracts: 0,
    totalEarnings: 0,
    completedProjects: 0,
    averageRating: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [recentContracts, setRecentContracts] = useState<any[]>([]);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Cargar estadísticas de aplicaciones
        const applicationStats = await applicationsService.getApplicationStats();
        
        // Cargar estadísticas de contratos
        const contractStats = await getProfessionalContractStats();
        
        // Cargar estadísticas de pagos
        const paymentStats = await getProfessionalPaymentStats();
        
        // Cargar aplicaciones recientes
        const applications = await applicationsService.getApplicationsByProfessional();
        setRecentApplications(applications.slice(0, 5));
        
        // Cargar contratos recientes
        const contracts = await getContractsByProfessional();
        setRecentContracts(contracts.slice(0, 5));
        
        // Cargar pagos recientes
        const payments = await getPaymentsByProfessional();
        setRecentPayments(payments.slice(0, 5));

        // Combinar estadísticas
        setStats({
          totalApplications: applicationStats?.totalApplications || 0,
          activeContracts: contractStats?.activeContracts || 0,
          totalEarnings: paymentStats?.totalEarnings || 0,
          completedProjects: contractStats?.completedContracts || 0,
          averageRating: 4.5, // Valor por defecto ya que no está en el tipo User
          pendingPayments: paymentStats?.pendingPayments || 0,
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
  }, [user, getProfessionalContractStats, getProfessionalPaymentStats, getContractsByProfessional, getPaymentsByProfessional]);

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Profesional</h1>
          <p className="text-gray-600">Bienvenido de vuelta, {user?.name}</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Briefcase className="w-4 h-4 mr-2" />
          Buscar Trabajos
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Aplicaciones</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
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
              +3% desde el mes pasado
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Ganancias Totales</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
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
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <Card>
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Aplicaciones Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{application.jobTitle}</h4>
                  <p className="text-sm text-gray-600">${application.proposedRate}/hora</p>
                </div>
                <Badge color={application.status === 'PENDING' ? 'warning' : application.status === 'ACCEPTED' ? 'success' : 'error'}>
                  {application.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Contracts */}
        <Card>
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Contratos Recientes</h3>
          </div>
          <div className="space-y-4">
            {recentContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{contract.title}</h4>
                  <p className="text-sm text-gray-600">${contract.value}</p>
                </div>
                <Badge color={contract.status === 'ACTIVE' ? 'success' : 'light'}>
                  {contract.status}
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
                  <h4 className="font-medium">{payment.description}</h4>
                  <p className="text-sm text-gray-600">${payment.amount}</p>
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
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col">
            <Briefcase className="w-6 h-6 mb-2" />
            Buscar Trabajos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <FileText className="w-6 h-6 mb-2" />
            Ver Contratos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <DollarSign className="w-6 h-6 mb-2" />
            Ver Pagos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Users className="w-6 h-6 mb-2" />
            Solicitar Asesoría
          </Button>
        </div>
      </Card>
    </div>
  );
} 