"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import AvatarUpload from "@/components/ui/avatar/AvatarUpload";
import Avatar from "@/components/ui/avatar/Avatar";
import ComponentCard from "@/components/common/ComponentCard";

const ProfileAvatarPage = () => {
  const { user, updateAvatar } = useAuth();

  const handleAvatarChange = async (file: File) => {
    try {
      // Aquí puedes implementar la lógica para subir el archivo
      console.log("Archivo seleccionado:", file);
      console.log("Tamaño del archivo:", file.size);
      console.log("Tipo del archivo:", file.type);
      
      // Simular una URL de avatar (en producción esto vendría del servidor)
      const avatarUrl = URL.createObjectURL(file);
      updateAvatar(avatarUrl);
    } catch (error) {
      console.error("Error al cambiar avatar:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-8">Demo: Cambio de Avatar de Perfil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Avatar Actual */}
        <ComponentCard title="Avatar Actual">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar 
                src={user?.profile_picture} 
                alt={user?.name || "Usuario"} 
                size="xl"
                fallbackText={user?.name}
              />
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            {/* Debug Info */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Información de Debug:</h4>
              <div className="text-sm space-y-1">
                <p><strong>URL del avatar:</strong> {user?.profile_picture || "No disponible"}</p>
                <p><strong>Nombre:</strong> {user?.name || "No disponible"}</p>
                <p><strong>Email:</strong> {user?.email || "No disponible"}</p>
                <p><strong>Rol:</strong> {user?.role || "No disponible"}</p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Sección de Cambio de Avatar */}
        <ComponentCard title="Cambiar Avatar">
          <div className="space-y-4">
            <p className="text-gray-600">
              Haz clic en el botón de abajo para seleccionar una nueva imagen de perfil.
              La imagen será recortada en un círculo perfecto.
            </p>
            
            <AvatarUpload onAvatarChange={handleAvatarChange} />
            
            <div className="text-sm text-gray-500">
              <p>• Formatos soportados: JPG, PNG, GIF</p>
              <p>• Tamaño máximo: 10MB</p>
              <p>• La imagen será recortada en un círculo 1:1</p>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Sección de Diferentes Tamaños */}
      <ComponentCard title="Diferentes Tamaños de Avatar" className="mt-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-center">
            <Avatar src={user?.profile_picture} alt="Avatar" size="sm" fallbackText={user?.name} />
            <p className="text-xs mt-1">SM</p>
          </div>
          <div className="text-center">
            <Avatar src={user?.profile_picture} alt="Avatar" size="md" fallbackText={user?.name} />
            <p className="text-xs mt-1">MD</p>
          </div>
          <div className="text-center">
            <Avatar src={user?.profile_picture} alt="Avatar" size="lg" fallbackText={user?.name} />
            <p className="text-xs mt-1">LG</p>
          </div>
          <div className="text-center">
            <Avatar src={user?.profile_picture} alt="Avatar" size="xl" fallbackText={user?.name} />
            <p className="text-xs mt-1">XL</p>
          </div>
          <div className="text-center">
            <Avatar src={user?.profile_picture} alt="Avatar" size="2xl" fallbackText={user?.name} />
            <p className="text-xs mt-1">2XL</p>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
};

export default ProfileAvatarPage; 