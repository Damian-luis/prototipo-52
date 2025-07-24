"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTalent } from "@/context/TalentContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { FreelancerProfile } from "@/context/TalentContext";

const EmpresaProfesionalesPage = () => {
  const { user } = useAuth();
  const { getRecommendedFreelancers } = useTalent();
  const [professionals, setProfessionals] = useState<FreelancerProfile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<FreelancerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        // Cargar profesionales recomendados (todos para la empresa)
        const recommended = await getRecommendedFreelancers("");
        setProfessionals(recommended);
      } catch (error) {
        console.error('Error loading professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, [getRecommendedFreelancers]);

  useEffect(() => {
    let filtered = professionals;
    
    if (searchTerm) {
      filtered = filtered.filter((p: FreelancerProfile) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (skillFilter) {
      filtered = filtered.filter((p: FreelancerProfile) => 
        p.skills.some((skill: string) => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }
    
    if (experienceFilter) {
      const minExp = parseInt(experienceFilter);
      filtered = filtered.filter((p: FreelancerProfile) => p.experience >= minExp);
    }
    
    if (availabilityFilter !== "all") {
      filtered = filtered.filter((p: FreelancerProfile) => p.availability === availabilityFilter);
    }
    
    setFilteredProfessionals(filtered);
  }, [professionals, searchTerm, skillFilter, experienceFilter, availabilityFilter]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'unavailable': return 'error';
      default: return 'light';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupado';
      case 'unavailable': return 'No Disponible';
      default: return availability;
    }
  };

  const handleContactProfessional = (professional: FreelancerProfile) => {
    // Implementar lógica de contacto
    console.log('Contactar a:', professional.name);
  };

  const handleViewProfile = (professional: FreelancerProfile) => {
    // Implementar ver perfil
    console.log('Ver perfil de:', professional.name);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <PageBreadcrumb pageTitle="Gestión de Profesionales" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Gestión de Profesionales" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Header con filtros */}
        <ComponentCard title="Filtros de Búsqueda">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre o habilidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            
            <input
              type="text"
              placeholder="Filtrar por habilidad específica..."
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Cualquier experiencia</option>
              <option value="1">1+ años</option>
              <option value="3">3+ años</option>
              <option value="5">5+ años</option>
              <option value="10">10+ años</option>
            </select>
            
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Cualquier disponibilidad</option>
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="unavailable">No Disponible</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de profesionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <ComponentCard key={professional.user_id} title={professional.name}>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {professional.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {professional.experience} años de experiencia
                      </p>
                    </div>
                  </div>
                  <Badge color={getAvailabilityColor(professional.availability)}>
                    {getAvailabilityText(professional.availability)}
                  </Badge>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tarifa por hora:</span>
                    <span className="font-medium">${professional.hourly_rate}/h</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Proyectos completados:</span>
                    <span className="font-medium">{professional.completed_projects}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tasa de éxito:</span>
                    <span className="font-medium">{professional.success_rate}%</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Habilidades:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {professional.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} color="light" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {professional.skills.length > 3 && (
                      <Badge color="light" size="sm">
                        +{professional.skills.length - 3} más
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(professional)}
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleContactProfessional(professional)}
                    disabled={professional.availability === 'unavailable'}
                  >
                    Contactar
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <ComponentCard title="Sin Profesionales">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron profesionales. {searchTerm || skillFilter || experienceFilter || availabilityFilter !== "all" ? "Intenta ajustar los filtros." : "No hay profesionales registrados."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>
    </div>
  );
};

export default EmpresaProfesionalesPage; 