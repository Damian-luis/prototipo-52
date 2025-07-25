"use client";
import React, { useState, useRef } from "react";
import Avatar from "./Avatar";
import Button from "../button/Button";
import ImageCropModal from "../image-crop/ImageCropModal";
import { showError } from '@/util/notifications';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      showError("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError("La imagen debe ser menor a 10MB");
      return;
    }

    // Abrir modal de recorte
    setSelectedFile(file);
    setIsCropModalOpen(true);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true);
      
      // Crear un archivo File desde el Blob
      const croppedFile = new File([croppedImageBlob], 'profile-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      // Crear preview
      const imageUrl = URL.createObjectURL(croppedImageBlob);
      setPreviewUrl(imageUrl);

      // Llamar callback con el archivo recortado
      onAvatarChange(croppedFile);
      
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      showError('Error al procesar la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    setSelectedFile(null);
    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          disabled={disabled || isUploading}
        >
          {isUploading ? "Procesando..." : "Cambiar Foto"}
        </Button>
        
        {(previewUrl || currentAvatar) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={disabled || isUploading}
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            Eliminar
          </Button>
        )}
      </div>

      {/* Información de ayuda */}
      <div className="text-xs text-gray-500 text-center max-w-xs">
        <p>Formatos soportados: JPG, PNG, GIF</p>
        <p>Tamaño máximo: 10MB</p>
        <p className="text-primary-600 font-medium">La imagen se recortará en formato circular</p>
      </div>

      {/* Modal de recorte */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={handleCloseCropModal}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
        circularCrop={true}
      />
    </div>
  );
};

export default AvatarUpload; 