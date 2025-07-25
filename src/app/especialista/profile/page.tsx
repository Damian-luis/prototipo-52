"use client";
import React, { useState } from "react";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";
import AvatarUpload from "@/components/ui/avatar/AvatarUpload";
import { useAuth } from "@/context/AuthContext";
import avatarService from "@/services/avatar.service";

export default function EspecialistaProfilePage() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      // Aquí implementarías la lógica para actualizar otros datos del perfil
      console.log("Actualizando perfil de especialista");
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar mensaje de éxito
      alert("Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tu información personal y configuración de cuenta
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
                defaultValue="Especialista"
                className="mt-1"
                disabled
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Actualizando..." : "Actualizar Información"}
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuración de Cuenta */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Configuración de Cuenta
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña Actual
              </label>
              <Input
                type="password"
                className="mt-1"
                placeholder="••••••••"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nueva Contraseña
              </label>
              <Input
                type="password"
                className="mt-1"
                placeholder="••••••••"
                disabled={isUpdating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Nueva Contraseña
              </label>
              <Input
                type="password"
                className="mt-1"
                placeholder="••••••••"
                disabled={isUpdating}
              />
            </div>
            <Button 
              className="w-full"
              disabled={isUpdating}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </Card>

        {/* Estadísticas */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Estadísticas del Especialista
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Consultas Realizadas</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">18</div>
              <div className="text-sm text-green-600 dark:text-green-400">Evaluaciones Completadas</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Sesiones Activas</div>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">4.8</div>
              <div className="text-sm text-orange-600 dark:text-orange-400">Calificación Promedio</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 