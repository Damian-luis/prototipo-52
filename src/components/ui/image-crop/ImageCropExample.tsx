"use client";
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import Button from '../button/Button';
import ImageCropModal from './ImageCropModal';

const ImageCropExample: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      setIsUploading(true);
      
      // Crear URL para mostrar la imagen recortada
      const imageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImageUrl(imageUrl);

      // Aquí puedes implementar la lógica para subir la imagen al servidor
      // Por ejemplo:
      // const formData = new FormData();
      // formData.append('image', croppedImageBlob, 'profile-image.jpg');
      // const response = await fetch('/api/upload-profile-image', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();
      
      console.log('Imagen recortada lista para subir:', croppedImageBlob);
      alert('Imagen recortada exitosamente! Revisa la consola para ver el Blob.');
      
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Error al procesar la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Recorte de Imagen de Perfil
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sube una imagen y recórtala en formato circular para tu perfil
        </p>
      </div>

      {/* Área de subida */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="primary" className="mb-2">
                Seleccionar Imagen
              </Button>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF hasta 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Vista previa de la imagen recortada */}
      {croppedImageUrl && (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Imagen Recortada
          </h3>
          <div className="inline-block">
            <img
              src={croppedImageUrl}
              alt="Imagen recortada"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCroppedImageUrl('')}
              size="sm"
            >
              Cambiar Imagen
            </Button>
            <Button
              variant="primary"
              onClick={() => alert('Aquí implementarías la subida al servidor')}
              size="sm"
              disabled={isUploading}
            >
              {isUploading ? 'Subiendo...' : 'Subir al Servidor'}
            </Button>
          </div>
        </div>
      )}

      {/* Modal de recorte */}
      <ImageCropModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
        circularCrop={true}
      />
    </div>
  );
};

export default ImageCropExample; 