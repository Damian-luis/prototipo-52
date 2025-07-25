"use client";
import React from 'react';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { ImageCropExample } from "@/components/ui/image-crop";

const ImageCropPage = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <PageBreadcrumb pageTitle="Ejemplo de Recorte de Imágenes" />
      
      <div className="space-y-6">
        <ComponentCard title="Recorte de Imagen de Perfil" desc="Componente de recorte de imágenes con modal de pantalla completa">
          <ImageCropExample />
        </ComponentCard>

        <ComponentCard title="Características del Componente" desc="Funcionalidades implementadas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Funcionalidades Principales:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  Modal de pantalla completa con fondo semitransparente
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  Recorte circular con relación de aspecto 1:1
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  Rotación de imagen (izquierda y derecha)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  Procesamiento con Canvas para alta calidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  Exportación como Blob para subida al servidor
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Tecnologías Utilizadas:</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  react-image-crop para el recorte
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Canvas API para procesamiento
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  TypeScript para tipado
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Tailwind CSS para estilos
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  Lucide React para iconos
                </li>
              </ul>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Cómo Usar el Componente" desc="Instrucciones de implementación">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">1. Importar el componente:</h5>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
{`import { ImageCropModal } from "@/components/ui/image-crop";`}
              </pre>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">2. Usar en tu componente:</h5>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-x-auto">
{`const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handleCropComplete = (croppedImageBlob: Blob) => {
  // Aquí implementas la subida al servidor
  console.log('Imagen recortada:', croppedImageBlob);
};

<ImageCropModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  imageFile={selectedFile}
  onCropComplete={handleCropComplete}
  aspectRatio={1}
  circularCrop={true}
/>`}
              </pre>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">3. Propiedades disponibles:</h5>
              <ul className="text-sm space-y-1">
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">isOpen</code> - Controla si el modal está abierto</li>
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">onClose</code> - Función llamada al cerrar el modal</li>
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">imageFile</code> - Archivo de imagen a recortar</li>
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">onCropComplete</code> - Callback con el Blob resultante</li>
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">aspectRatio</code> - Relación de aspecto (default: 1)</li>
                <li><code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">circularCrop</code> - Si es recorte circular (default: true)</li>
              </ul>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default ImageCropPage; 