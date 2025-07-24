"use client";
import React, { useState, useRef } from "react";
import Avatar from "./Avatar";
import Button from "../button/Button";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onAvatarChange: (file: File) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  fallbackText?: string;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = "xl",
  className = "",
  fallbackText,
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5MB");
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Llamar callback
    onAvatarChange(file);
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Aquí podrías llamar a una función para eliminar el avatar actual
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar con preview */}
      <div className="relative group">
        <Avatar
          src={previewUrl || currentAvatar}
          alt="Avatar"
          size={size}
          fallbackText={fallbackText}
          onClick={handleUploadClick}
          className={disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        />
        
        {/* Overlay para indicar que se puede hacer clic */}
        {!disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Botones de acción */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled}
        >
          Cambiar Foto
        </Button>
        
        {(previewUrl || currentAvatar) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={disabled}
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            Eliminar
          </Button>
        )}
      </div>

      {/* Información de ayuda */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Formatos soportados: JPG, PNG, GIF</p>
        <p>Tamaño máximo: 5MB</p>
      </div>
    </div>
  );
};

export default AvatarUpload; 