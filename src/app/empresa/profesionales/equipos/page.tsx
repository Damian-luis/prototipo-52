"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
  skills: string[];
  status: 'active' | 'inactive' | 'pending';
  hireDate: string;
  projects: string[];
  rating: number;
  totalEarnings: number;
}

const MisEquiposPage = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // Cargar datos del equipo
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true);
        
        // Aquí harías la llamada real a la API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/companies/${user?.id}/team-members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        } else {
          console.error('Error cargando miembros del equipo');
          // Por ahora, usar datos de ejemplo mientras se desarrolla la API
          setTeamMembers([
            {
              id: '1',
              fullName: 'Juan Pérez',
              email: 'juan.perez@email.com',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              role: 'Desarrollador Frontend',
              skills: ['React', 'TypeScript', 'Next.js'],
              status: 'active',
              hireDate: '2024-01-15',
              projects: ['E-commerce Platform', 'Admin Dashboard'],
              rating: 4.8,
              totalEarnings: 8500
            },
            {
              id: '2',
              fullName: 'María García',
              email: 'maria.garcia@email.com',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              role: 'Diseñadora UX/UI',
              skills: ['Figma', 'Adobe XD', 'Prototyping'],
              status: 'active',
              hireDate: '2024-02-01',
              projects: ['Mobile App Design', 'Brand Identity'],
              rating: 4.9,
              totalEarnings: 7200
            },
            {
              id: '3',
              fullName: 'Carlos Rodríguez',
              email: 'carlos.rodriguez@email.com',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              role: 'Desarrollador Backend',
              skills: ['Node.js', 'Python', 'PostgreSQL'],
              status: 'pending',
              hireDate: '2024-03-10',
              projects: ['API Development'],
              rating: 4.7,
              totalEarnings: 3200
            }
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadTeamMembers();
    }
  }, [user]);

  // Filtrar y ordenar miembros del equipo
  const filteredAndSortedMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'date':
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'earnings':
          return b.totalEarnings - a.totalEarnings;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'pending': return 'info';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Mis Equipos" />
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Mis Equipos" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros y acciones */}
        <ComponentCard title="Gestión de Equipos">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white max-w-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="pending">Pendientes</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="date">Ordenar por fecha</option>
                <option value="rating">Ordenar por rating</option>
                <option value="earnings">Ordenar por ganancias</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="primary">
                Agregar Miembro
              </Button>
            </div>
          </div>
        </ComponentCard>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Miembros">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {teamMembers.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profesionales
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Activos">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trabajando
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Rating Promedio">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {teamMembers.length > 0 
                  ? (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ⭐ Estrellas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Total Invertido">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {formatCurrency(teamMembers.reduce((sum, m) => sum + m.totalEarnings, 0))}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                En pagos
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Lista de miembros del equipo */}
        <div className="space-y-4">
          {filteredAndSortedMembers.length === 0 ? (
            <ComponentCard title="Sin Miembros">
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron miembros del equipo. {searchTerm || statusFilter !== "all" ? "Intenta ajustar los filtros." : "Aún no has contratado profesionales."}
                </p>
              </div>
            </ComponentCard>
          ) : (
            filteredAndSortedMembers.map((member) => (
              <ComponentCard key={member.id} title="">
                <div className="flex items-start gap-4 p-4">
                  {/* Avatar y información básica */}
                  <div className="flex-shrink-0">
                    <Avatar
                      src={member.avatar}
                      alt={member.fullName}
                      size="xl"
                      fallbackText={member.fullName.split(' ').map(n => n[0]).join('')}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {member.fullName}
                          </h3>
                          <Badge color={getStatusColor(member.status)} size="sm">
                            {getStatusText(member.status)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          {member.email}
                        </p>
                        
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-2">
                          {member.role}
                        </p>
                        
                        {/* Habilidades */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {member.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        {/* Proyectos */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Proyectos:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {member.projects.map((project, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded"
                              >
                                {project}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Información adicional */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            <span>Contratado: {formatDate(member.hireDate)}</span>
                            <span>Ganancias: {formatCurrency(member.totalEarnings)}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              Ver Perfil
                            </Button>
                            <Button variant="ghost" size="sm">
                              Mensaje
                            </Button>
                            <Button variant="ghost" size="sm">
                              Evaluar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ComponentCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MisEquiposPage; 