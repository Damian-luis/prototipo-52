"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import cvService, { ProfessionalProfile } from "@/services/cv.service";
import { showError, showSuccess } from '@/util/notifications';
import { MessageSquare, X } from "lucide-react";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

const EmpresaProfesionalesPage = () => {
  const { user } = useAuth();
  const { contactUser } = useChat();
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<ProfessionalProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    loadProfessionals();
  }, [skillFilter, experienceFilter, availabilityFilter, ratingFilter]);

  useEffect(() => {
    // Filtrar localmente solo por búsqueda de texto
    if (searchTerm) {
      const filtered = professionals.filter(prof => 
        prof.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProfessionals(filtered);
    } else {
      setFilteredProfessionals(professionals);
    }
  }, [professionals, searchTerm]);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (skillFilter) filters.skills = [skillFilter];
      if (experienceFilter) filters.experience = parseInt(experienceFilter);
      if (availabilityFilter) filters.availability = availabilityFilter;
      if (ratingFilter) filters.rating = parseFloat(ratingFilter);
      if (searchTerm) filters.search = searchTerm;

      const data = await cvService.getAllProfessionals(filters);
      setProfessionals(data);
      setFilteredProfessionals(data);
    } catch (error) {
      console.error('Error cargando profesionales:', error);
      showError('Error al cargar los profesionales');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProfessional = async (professional: ProfessionalProfile) => {
    if (!user || !professional.id) {
      console.error('No se puede contactar al profesional: datos faltantes');
      return;
    }

    const companyId = user.id; // ID de la empresa actual
    const professionalId = professional.id;

    try {
      console.log('🆕 Abriendo chat con profesional...');
      
      // Buscar sala existente o crear nueva (sin enviar mensaje automático)
      const result = await contactUser(
        [companyId, professionalId],
        '', // Sin mensaje automático
        `Contacto: ${user.name} ↔ ${professional.fullName}`
      );
      
      console.log('✅ Chat abierto:', result);
      
      // Redirigir a la página de chat
      window.location.href = '/empresa/chat';
      
    } catch (error) {
      console.error('❌ Error al abrir chat:', error);
      showError('Error al abrir el chat');
    }
  };

  const handleCloseChat = () => {
    // setShowChat(false); // Removed
    // setSelectedProfessional(null); // Removed
    // setActiveRoom(null); // Removed
  };

  const handleDownloadCV = async (professional: ProfessionalProfile) => {
    try {
      const blob = await cvService.downloadCV(professional.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${professional.fullName}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error descargando CV:', error);
      showError('Error al descargar el CV');
    }
  };

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
      case 'unavailable': return 'No disponible';
      default: return availability;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando profesionales...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Buscar Profesionales" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Filtros de búsqueda */}
        <ComponentCard title="Filtros de Búsqueda">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, habilidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            
            <input
              type="text"
              placeholder="Filtrar por habilidad..."
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
              <option value="">Cualquier disponibilidad</option>
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="unavailable">No disponible</option>
            </select>
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Cualquier calificación</option>
              <option value="4">4+ estrellas</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>
        </ComponentCard>

        {/* Resumen de resultados */}
        <ComponentCard title="Resultados">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Se encontraron {filteredProfessionals.length} profesionales
            </p>
          </div>
        </ComponentCard>

        {/* Lista de profesionales */}
        <div className="space-y-6">
          {filteredProfessionals.map((professional) => (
            <ComponentCard key={professional.id} title={professional.fullName}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={professional.avatar}
                    fallbackText={professional.fullName}
                    size="xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {professional.fullName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {professional.bio || "Sin descripción disponible"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge color={getAvailabilityColor(professional.availability)}>
                          {getAvailabilityText(professional.availability)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{professional.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Experiencia:</span>
                          <span className="font-medium">{professional.experience} años</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Proyectos completados:</span>
                          <span className="font-medium">{professional.completedProjects}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Ingresos totales:</span>
                          <span className="font-medium">${professional.totalEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tarifa por hora:</span>
                          <span className="font-medium">${professional.hourlyRate || 0}/h</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Ubicación:</span>
                          <span className="font-medium">{professional.city || 'No especificada'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">CV:</span>
                          <span className="font-medium">
                            {professional.cvFileName ? "✅ Disponible" : "❌ No disponible"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Habilidades:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {professional.skills.slice(0, 8).map((skill, index) => (
                          <Badge key={index} color="light" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {professional.skills.length > 8 && (
                          <Badge color="light" size="sm">
                            +{professional.skills.length - 8} más
                          </Badge>
                        )}
                      </div>
                    </div>

                    {professional.education.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Educación:</span>
                        <div className="mt-1">
                          {professional.education.slice(0, 2).map((edu, index) => (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                              {edu.degree} - {edu.institution} ({edu.year})
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    variant="primary"
                    onClick={() => handleContactProfessional(professional)}
                    className="w-full"
                  >
                    Abrir Chat
                  </Button>
                  {professional.cvFileName && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadCV(professional)}
                      className="w-full"
                    >
                      Descargar CV
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = `/empresa/profesionales/${professional.id}`}
                    className="w-full"
                  >
                    Ver Perfil Completo
                  </Button>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <ComponentCard title="Sin Profesionales Encontrados">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron profesionales que coincidan con tus criterios. {searchTerm || skillFilter || experienceFilter ? "Intenta ajustar los filtros." : "No hay profesionales disponibles en este momento."}
              </p>
            </div>
          </ComponentCard>
        )}
      </div>

      {/* Modal de chat */}
      {/* Removed */}
    </div>
  );
};

export default EmpresaProfesionalesPage; 