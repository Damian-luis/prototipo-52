"use client";
import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Save, RotateCcw, RotateCw } from 'lucide-react';
import Button from '../button/Button';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio?: number;
  circularCrop?: boolean;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  onCropComplete,
  aspectRatio = 1,
  circularCrop = true
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Función para centrar el crop inicial
  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number, aspect: number) => {
      return centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          mediaWidth,
          mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
      );
    },
    [],
  );

  // Función para cargar la imagen cuando se abre el modal
  React.useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isOpen]);

  // Función para manejar cuando la imagen se carga
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      if (aspectRatio) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
      }
    },
    [aspectRatio, centerAspectCrop],
  );

  // Función para rotar la imagen
  const rotateImage = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  // Función para generar la imagen recortada
  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Configurar el tamaño del canvas para una imagen cuadrada perfecta
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Para avatares, siempre generar una imagen cuadrada
    const size = Math.max(completedCrop.width * scaleX, completedCrop.height * scaleY);
    canvas.width = size;
    canvas.height = size;

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplicar rotación si es necesaria
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Calcular las dimensiones para centrar la imagen
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;
    const x = (size - cropWidth) / 2;
    const y = (size - cropHeight) / 2;

    // Dibujar la imagen recortada centrada
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      x,
      y,
      cropWidth,
      cropHeight,
    );

    // Si es recorte circular, aplicar máscara circular
    if (circularCrop) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        size / 2,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    if (rotation !== 0) {
      ctx.restore();
    }

    // Convertir canvas a Blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      },
      'image/jpeg',
      0.95
    );
  }, [completedCrop, rotation, circularCrop, onCropComplete, onClose]);

  if (!isOpen || !imageFile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo con efecto blur como Facebook */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Modal compacto centrado */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recortar Imagen
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative max-w-md max-h-96 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
              {imageSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  circularCrop={circularCrop}
                  className="max-w-full max-h-full"
                >
                  <img
                    ref={imgRef}
                    alt="Imagen para recortar"
                    src={imageSrc}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => rotateImage('left')}
                className="p-2"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => rotateImage('right')}
                className="p-2"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={generateCroppedImage}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </Button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {circularCrop 
                ? 'Ajusta el área circular para recortar tu imagen. Usa los botones de rotación si necesitas girar la imagen.'
                : 'Ajusta el área de recorte. Usa los botones de rotación si necesitas girar la imagen.'
              }
            </p>
          </div>
        </div>

        {/* Canvas oculto para procesamiento */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default ImageCropModal; 