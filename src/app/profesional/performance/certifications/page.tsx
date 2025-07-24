"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'active' | 'expired' | 'pending' | 'suspended';
  issue_date: string;
  expiry_date?: string;
  credential_id: string;
  verification_url?: string;
  description: string;
  skills: string[];
  score?: number;
  max_score?: number;
  logo_url?: string;
  is_featured: boolean;
  renewal_reminder?: string;
}

const FreelancerPerformanceCertificationsPage = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Simular datos de certificaciones
    const mockCertifications: Certification[] = [
      {
        id: "1",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        category: "Cloud Computing",
        level: 'advanced',
        status: 'active',
        issue_date: "2023-06-15",
        expiry_date: "2026-06-15",
        credential_id: "AWS-123456789",
        verification_url: "https://aws.amazon.com/verification",
        description: "Certificación que valida la capacidad para diseñar y desplegar aplicaciones escalables en AWS.",
        skills: ["AWS", "Cloud Architecture", "DevOps", "Infrastructure"],
        score: 950,
        max_score: 1000,
        logo_url: "/images/certifications/aws-logo.png",
        is_featured: true
      },
      {
        id: "2",
        name: "Google Cloud Professional Developer",
        issuer: "Google Cloud",
        category: "Cloud Computing",
        level: 'advanced',
        status: 'active',
        issue_date: "2023-09-20",
        expiry_date: "2026-09-20",
        credential_id: "GCP-987654321",
        verification_url: "https://cloud.google.com/certification",
        description: "Certificación para desarrolladores que construyen aplicaciones en Google Cloud Platform.",
        skills: ["Google Cloud", "App Engine", "Cloud Functions", "Kubernetes"],
        score: 92,
        max_score: 100,
        logo_url: "/images/certifications/gcp-logo.png",
        is_featured: true
      },
      {
        id: "3",
        name: "React Developer Certification",
        issuer: "Meta",
        category: "Frontend Development",
        level: 'intermediate',
        status: 'active',
        issue_date: "2023-03-10",
        credential_id: "META-REACT-456",
        verification_url: "https://meta.com/certification",
        description: "Certificación oficial de React que valida habilidades en desarrollo frontend.",
        skills: ["React", "JavaScript", "JSX", "Hooks", "State Management"],
        score: 88,
        max_score: 100,
        logo_url: "/images/certifications/meta-logo.png",
        is_featured: false
      },
      {
        id: "4",
        name: "Node.js Developer Certification",
        issuer: "OpenJS Foundation",
        category: "Backend Development",
        level: 'intermediate',
        status: 'active',
        issue_date: "2023-11-05",
        credential_id: "NODEJS-789",
        verification_url: "https://openjsf.org/certification",
        description: "Certificación que valida habilidades en desarrollo backend con Node.js.",
        skills: ["Node.js", "Express", "JavaScript", "API Development"],
        score: 85,
        max_score: 100,
        logo_url: "/images/certifications/nodejs-logo.png",
        is_featured: false
      },
      {
        id: "5",
        name: "MongoDB Database Administrator",
        issuer: "MongoDB Inc.",
        category: "Database",
        level: 'advanced',
        status: 'expired',
        issue_date: "2022-08-15",
        expiry_date: "2024-08-15",
        credential_id: "MONGODB-DBA-123",
        verification_url: "https://university.mongodb.com/certification",
        description: "Certificación para administración y optimización de bases de datos MongoDB.",
        skills: ["MongoDB", "Database Administration", "Performance Tuning"],
        score: 90,
        max_score: 100,
        logo_url: "/images/certifications/mongodb-logo.png",
        is_featured: false,
        renewal_reminder: "2024-08-15"
      },
      {
        id: "6",
        name: "Docker Certified Associate",
        issuer: "Docker Inc.",
        category: "DevOps",
        level: 'intermediate',
        status: 'pending',
        issue_date: "2024-01-20",
        credential_id: "DOCKER-CA-456",
        description: "Certificación que valida habilidades en containerización y orquestación con Docker.",
        skills: ["Docker", "Containers", "DevOps", "CI/CD"],
        logo_url: "/images/certifications/docker-logo.png",
        is_featured: false
      }
    ];
    
    setCertifications(mockCertifications);
  }, []);

  useEffect(() => {
    let filtered = certifications;
    
    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(cert => cert.category === categoryFilter);
    }
    
    if (levelFilter !== "all") {
      filtered = filtered.filter(cert => cert.level === levelFilter);
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(cert => cert.status === statusFilter);
    }
    
    setFilteredCertifications(filtered);
  }, [certifications, searchTerm, categoryFilter, levelFilter, statusFilter]);

  const handleAddCertification = () => {
    setShowAddModal(true);
  };

  const handleRenewCertification = (certId: string) => {
    // Implementar renovación de certificación
    console.log('Renovar certificación:', certId);
  };

  const handleVerifyCertification = (certId: string) => {
    // Implementar verificación de certificación
    console.log('Verificar certificación:', certId);
  };

  const handleDownloadCertificate = (cert: Certification) => {
    // Implementar descarga de certificado
    console.log('Descargar certificado:', cert.id);
  };

  const handleViewVerification = (cert: Certification) => {
    if (cert.verification_url) {
      window.open(cert.verification_url, '_blank');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'error';
      case 'advanced': return 'warning';
      case 'intermediate': return 'info';
      case 'beginner': return 'success';
      default: return 'light';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'expert': return 'Experto';
      case 'advanced': return 'Avanzado';
      case 'intermediate': return 'Intermedio';
      case 'beginner': return 'Principiante';
      default: return level;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'pending': return 'warning';
      case 'suspended': return 'light';
      default: return 'light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Expirada';
      case 'pending': return 'Pendiente';
      case 'suspended': return 'Suspendida';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'expired': return '❌';
      case 'pending': return '⏳';
      case 'suspended': return '🚫';
      default: return '📋';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === 'active').length,
    expired: certifications.filter(c => c.status === 'expired').length,
    pending: certifications.filter(c => c.status === 'pending').length,
    featured: certifications.filter(c => c.is_featured).length,
    expiringSoon: certifications.filter(c => c.expiry_date && isExpiringSoon(c.expiry_date)).length
  };

  const categories = Array.from(new Set(certifications.map(c => c.category)));

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadcrumb pageTitle="Certificaciones" />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ComponentCard title="Total de Certificaciones">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Certificaciones obtenidas
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Certificaciones Activas">
            <div className="text-center">
              <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                {stats.active}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Válidas actualmente
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Destacadas">
            <div className="text-center">
              <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                {stats.featured}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Certificaciones premium
              </p>
            </div>
          </ComponentCard>
          
          <ComponentCard title="Por Expirar">
            <div className="text-center">
              <p className="text-3xl font-bold text-error-600 dark:text-error-400">
                {stats.expiringSoon}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Requieren renovación
              </p>
            </div>
          </ComponentCard>
        </div>

        {/* Acciones principales */}
        <ComponentCard title="Acciones">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              onClick={handleAddCertification}
              className="w-full sm:w-auto"
            >
              + Agregar Certificación
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profesional/performance/stats'}
              className="w-full sm:w-auto"
            >
              Ver Estadísticas
            </Button>
          </div>
        </ComponentCard>

        {/* Filtros */}
        <ComponentCard title="Filtros">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre, emisor o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white flex-1"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los niveles</option>
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
              <option value="expert">Experto</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activa</option>
              <option value="expired">Expirada</option>
              <option value="pending">Pendiente</option>
              <option value="suspended">Suspendida</option>
            </select>
          </div>
        </ComponentCard>

        {/* Lista de certificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert) => (
            <ComponentCard key={cert.id} title={cert.name}>
              <div className="flex flex-col h-full">
                {/* Header de la certificación */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {cert.logo_url ? (
                        <img 
                          src={cert.logo_url} 
                          alt={cert.issuer}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                          {cert.issuer.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {cert.is_featured && (
                      <Badge color="warning" size="sm">
                        Destacada
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getStatusIcon(cert.status)}</span>
                      <Badge color={getStatusColor(cert.status)} size="sm">
                        {getStatusText(cert.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información de la certificación */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Categoría:</span>
                    <span className="font-medium">{cert.category}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Nivel:</span>
                    <Badge color={getLevelColor(cert.level)} size="sm">
                      {getLevelText(cert.level)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID Credencial:</span>
                    <span className="font-medium text-xs">{cert.credential_id}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Emisión:</span>
                    <span className="font-medium">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {cert.expiry_date && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Expiración:</span>
                      <span className={`font-medium ${isExpiringSoon(cert.expiry_date) ? 'text-red-600' : ''}`}>
                        {new Date(cert.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {cert.score && cert.max_score && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Puntuación:</span>
                      <span className="font-medium">
                        {cert.score}/{cert.max_score}
                      </span>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cert.description}
                  </p>
                </div>

                {/* Habilidades */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habilidades validadas:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, index) => (
                      <Badge key={index} color="light" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 mt-auto">
                  {cert.status === 'expired' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRenewCertification(cert.id)}
                      className="w-full"
                    >
                      Renovar Certificación
                    </Button>
                  )}
                  
                  {cert.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerifyCertification(cert.id)}
                      className="w-full"
                    >
                      Verificar Estado
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadCertificate(cert)}
                      className="flex-1"
                    >
                      Descargar
                    </Button>
                    {cert.verification_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVerification(cert)}
                        className="flex-1"
                      >
                        Verificar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ComponentCard>
          ))}
        </div>

        {filteredCertifications.length === 0 && (
          <ComponentCard title="Sin Certificaciones">
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron certificaciones. {searchTerm || categoryFilter !== "all" || levelFilter !== "all" || statusFilter !== "all" ? "Intenta ajustar los filtros." : "No tienes certificaciones registradas."}
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={handleAddCertification}>
                  Agregar Primera Certificación
                </Button>
              </div>
            </div>
          </ComponentCard>
        )}

        {/* Información adicional */}
        <ComponentCard title="Información Importante">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Beneficios de las Certificaciones</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Mayor visibilidad en el marketplace</li>
                <li>• Acceso a proyectos premium</li>
                <li>• Tarifas más altas</li>
                <li>• Credibilidad profesional</li>
                <li>• Oportunidades de networking</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Mantenimiento</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Renueva certificaciones antes de expirar</li>
                <li>• Mantén actualizadas tus habilidades</li>
                <li>• Verifica el estado regularmente</li>
                <li>• Descarga certificados para respaldo</li>
                <li>• Comparte enlaces de verificación</li>
              </ul>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default FreelancerPerformanceCertificationsPage; 