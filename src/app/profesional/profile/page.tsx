"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import AvatarUpload from "@/components/ui/avatar/AvatarUpload";
import Badge from "@/components/ui/badge/Badge";
import { useAuth } from "@/context/AuthContext";
import cvService, { CVData, Education, Certification, Language } from "@/services/cv.service";
import avatarService from "@/services/avatar.service";

export default function ProfesionalProfilePage() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Estado del perfil profesional
  const [profileData, setProfileData] = useState<Partial<CVData>>({
    experience: 0,
    education: [],
    certifications: [],
    skills: [],
    languages: [],
    availability: 'available',
    bio: '',
    portfolio: '',
  });

  // Estados para formularios dinámicos
  const [newEducation, setNewEducation] = useState<Partial<Education>>({});
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({});
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({});
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      if (user?.id) {
        const profile = await cvService.getProfessionalProfile(user.id);
        setProfileData({
          experience: profile.experience,
          education: profile.education,
          certifications: profile.certifications,
          skills: profile.skills,
          languages: profile.languages,
          availability: profile.availability as any,
          bio: profile.bio,
          portfolio: profile.portfolio,
        });
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  const handleAvatarChange = async (file: File) => {
    try {
      setIsUploadingAvatar(true);
      
      // Subir avatar al servidor
      const result = await avatarService.uploadAvatar(file);
      
      if (result.success && result.avatarUrl) {
        // Actualizar el contexto de autenticación inmediatamente
        updateAvatar(result.avatarUrl);
        alert('Foto de perfil actualizada exitosamente');
      } else {
        alert('Error al actualizar la foto de perfil: ' + result.message);
      }
    } catch (error) {
      console.error('Error al subir avatar:', error);
      alert('Error al subir la foto de perfil');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedCV(file);
    }
  };

  const handleUploadCV = async () => {
    if (!selectedCV) return;
    
    setIsUploadingCV(true);
    try {
      const result = await cvService.uploadCV(selectedCV);
      setProfileData(prev => ({
        ...prev,
        cvUrl: result.url,
        cvFileName: result.fileName,
      }));
      alert('CV subido exitosamente');
      setSelectedCV(null);
    } catch (error) {
      console.error('Error subiendo CV:', error);
      alert('Error al subir el CV');
    } finally {
      setIsUploadingCV(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await cvService.updateProfessionalProfile(profileData);
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  // Funciones para agregar elementos dinámicos
  const addEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.year) {
      setProfileData(prev => ({
        ...prev,
        education: [...(prev.education || []), newEducation as Education],
      }));
      setNewEducation({});
    }
  };

  const removeEducation = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || [],
    }));
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.year) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification as Certification],
      }));
      setNewCertification({});
    }
  };

  const removeCertification = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications?.filter((_, i) => i !== index) || [],
    }));
  };

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      setProfileData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage as Language],
      }));
      setNewLanguage({});
    }
  };

  const removeLanguage = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages?.filter((_, i) => i !== index) || [],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || [],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Perfil Profesional
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tu información personal, CV y perfil profesional
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar y Foto de Perfil */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Foto de Perfil
          </h2>
          <AvatarUpload
            currentAvatar={user?.profile_picture}
            onAvatarChange={handleAvatarChange}
            size="2xl"
            fallbackText={user?.name}
            disabled={isUploadingAvatar}
          />
        </Card>

        {/* Información Personal */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Información Personal
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre Completo
              </label>
              <Input
                type="text"
                defaultValue={user?.name || ""}
                className="mt-1"
                placeholder="Tu nombre completo"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                defaultValue={user?.email || ""}
                className="mt-1"
                placeholder="tu@email.com"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <Input
                type="text"
                defaultValue="Profesional"
                className="mt-1"
                disabled
              />
            </div>
          </div>
        </Card>
      </div>

      {/* CV y Documentos */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          CV y Documentos
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subir CV (PDF, DOC, DOCX)
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCVChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isUploadingCV}
              />
              <Button
                onClick={handleUploadCV}
                disabled={!selectedCV || isUploadingCV}
                size="sm"
              >
                {isUploadingCV ? "Subiendo..." : "Subir CV"}
              </Button>
            </div>
            {profileData.cvFileName && (
              <p className="mt-2 text-sm text-green-600">
                ✅ CV actual: {profileData.cvFileName}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Portafolio (URL)
            </label>
            <Input
              type="url"
              value={profileData.portfolio || ""}
              onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
              className="mt-1"
              placeholder="https://tu-portafolio.com"
            />
          </div>
        </div>
      </Card>

      {/* Información Profesional */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Información Profesional
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Años de Experiencia
            </label>
            <input
              type="number"
              value={profileData.experience || 0}
              onChange={(e) => setProfileData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Disponibilidad
            </label>
            <select
              value={profileData.availability || 'available'}
              onChange={(e) => setProfileData(prev => ({ ...prev, availability: e.target.value as any }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="available">Disponible</option>
              <option value="busy">Ocupado</option>
              <option value="unavailable">No disponible</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Biografía
          </label>
          <textarea
            value={profileData.bio || ""}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            rows={4}
            placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
          />
        </div>
      </Card>

      {/* Habilidades */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Habilidades
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Agregar habilidad..."
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && addSkill()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <Button onClick={addSkill} size="sm">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData.skills?.map((skill, index) => (
              <Badge key={index} color="primary" size="sm">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-white hover:text-red-200"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Educación */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Educación
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="text"
              value={newEducation.degree || ""}
              onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
              placeholder="Título"
            />
            <Input
              type="text"
              value={newEducation.institution || ""}
              onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="Institución"
            />
            <Input
              type="number"
              value={newEducation.year || ""}
              onChange={(e) => setNewEducation(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
              placeholder="Año"
            />
          </div>
          <Button onClick={addEducation} size="sm">
            Agregar Educación
          </Button>
          
          <div className="space-y-2">
            {profileData.education?.map((edu, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution} - {edu.year}</p>
                </div>
                <Button onClick={() => removeEducation(index)} size="sm" variant="outline">
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Certificaciones */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Certificaciones
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="text"
              value={newCertification.name || ""}
              onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre de certificación"
            />
            <Input
              type="text"
              value={newCertification.issuer || ""}
              onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
              placeholder="Emisor"
            />
            <Input
              type="number"
              value={newCertification.year || ""}
              onChange={(e) => setNewCertification(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
              placeholder="Año"
            />
          </div>
          <Button onClick={addCertification} size="sm">
            Agregar Certificación
          </Button>
          
          <div className="space-y-2">
            {profileData.certifications?.map((cert, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer} - {cert.year}</p>
                </div>
                <Button onClick={() => removeCertification(index)} size="sm" variant="outline">
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Idiomas */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Idiomas
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="text"
              value={newLanguage.name || ""}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Idioma"
            />
            <select
              value={newLanguage.level || ""}
              onChange={(e) => setNewLanguage(prev => ({ ...prev, level: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Seleccionar nivel</option>
              <option value="basic">Básico</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
              <option value="native">Nativo</option>
            </select>
          </div>
          <Button onClick={addLanguage} size="sm">
            Agregar Idioma
          </Button>
          
          <div className="space-y-2">
            {profileData.languages?.map((lang, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">{lang.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{lang.level}</p>
                </div>
                <Button onClick={() => removeLanguage(index)} size="sm" variant="outline">
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Botón de actualización */}
      <div className="flex justify-end">
        <Button 
          onClick={handleUpdateProfile}
          disabled={isUpdating}
          size="lg"
        >
          {isUpdating ? "Actualizando..." : "Actualizar Perfil"}
        </Button>
      </div>
    </div>
  );
} 