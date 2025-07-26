"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { showError, showSuccess } from '@/util/notifications';
import cvService, { ProfessionalProfile } from "@/services/cv.service";
import { MessageSquare, X } from "lucide-react";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import { useNotifications } from "@/hooks/useNotifications";

const ProfesionalDetallePage = () => {
  const params = useParams();
  const { user } = useAuth();
  const { contactUser } = useChat();
  const { notify } = useNotifications();
  const professionalId = params.id as string;
  
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (professionalId) {
      loadProfessionalProfile();
    }
  }, [professionalId]);

  const loadProfessionalProfile = async () => {
    try {
      setLoading(true);
      const data = await cvService.getProfessionalProfile(professionalId);
      setProfessional(data);
    } catch (error) {
      console.error('Error cargando perfil del profesional:', error);
      showError('Error al cargar el perfil del profesional');
    } finally {
      setLoading(false);
    }
  };

  const handleContactProfessional = async () => {
    if (!user || !professional) {
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
      notify('Error al abrir el chat');
    }
  };

  const handleDownloadCV = async () => {
    if (!professional) return;

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
      showSuccess('CV descargado exitosamente');
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No se pudo cargar el perfil del profesional.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/empresa/profesionales" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                Profesionales
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {professional.fullName}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header del perfil */}
          <ComponentCard title="Información del Profesional">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar
                src={professional.avatar}
                fallbackText={professional.fullName}
                size="2xl"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {professional.fullName}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {professional.bio || "Sin descripción disponible"}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge color={getAvailabilityColor(professional.availability)}>
                        {getAvailabilityText(professional.availability)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{professional.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      onClick={handleContactProfessional}
                      className="w-full md:w-auto"
                    >
                      Abrir Chat
                    </Button>
                    {professional.cvFileName && (
                      <Button
                        variant="outline"
                        onClick={handleDownloadCV}
                        className="w-full md:w-auto"
                      >
                        Descargar CV
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>

          {/* Habilidades */}
          <ComponentCard title="Habilidades">
            <div className="flex flex-wrap gap-2">
              {professional.skills.map((skill, index) => (
                <Badge key={index} color="primary" size="lg">
                  {skill}
                </Badge>
              ))}
            </div>
          </ComponentCard>

          {/* Educación */}
          {professional.education && professional.education.length > 0 && (
            <ComponentCard title="Educación">
              <div className="space-y-4">
                {professional.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.institution} • {edu.year}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}

          {/* Certificaciones */}
          {professional.certifications && professional.certifications.length > 0 && (
            <ComponentCard title="Certificaciones">
              <div className="space-y-4">
                {professional.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {cert.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cert.issuer} • {cert.year}
                      </p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    {cert.verificationUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(cert.verificationUrl, '_blank')}
                      >
                        Verificar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}

          {/* Idiomas */}
          {professional.languages && professional.languages.length > 0 && (
            <ComponentCard title="Idiomas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {lang.name}
                    </span>
                    <Badge color="light" size="sm">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}
        </div>

        {/* Sidebar con información adicional */}
        <div className="space-y-6">
          {/* Información de contacto */}
          <ComponentCard title="Información de Contacto">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                <p className="font-medium text-gray-900 dark:text-white">{professional.email}</p>
              </div>
              {professional.country && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">País:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{professional.country}</p>
                </div>
              )}
              {professional.city && (
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Ciudad:</span>
                  <p className="font-medium text-gray-900 dark:text-white">{professional.city}</p>
                </div>
              )}
            </div>
          </ComponentCard>

          {/* Estadísticas */}
          <ComponentCard title="Estadísticas">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Experiencia:</span>
                <span className="font-medium">{professional.experience} años</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Proyectos completados:</span>
                <span className="font-medium">{professional.completedProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Ingresos totales:</span>
                <span className="font-medium">{formatCurrency(professional.totalEarnings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tarifa por hora:</span>
                <span className="font-medium">{formatCurrency(professional.hourlyRate || 0)}/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Calificación:</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{professional.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </ComponentCard>

          {/* Portfolio */}
          {professional.portfolio && (
            <ComponentCard title="Portfolio">
              <Button
                variant="outline"
                onClick={() => window.open(professional.portfolio, '_blank')}
                className="w-full"
              >
                Ver Portfolio
              </Button>
            </ComponentCard>
          )}

          {/* Información adicional */}
          <ComponentCard title="Información Adicional">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Miembro desde:</span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(professional.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CV disponible:</span>
                <span className={professional.cvFileName ? "text-green-600" : "text-red-600"}>
                  {professional.cvFileName ? "✅ Sí" : "❌ No"}
                </span>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </div>
  );
};

export default ProfesionalDetallePage; 