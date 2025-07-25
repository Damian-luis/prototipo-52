# Componente de Recorte de Imágenes

Este componente proporciona una funcionalidad completa de recorte de imágenes con modal de pantalla completa, imitando la experiencia de usuario de Facebook.

## Características

- ✅ Modal de pantalla completa con fondo semitransparente
- ✅ Recorte circular con relación de aspecto 1:1
- ✅ Rotación de imagen (izquierda y derecha)
- ✅ Procesamiento con Canvas para alta calidad
- ✅ Exportación como Blob para subida al servidor
- ✅ Soporte para modo oscuro
- ✅ Totalmente tipado con TypeScript
- ✅ Responsive design

## Instalación

El componente utiliza la biblioteca `react-image-crop` que ya está instalada en el proyecto:

```bash
npm install react-image-crop
```

## Uso Básico

```tsx
import { ImageCropModal } from "@/components/ui/image-crop";

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCropComplete = (croppedImageBlob: Blob) => {
    // Aquí implementas la subida al servidor
    console.log('Imagen recortada:', croppedImageBlob);
  };

  return (
    <ImageCropModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      imageFile={selectedFile}
      onCropComplete={handleCropComplete}
      aspectRatio={1}
      circularCrop={true}
    />
  );
};
```

## Propiedades

| Propiedad | Tipo | Requerido | Default | Descripción |
|-----------|------|-----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | Controla si el modal está abierto |
| `onClose` | `() => void` | ✅ | - | Función llamada al cerrar el modal |
| `imageFile` | `File \| null` | ✅ | - | Archivo de imagen a recortar |
| `onCropComplete` | `(blob: Blob) => void` | ✅ | - | Callback con el Blob resultante |
| `aspectRatio` | `number` | ❌ | `1` | Relación de aspecto del recorte |
| `circularCrop` | `boolean` | ❌ | `true` | Si es recorte circular |

## Ejemplo Completo

```tsx
import React, { useState } from 'react';
import { ImageCropModal } from "@/components/ui/image-crop";
import Button from "@/components/ui/button/Button";

const ProfileImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    // Crear URL para mostrar la imagen recortada
    const imageUrl = URL.createObjectURL(croppedImageBlob);
    setCroppedImageUrl(imageUrl);

    // Aquí implementas la subida al servidor
    const formData = new FormData();
    formData.append('image', croppedImageBlob, 'profile-image.jpg');
    
    try {
      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Imagen subida:', result);
    } catch (error) {
      console.error('Error al subir imagen:', error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button>Seleccionar Imagen</Button>
      </label>

      {croppedImageUrl && (
        <img
          src={croppedImageUrl}
          alt="Imagen de perfil"
          className="w-32 h-32 rounded-full"
        />
      )}

      <ImageCropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageFile={selectedFile}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
        circularCrop={true}
      />
    </div>
  );
};
```

## Funcionalidades

### Modal de Pantalla Completa
El modal ocupa toda la pantalla con un fondo semitransparente oscuro, proporcionando una experiencia inmersiva para el recorte.

### Recorte Circular
Por defecto, el componente realiza un recorte circular con relación de aspecto 1:1, perfecto para imágenes de perfil.

### Rotación de Imagen
Los usuarios pueden rotar la imagen 90 grados hacia la izquierda o derecha antes de recortar.

### Procesamiento con Canvas
El componente utiliza la API Canvas para procesar la imagen con alta calidad, aplicando el recorte y la rotación.

### Exportación como Blob
La imagen recortada se exporta como un Blob, listo para ser subido a un servidor.

## Personalización

### Cambiar Relación de Aspecto
```tsx
<ImageCropModal
  // ... otras props
  aspectRatio={16/9} // Para formato panorámico
  circularCrop={false} // Para recorte rectangular
/>
```

### Recorte Rectangular
```tsx
<ImageCropModal
  // ... otras props
  circularCrop={false}
  aspectRatio={4/3} // Para formato 4:3
/>
```

## Dependencias

- `react-image-crop`: Biblioteca principal para el recorte
- `lucide-react`: Iconos utilizados en la interfaz
- `tailwindcss`: Estilos y diseño responsive

## Compatibilidad

- ✅ React 18+
- ✅ TypeScript
- ✅ Next.js 13+ (App Router)
- ✅ Navegadores modernos con soporte para Canvas API

## Notas Técnicas

- El componente utiliza `useCallback` para optimizar el rendimiento
- La rotación se aplica usando CSS transforms para mejor rendimiento
- El procesamiento con Canvas mantiene la calidad original de la imagen
- El componente es completamente responsive y funciona en dispositivos móviles 